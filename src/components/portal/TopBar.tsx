'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Bell, ChevronDown, User, BarChart3, Settings, LogOut, X } from 'lucide-react';
import { Creator } from '@/lib/creators';

interface TopBarProps {
  creator: Creator;
  onSignOut: () => void;
  rightPanelOpen: boolean;
  onRightPanelToggle: () => void;
}

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'New Data Card submitted for your review', time: '2m ago', read: false, type: 'report' },
  { id: 2, text: 'Manager accepted your creator request', time: '1h ago', read: false, type: 'manager' },
  { id: 3, text: 'Challenge results are in — check Growth Academy', time: '3h ago', read: true, type: 'challenge' },
  { id: 4, text: 'New collab request posted in Lounge', time: '5h ago', read: true, type: 'collab' },
];

export function TopBar({ creator, onSignOut, rightPanelOpen, onRightPanelToggle }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <header className="h-14 bg-background-surface border-b border-border-subtle flex items-center px-4 sm:px-6 gap-4 flex-shrink-0 relative z-30">

      {/* Mobile: Logo */}
      <Link href="/portal/home" className="lg:hidden flex-shrink-0">
        <span className="text-sm font-black text-foreground tracking-tight">
          PTA <span className="text-[#14B8A6]">Portal</span>
        </span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-sm hidden sm:flex items-center">
        <div className={`relative flex items-center w-full h-8 rounded-xl border transition-all ${
          searchOpen ? 'border-[#14B8A6]/40 bg-[#14B8A6]/5' : 'border-foreground/[0.06] bg-foreground/[0.03]'
        }`}>
          <Search size={13} className="absolute left-3 text-foreground/25" />
          <input
            type="text"
            placeholder="Search creators, departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            className="w-full h-full bg-transparent pl-8 pr-4 text-xs text-foreground placeholder-foreground/20 outline-none font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3">
              <X size={11} className="text-foreground/30" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1" />

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Mobile search */}
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
                className="absolute right-0 top-full mt-2 w-80 bg-background-elevated border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/[0.06]">
                  <span className="text-xs font-black text-foreground uppercase tracking-wider">Notifications</span>
                  <span className="text-[9px] font-bold text-[#14B8A6] cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="divide-y divide-foreground/[0.04]">
                  {MOCK_NOTIFICATIONS.map((n) => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-foreground/[0.02] transition-colors cursor-pointer ${!n.read ? 'bg-[#14B8A6]/[0.03]' : ''}`}>
                      <p className={`text-xs font-semibold leading-relaxed ${n.read ? 'text-foreground/40' : 'text-foreground/80'}`}>{n.text}</p>
                      <p className="text-[9px] text-foreground/20 mt-1 font-bold">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-foreground/[0.06] text-center">
                  <span className="text-[10px] font-bold text-foreground/30 cursor-pointer hover:text-foreground/60 transition-colors">View all notifications</span>
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
                  { label: 'My Profile', icon: User, href: '/portal/profile' },
                  { label: 'Data Cards', icon: BarChart3, href: '/portal/reports' },
                  { label: 'Settings', icon: Settings, href: '/portal/profile?tab=settings' },
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

      {/* Click-outside to close dropdowns */}
      {(notifOpen || avatarOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setNotifOpen(false); setAvatarOpen(false); }} />
      )}
    </header>
  );
}
