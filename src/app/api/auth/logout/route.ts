import { NextRequest, NextResponse } from 'next/server';
import { deleteSession, deleteAllUserSessions, getSessionData, SESSION_COOKIE } from '@/lib/auth/session';

const APP = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  const { all } = await request.json().catch(() => ({ all: false }));
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    if (all) {
      const data = await getSessionData(sessionId);
      if (data) await deleteAllUserSessions(data.userId);
    } else {
      await deleteSession(sessionId);
    }
  }

  const resp = NextResponse.redirect(`${APP}/login`);
  resp.cookies.delete(SESSION_COOKIE);
  resp.cookies.delete('pta_creator_session');
  return resp;
}

// Allow GET-based logout links too (e.g. email logout links)
export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  if (sessionId) await deleteSession(sessionId);

  const resp = NextResponse.redirect(`${APP}/login`);
  resp.cookies.delete(SESSION_COOKIE);
  resp.cookies.delete('pta_creator_session');
  return resp;
}
