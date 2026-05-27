/**
 * GOOGLE OAUTH — FUTURE FEATURE
 *
 * This route is fully wired but intentionally NOT linked from any login UI.
 * Enable by adding a "Sign in with Google" button to the login page and
 * setting these environment variables:
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   NEXT_PUBLIC_APP_URL
 *
 * The callback at /api/auth/google/callback will exchange the auth code,
 * look up or create a creator by email, run the same allowlist check,
 * and issue a session cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { redis } from '@/lib/redis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;

export async function GET(_req: NextRequest) {
  if (!CLIENT_ID) {
    return NextResponse.json({ error: 'Google OAuth is not configured' }, { status: 503 });
  }

  const state = generateToken(16);
  await redis.setex(`pta:auth:google:state:${state}`, 600, '1');

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', state);
  url.searchParams.set('access_type', 'offline');

  return NextResponse.redirect(url.toString());
}
