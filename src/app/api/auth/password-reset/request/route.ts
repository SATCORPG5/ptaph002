import { NextRequest, NextResponse } from 'next/server';
import { getCreatorsFromDb } from '@/lib/creators-db';
import { createToken } from '@/lib/auth/tokens';
import { sendPasswordReset } from '@/lib/auth/email';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'pta:rl:pw_reset',
});

export async function POST(request: NextRequest) {
  const { email } = await request.json().catch(() => ({}));
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await limiter.limit(ip);
  if (!success) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });

  const creators = await getCreatorsFromDb();
  const creator = creators.find(
    c => c.email?.toLowerCase() === email.toLowerCase()
      || c.recoveryEmail?.toLowerCase() === email.toLowerCase()
  );

  // Always respond OK to prevent email enumeration
  if (creator) {
    const token = await createToken('password_reset', { userId: creator.id, email });
    await sendPasswordReset(email, token);
  }

  return NextResponse.json({ success: true });
}
