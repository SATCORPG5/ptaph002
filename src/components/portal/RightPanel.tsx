'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { X, Radio, Users, Calendar, Ticket, TrendingUp, Bell } from 'lucide-react';

type IconProps = { size?: number; className?: string };
type IconComponent = React.ComponentType<IconProps>;

interface RightPanelProps {
  open: boolean;
  onClose: () => void;
}

function LiveFloorPanel() {
  const creators = [
    { name: 'ColdP1zza', viewers: '2.1K', duration: '1h 23m' },
    { name: 'Slingin6.0', viewers: '847', duration: '42m' },
    { name: 'STEALYN', viewers: '1.3K', duration: '2h 05m' },
  ];
  return (
    <div className="space-y-3">
      {creators.map((c) => (
        <div key={c.name} className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.05] hover:border-portal-accent/20 transition-colors">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center">
              <span className="text-[9px] font-black text-portal-accent">{c.name.charAt(0)}</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-background-surface animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{c.name}</p>
            <p className="text-[9px] text-foreground/30">{c.viewers} viewers Â· {c.duration}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CollabPanel() {
  const requests = [
    { name: 'ItsJakee_78', niche: 'Gaming', status: 'open' },
    { name: 'General Spuds', niche: 'IRL', status: 'open' },
    { name: 'Papa J', niche: 'Just Chatting', status: 'pending' },
  ];
  return (
    <div className="space-y-3">
      {requests.map((r) => (
        <div key={r.name} className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.05]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-foreground">{r.name}</p>
            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${
              r.status === 'open' ? 'bg-portal-accent/10 text-portal-accent' : 'bg-foreground/5 text-foreground/30'
            }`}>{r.status}</span>
          </div>
          <p className="text-[9px] text-foreground/30">{r.niche}</p>
        </div>
      ))}
    </div>
  );
}

function AgencyOpsPanel() {
  const tickets = [
    { title: 'Stream setup issue', priority: 'high', status: 'open' },
    { title: 'Profile image not updating', priority: 'medium', status: 'in-review' },
    { title: 'Card cover question', priority: 'low', status: 'resolved' },
  ];
  return (
    <div className="space-y-3">
      {tickets.map((t) => (
        <div key={t.title} className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.05]">
          <p className="text-xs font-bold text-foreground mb-1 leading-tight">{t.title}</p>
          <div className="flex items-center gap-2">
            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${
              t.priority === 'high' ? 'bg-red-500/10 text-red-400'
              : t.priority === 'medium' ? 'bg-amber-500/10 text-amber-400'
              : 'bg-foreground/5 text-foreground/30'
            }`}>{t.priority}</span>
            <span className="text-[8px] font-bold text-foreground/25 capitalize">{t.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DefaultPanel() {
  const announcements = [
    { text: 'New challenge drops Monday. Check Growth Academy', time: '2h ago' },
    { text: 'Battle Arena registration now open', time: '1d ago' },
    { text: 'Monthly Data Cards due this Friday', time: '2d ago' },
  ];
  return (
    <div className="space-y-3">
      {announcements.map((a, i) => (
        <div key={i} className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.05]">
          <p className="text-xs text-foreground/60 leading-relaxed">{a.text}</p>
          <p className="text-[9px] text-foreground/20 mt-1.5 font-bold">{a.time}</p>
        </div>
      ))}
    </div>
  );
}

const PANEL_CONFIG: Record<string, { title: string; icon: IconComponent; Component: React.ComponentType }> = {
  '/portal/live-floor': { title: "Who's Live", icon: Radio, Component: LiveFloorPanel },
  '/portal/collab-lounge': { title: 'Open Requests', icon: Users, Component: CollabPanel },
  '/portal/agency-ops': { title: 'Open Tickets', icon: Ticket, Component: AgencyOpsPanel },
};

export function RightPanel({ open, onClose }: RightPanelProps) {
  const pathname = usePathname();

  const matched = Object.entries(PANEL_CONFIG).find(([path]) => pathname.startsWith(path));
  const panelEntry: { title: string; icon: IconComponent; Component: React.ComponentType } =
    matched?.[1] ?? { title: 'Agency Feed', icon: Bell, Component: DefaultPanel };
  const { title, icon: Icon, Component } = panelEntry;

  return (
    <>
      {/* Desktop panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="hidden lg:flex flex-col bg-background-surface border-l border-border-subtle flex-shrink-0 overflow-hidden"
          >
            <div className="flex items-center justify-between h-14 px-4 border-b border-foreground/[0.05] flex-shrink-0">
              <div className="flex items-center gap-2">
                <Icon size={14} className="text-portal-accent" />
                <span className="text-xs font-black text-foreground/70">{title}</span>
              </div>
              <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-foreground/20 hover:text-foreground transition-colors">
                <X size={13} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none p-4">
              <Component />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile: slide-up sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={onClose}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed bottom-16 left-0 right-0 bg-background-elevated border-t border-border rounded-t-3xl z-50 max-h-[60vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/[0.06]">
                <div className="flex items-center gap-2">
                  <Icon size={15} className="text-portal-accent" />
                  <span className="text-sm font-black text-foreground">{title}</span>
                </div>
                <button onClick={onClose}>
                  <X size={16} className="text-foreground/30" />
                </button>
              </div>
              <div className="p-4">
                <Component />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
