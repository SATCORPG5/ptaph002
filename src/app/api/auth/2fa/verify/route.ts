import { NextRequest, NextResponse } from 'next/server';
import { consumeToken } from '@/lib/auth/tokens';
import { createSession, indexUserSession, SESSION_COOKIE } from '@/lib/auth';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  prefix: 'pta:rl:2fa_verify',
});

export async function POST(request: NextRequest) {
  const { creatorId, code } = await request.json().catch(() => ({}));
  if (!creatorId || !code) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success: rateOk } = await limiter.limit(ip);
  if (!rateOk) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });

  const data = await consumeToken('2fa', code);
  if (!data || data.userId !== creatorId) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 });
  }

  const sessionId = await createSession(creatorId, {
    ip: request.headers.get('x-forwarded-for') ?? undefined,
    userAgent: request.headers.get('user-agent') ?? undefined,
  }, true);
  await indexUserSession(creatorId, sessionId);

  const resp = NextResponse.json({ success: true });
  resp.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  resp.cookies.delete('pta_2fa_creator');
  return resp;
}
