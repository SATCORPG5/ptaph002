/**
 * Shared portal routing utility — single source of truth for tier → route mapping.
 * Used by: Navigation, AuthModal, TikTok callback, 2FA page.
 */
export function getPortalRoute(tier?: string | null): string {
  if (tier === 'staff') return '/portal/admin';
  if (tier === 'recruiter') return '/portal/my-creators';
  return '/portal/home';
}
