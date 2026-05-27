'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, BarChart3, StickyNote, Search, UserPlus, Check, X } from 'lucide-react';
import { Creator } from '@/lib/creators';

interface PortalAdminClientProps {
  manager: Creator;
  creators: Creator[];
}

const TABS = ['Creator Roster', 'CRM Notes', 'Assignments'];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export function PortalAdminClient({ manager, creators }: PortalAdminClientProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [noteText, setNoteText] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(creators[0] || null);

  const filtered = creators.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.handle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center">
          <Shield size={20} className="text-foreground/50" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Admin Controls</h1>
          <p className="text-xs text-foreground/30 font-medium">Manage creators, notes, and assignments</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Creators', value: creators.length, icon: Users },
          { label: 'Active', value: creators.filter(c => c.tier !== 'staff').length, icon: Check },
          { label: 'Staff', value: creators.filter(c => c.tier === 'staff').length, icon: Shield },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-4 text-center">
              <Icon size={16} className="text-foreground/25 mx-auto mb-2" />
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-[9px] font-bold text-foreground/25 uppercase tracking-wider">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-foreground/[0.03] border border-foreground/[0.06] rounded-2xl p-1.5 max-w-sm">
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex-1 transition-all ${
              activeTab === i ? 'bg-foreground/[0.08] text-foreground border border-foreground/10' : 'text-foreground/30 hover:text-foreground/60'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ─── CREATOR ROSTER ─── */}
      {activeTab === 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/25" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                className="pl-8 pr-4 py-2 bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl text-xs text-foreground placeholder-foreground/20 outline-none focus:border-foreground/20 w-48" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-[#14B8A6] text-xs font-black hover:bg-[#14B8A6]/20 transition-all">
              <UserPlus size={13} /> Add Creator
            </button>
          </div>
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
            {filtered.map(c => (
              <motion.div key={c.id} variants={fadeUp}
                onClick={() => setSelectedCreator(c)}
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${selectedCreator?.id === c.id ? 'border-[#14B8A6]/20 bg-[#14B8A6]/[0.03]' : 'border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.1]'}`}>
                <div className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-black text-foreground/50">{c.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{c.name}</p>
                  <p className="text-[9px] text-foreground/25">{c.handle}</p>
                </div>
                <div className="flex items-center gap-2">
                  {c.tier && (
                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/30">{c.tier}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* ─── CRM NOTES ─── */}
      {activeTab === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Creator list */}
          <div className="space-y-2">
            <p className="text-[9px] font-black text-foreground/30 uppercase tracking-widest mb-3">Select Creator</p>
            {creators.slice(0, 6).map(c => (
              <button key={c.id} onClick={() => setSelectedCreator(c)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl border text-left transition-all ${selectedCreator?.id === c.id ? 'border-[#14B8A6]/20 bg-[#14B8A6]/[0.04]' : 'border-foreground/[0.05] bg-foreground/[0.02] hover:border-foreground/[0.08]'}`}>
                <div className="w-7 h-7 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-black text-foreground/40">{c.name.charAt(0)}</span>
                </div>
                <p className="text-xs font-bold text-foreground">{c.name}</p>
              </button>
            ))}
          </div>

          {/* Note entry */}
          {selectedCreator && (
            <div className="lg:col-span-2">
              <p className="text-[9px] font-black text-foreground/30 uppercase tracking-widest mb-3">CRM Notes for {selectedCreator.name}</p>
              <div className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-5 mb-4">
                <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                  placeholder="Add internal note (private — only admin and staff see this)..."
                  rows={4}
                  className="w-full bg-transparent text-sm text-foreground placeholder-foreground/20 outline-none resize-none" />
                <div className="flex justify-end pt-3 border-t border-foreground/[0.05] mt-3">
                  <button disabled={!noteText.trim()}
                    className="px-4 py-2 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-[#14B8A6] text-xs font-black hover:bg-[#14B8A6]/20 transition-all disabled:opacity-30">
                    Add Note
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-foreground/20">No notes yet for this creator.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── ASSIGNMENTS ─── */}
      {activeTab === 2 && (
        <div className="max-w-2xl space-y-3">
          <p className="text-[9px] font-black text-foreground/30 uppercase tracking-widest mb-4">Manager Assignments</p>
          {creators.slice(0, 5).map(c => (
            <div key={c.id} className="flex items-center gap-4 p-4 rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02]">
              <div className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-black text-foreground/40">{c.name.charAt(0)}</span>
              </div>
              <p className="text-sm font-bold text-foreground flex-1">{c.name}</p>
              <select className="bg-[#0F1623] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#14B8A6]/30 [color-scheme:dark]">
                <option value="">Assign manager...</option>
                {creators.filter(m => m.tier === 'staff').map(m => (
                  <option key={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
