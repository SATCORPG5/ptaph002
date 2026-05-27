import { NextRequest, NextResponse } from 'next/server';
import { getCreatorsFromDb } from '@/lib/creators-db';
import { createToken } from '@/lib/auth/tokens';
import { send2FACode } from '@/lib/auth/email';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '10 m'),
  prefix: 'pta:rl:2fa_send',
});

export async function POST(request: NextRequest) {
  const { creatorId } = await request.json().catch(() => ({}));
  if (!creatorId) return NextResponse.json({ error: 'Missing creatorId' }, { status: 400 });

  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await limiter.limit(ip);
  if (!success) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });

  const creators = await getCreatorsFromDb();
  const creator = creators.find(c => c.id === creatorId);
  if (!creator?.email) return NextResponse.json({ error: 'No email on file' }, { status: 400 });

  const code = await createToken('2fa', { userId: creatorId, email: creator.email });
  await send2FACode(creator.email, code);

  return NextResponse.json({ success: true });
}
