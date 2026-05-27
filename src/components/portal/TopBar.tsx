'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, ChevronDown, User, BarChart3, Settings, LogOut, X, ArrowRight } from 'lucide-react';
import { Creator } from '@/lib/creators';

interface TopBarProps {
  creator: Creator;
  onSignOut: () => void;
  rightPanelOpen: boolean;
  onRightPanelToggle: () => void;
}

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
  type: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, text: 'New Data Card submitted for your review', time: '2m ago', read: false, type: 'report' },
  { id: 2, text: 'Manager accepted your creator request',  time: '1h ago', read: false, type: 'manager' },
  { id: 3, text: 'Challenge results are in. Check Growth Academy', time: '3h ago', read: true, type: 'challenge' },
  { id: 4, text: 'New collab request posted in Lounge',    time: '5h ago', read: true,  type: 'collab' },
];

const SEARCH_ITEMS = [
  { label: 'Lobby',           desc: 'Home base for your portal',            href: '/portal/home',            category: 'Navigation' },
  { label: 'Creative Studio', desc: 'Assets, thumbnails, overlays',         href: '/portal/creative-studio', category: 'Navigation' },
  { label: 'Collab Lounge',   desc: 'Co-streams, collabs, events',          href: '/portal/collab-lounge',   category: 'Navigation' },
  { label: 'Growth Academy',  desc: 'Courses, challenges, coaching',        href: '/portal/growth-academy',  category: 'Navigation' },
  { label: 'Agency Ops',      desc: 'Support tickets, onboarding',          href: '/portal/agency-ops',      category: 'Navigation' },
  { label: 'Live Floor',      desc: 'Live stats, clip archive',             href: '/portal/live-floor',      category: 'Navigation' },
  { label: 'My Profile',      desc: 'Edit your profile and branding',       href: '/portal/profile',         category: 'Account' },
  { label: 'Data Cards',      desc: 'Stream reports and analytics',         href: '/portal/reports',         category: 'Account' },
  { label: 'My Team',         desc: 'Team hub and manager messages',        href: '/portal/my-team',         category: 'Account' },
  { label: 'My Creators',     desc: 'Manage your creator roster',           href: '/portal/my-creators',     category: 'Management' },
  { label: 'Admin Controls',  desc: 'Portal administration panel',          href: '/portal/admin',           category: 'Management' },
  { label: 'Settings',        desc: 'Account settings and preferences',     href: '/portal/profile?tab=settings', category: 'Account' },
];

export function TopBar({ creator, onSignOut, rightPanelOpen, onRightPanelToggle }: TopBarProps) {
  const [notifOpen, setNotifOpen]       = useState(false);
  const [avatarOpen, setAvatarOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [searchOpen,  setSearchOpen]    = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const searchResults = searchQuery.trim().length > 0
    ? SEARCH_ITEMS.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 7)
    : [];

  const handleSearchSelect = (href: string) => {
    setSearchQuery('');
    setSearchOpen(false);
    router.push(href);
  };

  return (
    <header className="h-14 bg-background-surface border-b border-border-subtle flex items-center px-4 sm:px-6 gap-4 flex-shrink-0 relative z-30">

      {/* Mobile: Logo */}
      <Link href="/portal/home" className="lg:hidden flex-shrink-0">
        <span className="text-sm font-black text-foreground tracking-tight">
          PTA <span className="text-[#14B8A6]">Portal</span>
        </span>
      </Link>

      {/* Search — desktop */}
      <div className="flex-1 max-w-sm hidden sm:flex items-center relative">
        <div className={`relative flex items-center w-full h-8 rounded-xl border transition-all ${
          searchOpen ? 'border-[#14B8A6]/40 bg-[#14B8A6]/5' : 'border-foreground/[0.06] bg-foreground/[0.03]'
        }`}>
          <Search size={13} className="absolute left-3 text-foreground/25 pointer-events-none" />
          <input
            type="text"
            placeholder="Search creators, departments..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            className="w-full h-full bg-transparent pl-8 pr-8 text-xs text-foreground placeholder-foreground/20 outline-none font-medium"
          />
          {searchQuery && (
            <button
              onMouseDown={() => { setSearchQuery(''); setSearchOpen(false); }}
              className="absolute right-3"
            >
              <X size={11} className="text-foreground/30" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {searchOpen && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.12 }}
              className="absolute top-full left-0 mt-2 w-full min-w-[300px] bg-background-elevated border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              {searchResults.map((item) => (
                <button
                  key={item.href}
                  onMouseDown={() => handleSearchSelect(item.href)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-foreground/[0.05] transition-colors text-left group border-b border-foreground/[0.04] last:border-0"
                >
                  <div>
                    <p className="text-xs font-bold text-foreground/80 group-hover:text-foreground">{item.label}</p>
                    <p className="text-[10px] text-foreground/30 mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <span className="text-[8px] font-black uppercase tracking-wider text-foreground/20 px-1.5 py-0.5 bg-foreground/5 rounded-md">
                      {item.category}
                    </span>
                    <ArrowRight size={11} className="text-foreground/20 group-hover:text-[#14B8A6] transition-colors" />
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1" />

      {/* Right: actions */}
      <div className="flex items-center gap-2">

        {/* Mobile search icon (placeholder for future mobile search overlay) */}
        <button className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-all">
          <Search size={16} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setAvatarOpen(false); }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-all"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#14B8A6] rounded-full text-[9px] font-black text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                // On mobile: fixed, centered horizontally, just below the top bar
                // On desktop: absolute dropdown aligned to the right of the bell icon
                className="fixed left-1/2 -translate-x-1/2 top-16 w-[calc(100vw-32px)] max-w-sm
                           sm:absolute sm:left-auto sm:translate-x-0 sm:right-0 sm:top-full sm:mt-2 sm:w-80
                           bg-background-elevated border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/[0.06]">
                  <span className="text-xs font-black text-foreground uppercase tracking-wider">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[9px] font-bold text-[#14B8A6] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-foreground/[0.04]">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 hover:bg-foreground/[0.02] transition-colors cursor-pointer ${!n.read ? 'bg-[#14B8A6]/[0.03]' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] flex-shrink-0 mt-1.5" />}
                        <div className={!n.read ? '' : 'pl-[14px]'}>
                          <p className={`text-xs font-semibold leading-relaxed ${n.read ? 'text-foreground/40' : 'text-foreground/80'}`}>{n.text}</p>
                          <p className="text-[9px] text-foreground/20 mt-1 font-bold">{n.time}</p>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => { setAvatarOpen(!avatarOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 h-8 pl-1 pr-2 rounded-xl hover:bg-foreground/5 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/30 flex items-center justify-center">
              <span className="text-[9px] font-black text-[#14B8A6] uppercase">{creator.name.charAt(0)}</span>
            </div>
            <span className="text-xs font-bold text-foreground/60 hidden sm:block max-w-[80px] truncate">{creator.name}</span>
            <ChevronDown size={10} className="text-foreground/20" />
          </button>

          <AnimatePresence>
            {avatarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-background-elevated border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-foreground/[0.06]">
                  <p className="text-xs font-black text-foreground truncate">{creator.name}</p>
                  <p className="text-[9px] text-foreground/30 font-semibold">{creator.handle}</p>
                </div>
                {[
                  { label: 'My Profile', icon: User,     href: '/portal/profile' },
                  { label: 'Data Cards', icon: BarChart3, href: '/portal/reports' },
                  { label: 'Settings',   icon: Settings,  href: '/portal/profile?tab=settings' },
                ].map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setAvatarOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-foreground/[0.04] transition-colors cursor-pointer">
                      <item.icon size={13} className="text-foreground/40" />
                      <span className="text-xs font-semibold text-foreground/60 hover:text-foreground">{item.label}</span>
                    </div>
                  </Link>
                ))}
                <div className="border-t border-foreground/[0.06]">
                  <button
                    onClick={() => { setAvatarOpen(false); onSignOut(); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-400/5 w-full transition-colors"
                  >
                    <LogOut size={13} className="text-red-400/40" />
                    <span className="text-xs font-semibold text-red-400/60 hover:text-red-400">Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click-outside backdrop to close dropdowns */}
      {(notifOpen || avatarOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setNotifOpen(false); setAvatarOpen(false); }}
        />
      )}
    </header>
  );
}
