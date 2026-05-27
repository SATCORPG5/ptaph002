export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { exchangeTikTokCode, getTikTokProfile } from '@/lib/tiktok';
import {
  createSession,
  indexUserSession,
  SESSION_COOKIE,
} from '@/lib/auth';
import { createToken } from '@/lib/auth/tokens';
import { send2FACode } from '@/lib/auth/email';
import { getCreatorsFromDb, updateCreatorInDb } from '@/lib/creators-db';

const APP = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) return NextResponse.redirect(`${APP}/login?error=${encodeURIComponent(error)}`);
  if (!code || !state) return NextResponse.redirect(`${APP}/login?error=missing_params`);

  // ── CSRF check ──────────────────────────────────────────────────
  const stateKey = `pta:auth:oauth:state:${state}`;
  const valid = await redis.get(stateKey);
  if (!valid) return NextResponse.redirect(`${APP}/login?error=invalid_state`);
  await redis.del(stateKey);

  try {
    const tokenData = await exchangeTikTokCode(code);
    const profile = await getTikTokProfile(tokenData.access_token);

    // ── ALLOWLIST GATEWAY ───────────────────────────────────────────
    // Method 1 (current): Check creator's TikTok open_id and username against
    // a private allowlist maintained in Redis by admins.
    //
    // Method 2 (future — TCM/Business API): When TIKTOK_BUSINESS_API_KEY is
    // configured, verifyAgainstTCMRoster() will cross-reference the logging-in
    // creator's open_id against the agency's official TikTok Creator Marketplace
    // roster in real time, replacing Method 1 entirely.

    const [allowedIds, usernameMap] = await Promise.all([
      redis.get<string[]>('pta:auth:allowlist:ids') as Promise<string[] | null>,
      redis.get<Record<string, string>>('pta:auth:allowlist:usernames') as Promise<Record<string, string> | null>,
    ]);

    const idList = allowedIds ?? [];
    const unMap = usernameMap ?? {};

    const allowedById = idList.includes(profile.open_id);
    const allowedByUsername = Object.keys(unMap).some(
      un => un.toLowerCase() === profile.username?.toLowerCase()
    );

    if (!allowedById && !allowedByUsername) {
      return NextResponse.redirect(
        `${APP}/login?error=${encodeURIComponent(
          'ACCESS DENIED: This portal is exclusive to signed Peace Time Agency creators.'
        )}`
      );
    }
    // ── END ALLOWLIST ───────────────────────────────────────────────

    // Locate or scaffold creator account
    const creators = await getCreatorsFromDb();
    let creator = creators.find(
      c => c.tiktokOpenId === profile.open_id
        || c.handle.toLowerCase() === `@${profile.username}`.toLowerCase()
    );

    if (!creator) {
      // First-time TikTok login — store profile temporarily for onboarding
      await redis.setex(
        `pta:auth:tiktok_pending:${profile.open_id}`,
        7200,
        JSON.stringify({ profile, accessToken: tokenData.access_token })
      );
      return NextResponse.redirect(`${APP}/onboarding?tiktok_id=${encodeURIComponent(profile.open_id)}`);
    }

    // Merge updated TikTok open_id onto creator record
    if (!creator.tiktokOpenId) {
      await updateCreatorInDb({ ...creator, tiktokOpenId: profile.open_id });
      creator = { ...creator, tiktokOpenId: profile.open_id };
    }

    if (!creator.onboardingCompleted) {
      await redis.setex(
        `pta:auth:tiktok_pending:${profile.open_id}`,
        7200,
        JSON.stringify({ profile, accessToken: tokenData.access_token })
      );
      return NextResponse.redirect(
        `${APP}/onboarding?tiktok_id=${encodeURIComponent(profile.open_id)}&creator_id=${creator.id}`
      );
    }

    if (creator.accountStatus === 'pending_manager' || creator.accountStatus === 'in_pool') {
      return NextResponse.redirect(`${APP}/onboarding?creator_id=${creator.id}&pending=1`);
    }

    // ── 2FA gate ────────────────────────────────────────────────────
    if (creator.twoFactorEnabled && creator.email) {
      const tfaCode = await createToken('2fa', { userId: creator.id, email: creator.email });
      await send2FACode(creator.email, tfaCode);
      const resp = NextResponse.redirect(`${APP}/login/2fa?creator_id=${creator.id}`);
      resp.cookies.set('pta_2fa_creator', creator.id, { httpOnly: true, sameSite: 'lax', maxAge: 600, path: '/' });
      return resp;
    }

    const sessionId = await createSession(creator.id, {
      ip: request.headers.get('x-forwarded-for') ?? undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
    });
    await indexUserSession(creator.id, sessionId);

    const resp = NextResponse.redirect(`${APP}/portal/home`);
    resp.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    resp.cookies.delete('pta_creator_session');
    return resp;

  } catch (err) {
    console.error('[TikTok callback error]', err);
    return NextResponse.redirect(`${APP}/login?error=auth_failed`);
  }
}
