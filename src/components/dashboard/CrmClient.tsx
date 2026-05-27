'use client';

import { useState, useMemo } from 'react';
import { Creator } from '@/lib/creators';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Activity,
  Radio,
  UserPlus,
  Search,
  LayoutGrid,
  LayoutList,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  Star,
  Zap,
  MessageSquare,
  Eye,
  Filter,
} from 'lucide-react';
import Image from 'next/image';

interface CrmClientProps {
  creators: Creator[];
}

type ViewMode = 'table' | 'grid';
type FilterStatus = 'all' | 'staff' | 'new' | 'recruiter' | 'top';
type SortBy = 'name' | 'tier' | 'category';

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: typeof Star }> = {
  staff:     { label: 'Staff',     color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20', icon: Shield },
  top:       { label: 'Top Tier',  color: 'text-purple-400', bg: 'bg-purple-400/10',  border: 'border-purple-400/20', icon: Star },
  new:       { label: 'New',       color: 'text-cyan-400',   bg: 'bg-cyan-400/10',    border: 'border-cyan-400/20',  icon: Zap },
  recruiter: { label: 'Recruiter', color: 'text-emerald-400',bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: Users },
};

export default function CrmClient({ creators }: CrmClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Stats
  const stats = useMemo(() => ({
    total: creators.length,
    staff: creators.filter(c => c.tier === 'staff').length,
    recruiters: creators.filter(c => c.tier === 'recruiter').length,
    newCreators: creators.filter(c => c.tier === 'new').length,
    categories: [...new Set(creators.flatMap(c => c.category))].length,
  }), [creators]);

  // Filtered + sorted creators
  const filteredCreators = useMemo(() => {
    let result = [...creators];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.some(cat => cat.toLowerCase().includes(q))
      );
    }

    // Filter
    if (filterStatus !== 'all') {
      result = result.filter(c => c.tier === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'tier') return (a.tier || '').localeCompare(b.tier || '');
      if (sortBy === 'category') return (a.category[0] || '').localeCompare(b.category[0] || '');
      return 0;
    });

    return result;
  }, [creators, search, filterStatus, sortBy]);

  const filters: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'all', label: 'All Creators', count: stats.total },
    { key: 'staff', label: 'Staff', count: stats.staff },
    { key: 'recruiter', label: 'Recruiters', count: stats.recruiters },
    { key: 'new', label: 'New', count: stats.newCreators },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 min-h-screen">

      {/* ── Header ── */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          Agency <span className="text-gradient-primary">CRM</span>
        </h1>
        <p className="text-foreground-muted font-medium">Manage your roster, track creators, and keep notes.</p>
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Creators', value: stats.total, icon: Users, color: 'from-primary/20 to-primary/5', iconColor: 'text-primary', glow: 'shadow-primary/10' },
          { label: 'Staff', value: stats.staff, icon: Shield, color: 'from-amber-500/20 to-amber-500/5', iconColor: 'text-amber-400', glow: 'shadow-amber-400/10' },
          { label: 'Recruiters', value: stats.recruiters, icon: Activity, color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400', glow: 'shadow-emerald-400/10' },
          { label: 'New Creators', value: stats.newCreators, icon: UserPlus, color: 'from-cyan-500/20 to-cyan-500/5', iconColor: 'text-cyan-400', glow: 'shadow-cyan-400/10' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${stat.color} shadow-lg ${stat.glow}`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`${stat.iconColor}`} size={22} />
                <span className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.15em]">{stat.label}</span>
              </div>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Pipeline ── */}
      <div className="glass-card rounded-2xl p-6 mb-10">
        <h3 className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-5">Creator Pipeline</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { stage: 'Applicants', count: 0, color: 'bg-foreground-subtle/20 text-foreground-subtle' },
            { stage: 'Onboarding', count: stats.newCreators, color: 'bg-cyan-500/20 text-cyan-400' },
            { stage: 'Active', count: stats.total - stats.newCreators, color: 'bg-emerald-500/20 text-emerald-400' },
            { stage: 'Staff / Top', count: stats.staff + stats.recruiters, color: 'bg-amber-500/20 text-amber-400' },
          ].map((stage, i, arr) => (
            <div key={stage.stage} className="flex items-center gap-2 flex-shrink-0">
              <div className={`${stage.color} px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2`}>
                {stage.stage}
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-black">{stage.count}</span>
              </div>
              {i < arr.length - 1 && (
                <div className="w-8 h-px bg-gradient-to-r from-foreground-subtle/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, handle, category..."
            className="w-full bg-background-surface border border-border rounded-xl pl-11 pr-4 py-3 text-white placeholder-foreground-subtle focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium text-sm"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-foreground-subtle" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="bg-background-surface border border-border rounded-xl px-4 py-3 text-white text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none"
          >
            <option value="name">Sort: Name</option>
            <option value="tier">Sort: Tier</option>
            <option value="category">Sort: Category</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-background-surface border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('table')}
            className={`p-3 transition-colors ${viewMode === 'table' ? 'bg-primary text-white' : 'text-foreground-subtle hover:text-white'}`}
          >
            <LayoutList size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-foreground-subtle hover:text-white'}`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* ── Filter Chips ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              filterStatus === f.key
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white/5 border-border text-foreground-muted hover:text-white hover:border-foreground-subtle'
            }`}
          >
            {f.label}
            <span className="ml-2 bg-white/10 px-1.5 py-0.5 rounded-full text-[10px]">{f.count}</span>
          </button>
        ))}
      </div>

      {/* ── Results Count ── */}
      <p className="text-xs text-foreground-subtle font-bold mb-4 uppercase tracking-wider">
        Showing {filteredCreators.length} of {creators.length} creators
      </p>

      {/* ── Table View ── */}
      {viewMode === 'table' && (
        <div className="space-y-3">
          {filteredCreators.map((creator, index) => {
            const tier = TIER_CONFIG[creator.tier || 'new'];
            const TierIcon = tier.icon;
            const isExpanded = expandedId === creator.id;

            return (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                {/* Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : creator.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0">
                    <Image
                      src={creator.image}
                      alt={creator.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Name + Handle */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{creator.name}</p>
                    <p className="text-xs text-foreground-subtle truncate">{creator.handle}</p>
                  </div>

                  {/* Title */}
                  <div className="hidden lg:block flex-1 min-w-0">
                    <p className="text-xs text-foreground-muted truncate">{creator.title || '—'}</p>
                  </div>

                  {/* Tier Badge */}
                  <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${tier.bg} ${tier.color} ${tier.border} border`}>
                    <TierIcon size={12} />
                    {tier.label}
                  </div>

                  {/* Categories */}
                  <div className="hidden md:flex gap-1 flex-shrink-0">
                    {creator.category.slice(0, 2).map(cat => (
                      <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-foreground-subtle border border-border font-bold">
                        {cat}
                      </span>
                    ))}
                    {creator.category.length > 2 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-foreground-subtle font-bold">
                        +{creator.category.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Expand Icon */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={18} className="text-foreground-subtle" />
                  </motion.div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 pt-2 border-t border-border">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left: Bio + Socials */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-2">Bio</h4>
                              <p className="text-sm text-foreground-muted leading-relaxed">
                                {creator.description || 'No bio set.'}
                              </p>
                            </div>

                            {/* Socials */}
                            <div>
                              <h4 className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-2">Social Links</h4>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(creator.socials).filter(([, v]) => v).map(([platform, url]) => (
                                  <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-border text-xs font-bold text-foreground-muted hover:text-primary hover:border-primary/30 transition-all"
                                  >
                                    {platform}
                                    <ExternalLink size={10} />
                                  </a>
                                ))}
                              </div>
                            </div>

                            {/* Tags */}
                            <div>
                              <h4 className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-2">Tags</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {creator.tags.map(tag => (
                                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-bold">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right: Stats + Quick Actions */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-2">Stats</h4>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { label: 'Followers', value: creator.stats.followers },
                                  { label: 'Avg Watch', value: creator.stats.avgWatchTime },
                                  { label: 'Peak CCV', value: creator.stats.peakCCV },
                                  { label: 'Total Likes', value: creator.stats.totalLikes },
                                ].map(s => (
                                  <div key={s.label} className="p-3 rounded-xl bg-white/5 border border-border">
                                    <p className="text-[10px] text-foreground-subtle font-bold uppercase tracking-wider mb-1">{s.label}</p>
                                    <p className="text-sm font-bold text-white">{s.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                              <h4 className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-2">Quick Actions</h4>
                              <div className="flex flex-wrap gap-2">
                                {creator.liveUrl && (
                                  <a
                                    href={creator.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
                                  >
                                    <Radio size={12} />
                                    View Live
                                  </a>
                                )}
                                <a
                                  href={`/creators/${creator.id}`}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-border text-xs font-bold text-foreground-muted hover:text-white transition-all"
                                >
                                  <Eye size={12} />
                                  View Profile
                                </a>
                              </div>
                            </div>

                            {/* Internal Notes Placeholder */}
                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare size={14} className="text-amber-400" />
                                <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Internal Notes</h4>
                              </div>
                              <p className="text-xs text-foreground-subtle italic">No notes yet. Notes feature coming soon.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {filteredCreators.length === 0 && (
            <div className="text-center py-20">
              <Search className="mx-auto mb-4 text-foreground-subtle" size={40} />
              <p className="text-foreground-muted font-bold">No creators found</p>
              <p className="text-xs text-foreground-subtle mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {/* ── Grid View ── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCreators.map((creator, index) => {
            const tier = TIER_CONFIG[creator.tier || 'new'];
            const TierIcon = tier.icon;

            return (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
                className="glass-card rounded-2xl p-5 hover:border-primary/20 transition-all group cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0">
                    <Image
                      src={creator.image}
                      alt={creator.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{creator.name}</p>
                    <p className="text-xs text-foreground-subtle truncate">{creator.handle}</p>
                  </div>
                </div>

                {/* Tier */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${tier.bg} ${tier.color} ${tier.border} border mb-3`}>
                  <TierIcon size={10} />
                  {tier.label}
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {creator.category.slice(0, 3).map(cat => (
                    <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-foreground-subtle font-bold">
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Bio Preview */}
                <p className="text-xs text-foreground-muted leading-relaxed line-clamp-2 mb-4">
                  {creator.description || 'No bio.'}
                </p>

                {/* Footer Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <a
                    href={`/creators/${creator.id}`}
                    className="flex-1 text-center text-[10px] font-bold text-foreground-subtle hover:text-white py-1.5 rounded-lg hover:bg-white/5 transition-all uppercase tracking-wider"
                  >
                    View Profile
                  </a>
                  {creator.socials.tiktok && (
                    <a
                      href={creator.socials.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-primary hover:text-primary-dark py-1.5 px-3 rounded-lg hover:bg-primary/5 transition-all uppercase tracking-wider"
                    >
                      TikTok
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}

          {filteredCreators.length === 0 && (
            <div className="col-span-full text-center py-20">
              <Search className="mx-auto mb-4 text-foreground-subtle" size={40} />
              <p className="text-foreground-muted font-bold">No creators found</p>
              <p className="text-xs text-foreground-subtle mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
