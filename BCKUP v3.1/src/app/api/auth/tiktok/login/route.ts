// src/app/api/auth/tiktok/login/route.ts
import { NextResponse } from 'next/server';
import { getTikTokAuthUrl } from '@/lib/tiktok';

export async function GET(request: Request) {
  // generate a simple random state token
  const state = Math.random().toString(36).substring(2, 15);
  // store state in a cookie for later verification
  const url = new URL(request.url);
  const redirect = url.searchParams.get('redirect') || '/login';
  const authUrl = getTikTokAuthUrl(state) + `&redirect_uri=${encodeURIComponent(redirect)}`;
  const response = NextResponse.redirect(authUrl);
  response.cookies.set('tiktok_oauth_state', state, { httpOnly: true, path: '/', maxAge: 600 });
  return response;
}
