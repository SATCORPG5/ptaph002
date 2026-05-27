'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Trophy, Zap, BarChart3, ChevronRight, Lock, Check, Star } from 'lucide-react';
import { ActivityRing } from '@/components/portal/ActivityRing';

const TABS = ['Modules', 'Challenges', 'Leaderboard', 'Tips Library'];

const MODULES = [
  { id: 1, title: 'Stream Setup Fundamentals', lessons: 5, completed: 5, duration: '45m', level: 'beginner', locked: false },
  { id: 2, title: 'Hook Writing for TikTok LIVE', lessons: 4, completed: 3, duration: '30m', level: 'beginner', locked: false },
  { id: 3, title: 'Growing Your Viewer Retention', lessons: 6, completed: 0, duration: '1h', level: 'intermediate', locked: false },
  { id: 4, title: 'Diamond Strategy & Gift Pulls', lessons: 8, completed: 0, duration: '1h 20m', level: 'intermediate', locked: false },
  { id: 5, title: 'Collab Networking Masterclass', lessons: 5, completed: 0, duration: '50m', level: 'advanced', locked: true },
  { id: 6, title: 'Brand Deal Preparation', lessons: 7, completed: 0, duration: '1h 10m', level: 'advanced', locked: true },
];

const CHALLENGES = [
  { id: 1, title: '7-Day Stream Streak', desc: 'Stream every day for 7 consecutive days', reward: '50 XP + Badge', deadline: 'Jun 1', submitted: false, active: true },
  { id: 2, title: 'Hook Challenge', desc: 'Use 3 engagement hooks in a single stream and report results', reward: '25 XP', deadline: 'May 31', submitted: true, active: true },
  { id: 3, title: 'Collab Creator', desc: 'Do a collab stream with another agency creator', reward: '75 XP + Badge', deadline: 'Jun 7', submitted: false, active: true },
];

const LEADERBOARD = [
  { rank: 1, creator: 'ColdP1zza', xp: 840, badges: 4, change: 'up' },
  { rank: 2, creator: 'Slingin6.0', xp: 720, badges: 3, change: 'up' },
  { rank: 3, creator: 'ItsJakee_78', xp: 610, badges: 2, change: 'same' },
  { rank: 4, creator: 'STEALYN', xp: 540, badges: 2, change: 'down' },
  { rank: 5, creator: 'General Spuds', xp: 480, badges: 1, change: 'up' },
  { rank: 6, creator: 'Papa J', xp: 390, badges: 1, change: 'same' },
];

const TIPS = [
  { title: 'How to Write a Stream Title That Gets Clicks', category: 'Growth', read: '4 min', featured: true },
  { title: 'The 3-Hook Formula for Viewer Retention', category: 'Engagement', read: '6 min', featured: true },
  { title: 'Gift Pull Psychology: Why Viewers Give', category: 'Monetization', read: '5 min', featured: false },
  { title: 'Setting Up Your Stream for Maximum Quality', category: 'Technical', read: '8 min', featured: false },
  { title: 'Collab Etiquette: How to Not Burn Bridges', category: 'Community', read: '3 min', featured: false },
];

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'text-[#14B8A6] bg-[#14B8A6]/10 border-[#14B8A6]/20',
  intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  advanced: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export function GrowthAcademyClient() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <GraduationCap size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Growth Academy</h1>
            <p className="text-xs text-foreground/30 font-medium">Learn, compete, and level up your stream</p>
          </div>
        </div>
        <ActivityRing value={35} size={40} strokeWidth={3.5} />
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-foreground/[0.03] border border-foreground/[0.06] rounded-2xl p-1.5 mb-8 overflow-x-auto scrollbar-none">
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === i ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'text-foreground/30 hover:text-foreground/60 hover:bg-foreground/[0.04]'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ─── MODULES ─── */}
      {activeTab === 0 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODULES.map(mod => {
            const progress = mod.lessons > 0 ? (mod.completed / mod.lessons) * 100 : 0;
            return (
              <motion.div key={mod.id} variants={fadeUp}
                className={`rounded-2xl border p-5 transition-all ${mod.locked ? 'border-foreground/[0.04] bg-foreground/[0.01] opacity-60' : 'border-foreground/[0.06] bg-foreground/[0.02] hover:border-amber-500/20'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${mod.locked ? 'bg-foreground/[0.03] border-foreground/[0.06]' : 'bg-amber-500/10 border-amber-500/20'}`}>
                      {mod.locked ? <Lock size={16} className="text-foreground/20" /> : <BookOpen size={16} className="text-amber-400" />}
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${LEVEL_COLORS[mod.level]}`}>{mod.level}</span>
                  </div>
                  {mod.completed === mod.lessons && mod.completed > 0 && (
                    <div className="w-6 h-6 rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/30 flex items-center justify-center">
                      <Check size={11} className="text-[#14B8A6]" />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-black text-foreground mb-1">{mod.title}</h3>
                <p className="text-[10px] text-foreground/30 mb-4">{mod.lessons} lessons · {mod.duration}</p>

                {/* Progress */}
                <div className="h-1.5 rounded-full bg-foreground/[0.05] overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-foreground/25">{mod.completed}/{mod.lessons} complete</span>
                  {!mod.locked && (
                    <button className="flex items-center gap-1 text-[9px] font-black text-amber-400/60 hover:text-amber-400 transition-colors">
                      {mod.completed > 0 ? 'Continue' : 'Start'} <ChevronRight size={10} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ─── CHALLENGES ─── */}
      {activeTab === 1 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 max-w-2xl">
          {CHALLENGES.map(ch => (
            <motion.div key={ch.id} variants={fadeUp}
              className={`rounded-2xl border p-6 transition-all ${ch.submitted ? 'border-[#14B8A6]/15 bg-[#14B8A6]/[0.03]' : 'border-foreground/[0.06] bg-foreground/[0.02] hover:border-amber-500/15'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-black text-foreground mb-1">{ch.title}</h3>
                  <p className="text-xs text-foreground/40 leading-relaxed">{ch.desc}</p>
                </div>
                {ch.submitted && (
                  <div className="w-7 h-7 rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/30 flex items-center justify-center flex-shrink-0 ml-4">
                    <Check size={12} className="text-[#14B8A6]" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[9px] font-black text-amber-400">
                    <Zap size={10} /> {ch.reward}
                  </span>
                  <span className="text-[9px] text-foreground/25">Due {ch.deadline}</span>
                </div>
                {!ch.submitted ? (
                  <button className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black hover:bg-amber-500/20 transition-all">
                    Submit Entry
                  </button>
                ) : (
                  <span className="text-[9px] font-black text-[#14B8A6] uppercase tracking-wider">Submitted ✓</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ─── LEADERBOARD ─── */}
      {activeTab === 2 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl space-y-2">
          {LEADERBOARD.map(entry => (
            <motion.div key={entry.rank} variants={fadeUp}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                entry.rank === 1 ? 'border-amber-500/25 bg-amber-500/[0.04]' : 'border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.1]'
              }`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${
                entry.rank === 1 ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
                : entry.rank === 2 ? 'bg-foreground/10 border border-foreground/15 text-foreground/60'
                : entry.rank === 3 ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
                : 'bg-foreground/[0.04] border border-foreground/[0.06] text-foreground/30'
              }`}>
                {entry.rank === 1 ? <Trophy size={14} className="text-amber-400" /> : entry.rank}
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-foreground">{entry.creator}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-bold text-amber-400">{entry.xp} XP</span>
                  <span className="text-[9px] text-foreground/20">·</span>
                  <span className="text-[9px] text-foreground/30">{entry.badges} {entry.badges === 1 ? 'badge' : 'badges'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {Array.from({ length: entry.badges }).map((_, i) => (
                  <Star key={i} size={10} className="text-amber-400/60 fill-amber-400/30" />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ─── TIPS LIBRARY ─── */}
      {activeTab === 3 && (
        <motion.div variants={stagger} initial="hidden" animate="show">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIPS.map((tip, i) => (
              <motion.div key={i} variants={fadeUp}
                className={`rounded-2xl border p-5 cursor-pointer group transition-all hover:border-foreground/[0.12] ${
                  tip.featured ? 'border-amber-500/15 bg-amber-500/[0.03]' : 'border-foreground/[0.06] bg-foreground/[0.02]'
                }`}>
                {tip.featured && (
                  <div className="flex items-center gap-1 text-[9px] font-black text-amber-400 mb-3">
                    <Star size={10} className="fill-amber-400" /> Featured
                  </div>
                )}
                <h3 className="text-sm font-bold text-foreground mb-2 group-hover:text-foreground leading-tight">{tip.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/40">{tip.category}</span>
                  <span className="text-[9px] text-foreground/25">{tip.read} read</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
