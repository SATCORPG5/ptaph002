'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Creator } from '@/lib/creators';
import { signOutAction } from '@/app/actions/auth';
import { TopBar } from './TopBar';
import { TopMomentumBar } from './TopMomentumBar';
import { LeftSidebar } from './LeftSidebar';
import { BottomNav } from './BottomNav';
import { RightPanel } from './RightPanel';
import { PanelRight } from 'lucide-react';

interface PortalShellProps {
  creator: Creator;
  children: React.ReactNode;
}

export function PortalShell({ creator, children }: PortalShellProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOutAction();
    router.push('/');
    router.refresh();
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, []);

  return (
    <div className="pta-portal fixed inset-0 flex flex-col bg-background overflow-hidden" style={{ paddingTop: 0 }}>

      {/* ─── TOP BAR ─── */}
      <TopBar
        creator={creator}
        onSignOut={handleSignOut}
        rightPanelOpen={rightPanelOpen}
        onRightPanelToggle={() => setRightPanelOpen(!rightPanelOpen)}
      />

      {/* ─── MOMENTUM BAR ─── */}
      <TopMomentumBar activeStage={3} livePosts={47} liveCollabs={12} activeCreators={28} />

      {/* ─── MAIN AREA ─── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar (desktop) */}
        <LeftSidebar
          creator={creator}
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          onSignOut={handleSignOut}
        />

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-[280px] flex-shrink-0 z-10">
              <LeftSidebar
                creator={creator}
                collapsed={false}
                onCollapse={() => setMobileSidebarOpen(false)}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {/* Right panel toggle button (desktop) */}
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className={`hidden lg:flex fixed right-0 top-[104px] z-20 w-6 h-12 items-center justify-center bg-[#080812] border-l border-t border-b border-white/[0.05] rounded-l-lg text-white/20 hover:text-[#14B8A6] transition-colors ${rightPanelOpen ? 'opacity-0 pointer-events-none' : ''}`}
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
    </div>
  );
}
