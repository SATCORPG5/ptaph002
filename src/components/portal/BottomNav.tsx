'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Palette, Users, GraduationCap, Radio } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home',            label: 'Lobby',     icon: Home,          href: '/portal/home' },
  { id: 'creative-studio', label: 'Studio',    icon: Palette,       href: '/portal/creative-studio' },
  { id: 'collab-lounge',   label: 'Collab',    icon: Users,         href: '/portal/collab-lounge' },
  { id: 'growth-academy',  label: 'Academy',   icon: GraduationCap, href: '/portal/growth-academy' },
  { id: 'live-floor',      label: 'Live',      icon: Radio,         href: '/portal/live-floor' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background-surface/95 backdrop-blur-xl border-t border-border-subtle safe-area-pb">
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link key={item.id} href={item.href} className="flex-1">
              <div className="flex flex-col items-center justify-center h-full gap-1 relative">
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute top-0 left-2 right-2 h-0.5 bg-[#14B8A6] rounded-full"
                  />
                )}
                <Icon
                  size={20}
                  className={`transition-colors ${isActive ? 'text-[#14B8A6]' : 'text-white/25'}`}
                />
                <span
                  className={`text-[9px] font-bold transition-colors ${isActive ? 'text-[#14B8A6]' : 'text-white/20'}`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
