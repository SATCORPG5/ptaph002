import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, getSessionData } from '@/lib/auth/session';

const PROTECTED = ['/portal', '/creator', '/crm', '/admin', '/creator-portal'];
const AUTH_ROUTES = ['/login', '/register', '/onboarding', '/reset-password', '/verify-email'];
const ADMIN_ONLY = ['/admin', '/crm'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optional full portal lock (env flag for maintenance mode)
  if (process.env.HIDE_ADMIN_PORTAL === 'true') {
    const locked = ['/admin', '/crm', '/creator', '/creator-portal', '/portal'];
    if (locked.some(p => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  const isAdminOnly = ADMIN_ONLY.some(p => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  // ── Session resolution ──────────────────────────────────────────
  const isMock =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mockproject.supabase.co';

  // In mock mode let everything through so the dev preview still works
  if (isMock && process.env.NODE_ENV === 'development') return NextResponse.next();

  const newSessionId = request.cookies.get(SESSION_COOKIE)?.value;
  const legacySessionId = request.cookies.get('pta_creator_session')?.value;

  let authenticated = false;
  let userId: string | undefined;

  if (newSessionId) {
    const data = await getSessionData(newSessionId);
    if (data) { authenticated = true; userId = data.userId; }
  } else if (legacySessionId) {
    // Legacy cookie — treat as authenticated; upgraded on next sign-in
    authenticated = true;
    userId = legacySessionId;
  }

  if (!authenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Admin-only routes — role check requires a DB call; skip in edge if Redis unavailable
  // Full role enforcement is handled server-side inside the page/layout.
  // This middleware only guards against unauthenticated access.

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
