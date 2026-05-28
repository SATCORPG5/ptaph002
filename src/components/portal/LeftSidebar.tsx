'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Creator } from '@/lib/creators';
import { ActivityRing } from './ActivityRing';
import {
  Home, Palette, Users, GraduationCap, Briefcase,
  Radio, User, BarChart3, UserCheck, Shield,
  ChevronLeft, LogOut, Users2,
} from 'lucide-react';

const DEPARTMENTS = [
  { id: 'home',            label: 'Lobby',            icon: Home,          href: '/portal/home',            activity: 52 },
  { id: 'creative-studio', label: 'Creative Studio',  icon: Palette,       href: '/portal/creative-studio', activity: 78 },
  { id: 'collab-lounge',   label: 'Collab Lounge',    icon: Users,         href: '/portal/collab-lounge',   activity: 43 },
  { id: 'growth-academy',  label: 'Growth Academy',   icon: GraduationCap, href: '/portal/growth-academy',  activity: 35 },
  { id: 'agency-ops',      label: 'Agency Ops',       icon: Briefcase,     href: '/portal/agency-ops',      activity: 61 },
  { id: 'live-floor',      label: 'Live Floor',       icon: Radio,         href: '/portal/live-floor',      activity: 88 },
];

const ROLE_LINKS = [
  { id: 'profile',      label: 'My Profile',      icon: User,      href: '/portal/profile',      section: 'ACCOUNT', roles: ['creator'] },
  { id: 'reports',      label: 'Data Cards',      icon: BarChart3, href: '/portal/reports',      section: 'ACCOUNT', roles: ['creator'] },
  { id: 'my-team',      label: 'My Team',         icon: Users2,    href: '/portal/my-team',      section: 'ACCOUNT', roles: ['creator-manager', 'staff', 'admin'] },
  { id: 'my-creators',  label: 'My Creators',     icon: UserCheck, href: '/portal/my-creators',  section: 'ADMIN',   roles: ['staff', 'admin'] },
  { id: 'admin',        label: 'Admin Controls',  icon: Shield,    href: '/portal/admin',        section: 'ADMIN',   roles: ['admin'] },
] as const;

function getRoleFromTier(tier?: string): 'creator' | 'staff' | 'admin' {
  if (tier === 'staff') return 'admin';
  if (tier === 'recruiter') return 'staff';
  return 'creator';
}

interface LeftSidebarProps {
  creator: Creator;
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  onSignOut: () => void;
  /** Always render expanded (used inside the mobile Sheet) — disables the icon rail + hover-expand. */
  forceExpanded?: boolean;
}

function SectionLabel({ children, show }: { children: React.ReactNode; show: boolean }) {
  if (!show) return null;
  return (
    <p className="font-mono text-[10px] font-bold text-foreground/20 uppercase tracking-[0.2em] px-3 mb-2">
      {children}
    </p>
  );
}

export function LeftSidebar({ creator, collapsed, onCollapse, onSignOut, forceExpanded = false }: LeftSidebarProps) {
  const pathname = usePathname();
  const role = getRoleFromTier(creator.tier);
  const [hovered, setHovered] = useState(false);

  // Persisted collapse is the source of truth; hover temporarily expands the rail on desktop.
  const expanded = forceExpanded || !collapsed || hovered;

  const effectiveRoles: string[] = [role];
  if (role === 'creator' && creator.managerId) {
    effectiveRoles.push('creator-manager');
  }

  const visibleRoleLinks = ROLE_LINKS.filter(l =>
    l.roles.some(r => effectiveRoles.includes(r))
  );
  const accountLinks = visibleRoleLinks.filter(l => l.section === 'ACCOUNT');
  const adminLinks = visibleRoleLinks.filter(l => l.section === 'ADMIN');

  const renderRoleLink = (link: typeof ROLE_LINKS[number]) => {
    const Icon = link.icon;
    const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
    return (
      <Link key={link.id} href={link.href}>
        <div
          className={`flex items-center gap-3 py-2.5 rounded-xl mb-0.5 cursor-pointer transition-all group relative ${expanded ? 'px-3' : 'justify-center px-2'} ${
            isActive
              ? 'bg-portal-accent/10 border border-portal-accent/20 text-foreground'
              : 'text-foreground/30 hover:text-foreground/70 hover:bg-foreground/[0.03]'
          }`}
        >
          <Icon size={16} className={`flex-shrink-0 ${isActive ? 'text-portal-accent' : ''}`} />
          {expanded && <span className="flex-1 text-sm font-semibold truncate">{link.label}</span>}
          {!expanded && (
            <div className="absolute left-full ml-2 bg-background-elevated border border-border rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
              {link.label}
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <motion.aside
      animate={{ width: expanded ? 280 : 64 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      onMouseEnter={() => !forceExpanded && setHovered(true)}
      onMouseLeave={() => !forceExpanded && setHovered(false)}
      className={`${forceExpanded ? 'flex' : 'hidden lg:flex'} flex-col h-full bg-background-surface border-r border-border-subtle flex-shrink-0 overflow-hidden relative`}
    >
      {/* Header */}
      <div className="flex items-center h-14 px-4 border-b border-foreground/[0.05] flex-shrink-0">
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-w-0"
            >
              <p className="text-xs font-black text-foreground uppercase tracking-widest truncate">Peace Time</p>
              <p className="font-mono text-[10px] font-bold text-portal-accent/70 uppercase tracking-wider">Agency Portal</p>
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-6 h-6 rounded bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center mx-auto"
            >
              <span className="font-mono text-[10px] font-black text-portal-accent">P</span>
            </motion.div>
          )}
        </AnimatePresence>
        {!forceExpanded && (
          <button
            onClick={() => onCollapse(!collapsed)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground/20 hover:text-foreground hover:bg-foreground/5 transition-all flex-shrink-0 ml-auto"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronLeft size={14} />
            </motion.div>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none py-3 px-2">
        {/* OPERATIONS */}
        <div className="mb-1">
          <SectionLabel show={expanded}>Operations</SectionLabel>
          {DEPARTMENTS.map((dept) => {
            const Icon = dept.icon;
            const isActive = pathname === dept.href || pathname.startsWith(dept.href + '/');
            return (
              <Link key={dept.id} href={dept.href}>
                <motion.div
                  whileHover={{ x: expanded ? 2 : 0 }}
                  className={`flex items-center gap-3 py-2.5 rounded-xl mb-0.5 cursor-pointer transition-all group relative ${expanded ? 'px-3' : 'justify-center px-2'} ${
                    isActive
                      ? 'bg-portal-accent/10 border border-portal-accent/20 text-foreground'
                      : 'text-foreground/40 hover:text-foreground/80 hover:bg-foreground/[0.04]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-dept"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-portal-accent rounded-full"
                    />
                  )}
                  <Icon size={16} className={`flex-shrink-0 ${isActive ? 'text-portal-accent' : ''}`} />
                  {expanded && (
                    <>
                      <span className="flex-1 text-sm font-bold truncate">{dept.label}</span>
                      <ActivityRing value={dept.activity} size={28} strokeWidth={2.5} />
                    </>
                  )}
                  {!expanded && (
                    <div className="absolute left-full ml-2 bg-background-elevated border border-border rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                      {dept.label}
                      <div className="font-mono text-[10px] text-portal-accent mt-0.5 tracking-wider">{dept.activity}% activity</div>
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* ACCOUNT */}
        {accountLinks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-foreground/[0.05]">
            <SectionLabel show={expanded}>Account</SectionLabel>
            {accountLinks.map(renderRoleLink)}
          </div>
        )}

        {/* ADMIN */}
        {adminLinks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-foreground/[0.05]">
            <SectionLabel show={expanded}>Admin</SectionLabel>
            {adminLinks.map(renderRoleLink)}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-foreground/[0.05] px-2 py-3 flex-shrink-0">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl mb-1 ${expanded ? '' : 'justify-center'}`}>
          <div className="w-7 h-7 rounded-full bg-portal-accent/20 border border-portal-accent/30 flex items-center justify-center flex-shrink-0">
            <span className="font-mono text-[10px] font-black text-portal-accent uppercase">
              {creator.name.charAt(0)}
            </span>
          </div>
          {expanded && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{creator.name}</p>
              <p className="text-[10px] text-foreground/30 font-semibold capitalize">
                {role === 'admin' ? 'Admin' : role === 'staff' ? 'Manager' : 'Creator'}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onSignOut}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl w-full text-foreground/20 hover:text-red-400 hover:bg-red-400/5 transition-all group relative ${expanded ? '' : 'justify-center'}`}
        >
          <LogOut size={14} className="flex-shrink-0" />
          {expanded && <span className="text-xs font-bold">Sign Out</span>}
          {!expanded && (
            <div className="absolute left-full ml-2 bg-background-elevated border border-border rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
