'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Creator } from '@/lib/creators';
import { PortalCard, StatTile, SectionHeader } from '@/components/portal/ui';
import {
  Users, GraduationCap, Briefcase,
  TrendingUp, Bell, Calendar, ArrowRight,
  Star, Zap, Award, Palette, Radio, BarChart3,
  UserCheck, Shield, Users2, Target, Handshake, CheckCircle,
} from 'lucide-react';

interface LobbyClientProps {
  creator: Creator;
}

const DEPT_ROUTES: Record<string, string> = {
  'Collab Lounge':   '/portal/collab-lounge',
  'Growth Academy':  '/portal/growth-academy',
  'Agency Ops':      '/portal/agency-ops',
  'Live Floor':      '/portal/live-floor',
  'Creative Studio': '/portal/creative-studio',
  'My Team':         '/portal/my-team',
  'My Creators':     '/portal/my-creators',
};

const LIVE_PREVIEWS = [
  { creator: 'ColdP1zza',  viewers: '2.1K', category: 'Gaming'        },
  { creator: 'Slingin6.0', viewers: '1.9K', category: 'IRL'           },
  { creator: 'STEALYN',    viewers: '1.3K', category: 'Just Chatting' },
];

const APPROVALS = [
  { id: 1, type: 'Collab Request', from: 'ItsJakee_78',   desc: 'Duo gaming stream collab',  time: '5m ago'  },
  { id: 2, type: 'Data Card',      from: 'General Spuds', desc: 'Week 21 report pending',     time: '1h ago'  },
  { id: 3, type: 'Showcase',       from: 'Papa J',        desc: 'New showcase post review',   time: '2h ago'  },
];

const UPCOMING_EVENTS = [
  { title: 'Battle Arena: Round 2',     dept: 'Collab Lounge',  time: 'Today 8pm',   type: 'battle'    },
  { title: 'Growth Challenge Deadline', dept: 'Growth Academy', time: 'Fri 11:59pm', type: 'challenge' },
  { title: 'Agency Town Hall',          dept: 'Agency Ops',     time: 'Sat 3pm',     type: 'meeting'   },
];

const RECENT_ACTIVITY = [
  { text: 'ItsJakee_78 posted a new video',          time: '4m ago',  icon: Palette       },
  { text: 'General Spuds opened a collab request',   time: '12m ago', icon: Users         },
  { text: 'New Growth Academy module available',     time: '1h ago',  icon: GraduationCap },
  { text: 'ColdP1zza completed Go Live checklist',   time: '2h ago',  icon: Radio         },
  { text: 'Agency Ops: New announcement posted',     time: '3h ago',  icon: Bell          },
];

const CREATOR_ACTIONS = [
  { label: 'Go Live',     icon: Radio,     href: '/portal/live-floor',     color: '#EF4444', desc: 'Live floor stats'  },
  { label: 'Data Card',   icon: BarChart3, href: '/portal/reports',        color: '#14B8A6', desc: 'Submit your report' },
  { label: 'Find Collab', icon: Handshake, href: '/portal/collab-lounge',  color: '#0EA5E9', desc: 'Collab lounge'     },
  { label: 'Challenges',  icon: Target,    href: '/portal/growth-academy', color: '#F59E0B', desc: 'Growth Academy'    },
];

const STAFF_ACTIONS = [
  { label: 'My Creators', icon: UserCheck, href: '/portal/my-creators', color: '#14B8A6', desc: 'Manage your roster'  },
  { label: 'Team Hub',    icon: Users2,    href: '/portal/my-team',     color: '#0EA5E9', desc: 'Team messages'       },
  { label: 'Agency Ops',  icon: Briefcase, href: '/portal/agency-ops',  color: '#F59E0B', desc: 'Tickets & updates'  },
  { label: 'Admin Panel', icon: Shield,    href: '/portal/admin',       color: '#A855F7', desc: 'Platform controls'  },
];

function getRoleFromCreator(creator: Creator): 'admin' | 'staff' | 'creator' {
  if (creator.tier === 'staff')     return 'admin';
  if (creator.tier === 'recruiter') return 'staff';
  return 'creator';
}

export function LobbyClient({ creator }: LobbyClientProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const role = getRoleFromCreator(creator);
  const quickActions = (role === 'admin' || role === 'staff') ? STAFF_ACTIONS : CREATOR_ACTIONS;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ─── HERO ─── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PortalCard
          tone="tactical"
          className="p-8 md:p-10 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(20,184,166,0.08) 0%, var(--color-background) 50%, rgba(14,165,233,0.05) 100%)',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(20,184,166,0.06),transparent_60%)]" />

          <div className="relative z-10 flex flex-col gap-6">
            <div>
              <p className="text-portal-accent/70 text-sm font-bold uppercase tracking-[0.15em] mb-2">{greeting}</p>
              <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{creator.name}</h1>
            </div>

            <div>
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-foreground/25 mb-3">Quick Access</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group flex items-center gap-3 p-3 rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] hover:bg-foreground/[0.05] hover:border-foreground/[0.12] transition-all duration-200"
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                        style={{ background: `${action.color}18`, border: `1px solid ${action.color}30` }}
                      >
                        <Icon size={14} style={{ color: action.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-foreground/80 group-hover:text-foreground truncate">{action.label}</p>
                        <p className="text-[10px] text-foreground/25 truncate">{action.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2 mt-6">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-portal-accent/10 border border-portal-accent/20 text-portal-accent">
              <div className="w-1.5 h-1.5 rounded-full bg-portal-accent animate-pulse" />
              Portal Active
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/50 capitalize">
              <Star size={10} />
              {role}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Zap size={10} />
              Phase: Launch
            </span>
          </div>
        </PortalCard>
      </motion.div>

      {/* ─── TODAY'S MOMENTUM ─── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <SectionHeader eyebrow="today" heading="Momentum" className="mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatTile label="Followers"  value={creator.stats.followers}    icon={<Users size={16} />} />
          <StatTile label="Peak CCV"   value={creator.stats.peakCCV}      icon={<Radio size={16} />} />
          <StatTile label="Avg Watch"  value={creator.stats.avgWatchTime} icon={<TrendingUp size={16} />} />
          <StatTile label="Total Likes" value={creator.stats.totalLikes}  icon={<Star size={16} />} />
        </div>
      </motion.div>

      {/* ─── LIVE FLOOR + APPROVALS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <PortalCard className="h-full">
            <PortalCard.Header>
              <div>
                <p className="text-[10px] font-mono font-black text-foreground/25 uppercase tracking-[0.2em]">live now</p>
                <p className="text-sm font-black text-foreground mt-0.5">Live Floor</p>
              </div>
              <Link href="/portal/live-floor" className="flex items-center gap-1 text-[10px] font-black text-portal-accent/60 hover:text-portal-accent transition-colors flex-shrink-0">
                View all <ArrowRight size={10} />
              </Link>
            </PortalCard.Header>
            <PortalCard.Body className="space-y-3">
              {LIVE_PREVIEWS.map((s) => (
                <div key={s.creator} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <span className="text-xs font-black text-red-400">{s.creator.charAt(0)}</span>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-foreground">{s.creator}</p>
                    <p className="text-[10px] text-foreground/30">{s.category}</p>
                  </div>
                  <span className="text-[10px] font-black text-foreground/50 flex-shrink-0 tabular-nums slashed-zero">{s.viewers}</span>
                </div>
              ))}
            </PortalCard.Body>
          </PortalCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <PortalCard className="h-full">
            <PortalCard.Header>
              <div>
                <p className="text-[10px] font-mono font-black text-foreground/25 uppercase tracking-[0.2em]">inbox</p>
                <p className="text-sm font-black text-foreground mt-0.5">Approvals</p>
              </div>
              <span className="text-[10px] font-black text-portal-accent flex-shrink-0">{APPROVALS.length} pending</span>
            </PortalCard.Header>
            <PortalCard.Body className="space-y-3">
              {APPROVALS.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl border border-foreground/[0.04] bg-foreground/[0.02] hover:border-portal-accent/20 transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={14} className="text-portal-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono font-black text-portal-accent/60 uppercase tracking-[0.15em]">{item.type}</p>
                    <p className="text-xs font-bold text-foreground truncate">{item.desc}</p>
                    <p className="text-[10px] text-foreground/25">{item.from} · {item.time}</p>
                  </div>
                  <ArrowRight size={12} className="text-foreground/20 group-hover:text-portal-accent transition-colors flex-shrink-0 mt-1" />
                </div>
              ))}
            </PortalCard.Body>
          </PortalCard>
        </motion.div>
      </div>

      {/* ─── UPCOMING + ACTIVITY ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <PortalCard>
            <PortalCard.Header>
              <div>
                <p className="text-[10px] font-mono font-black text-foreground/25 uppercase tracking-[0.2em]">schedule</p>
                <p className="text-sm font-black text-foreground mt-0.5">Upcoming This Week</p>
              </div>
              <Calendar size={14} className="text-foreground/20 flex-shrink-0" />
            </PortalCard.Header>
            <PortalCard.Body className="space-y-2">
              {UPCOMING_EVENTS.map((event, i) => {
                const href = DEPT_ROUTES[event.dept] ?? '/portal/home';
                return (
                  <Link
                    key={i}
                    href={href}
                    className="group flex items-start gap-4 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04] hover:border-portal-accent/30 hover:bg-portal-accent/[0.03] transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-foreground/[0.04] border border-foreground/[0.06] group-hover:border-foreground/[0.12] flex items-center justify-center flex-shrink-0 transition-colors">
                      {event.type === 'battle'    && <Award      size={14} className="text-amber-400" />}
                      {event.type === 'challenge' && <TrendingUp size={14} className="text-portal-accent" />}
                      {event.type === 'meeting'   && <Users      size={14} className="text-[#0EA5E9]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate group-hover:text-portal-accent transition-colors">{event.title}</p>
                      <p className="text-[10px] text-foreground/25 mt-0.5">{event.dept}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-black text-foreground/30">{event.time}</span>
                      <ArrowRight size={10} className="text-foreground/20 group-hover:text-portal-accent transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </PortalCard.Body>
            <PortalCard.Footer>
              <Link href="/portal/collab-lounge" className="flex items-center gap-2 text-[10px] font-black text-portal-accent/60 hover:text-portal-accent transition-colors">
                View full calendar <ArrowRight size={10} />
              </Link>
            </PortalCard.Footer>
          </PortalCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <PortalCard>
            <PortalCard.Header>
              <div>
                <p className="text-[10px] font-mono font-black text-foreground/25 uppercase tracking-[0.2em]">feed</p>
                <p className="text-sm font-black text-foreground mt-0.5">Agency Activity</p>
              </div>
              <Zap size={14} className="text-foreground/20 flex-shrink-0" />
            </PortalCard.Header>
            <PortalCard.Body className="space-y-1">
              {RECENT_ACTIVITY.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    className="flex items-center gap-3 py-2.5 border-b border-foreground/[0.03] last:border-0"
                  >
                    <div className="w-6 h-6 rounded-lg bg-foreground/[0.04] flex items-center justify-center flex-shrink-0">
                      <Icon size={11} className="text-foreground/30" />
                    </div>
                    <p className="flex-1 text-[11px] text-foreground/50 leading-relaxed">{activity.text}</p>
                    <span className="text-[10px] text-foreground/20 flex-shrink-0 font-bold">{activity.time}</span>
                  </motion.div>
                );
              })}
            </PortalCard.Body>
          </PortalCard>
        </motion.div>
      </div>
    </div>
  );
}
