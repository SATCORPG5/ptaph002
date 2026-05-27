import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optional portal lock — set HIDE_ADMIN_PORTAL=true in env to seal off internal routes
  const isPortalsLocked = process.env.HIDE_ADMIN_PORTAL === 'true';
  const lockedPaths = ['/admin', '/crm', '/creator', '/creator-portal', '/portal'];
  const isTargetingLocked = lockedPaths.some(path => pathname.startsWith(path));

  if (isPortalsLocked && isTargetingLocked) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
