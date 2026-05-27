import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { redis } from '@/lib/redis';
import { getTikTokAuthUrl } from '@/lib/tiktok';

export async function GET(_req: NextRequest) {
  const state = generateToken(16);
  // CSRF state — valid for 10 minutes
  await redis.setex(`pta:auth:oauth:state:${state}`, 600, '1');
  return NextResponse.redirect(getTikTokAuthUrl(state));
}
