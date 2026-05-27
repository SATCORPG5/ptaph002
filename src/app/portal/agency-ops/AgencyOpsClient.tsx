'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Bell, BookOpen, Heart, Ticket, Plus, X, ChevronDown } from 'lucide-react';
import { ActivityRing } from '@/components/portal/ActivityRing';

const TABS = ['Announcements', 'Resources', 'Charity', 'Support Tickets'];

const ANNOUNCEMENTS = [
  { id: 1, title: 'June Data Cards Due Friday', body: 'All staff must submit Data Cards for their assigned creators by end of day Friday, May 30. Reach out to admin if you have issues.', author: 'Baked', time: '2h ago', pinned: true, category: 'Operations' },
  { id: 2, title: 'New Creator Onboarded: Internet Tour Guide', body: 'Welcome our newest creator to the roster! They have been assigned to their manager and their portal is now active.', author: 'Baked', time: '1d ago', pinned: false, category: 'Roster' },
  { id: 3, title: 'Battle Arena Registration Opens Tomorrow', body: 'Round 2 of the In-Agency Battle Arena opens for registration tomorrow. Check the Collab Lounge calendar for times.', author: 'Baked', time: '2d ago', pinned: false, category: 'Events' },
];

const RESOURCES = [
  { title: 'Creator Onboarding Checklist', type: 'PDF', size: '1.2 MB', category: 'Ops' },
  { title: 'Stream Setup Guide 2025', type: 'PDF', size: '3.8 MB', category: 'Technical' },
  { title: 'Brand Deal Rate Card Template', type: 'DOCX', size: '420 KB', category: 'Business' },
  { title: 'Hook Writing Worksheet', type: 'PDF', size: '850 KB', category: 'Content' },
  { title: 'Agency Brand Kit (Logos + Colors)', type: 'ZIP', size: '12.4 MB', category: 'Branding' },
];

const CHARITY = [
  { title: 'Charity Stream: Mental Health Awareness', goal: '$5,000', raised: '$3,420', deadline: 'Jun 15', active: true },
  { title: 'Creator Education Fund', goal: '$2,000', raised: '$2,000', deadline: 'May 1', active: false },
];

const TICKETS = [
  { id: 1, title: 'Profile image not showing correctly', creator: 'General Spuds', priority: 'medium', status: 'open', time: '3h ago' },
  { id: 2, title: 'Stream overlay template request', creator: 'ItsJakee_78', priority: 'low', status: 'in-review', time: '1d ago' },
  { id: 3, title: 'Card cover not saving changes', creator: 'Papa J', priority: 'high', status: 'open', time: '5h ago' },
  { id: 4, title: 'Data Card question', creator: 'Trash', priority: 'low', status: 'resolved', time: '2d ago' },
];

const PRIORITY_COLORS: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10 border-red-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-foreground/40 bg-foreground/5 border-foreground/10',
};
const STATUS_COLORS: Record<string, string> = {
  open: 'text-[#14B8A6] bg-[#14B8A6]/10 border-[#14B8A6]/20',
  'in-review': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  resolved: 'text-foreground/30 bg-foreground/5 border-foreground/10',
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export function AgencyOpsClient() {
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Briefcase size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Agency Ops</h1>
            <p className="text-xs text-foreground/30 font-medium">Announcements, resources, and support</p>
          </div>
        </div>
        <ActivityRing value={61} size={40} strokeWidth={3.5} />
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-foreground/[0.03] border border-foreground/[0.06] rounded-2xl p-1.5 mb-8 overflow-x-auto scrollbar-none">
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === i ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'text-foreground/30 hover:text-foreground/60 hover:bg-foreground/[0.04]'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ─── ANNOUNCEMENTS ─── */}
      {activeTab === 0 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3 max-w-2xl">
          {ANNOUNCEMENTS.map(ann => (
            <motion.div key={ann.id} variants={fadeUp}
              className={`rounded-2xl border overflow-hidden transition-all ${ann.pinned ? 'border-blue-500/20 bg-blue-500/[0.03]' : 'border-foreground/[0.06] bg-foreground/[0.02]'}`}>
              <button
                onClick={() => setExpanded(expanded === ann.id ? null : ann.id)}
                className="w-full flex items-start gap-4 p-5 text-left"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${ann.pinned ? 'bg-blue-500/10 border-blue-500/20' : 'bg-foreground/[0.04] border-foreground/[0.06]'}`}>
                  <Bell size={14} className={ann.pinned ? 'text-blue-400' : 'text-foreground/30'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {ann.pinned && <span className="text-[8px] font-black text-blue-400 uppercase tracking-wider">Pinned</span>}
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-foreground/5 text-foreground/30">{ann.category}</span>
                  </div>
                  <p className="text-sm font-black text-foreground">{ann.title}</p>
                  <p className="text-[9px] text-foreground/25 mt-1">{ann.author} · {ann.time}</p>
                </div>
                <ChevronDown size={14} className={`text-foreground/20 flex-shrink-0 transition-transform mt-1 ${expanded === ann.id ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expanded === ann.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 border-t border-foreground/[0.04]">
                      <p className="text-sm text-foreground/50 leading-relaxed pt-4">{ann.body}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ─── RESOURCES ─── */}
      {activeTab === 1 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {RESOURCES.map((r, i) => (
            <motion.div key={i} variants={fadeUp}
              className="flex items-center gap-4 p-4 rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] hover:border-blue-500/15 transition-all group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <BookOpen size={16} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground group-hover:text-foreground truncate">{r.title}</p>
                <p className="text-[9px] text-foreground/25 mt-0.5">{r.type} · {r.size}</p>
              </div>
              <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/30 flex-shrink-0">{r.category}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ─── CHARITY ─── */}
      {activeTab === 2 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 max-w-2xl">
          {CHARITY.map((c, i) => {
            const pct = Math.round((parseFloat(c.raised.replace(/[$,]/g, '')) / parseFloat(c.goal.replace(/[$,]/g, ''))) * 100);
            return (
              <motion.div key={i} variants={fadeUp}
                className={`rounded-2xl border p-6 ${c.active ? 'border-[#14B8A6]/20 bg-[#14B8A6]/[0.03]' : 'border-foreground/[0.05] bg-foreground/[0.01] opacity-70'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Heart size={14} className={c.active ? 'text-[#14B8A6]' : 'text-foreground/20'} />
                      {c.active && <span className="text-[8px] font-black text-[#14B8A6] uppercase tracking-wider">Active</span>}
                    </div>
                    <h3 className="text-sm font-black text-foreground">{c.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-foreground">{c.raised}</p>
                    <p className="text-[9px] text-foreground/25">of {c.goal} goal</p>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-foreground/[0.05] overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#14B8A6]">{pct}% raised</span>
                  <span className="text-[9px] text-foreground/25">Ends {c.deadline}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ─── TICKETS ─── */}
      {activeTab === 3 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-black text-foreground/30 uppercase tracking-widest">Support Tickets</p>
            <button onClick={() => setShowNewTicket(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black hover:bg-blue-500/20 transition-all">
              <Plus size={14} /> New Ticket
            </button>
          </div>
          <div className="space-y-3">
            {TICKETS.map(t => (
              <motion.div key={t.id} variants={fadeUp}
                className="flex items-start gap-4 p-4 rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.1] transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground mb-1">{t.title}</p>
                  <p className="text-[9px] text-foreground/25">{t.creator} · {t.time}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicket && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowNewTicket(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-background-surface border border-foreground/10 rounded-3xl p-8 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-foreground">Submit Support Ticket</h3>
                <button onClick={() => setShowNewTicket(false)}><X size={18} className="text-foreground/30" /></button>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Brief title of your issue..." className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none" />
                <select className="w-full bg-[#0F1623] border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none [color-scheme:dark]">
                  <option value="">Priority level...</option>
                  <option>High — Blocking my stream</option>
                  <option>Medium — Can work around it</option>
                  <option>Low — Question / minor issue</option>
                </select>
                <textarea rows={4} placeholder="Describe the issue in detail..." className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none resize-none" />
                <button className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black hover:bg-blue-500/20 transition-all">
                  Submit Ticket
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
