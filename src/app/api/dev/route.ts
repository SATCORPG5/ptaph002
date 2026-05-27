/**
 * /api/dev  — dev-only utilities for mock environment testing.
 * All routes are blocked in production (NODE_ENV !== 'development').
 *
 * GET  /api/dev?action=state      — dump in-memory Redis store
 * POST /api/dev?action=seed       — populate mock allowlist, session, tokens
 * POST /api/dev?action=reset      — clear in-memory store
 * POST /api/dev?action=allow      — add a tiktok_open_id to the allowlist
 * POST /api/dev?action=login      — create a session for a creator by ID and set the cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { redis, isUsingMockRedis } from '@/lib/redis';
import { getCreatorsFromDb, updateCreatorInDb } from '@/lib/creators-db';
import { hashPassword, createSession, indexUserSession, SESSION_COOKIE } from '@/lib/auth';

function guard() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }
  return null;
}

// ── GET: dump store state ─────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const block = guard(); if (block) return block;
  const action = request.nextUrl.searchParams.get('action') || 'state';

  if (action === 'state') {
    const raw = (redis as any)._dump?.() ?? { note: 'Using real Redis — no dump available' };
    const creators = await getCreatorsFromDb();
    return NextResponse.json({
      usingMockRedis: isUsingMockRedis,
      store: raw,
      creators: creators.map(c => ({
        id: c.id,
        name: c.name,
        handle: c.handle,
        tier: c.tier,
        accountStatus: (c as any).accountStatus,
        onboardingCompleted: (c as any).onboardingCompleted,
        email: (c as any).email,
        tiktokOpenId: (c as any).tiktokOpenId,
        twoFactorEnabled: (c as any).twoFactorEnabled,
        passwordSet: !!(c as any).passwordHash,
      })),
    });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

// ── POST: seed / reset / allow / login ────────────────────────────────────
export async function POST(request: NextRequest) {
  const block = guard(); if (block) return block;
  const action = request.nextUrl.searchParams.get('action');
  const body = await request.json().catch(() => ({}));

  // ── seed ────────────────────────────────────────────────────────────────
  if (action === 'seed') {
    const creators = await getCreatorsFromDb();

    // 1. Add all existing creators to the TikTok allowlist by username
    const usernameMap: Record<string, string> = {};
    const idList: string[] = [];

    for (const c of creators) {
      const username = c.handle.replace('@', '').toLowerCase();
      usernameMap[username] = `mock_open_id_${c.id}`;
      idList.push(`mock_open_id_${c.id}`);

      // Patch creator record with mock auth fields if missing
      const needsPatch = !(c as any).email || !(c as any).passwordHash || !(c as any).accountStatus;
      if (needsPatch) {
        const patch = {
          ...c,
          email: (c as any).email || `${c.id}@mock.peacetimeagency.com`,
          tiktokOpenId: (c as any).tiktokOpenId || `mock_open_id_${c.id}`,
          accountStatus: (c as any).accountStatus || 'active',
          onboardingCompleted: (c as any).onboardingCompleted ?? true,
          passwordHash: (c as any).passwordHash || await hashPassword('Test1234!'),
          emailVerified: (c as any).emailVerified ?? true,
          twoFactorEnabled: false,
        };
        await updateCreatorInDb(patch);
      }
    }

    // Also add the canonical mock TikTok profile from tiktok.ts mock mode
    usernameMap['mock_creator_66'] = 'mock_open_id';
    idList.push('mock_open_id');

    await redis.set('pta:auth:allowlist:ids', idList);
    await redis.set('pta:auth:allowlist:usernames', usernameMap);

    return NextResponse.json({
      success: true,
      message: `Seeded allowlist with ${idList.length} entries and patched ${creators.length} creator records.`,
      allowlistIds: idList,
      usernameMap,
    });
  }

  // ── reset ───────────────────────────────────────────────────────────────
  if (action === 'reset') {
    const dump = (redis as any)._dump?.() ?? {};
    const keys = Object.keys(dump);
    await Promise.all(keys.map(k => redis.del(k)));
    return NextResponse.json({ success: true, clearedKeys: keys.length });
  }

  // ── allow: add a specific tiktok_open_id to the allowlist ───────────────
  if (action === 'allow') {
    const { tiktokOpenId, username } = body;
    if (!tiktokOpenId) return NextResponse.json({ error: 'tiktokOpenId required' }, { status: 400 });

    const idList: string[] = (await redis.get<string[]>('pta:auth:allowlist:ids')) ?? [];
    if (!idList.includes(tiktokOpenId)) idList.push(tiktokOpenId);
    await redis.set('pta:auth:allowlist:ids', idList);

    if (username) {
      const unMap: Record<string, string> = (await redis.get<Record<string, string>>('pta:auth:allowlist:usernames')) ?? {};
      unMap[username.toLowerCase()] = tiktokOpenId;
      await redis.set('pta:auth:allowlist:usernames', unMap);
    }

    return NextResponse.json({ success: true, idList });
  }

  // ── login: create a real session for a creator and set the cookie ────────
  if (action === 'login') {
    const { creatorId } = body;
    if (!creatorId) return NextResponse.json({ error: 'creatorId required' }, { status: 400 });

    const creators = await getCreatorsFromDb();
    const creator = creators.find(c => c.id === creatorId);
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

    const sessionId = await createSession(creatorId, undefined, true);
    await indexUserSession(creatorId, sessionId);

    const resp = NextResponse.json({ success: true, creatorId, sessionId });
    resp.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    resp.cookies.delete('pta_creator_session');
    return resp;
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
