'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import {
  Home, Palette, Users, GraduationCap, Briefcase, Radio,
  User, BarChart3, Users2, UserCheck, Shield,
} from 'lucide-react';
import { Creator } from '@/lib/creators';
import { signOutAction } from '@/app/actions/auth';
import { TopBar } from './TopBar';
import { TopMomentumBar } from './TopMomentumBar';
import { StatusRail } from './StatusRail';
import { LeftSidebar } from './LeftSidebar';
import { BottomNav } from './BottomNav';
import { RightPanel } from './RightPanel';
import { NAV_TARGETS } from './nav-targets';
import { CommandPalette } from './ui';
import { Sheet, SheetContent, SheetTitle } from '@/components/shadcn-ui/sheet';
import { PanelRight } from 'lucide-react';

interface PortalShellProps {
  creator: Creator;
  children: React.ReactNode;
}

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  home: Home, 'creative-studio': Palette, 'collab-lounge': Users,
  'growth-academy': GraduationCap, 'agency-ops': Briefcase, 'live-floor': Radio,
  profile: User, reports: BarChart3, 'my-team': Users2,
  settings: User, 'my-creators': UserCheck, admin: Shield,
};

const SIDEBAR_KEY = 'pta:sidebar-expanded';

export function PortalShell({ creator, children }: PortalShellProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Restore persisted sidebar state (expanded === !collapsed)
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored === null) return;
    const restore = () => setSidebarCollapsed(stored === 'false');
    restore();
  }, []);

  const handleCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem(SIDEBAR_KEY, String(!collapsed));
  };

  const handleSignOut = async () => {
    await signOutAction();
    router.push('/');
    router.refresh();
  };

  const commandItems = useMemo(
    () =>
      NAV_TARGETS.map((t) => {
        const Icon = ICONS[t.id];
        return {
          id: t.id,
          label: t.label,
          description: t.description,
          category: t.category,
          icon: Icon ? <Icon size={14} /> : undefined,
          onSelect: () => router.push(t.href),
        };
      }),
    [router],
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="pta-portal fixed inset-0 flex flex-col bg-background overflow-hidden">

        {/* ─── TOP BAR ─── */}
        <TopBar
          creator={creator}
          onSignOut={handleSignOut}
          rightPanelOpen={rightPanelOpen}
          onRightPanelToggle={() => setRightPanelOpen(!rightPanelOpen)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMobileNav={() => setMobileSidebarOpen(true)}
        />

        {/* ─── MOMENTUM + STATUS ─── */}
        <TopMomentumBar activeStage={3} livePosts={47} liveCollabs={12} activeCreators={28} />
        <StatusRail liveCount={28} />

        {/* ─── MAIN AREA ─── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left Sidebar (desktop) */}
          <LeftSidebar
            creator={creator}
            collapsed={sidebarCollapsed}
            onCollapse={handleCollapse}
            onSignOut={handleSignOut}
          />

          {/* Mobile sidebar (Sheet) */}
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent
              side="left"
              showCloseButton={false}
              className="w-[280px] p-0 bg-background-surface border-border-subtle"
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <LeftSidebar
                creator={creator}
                collapsed={false}
                onCollapse={() => setMobileSidebarOpen(false)}
                onSignOut={handleSignOut}
                forceExpanded
              />
            </SheetContent>
          </Sheet>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
            {/* Right panel toggle button (desktop) */}
            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className={`hidden lg:flex fixed right-0 top-[104px] z-20 w-6 h-12 items-center justify-center bg-portal-surface-1 border-l border-t border-b border-white/[0.05] rounded-l-lg text-white/20 hover:text-portal-accent transition-colors ${rightPanelOpen ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <PanelRight size={12} />
            </button>

            <div className="min-h-full pb-20 lg:pb-8">
              {children}
            </div>
          </main>

          {/* Right Panel */}
          <RightPanel open={rightPanelOpen} onClose={() => setRightPanelOpen(false)} />
        </div>

        {/* Bottom Nav (mobile) */}
        <BottomNav />

        {/* Global ⌘K command palette */}
        <CommandPalette
          items={commandItems}
          open={searchOpen}
          onOpenChange={setSearchOpen}
          placeholder="Search creators, departments..."
        />
      </div>
    </MotionConfig>
  );
}
