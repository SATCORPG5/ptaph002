/**
 * DISCORD OAUTH — FUTURE FEATURE
 *
 * This route is fully wired but intentionally NOT linked from any login UI.
 * Enable by adding a "Sign in with Discord" button to the login page and
 * setting these environment variables:
 *   DISCORD_CLIENT_ID
 *   DISCORD_CLIENT_SECRET
 *   NEXT_PUBLIC_APP_URL
 *
 * The callback at /api/auth/discord/callback will exchange the auth code,
 * link the Discord user ID to the creator record, and issue a session.
 * Useful for community-driven creator networks and instant identity verification.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { redis } from '@/lib/redis';

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/discord/callback`;

export async function GET(_req: NextRequest) {
  if (!CLIENT_ID) {
    return NextResponse.json({ error: 'Discord OAuth is not configured' }, { status: 503 });
  }

  const state = generateToken(16);
  await redis.setex(`pta:auth:discord:state:${state}`, 600, '1');

  const url = new URL('https://discord.com/api/oauth2/authorize');
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'identify email');
  url.searchParams.set('state', state);

  return NextResponse.redirect(url.toString());
}
