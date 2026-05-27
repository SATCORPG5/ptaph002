'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Calendar, BarChart3, CheckSquare, StickyNote, Star, Plus, X, Check, ExternalLink } from 'lucide-react';
import { ActivityRing } from '@/components/portal/ActivityRing';

const TABS = ["Who's Live", 'Live Schedule', 'Tracker', 'Go Live Checklist', 'Live Notes', 'Highlights'];

const LIVE_NOW = [
  { creator: 'ColdP1zza', viewers: '2,143', diamonds: '847', time: '1h 23m', category: 'Gaming' },
  { creator: 'Slingin6.0', viewers: '1,891', diamonds: '1,204', time: '2h 05m', category: 'IRL' },
  { creator: 'STEALYN', viewers: '1,342', diamonds: '523', time: '42m', category: 'Just Chatting' },
];

const SCHEDULE = [
  { creator: 'ItsJakee_78', time: 'Today 7pm', category: 'Gaming', title: 'Ranked Grind Session' },
  { creator: 'General Spuds', time: 'Today 9pm', category: 'IRL', title: 'Late Night Cooking' },
  { creator: 'Papa J', time: 'Tomorrow 3pm', category: 'Just Chatting', title: 'Community Q&A' },
  { creator: 'Trash', time: 'Fri 8pm', category: 'Gaming', title: 'Casual Friday Vibes' },
];

const GO_LIVE_CHECKLIST = [
  { id: 1, item: 'Lighting setup optimized' },
  { id: 2, item: 'Microphone tested & levels set' },
  { id: 3, item: 'Stream title and thumbnail ready' },
  { id: 4, item: 'Backup power connected' },
  { id: 5, item: 'Giveaway items / gifts prepped' },
  { id: 6, item: 'Engagement hooks written out' },
  { id: 7, item: 'Goals for the stream set' },
  { id: 8, item: 'Hydration & snacks ready 💧' },
];

const HIGHLIGHTS = [
  { creator: 'ColdP1zza', title: 'Back-to-back gift trains for 10 min straight!', views: '14.2K', time: '2h ago' },
  { creator: 'Slingin6.0', title: 'Collab stream moment, crowd went crazy', views: '8.7K', time: '1d ago' },
  { creator: 'STEALYN', title: 'First time hitting 1K CCV, the chat reaction', views: '6.4K', time: '2d ago' },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export function LiveFloorClient() {
  const [activeTab, setActiveTab] = useState(0);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [markingLive, setMarkingLive] = useState(false);
  const [trackerForm, setTrackerForm] = useState({ viewers: '', diamonds: '', notes: '' });
  const [noteText, setNoteText] = useState('');

  const toggleCheck = (id: number) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Radio size={20} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Live Floor</h1>
            <p className="text-xs text-foreground/30 font-medium">Real-time TikTok LIVE activity hub</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black text-red-400">{LIVE_NOW.length} Live Now</span>
          </div>
          <ActivityRing value={88} size={40} strokeWidth={3.5} />
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-foreground/[0.03] border border-foreground/[0.06] rounded-2xl p-1.5 mb-8 overflow-x-auto scrollbar-none">
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === i ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'text-foreground/30 hover:text-foreground/60 hover:bg-foreground/[0.04]'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ─── WHO'S LIVE ─── */}
      {activeTab === 0 && (
        <motion.div variants={stagger} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-black text-foreground/30 uppercase tracking-widest">Streaming now</p>
            <button onClick={() => setMarkingLive(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black hover:bg-red-500/20 transition-all">
              <Radio size={14} /> Go Live
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LIVE_NOW.map(s => (
              <motion.div key={s.creator} variants={fadeUp}
                className="rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-5 hover:border-red-500/25 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <span className="text-xs font-black text-red-400">{s.creator.charAt(0)}</span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">{s.creator}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-foreground/5 text-foreground/30">{s.category}</span>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-foreground/20 hover:text-foreground cursor-pointer" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Viewers', value: s.viewers },
                    { label: 'Diamonds', value: s.diamonds },
                    { label: 'Duration', value: s.time },
                  ].map(stat => (
                    <div key={stat.label} className="text-center p-2 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]">
                      <p className="text-xs font-black text-foreground">{stat.value}</p>
                      <p className="text-[8px] font-bold text-foreground/25 uppercase tracking-wider mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── LIVE SCHEDULE ─── */}
      {activeTab === 1 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-black text-foreground/30 uppercase tracking-widest">Upcoming streams</p>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black text-foreground/30 hover:text-foreground/60 bg-foreground/[0.03] border border-foreground/[0.06] transition-all">
              <Plus size={11} /> Add Stream
            </button>
          </div>
          {SCHEDULE.map((s, i) => (
            <motion.div key={i} variants={fadeUp}
              className="flex items-center gap-4 p-4 rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] hover:border-red-500/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-foreground/[0.04] border border-foreground/[0.06] flex items-center justify-center flex-shrink-0">
                <Calendar size={16} className="text-foreground/30" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-foreground">{s.title}</p>
                <p className="text-[9px] text-foreground/30 mt-0.5">{s.creator} · {s.category}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-black text-foreground/60">{s.time}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ─── TRACKER ─── */}
      {activeTab === 2 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg">
          <div className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-8">
            <h3 className="text-lg font-black text-foreground mb-2">Live Performance Tracker</h3>
            <p className="text-xs text-foreground/40 mb-6">Log during-stream stats for your records</p>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] block mb-2">Peak Viewers</label>
                <input type="number" value={trackerForm.viewers}
                  onChange={e => setTrackerForm(p => ({ ...p, viewers: e.target.value }))}
                  placeholder="e.g. 1,240"
                  className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none focus:border-red-500/30" />
              </div>
              <div>
                <label className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] block mb-2">Diamonds Earned</label>
                <input type="number" value={trackerForm.diamonds}
                  onChange={e => setTrackerForm(p => ({ ...p, diamonds: e.target.value }))}
                  placeholder="e.g. 847"
                  className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none focus:border-red-500/30" />
              </div>
              <div>
                <label className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] block mb-2">Session Notes</label>
                <textarea rows={3} value={trackerForm.notes}
                  onChange={e => setTrackerForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="What worked? What didn't?"
                  className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none resize-none focus:border-red-500/30" />
              </div>
              <button className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-black hover:bg-red-500/20 transition-all">
                Save Session Log
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── GO LIVE CHECKLIST ─── */}
      {activeTab === 3 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-black text-foreground/30 uppercase tracking-widest">Pre-Stream Checklist</p>
            <span className="text-[10px] font-black text-[#14B8A6]">{checkedCount}/{GO_LIVE_CHECKLIST.length} done</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-foreground/[0.05] overflow-hidden mb-6">
            <motion.div
              className="h-full bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] rounded-full"
              animate={{ width: `${(checkedCount / GO_LIVE_CHECKLIST.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="space-y-2">
            {GO_LIVE_CHECKLIST.map(c => (
              <button key={c.id} onClick={() => toggleCheck(c.id)}
                className={`flex items-center gap-4 w-full p-4 rounded-xl border transition-all text-left ${
                  checked[c.id] ? 'border-[#14B8A6]/20 bg-[#14B8A6]/[0.03] text-foreground/60' : 'border-foreground/[0.06] bg-foreground/[0.02] text-foreground hover:border-foreground/[0.1]'
                }`}>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                  checked[c.id] ? 'bg-[#14B8A6]/20 border-[#14B8A6]/40' : 'border-foreground/15'
                }`}>
                  {checked[c.id] && <Check size={11} className="text-[#14B8A6]" />}
                </div>
                <span className={`text-sm font-semibold transition-all ${checked[c.id] ? 'line-through text-foreground/30' : ''}`}>{c.item}</span>
              </button>
            ))}
          </div>

          {checkedCount === GO_LIVE_CHECKLIST.length && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/[0.04] text-center">
              <p className="text-sm font-black text-red-400">You're ready to go live! 🔴</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ─── LIVE NOTES ─── */}
      {activeTab === 4 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <p className="text-xs text-foreground/30 font-bold uppercase tracking-widest mb-4">Staff session notes</p>
          <div className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-6 mb-4">
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add a session note (visible to assigned staff and admin)..."
              rows={4}
              className="w-full bg-transparent text-sm text-foreground placeholder-foreground/20 outline-none resize-none"
            />
            <div className="flex items-center justify-between pt-3 border-t border-foreground/[0.05] mt-3">
              <span className="text-[9px] text-foreground/20 font-bold">{noteText.length} chars</span>
              <button
                disabled={!noteText.trim()}
                className="px-4 py-2 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-[#14B8A6] text-xs font-black hover:bg-[#14B8A6]/20 transition-all disabled:opacity-30"
              >
                Save Note
              </button>
            </div>
          </div>
          <p className="text-[10px] text-foreground/20 font-bold">No prior notes for this session.</p>
        </motion.div>
      )}

      {/* ─── HIGHLIGHTS ─── */}
      {activeTab === 5 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-black text-foreground/30 uppercase tracking-widest">Recent Highlights</p>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] text-foreground/50 text-xs font-black hover:text-foreground transition-all">
              <Plus size={14} /> Share Clip
            </button>
          </div>
          {HIGHLIGHTS.map((h, i) => (
            <motion.div key={i} variants={fadeUp}
              className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-5 hover:border-red-500/10 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Star size={16} className="text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-foreground mb-1">{h.creator}</p>
                  <p className="text-sm text-foreground/60 leading-relaxed mb-2">{h.title}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-foreground/25 font-bold">{h.views} views</span>
                    <span className="text-[9px] text-foreground/20">{h.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Mark Live Modal */}
      <AnimatePresence>
        {markingLive && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setMarkingLive(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-background-surface border border-foreground/10 rounded-3xl p-8 w-full max-w-sm text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                <Radio size={28} className="text-red-400" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-2">Mark Yourself Live</h3>
              <p className="text-xs text-foreground/40 mb-6">This will show you in the Who's Live feed for the agency and public.</p>
              <input type="text" placeholder="Stream title / game..." className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setMarkingLive(false)} className="flex-1 py-3 rounded-xl border border-foreground/10 text-foreground/40 text-sm font-black">Cancel</button>
                <button className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-black hover:bg-red-500/30 transition-all">
                  🔴 Go Live
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
