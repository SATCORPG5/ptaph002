export interface NavTarget {
  id: string;
  label: string;
  description: string;
  href: string;
  category: 'Navigation' | 'Account' | 'Management';
}

/** Shared portal destinations — feeds the ⌘K CommandPalette. */
export const NAV_TARGETS: NavTarget[] = [
  { id: 'home',            label: 'Lobby',           description: 'Home base for your portal',     href: '/portal/home',                 category: 'Navigation' },
  { id: 'creative-studio', label: 'Creative Studio', description: 'Assets, thumbnails, overlays',  href: '/portal/creative-studio',      category: 'Navigation' },
  { id: 'collab-lounge',   label: 'Collab Lounge',   description: 'Co-streams, collabs, events',   href: '/portal/collab-lounge',        category: 'Navigation' },
  { id: 'growth-academy',  label: 'Growth Academy',  description: 'Courses, challenges, coaching', href: '/portal/growth-academy',       category: 'Navigation' },
  { id: 'agency-ops',      label: 'Agency Ops',      description: 'Support tickets, onboarding',   href: '/portal/agency-ops',           category: 'Navigation' },
  { id: 'live-floor',      label: 'Live Floor',      description: 'Live stats, clip archive',      href: '/portal/live-floor',           category: 'Navigation' },
  { id: 'profile',         label: 'My Profile',      description: 'Edit your profile and branding',href: '/portal/profile',              category: 'Account' },
  { id: 'reports',         label: 'Data Cards',      description: 'Stream reports and analytics',  href: '/portal/reports',              category: 'Account' },
  { id: 'my-team',         label: 'My Team',         description: 'Team hub and manager messages', href: '/portal/my-team',              category: 'Account' },
  { id: 'settings',        label: 'Settings',        description: 'Account settings and preferences', href: '/portal/profile?tab=settings', category: 'Account' },
  { id: 'my-creators',     label: 'My Creators',     description: 'Manage your creator roster',     href: '/portal/my-creators',          category: 'Management' },
  { id: 'admin',           label: 'Admin Controls',  description: 'Portal administration panel',    href: '/portal/admin',                category: 'Management' },
];
