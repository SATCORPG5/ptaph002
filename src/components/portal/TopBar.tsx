'use client';

import { useState, useOptimistic, useTransition } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown, User, BarChart3, Settings, LogOut, Menu } from 'lucide-react';
import { Creator } from '@/lib/creators';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn-ui/dropdown-menu';

interface TopBarProps {
  creator: Creator;
  onSignOut: () => void;
  rightPanelOpen: boolean;
  onRightPanelToggle: () => void;
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
}

interface Notification {
  id: number;
  text: string;
  minutesAgo: number;
  read: boolean;
  type: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, text: 'New Data Card submitted for your review', minutesAgo: 2, read: false, type: 'report' },
  { id: 2, text: 'Manager accepted your creator request', minutesAgo: 60, read: false, type: 'manager' },
  { id: 3, text: 'Challenge results are in. Check Growth Academy', minutesAgo: 180, read: true, type: 'challenge' },
  { id: 4, text: 'New collab request posted in Lounge', minutesAgo: 300, read: true, type: 'collab' },
];

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function relativeTime(minutesAgo: number): string {
  if (minutesAgo < 60) return rtf.format(-minutesAgo, 'minute');
  if (minutesAgo < 1440) return rtf.format(-Math.round(minutesAgo / 60), 'hour');
  return rtf.format(-Math.round(minutesAgo / 1440), 'day');
}

const ACCOUNT_LINKS = [
  { label: 'My Profile', icon: User, href: '/portal/profile' },
  { label: 'Data Cards', icon: BarChart3, href: '/portal/reports' },
  { label: 'Settings', icon: Settings, href: '/portal/profile?tab=settings' },
];

export function TopBar({ creator, onSignOut, onOpenSearch, onOpenMobileNav }: TopBarProps) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [optimisticNotifs, applyOptimistic] = useOptimistic(
    notifications,
    (state) => state.map((n) => ({ ...n, read: true })),
  );
  const [, startTransition] = useTransition();

  const unreadCount = optimisticNotifs.filter((n) => !n.read).length;

  const markAllRead = () => {
    startTransition(async () => {
      applyOptimistic(null);
      await Promise.resolve();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });
  };

  return (
    <header className="h-14 bg-background-surface border-b border-border-subtle flex items-center px-4 sm:px-6 gap-3 flex-shrink-0 relative z-30">

      {/* Mobile: hamburger + logo */}
      <button
        onClick={onOpenMobileNav}
        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all flex-shrink-0"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>
      <Link href="/portal/home" className="lg:hidden flex-shrink-0">
        <span className="text-sm font-black text-foreground tracking-tight">
          PTA <span className="text-portal-accent">Portal</span>
        </span>
      </Link>

      {/* Search trigger — opens ⌘K palette */}
      <button
        onClick={onOpenSearch}
        className="flex-1 max-w-sm hidden sm:flex items-center h-8 rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] hover:border-portal-accent/30 hover:bg-portal-accent/5 transition-all px-3 group"
      >
        <Search size={13} className="text-foreground/25 group-hover:text-portal-accent/60 transition-colors flex-shrink-0" />
        <span className="ml-2 text-xs text-foreground/30 font-medium">Search creators, departments...</span>
        <kbd className="ml-auto font-mono text-[10px] tracking-[0.15em] text-foreground/30 border border-foreground/10 rounded-md px-1.5 py-0.5">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* Right: actions */}
      <div className="flex items-center gap-2">

        {/* Mobile search trigger */}
        <button
          onClick={onOpenSearch}
          className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-all"
          aria-label="Search"
        >
          <Search size={16} />
        </button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative w-8 h-8 flex items-center justify-center rounded-lg text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-portal-ring-focus"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-portal-accent rounded-full text-[10px] font-black text-white flex items-center justify-center tabular-nums">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-80 p-0 bg-background-elevated border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/[0.06]">
              <span className="text-xs font-black text-foreground uppercase tracking-wider">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-bold text-portal-accent hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="divide-y divide-foreground/[0.04] max-h-80 overflow-y-auto">
              {optimisticNotifs.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 hover:bg-foreground/[0.02] transition-colors ${!n.read ? 'bg-portal-accent/[0.03]' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-portal-accent flex-shrink-0 mt-1.5" />}
                    <div className={!n.read ? '' : 'pl-[14px]'}>
                      <p className={`text-xs font-semibold leading-relaxed ${n.read ? 'text-foreground/40' : 'text-foreground/80'}`}>{n.text}</p>
                      <p className="text-[10px] text-foreground/20 mt-1 font-bold">{relativeTime(n.minutesAgo)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-foreground/[0.06] text-center">
              <span className="text-[10px] font-bold text-foreground/30 cursor-pointer hover:text-foreground/60 transition-colors">
                View all notifications
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar + dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 h-8 pl-1 pr-2 rounded-xl hover:bg-foreground/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-portal-ring-focus">
              <div className="w-6 h-6 rounded-full bg-portal-accent/20 border border-portal-accent/30 flex items-center justify-center">
                <span className="text-[10px] font-black text-portal-accent uppercase">{creator.name.charAt(0)}</span>
              </div>
              <span className="text-xs font-bold text-foreground/60 hidden sm:block max-w-[80px] truncate">{creator.name}</span>
              <ChevronDown size={10} className="text-foreground/20" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-48 p-0 bg-background-elevated border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-foreground/[0.06]">
              <p className="text-xs font-black text-foreground truncate">{creator.name}</p>
              <p className="text-[10px] text-foreground/30 font-semibold">{creator.handle}</p>
            </div>
            {ACCOUNT_LINKS.map((item) => (
              <DropdownMenuItem
                key={item.label}
                asChild
                className="px-4 py-2.5 rounded-none focus:bg-foreground/[0.04] data-[highlighted]:bg-foreground/[0.04]"
              >
                <Link href={item.href} className="flex items-center gap-3 cursor-pointer">
                  <item.icon size={13} className="text-foreground/40" />
                  <span className="text-xs font-semibold text-foreground/70">{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-foreground/[0.06] my-0" />
            <DropdownMenuItem
              onSelect={onSignOut}
              className="px-4 py-2.5 rounded-none cursor-pointer focus:bg-red-400/5 data-[highlighted]:bg-red-400/5"
            >
              <LogOut size={13} className="text-red-400/40" />
              <span className="text-xs font-semibold text-red-400/70">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
