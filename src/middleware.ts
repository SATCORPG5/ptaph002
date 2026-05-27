import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strict Portal Lock (enabled by default unless explicitly unlocked)
  const isPortalsLocked = process.env.HIDE_ADMIN_PORTAL === "true";

  const lockedPaths = ['/admin', '/crm', '/creator', '/creator-portal', '/creators', '/apply', '/cardform', '/portal'];
  const isTargetingPortal = lockedPaths.some(path => pathname.startsWith(path));

  if (isPortalsLocked && isTargetingPortal) {
    // Redirect to home if portals are sealed off
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Delegate the rest of auth checks to Supabase
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
