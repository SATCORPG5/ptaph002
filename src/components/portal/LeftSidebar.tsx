'use client';

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
  { id: 'profile',      label: 'My Profile',      icon: User,      href: '/portal/profile',      roles: ['creator'] },
  { id: 'reports',      label: 'Data Cards',       icon: BarChart3, href: '/portal/reports',      roles: ['creator'] },
  { id: 'my-team',      label: 'My Team',          icon: Users2,    href: '/portal/my-team',      roles: ['creator-manager', 'staff', 'admin'] },
  { id: 'my-creators',  label: 'My Creators',      icon: UserCheck, href: '/portal/my-creators',  roles: ['staff', 'admin'] },
  { id: 'admin',        label: 'Admin Controls',   icon: Shield,    href: '/portal/admin',        roles: ['admin'] },
];

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
}

export function LeftSidebar({ creator, collapsed, onCollapse, onSignOut }: LeftSidebarProps) {
  const pathname = usePathname();
  const role = getRoleFromTier(creator.tier);

  // Creators assigned to a manager also get access to My Team
  const effectiveRoles: string[] = [role];
  if (role === 'creator' && creator.managerId) {
    effectiveRoles.push('creator-manager');
  }

  const visibleRoleLinks = ROLE_LINKS.filter(l =>
    l.roles.some(r => effectiveRoles.includes(r))
  );

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 280 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="hidden lg:flex flex-col h-full bg-background-surface border-r border-border-subtle flex-shrink-0 overflow-hidden relative"
    >
      {/* Header */}
      <div className="flex items-center h-14 px-4 border-b border-foreground/[0.05] flex-shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-w-0"
            >
              <p className="text-xs font-black text-foreground uppercase tracking-widest truncate">Peace Time</p>
              <p className="text-[9px] font-bold text-[#14B8A6]/70 uppercase tracking-wider">Agency Portal</p>
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-6 h-6 rounded bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center mx-auto"
            >
              <span className="text-[10px] font-black text-[#14B8A6]">P</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => onCollapse(!collapsed)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground/20 hover:text-foreground hover:bg-foreground/5 transition-all flex-shrink-0 ml-auto"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronLeft size={14} />
          </motion.div>
        </button>
      </div>

      {/* Departments */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none py-3 px-2">
        <div className="mb-1">
          {!collapsed && (
            <p className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.2em] px-3 mb-2">Departments</p>
          )}
          {DEPARTMENTS.map((dept) => {
            const Icon = dept.icon;
            const isActive = pathname === dept.href || pathname.startsWith(dept.href + '/');

            return (
              <Link key={dept.id} href={dept.href}>
                <motion.div
                  whileHover={{ x: collapsed ? 0 : 2 }}
                  className={`flex items-center gap-3 py-2.5 rounded-xl mb-0.5 cursor-pointer transition-all group relative ${collapsed ? 'justify-center px-2' : 'px-3'} ${
                    isActive
                      ? 'bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-foreground'
                      : 'text-foreground/40 hover:text-foreground/80 hover:bg-foreground/[0.04]'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="active-dept"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#14B8A6] rounded-full"
                    />
                  )}

                  <Icon size={16} className={`flex-shrink-0 ${isActive ? 'text-[#14B8A6]' : ''}`} />

                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm font-bold truncate">{dept.label}</span>
                      <ActivityRing value={dept.activity} size={28} strokeWidth={2.5} />
                    </>
                  )}

                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 bg-background-elevated border border-border rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                      {dept.label}
                      <div className="text-[9px] text-[#14B8A6] mt-0.5">{dept.activity}% activity</div>
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Role-specific links */}
        {visibleRoleLinks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-foreground/[0.05]">
            {!collapsed && (
              <p className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.2em] px-3 mb-2">My Space</p>
            )}
            {visibleRoleLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              const isTeamLink = link.id === 'my-team';
              return (
                <Link key={link.id} href={link.href}>
                  <div
                    className={`flex items-center gap-3 py-2.5 rounded-xl mb-0.5 cursor-pointer transition-all group relative ${collapsed ? 'justify-center px-2' : 'px-3'} ${
                      isActive
                        ? isTeamLink
                          ? 'bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-foreground'
                          : 'bg-foreground/[0.06] border border-foreground/10 text-foreground'
                        : 'text-foreground/30 hover:text-foreground/70 hover:bg-foreground/[0.03]'
                    }`}
                  >
                    <Icon size={16} className={`flex-shrink-0 ${isActive && isTeamLink ? 'text-[#14B8A6]' : ''}`} />
                    {!collapsed && <span className="flex-1 text-sm font-semibold truncate">{link.label}</span>}
                    {collapsed && (
                      <div className="absolute left-full ml-2 bg-background-elevated border border-border rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                        {link.label}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-foreground/[0.05] px-2 py-3 flex-shrink-0">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl mb-1 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-black text-[#14B8A6] uppercase">
              {creator.name.charAt(0)}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{creator.name}</p>
              <p className="text-[9px] text-foreground/30 font-semibold capitalize">
                {role === 'admin' ? 'Admin' : role === 'staff' ? 'Manager' : 'Creator'}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onSignOut}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl w-full text-foreground/20 hover:text-red-400 hover:bg-red-400/5 transition-all group relative ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={14} className="flex-shrink-0" />
          {!collapsed && <span className="text-xs font-bold">Sign Out</span>}
          {collapsed && (
            <div className="absolute left-full ml-2 bg-background-elevated border border-border rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
