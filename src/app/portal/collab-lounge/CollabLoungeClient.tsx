'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Swords, Calendar, Heart, Plus, X, Filter, ChevronRight, Clock } from 'lucide-react';
import { ActivityRing } from '@/components/portal/ActivityRing';

const TABS = ['Request Board', 'Battle Arenas', 'Calendar', 'Matchmaking'];

const COLLAB_REQUESTS = [
  { id: 1, creator: 'ItsJakee_78', niche: 'Gaming', platform: 'TikTok LIVE', style: 'Duo stream', bio: 'Looking for a gaming partner for a co-op session. Chill vibes only!', open: true },
  { id: 2, creator: 'General Spuds', niche: 'IRL', platform: 'TikTok LIVE', style: 'React together', bio: 'Want to react to viral food content together and cook something live.', open: true },
  { id: 3, creator: 'Slingin6.0', niche: 'Just Chatting', platform: 'TikTok LIVE', style: 'Talk show', bio: 'Hosting a creator interview format. Looking for confident speakers.', open: false },
  { id: 4, creator: 'Papa J', niche: 'Gaming', platform: 'TikTok LIVE', style: 'Tournament', bio: 'FPS tournament bracket, need 7 more players. All skill levels welcome.', open: true },
];

const BATTLES = [
  { id: 1, title: 'In-Agency Battle: Round 2', type: 'battle', status: 'live', participants: ['ColdP1zza', 'STEALYN'], viewers: '3.4K', time: 'Now' },
  { id: 2, title: 'Karaoke Night', type: 'karaoke', status: 'upcoming', participants: ['ItsJakee_78', 'General Spuds', 'Papa J'], viewers: 'TBD', time: 'Fri 9pm' },
  { id: 3, title: 'Trivia Showdown', type: 'trivia', status: 'upcoming', participants: ['Slingin6.0', 'Trash'], viewers: 'TBD', time: 'Sat 7pm' },
];

const CALENDAR_EVENTS = [
  { id: 1, title: 'Battle Arena: Round 2', dept: 'Collab', date: 'Today', time: '8:00 PM', type: 'battle', rsvp: true },
  { id: 2, title: 'Growth Challenge Deadline', dept: 'Academy', date: 'Fri May 30', time: '11:59 PM', type: 'challenge', rsvp: false },
  { id: 3, title: 'Agency Town Hall', dept: 'Ops', date: 'Sat May 31', time: '3:00 PM', type: 'meeting', rsvp: false },
  { id: 4, title: 'Karaoke Night', dept: 'Collab', date: 'Fri May 30', time: '9:00 PM', type: 'karaoke', rsvp: false },
  { id: 5, title: 'New Module Drop', dept: 'Academy', date: 'Mon Jun 2', time: '12:00 PM', type: 'module', rsvp: false },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const TYPE_COLORS: Record<string, string> = {
  battle: 'text-red-400 bg-red-500/10 border-red-500/20',
  challenge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  meeting: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  karaoke: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  module: 'text-portal-accent bg-portal-accent/10 border-portal-accent/20',
  trivia: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

export function CollabLoungeClient() {
  const [activeTab, setActiveTab] = useState(0);
  const [rsvpd, setRsvpd] = useState<Record<number, boolean>>({});
  const [filter, setFilter] = useState('All');
  const [showPostRequest, setShowPostRequest] = useState(false);

  const niches = ['All', 'Gaming', 'IRL', 'Just Chatting', 'Music'];
  const toggleRsvp = (id: number) => setRsvpd(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center">
            <Users size={20} className="text-portal-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Collab Lounge</h1>
            <p className="text-xs text-foreground/30 font-medium">Discover collabs, battles, and events</p>
          </div>
        </div>
        <ActivityRing value={43} size={40} strokeWidth={3.5} />
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-foreground/[0.03] border border-foreground/[0.06] rounded-2xl p-1.5 mb-8 overflow-x-auto scrollbar-none">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === i
                ? 'bg-portal-accent/15 text-portal-accent border border-portal-accent/20'
                : 'text-foreground/30 hover:text-foreground/60 hover:bg-foreground/[0.04]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* â”€â”€â”€ REQUEST BOARD â”€â”€â”€ */}
      {activeTab === 0 && (
        <motion.div variants={stagger} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {niches.map(n => (
                <button key={n} onClick={() => setFilter(n)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filter === n ? 'bg-portal-accent/15 text-portal-accent border border-portal-accent/20' : 'text-foreground/25 hover:text-foreground/50 bg-foreground/[0.03] border border-transparent'}`}>
                  {n}
                </button>
              ))}
            </div>
            <button onClick={() => setShowPostRequest(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-portal-accent/10 border border-portal-accent/20 text-portal-accent text-xs font-black hover:bg-portal-accent/20 transition-all">
              <Plus size={14} /> Post Request
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COLLAB_REQUESTS
              .filter(r => filter === 'All' || r.niche === filter)
              .map(req => (
              <motion.div key={req.id} variants={fadeUp} className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-5 hover:border-portal-accent/20 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center">
                      <span className="text-xs font-black text-portal-accent">{req.creator.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-foreground">{req.creator}</p>
                      <p className="text-[9px] text-foreground/25">{req.platform}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase ${req.open ? 'bg-portal-accent/10 text-portal-accent border-portal-accent/20' : 'bg-foreground/5 text-foreground/25 border-foreground/10'}`}>
                    {req.open ? 'Open' : 'Pending'}
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/40">{req.niche}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/40">{req.style}</span>
                </div>
                <p className="text-xs text-foreground/50 leading-relaxed mb-4">{req.bio}</p>
                {req.open && (
                  <button className="w-full py-2 rounded-xl border border-portal-accent/20 bg-portal-accent/5 text-portal-accent text-xs font-black hover:bg-portal-accent/15 transition-all">
                    Express Interest
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* â”€â”€â”€ BATTLE ARENAS â”€â”€â”€ */}
      {activeTab === 1 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
          {BATTLES.map(battle => (
            <motion.div key={battle.id} variants={fadeUp} className={`rounded-2xl border p-5 hover:bg-foreground/[0.02] transition-all ${battle.status === 'live' ? 'border-red-500/20 bg-red-500/[0.03]' : 'border-foreground/[0.06] bg-foreground/[0.02]'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {battle.status === 'live' && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-red-400 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live
                      </span>
                    )}
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${TYPE_COLORS[battle.type]}`}>
                      {battle.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-foreground">{battle.title}</h3>
                  <p className="text-[10px] text-foreground/30 mt-1">{battle.time} Â· {battle.viewers} viewers</p>
                </div>
                <Swords size={18} className={battle.status === 'live' ? 'text-red-400' : 'text-foreground/20'} />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {battle.participants.map(p => (
                  <span key={p} className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-foreground/[0.04] border border-foreground/[0.06] text-foreground/50">{p}</span>
                ))}
              </div>

              <div className="flex gap-3">
                {battle.status === 'live' && (
                  <button className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black hover:bg-red-500/20 transition-all">
                    Watch Live
                  </button>
                )}
                {battle.status === 'upcoming' && (
                  <button className="flex-1 py-2 rounded-xl bg-portal-accent/10 border border-portal-accent/20 text-portal-accent text-xs font-black hover:bg-portal-accent/20 transition-all">
                    Register to Compete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* â”€â”€â”€ CALENDAR â”€â”€â”€ */}
      {activeTab === 2 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-black text-foreground/30 uppercase tracking-widest">Upcoming Events</p>
            <button className="flex items-center gap-1.5 text-[10px] font-black text-foreground/25 hover:text-foreground/50 transition-colors">
              <Filter size={11} /> Filter
            </button>
          </div>
          {CALENDAR_EVENTS.map(event => (
            <motion.div key={event.id} variants={fadeUp}
              className="flex items-center gap-4 p-4 rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.1] transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${TYPE_COLORS[event.type] || 'bg-foreground/5 border-foreground/10 text-foreground/30'}`}>
                {event.type === 'battle' && <Swords size={16} />}
                {event.type === 'challenge' && <Heart size={16} />}
                {event.type === 'meeting' && <Users size={16} />}
                {event.type === 'karaoke' && <Users size={16} />}
                {event.type === 'module' && <ChevronRight size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{event.title}</p>
                <p className="text-[9px] text-foreground/25 mt-0.5">{event.dept} Â· {event.date} at {event.time}</p>
              </div>
              <button
                onClick={() => toggleRsvp(event.id)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all flex-shrink-0 ${
                  rsvpd[event.id]
                    ? 'bg-portal-accent/15 text-portal-accent border border-portal-accent/20'
                    : 'bg-foreground/[0.04] text-foreground/30 border border-foreground/[0.06] hover:border-foreground/20 hover:text-foreground/60'
                }`}
              >
                {rsvpd[event.id] ? "âœ“ RSVP'd" : 'RSVP'}
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* â”€â”€â”€ MATCHMAKING â”€â”€â”€ */}
      {activeTab === 3 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
          <div className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-8">
            <h3 className="text-lg font-black text-foreground mb-2">Find Your Collab Match</h3>
            <p className="text-xs text-foreground/40 mb-6 leading-relaxed">Tell us what you're looking for and we'll surface the best collab partners from the agency roster.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] block mb-2">Your Niche</label>
                <select className="w-full bg-[#0F1623] border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-portal-accent/40 [color-scheme:dark]">
                  <option value="">Select niche...</option>
                  <option>Gaming</option>
                  <option>IRL</option>
                  <option>Just Chatting</option>
                  <option>Music</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] block mb-2">Collab Style</label>
                <select className="w-full bg-[#0F1623] border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-portal-accent/40 [color-scheme:dark]">
                  <option value="">Select style...</option>
                  <option>Duo Stream</option>
                  <option>Battle</option>
                  <option>React Together</option>
                  <option>Talk Show</option>
                  <option>Tournament</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] block mb-2">Platform</label>
                <select className="w-full bg-[#0F1623] border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-portal-accent/40 [color-scheme:dark]">
                  <option value="">Select platform...</option>
                  <option>TikTok LIVE</option>
                  <option>Twitch</option>
                  <option>YouTube Live</option>
                </select>
              </div>
              <button className="w-full py-3.5 rounded-xl bg-portal-accent/10 border border-portal-accent/20 text-portal-accent text-sm font-black hover:bg-portal-accent/20 transition-all">
                Find My Match
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Post Request Modal */}
      <AnimatePresence>
        {showPostRequest && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPostRequest(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-background-surface border border-foreground/10 rounded-3xl p-8 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-foreground">Post Collab Request</h3>
                <button onClick={() => setShowPostRequest(false)}><X size={18} className="text-foreground/30" /></button>
              </div>
              <div className="space-y-4">
                <select className="w-full bg-[#0F1623] border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none [color-scheme:dark]">
                  <option value="">Collab niche...</option>
                  <option>Gaming</option><option>IRL</option><option>Just Chatting</option>
                </select>
                <select className="w-full bg-[#0F1623] border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none [color-scheme:dark]">
                  <option value="">Collab style...</option>
                  <option>Duo Stream</option><option>Battle</option><option>React Together</option>
                </select>
                <textarea rows={4} placeholder="Describe your collab idea..." className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none resize-none" />
                <button className="w-full py-3 rounded-xl bg-portal-accent/10 border border-portal-accent/20 text-portal-accent font-black hover:bg-portal-accent/20 transition-all">
                  Post Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
