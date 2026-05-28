'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Diamond, Eye, Clock, Users, ChevronDown } from 'lucide-react';
import { Creator } from '@/lib/creators';
import { useState } from 'react';

interface ReportsClientProps {
  creator: Creator;
}

const MOCK_DATA_CARDS = [
  {
    month: 'May 2025',
    diamonds: '12,847',
    views: '184,200',
    avgWatch: '4m 32s',
    followers: '+892',
    engagement: '7.4%',
    notes: 'Strong month. Back-to-back gift trains on May 3rd and 17th. Recommend maintaining the 8pm schedule.',
    submittedBy: 'Baked',
    submittedAt: 'May 26, 2025',
  },
  {
    month: 'April 2025',
    diamonds: '9,234',
    views: '121,800',
    avgWatch: '3m 58s',
    followers: '+541',
    engagement: '5.8%',
    notes: 'Solid improvement from March. Collab with Slingin6.0 on April 12 drove 40% of monthly views.',
    submittedBy: 'Baked',
    submittedAt: 'Apr 30, 2025',
  },
  {
    month: 'March 2025',
    diamonds: '7,611',
    views: '98,400',
    avgWatch: '3m 22s',
    followers: '+318',
    engagement: '4.9%',
    notes: 'First full month on the roster. Great start. Focus on consistency over volume.',
    submittedBy: 'Baked',
    submittedAt: 'Mar 31, 2025',
  },
];

const STATS = [
  { label: 'Total Diamonds', value: '29,692', icon: Diamond, color: '#14B8A6', trend: '+24%' },
  { label: 'Total Views', value: '404.4K', icon: Eye, color: '#0EA5E9', trend: '+52%' },
  { label: 'Avg Watch Time', value: '4m 04s', icon: Clock, color: '#A78BFA', trend: '+12%' },
  { label: 'Total Followers', value: '+1,751', icon: Users, color: '#F59E0B', trend: '+18%' },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export function ReportsClient({ creator }: ReportsClientProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center">
          <BarChart3 size={20} className="text-portal-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Data Cards</h1>
          <p className="text-xs text-foreground/30 font-medium">Monthly performance reports from your manager</p>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(stat => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={fadeUp}
              className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                  <Icon size={15} style={{ color: stat.color }} />
                </div>
                <span className="text-[9px] font-black text-portal-accent">{stat.trend}</span>
              </div>
              <p className="text-xl font-black text-foreground mb-1">{stat.value}</p>
              <p className="text-[9px] font-bold text-foreground/25 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Note */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] max-w-2xl">
        <TrendingUp size={14} className="text-foreground/20 flex-shrink-0" />
        <p className="text-xs text-foreground/30">Data Cards are submitted by your manager. You have view-only access. Contact your manager to discuss any questions.</p>
      </div>

      {/* Data Cards */}
      <div className="space-y-4 max-w-3xl">
        <p className="text-xs font-black text-foreground/30 uppercase tracking-widest">Monthly Reports</p>
        {MOCK_DATA_CARDS.map(card => (
          <div key={card.month}
            className={`rounded-2xl border overflow-hidden transition-all ${expanded === card.month ? 'border-portal-accent/20 bg-portal-accent/[0.03]' : 'border-foreground/[0.06] bg-foreground/[0.02]'}`}>
            <button
              onClick={() => setExpanded(expanded === card.month ? null : card.month)}
              className="w-full flex items-center gap-4 p-5 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center flex-shrink-0">
                <BarChart3 size={16} className="text-portal-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-foreground">{card.month}</p>
                <p className="text-[9px] text-foreground/25">Submitted by {card.submittedBy} Â· {card.submittedAt}</p>
              </div>
              <div className="hidden sm:flex items-center gap-6 mr-4">
                <div className="text-center">
                  <p className="text-xs font-black text-foreground">{card.diamonds}</p>
                  <p className="text-[8px] text-foreground/25">Diamonds</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-foreground">{card.followers}</p>
                  <p className="text-[8px] text-foreground/25">Followers</p>
                </div>
              </div>
              <ChevronDown size={14} className={`text-foreground/20 transition-transform flex-shrink-0 ${expanded === card.month ? 'rotate-180' : ''}`} />
            </button>

            {expanded === card.month && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="border-t border-foreground/[0.05]"
              >
                <div className="p-5 pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                  {[
                    { label: 'Diamonds', value: card.diamonds },
                    { label: 'Total Views', value: card.views },
                    { label: 'Avg Watch', value: card.avgWatch },
                    { label: 'Followers+', value: card.followers },
                    { label: 'Engagement', value: card.engagement },
                  ].map(s => (
                    <div key={s.label} className="p-3 rounded-xl border border-foreground/[0.04] bg-foreground/[0.02] text-center">
                      <p className="text-sm font-black text-foreground">{s.value}</p>
                      <p className="text-[8px] font-bold text-foreground/25 uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                {card.notes && (
                  <div className="px-5 pb-5">
                    <p className="text-[9px] font-black text-foreground/30 uppercase tracking-widest mb-2">Manager Notes</p>
                    <p className="text-sm text-foreground/50 leading-relaxed bg-foreground/[0.02] border border-foreground/[0.04] rounded-xl p-4">{card.notes}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
