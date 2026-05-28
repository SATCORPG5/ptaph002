'use client';

import {
  useState,
  useMemo,
  useEffect,
  useOptimistic,
  useTransition,
  useRef,
} from 'react';
import { useQueryState } from 'nuqs';
import { toast } from 'sonner';
import Image from 'next/image';
import { Creator } from '@/lib/creators';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Users,
  Shield,
  UserPlus,
  Activity,
  Search,
  ExternalLink,
  Radio,
  Eye,
  MessageSquare,
  Star,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react';

import {
  DataTable,
  SectionHeader,
  StatTile,
  PortalCard,
  TacticalLabel,
} from '@/components/portal/ui';
import {
  Sheet,
  SheetContent,
} from '@/components/shadcn-ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn-ui/tooltip';
import { updateCreatorTier } from '@/app/(dashboard)/crm/actions';
import { cn } from '@/lib/utils';

// ── Types & Constants ────────────────────────────────────────────────────────

type Tier = NonNullable<Creator['tier']>;

const TIER_CONFIG: Record<
  Tier,
  { label: string; description: string; color: string; bg: string; border: string; icon: typeof Star }
> = {
  staff: {
    label: 'Staff',
    description: 'Core team member — agency leadership or operations.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    icon: Shield,
  },
  top: {
    label: 'Top Tier',
    description: 'High-performing creator with a verified growth track.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    icon: Star,
  },
  new: {
    label: 'New',
    description: 'Onboarding creator — active in the Growth System.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    icon: Zap,
  },
  recruiter: {
    label: 'Recruiter',
    description: 'Talent scout or manager — recruits and supports creators.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    icon: Users,
  },
};

const FILTER_CHIPS = [
  { key: 'all' as const,       label: 'All' },
  { key: 'new' as const,       label: 'New' },
  { key: 'top' as const,       label: 'Top Tier' },
  { key: 'recruiter' as const, label: 'Recruiters' },
  { key: 'staff' as const,     label: 'Staff' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function TierChip({ tier }: { tier?: Tier }) {
  const cfg = TIER_CONFIG[tier ?? 'new'];
  const Icon = cfg.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-[0.12em] font-bold border cursor-default select-none',
            cfg.bg,
            cfg.color,
            cfg.border,
          )}
        >
          <Icon size={10} aria-hidden />
          {cfg.label}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-background-elevated border border-border text-foreground font-medium"
      >
        {cfg.description}
      </TooltipContent>
    </Tooltip>
  );
}

function CreatorCell({ creator }: { creator: Creator }) {
  return (
    <div className="flex items-center gap-3 min-w-0 py-1">
      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-foreground/10 flex-shrink-0">
        <Image
          src={creator.image}
          alt={creator.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-foreground truncate">{creator.name}</p>
        <p className="font-mono text-[10px] text-foreground/40 truncate">{creator.handle}</p>
      </div>
    </div>
  );
}

// ── Detail Sheet ─────────────────────────────────────────────────────────────

interface DetailSheetProps {
  creator: Creator | null;
  optimisticTier: Tier | undefined;
  isPending: boolean;
  onTierUpdate: (id: string, tier: Tier) => void;
}

function CreatorDetailSheet({
  creator,
  optimisticTier,
  isPending,
  onTierUpdate,
}: DetailSheetProps) {
  if (!creator) return null;

  const currentTier = optimisticTier ?? creator.tier ?? 'new';

  return (
    <SheetContent
      side="right"
      className="bg-background-elevated border-l border-border text-foreground w-full sm:max-w-xl flex flex-col gap-0 p-0 overflow-hidden"
    >
      {/* Profile band */}
      <div className="p-6 border-b border-border/50 bg-portal-surface-1/60 flex-shrink-0">
        <div className="flex items-start gap-4 mb-5">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-foreground/10 flex-shrink-0">
            <Image
              src={creator.image}
              alt={creator.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="font-display text-lg font-black text-foreground leading-tight">
              {creator.name}
            </p>
            <p className="font-mono text-[11px] text-foreground/40 tracking-[0.1em] mt-0.5">
              {creator.handle}
            </p>
            {creator.title && (
              <p className="text-xs text-foreground/50 mt-1 font-medium">{creator.title}</p>
            )}
          </div>
        </div>

        {/* Stage selector with optimistic update */}
        <div>
          <TacticalLabel size="xs" className="block mb-2.5">Stage</TacticalLabel>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TIER_CONFIG) as Tier[]).map((t) => {
              const c = TIER_CONFIG[t];
              const TIcon = c.icon;
              const isActive = t === currentTier;
              return (
                <button
                  key={t}
                  disabled={isPending}
                  onClick={() => t !== currentTier && onTierUpdate(creator.id, t)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase tracking-[0.12em] font-bold border transition-all',
                    isActive
                      ? cn(c.bg, c.color, c.border)
                      : 'bg-foreground/[0.03] border-foreground/[0.08] text-foreground/30 hover:text-foreground/60 hover:border-foreground/20',
                    isPending && 'opacity-50 cursor-not-allowed',
                  )}
                  aria-pressed={isActive}
                >
                  <TIcon size={10} aria-hidden />
                  {c.label}
                </button>
              );
            })}
          </div>
          {isPending && (
            <p className="font-mono text-[9px] text-portal-accent/60 mt-2 uppercase tracking-[0.12em]">
              Updating…
            </p>
          )}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">

        {/* Stats */}
        <div>
          <TacticalLabel size="xs" className="block mb-3">Stats</TacticalLabel>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Followers',   value: creator.stats.followers },
              { label: 'Avg Watch',   value: creator.stats.avgWatchTime },
              { label: 'Peak CCV',    value: creator.stats.peakCCV },
              { label: 'Total Likes', value: creator.stats.totalLikes },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-3 rounded-xl bg-portal-surface-1 border border-foreground/[0.06]"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-foreground/30 mb-1">
                  {label}
                </p>
                <p className="text-sm font-bold tabular-nums slashed-zero text-foreground">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        {creator.description && (
          <div>
            <TacticalLabel size="xs" className="block mb-2">Bio</TacticalLabel>
            <p className="text-sm text-foreground/50 leading-relaxed">
              {creator.description}
            </p>
          </div>
        )}

        {/* Categories */}
        {creator.category.length > 0 && (
          <div>
            <TacticalLabel size="xs" className="block mb-2">Categories</TacticalLabel>
            <div className="flex flex-wrap gap-1.5">
              {creator.category.map((cat) => (
                <span
                  key={cat}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] text-foreground/50 font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {creator.tags.length > 0 && (
          <div>
            <TacticalLabel size="xs" className="block mb-2">Tags</TacticalLabel>
            <div className="flex flex-wrap gap-1.5">
              {creator.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-portal-accent/[0.06] border border-portal-accent/[0.12] text-portal-accent/70 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Socials */}
        {Object.values(creator.socials).some(Boolean) && (
          <div>
            <TacticalLabel size="xs" className="block mb-2">Socials</TacticalLabel>
            <div className="flex flex-wrap gap-2">
              {Object.entries(creator.socials)
                .filter(([, v]) => v)
                .map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/[0.03] border border-foreground/[0.08] text-xs font-medium text-foreground/50 hover:text-portal-accent hover:border-portal-accent/20 transition-colors capitalize"
                  >
                    {platform}
                    <ExternalLink size={10} aria-hidden />
                  </a>
                ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <TacticalLabel size="xs" className="block mb-2">Quick Actions</TacticalLabel>
          <div className="flex flex-wrap gap-2">
            {creator.liveUrl && (
              <a
                href={creator.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-portal-accent/[0.08] border border-portal-accent/20 text-xs font-bold text-portal-accent hover:bg-portal-accent/[0.14] transition-colors"
              >
                <Radio size={12} aria-hidden />
                View Live
              </a>
            )}
            <a
              href={`/creators/${creator.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground/[0.03] border border-foreground/[0.08] text-xs font-bold text-foreground/50 hover:text-foreground transition-colors"
            >
              <Eye size={12} aria-hidden />
              View Profile
            </a>
          </div>
        </div>

        {/* Internal Notes placeholder */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <MessageSquare size={13} className="text-foreground/30" aria-hidden />
              <TacticalLabel size="xs">Internal Notes</TacticalLabel>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-amber-400/50 border border-amber-400/20 bg-amber-400/[0.04] px-2 py-0.5 rounded-full">
              Coming Soon
            </span>
          </div>
          <div className="relative">
            <textarea
              disabled
              placeholder="Private notes visible to staff only…"
              rows={3}
              className="w-full bg-portal-surface-1/50 border border-foreground/[0.06] rounded-xl px-3 py-2.5 text-xs text-foreground/30 placeholder-foreground/20 resize-none cursor-not-allowed focus:outline-none"
              aria-label="Internal notes (not yet available)"
            />
          </div>
        </div>
      </div>
    </SheetContent>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface CrmClientProps {
  creators: Creator[];
}

export default function CrmClient({ creators }: CrmClientProps) {
  // URL-synced state (nuqs)
  const [q, setQ] = useQueryState('q', { defaultValue: '' });
  const [tierFilter, setTierFilter] = useQueryState('tier', { defaultValue: 'all' });
  const [sortKey, setSortKey] = useQueryState('sort', { defaultValue: 'name' });

  // Local UI state
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const [density, setDensity] = useState<'compact' | 'default' | 'comfortable'>('default');
  const searchRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  // Optimistic tier updates across the full list
  const [optimisticCreators, addOptimistic] = useOptimistic(
    creators,
    (state: Creator[], { id, tier }: { id: string; tier: Tier }) =>
      state.map((c) => (c.id === id ? { ...c, tier } : c)),
  );

  // Tier for the currently open Sheet, reflecting any optimistic update
  const optimisticSelectedTier = selectedCreator
    ? (optimisticCreators.find((c) => c.id === selectedCreator.id)?.tier as Tier | undefined)
    : undefined;

  // Aggregate stats
  const stats = useMemo(
    () => ({
      total:       optimisticCreators.length,
      staff:       optimisticCreators.filter((c) => c.tier === 'staff').length,
      recruiters:  optimisticCreators.filter((c) => c.tier === 'recruiter').length,
      newCreators: optimisticCreators.filter((c) => c.tier === 'new').length,
      topCreators: optimisticCreators.filter((c) => c.tier === 'top').length,
    }),
    [optimisticCreators],
  );

  // Pipeline derived counts
  const pipeline = useMemo(
    () => [
      { key: 'applicants', label: 'Applicants', count: 0,
        detail: 'Prospective creators not yet onboarded.' },
      { key: 'onboarding', label: 'Onboarding',  count: stats.newCreators,
        detail: 'Creators actively completing onboarding.' },
      { key: 'active',     label: 'Active',      count: stats.total - stats.newCreators,
        detail: 'Creators participating in agency programs.' },
      { key: 'staff_top',  label: 'Staff / Top', count: stats.staff + stats.recruiters + stats.topCreators,
        detail: 'Staff, recruiters, and top-tier creators.' },
    ],
    [stats],
  );

  // Filtered + sorted creators
  const filteredCreators = useMemo(() => {
    let result = [...optimisticCreators];

    if (q) {
      const lq = q.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lq) ||
          c.handle.toLowerCase().includes(lq) ||
          c.description.toLowerCase().includes(lq) ||
          c.category.some((cat) => cat.toLowerCase().includes(lq)),
      );
    }

    if (tierFilter !== 'all') {
      result = result.filter((c) => c.tier === tierFilter);
    }

    result.sort((a, b) => {
      if (sortKey === 'name')     return a.name.localeCompare(b.name);
      if (sortKey === 'tier')     return (a.tier ?? '').localeCompare(b.tier ?? '');
      if (sortKey === 'category') return (a.category[0] ?? '').localeCompare(b.category[0] ?? '');
      return 0;
    });

    return result;
  }, [optimisticCreators, q, tierFilter, sortKey]);

  // Server action + optimistic update handler
  function handleTierUpdate(creatorId: string, tier: Tier) {
    const label = TIER_CONFIG[tier].label;
    startTransition(async () => {
      addOptimistic({ id: creatorId, tier });
      try {
        await updateCreatorTier(creatorId, tier);
        toast.success(`Stage updated to ${label}`);
      } catch {
        toast.error('Failed to update stage — please try again');
      }
    });
  }

  // Keyboard navigation: j/k rows, Enter open, / search, Esc close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      const sheetOpen = !!selectedCreator;

      if (e.key === '/' && !inInput && !sheetOpen) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (inInput || sheetOpen) return;

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIdx((i) => Math.min(i + 1, filteredCreators.length - 1));
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && focusedIdx >= 0 && filteredCreators[focusedIdx]) {
        e.preventDefault();
        setSelectedCreator(filteredCreators[focusedIdx]);
      } else if (e.key === 'Escape') {
        setFocusedIdx(-1);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [filteredCreators, focusedIdx, selectedCreator]);

  // Table columns
  const columns = useMemo<ColumnDef<Creator>[]>(
    () => [
      {
        id: 'creator',
        header: 'Creator',
        cell: ({ row }) => <CreatorCell creator={row.original} />,
        enableSorting: false,
        size: 220,
      },
      {
        accessorKey: 'tier',
        header: 'Stage',
        cell: ({ row }) => <TierChip tier={row.original.tier} />,
        enableSorting: false,
        size: 130,
      },
      {
        id: 'categories',
        header: 'Categories',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.category.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/[0.04] border border-foreground/[0.07] text-foreground/40 font-medium"
              >
                {cat}
              </span>
            ))}
            {row.original.category.length > 2 && (
              <span className="text-[10px] text-foreground/30">
                +{row.original.category.length - 2}
              </span>
            )}
          </div>
        ),
        enableSorting: false,
        size: 180,
      },
      {
        id: 'followers',
        header: 'Followers',
        accessorFn: (row) => row.stats.followers,
        enableSorting: false,
        size: 100,
      },
      {
        id: 'open',
        header: '',
        cell: ({ row }) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCreator(row.original);
            }}
            className="p-1 rounded-lg text-foreground/20 hover:text-portal-accent hover:bg-portal-accent/[0.06] transition-colors"
            aria-label={`View ${row.original.name} details`}
            tabIndex={-1}
          >
            <ChevronRight size={14} />
          </button>
        ),
        enableSorting: false,
        size: 40,
      },
    ],
    [],
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 min-h-screen">

        {/* Header */}
        <SectionHeader
          eyebrow="PEACE TIME AGENCY"
          heading="Creator CRM"
          description="Manage your roster, track pipeline stages, and keep internal notes."
          className="mb-8"
          actions={
            <div className="flex items-center gap-1 bg-portal-surface-1 border border-foreground/[0.06] rounded-lg p-1">
              {(['compact', 'default', 'comfortable'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={cn(
                    'px-2.5 py-1 rounded-md font-mono text-[9px] uppercase tracking-[0.1em] transition-colors',
                    density === d
                      ? 'bg-portal-accent/20 text-portal-accent'
                      : 'text-foreground/30 hover:text-foreground/60',
                  )}
                  aria-label={`${d} density`}
                >
                  {d === 'compact' ? 'S' : d === 'default' ? 'M' : 'L'}
                </button>
              ))}
            </div>
          }
        />

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatTile label="Total Creators" value={stats.total}        icon={<Users    size={16} />} />
          <StatTile label="Staff"          value={stats.staff}        icon={<Shield   size={16} />} />
          <StatTile label="Recruiters"     value={stats.recruiters}   icon={<Activity size={16} />} />
          <StatTile label="New Creators"   value={stats.newCreators}  icon={<UserPlus size={16} />} />
        </div>

        {/* Pipeline bar */}
        <PortalCard tone="tactical" className="mb-8">
          <PortalCard.Body className="py-4">
            <TacticalLabel size="xs" className="block mb-4">Creator Pipeline</TacticalLabel>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {pipeline.map((stage, i) => (
                <div key={stage.key} className="flex items-center gap-2 flex-shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border select-none',
                          stage.count > 0
                            ? 'bg-portal-accent/[0.08] border-portal-accent/20 text-portal-accent'
                            : 'bg-foreground/[0.03] border-foreground/[0.07] text-foreground/30',
                        )}
                        tabIndex={0}
                        role="status"
                        aria-label={`${stage.label}: ${stage.count}`}
                      >
                        <span>{stage.label}</span>
                        <span
                          className={cn(
                            'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full font-mono text-[10px] font-black',
                            stage.count > 0
                              ? 'bg-portal-accent/20 text-portal-accent'
                              : 'bg-foreground/[0.06] text-foreground/25',
                          )}
                        >
                          {stage.count}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-background-elevated border border-border text-foreground font-medium"
                    >
                      {stage.detail}
                    </TooltipContent>
                  </Tooltip>
                  {i < pipeline.length - 1 && (
                    <div
                      className="w-6 h-px bg-gradient-to-r from-foreground/[0.12] to-transparent flex-shrink-0"
                      aria-hidden
                    />
                  )}
                </div>
              ))}
            </div>
          </PortalCard.Body>
        </PortalCard>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none"
              aria-hidden
            />
            <input
              ref={searchRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value || null)}
              placeholder="Search name, handle, category…"
              className="w-full bg-portal-surface-1 border border-foreground/[0.06] rounded-xl pl-10 pr-9 py-2.5 text-sm text-foreground placeholder-foreground/25 focus:outline-none focus:ring-1 focus:ring-portal-accent/40 transition-all"
              aria-label="Search creators"
            />
            {q && (
              <button
                onClick={() => setQ(null)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="bg-portal-surface-1 border border-foreground/[0.06] rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/70 focus:outline-none focus:ring-1 focus:ring-portal-accent/40"
            aria-label="Sort creators"
          >
            <option value="name">Sort: Name</option>
            <option value="tier">Sort: Stage</option>
            <option value="category">Sort: Category</option>
          </select>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTER_CHIPS.map((chip) => {
            const count =
              chip.key === 'all'         ? stats.total
              : chip.key === 'new'       ? stats.newCreators
              : chip.key === 'top'       ? stats.topCreators
              : chip.key === 'recruiter' ? stats.recruiters
              : stats.staff;
            const active = tierFilter === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => setTierFilter(chip.key === 'all' ? null : chip.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.1em] font-bold border transition-all',
                  active
                    ? 'bg-portal-accent/15 border-portal-accent/30 text-portal-accent'
                    : 'bg-foreground/[0.03] border-foreground/[0.08] text-foreground/35 hover:text-foreground/60 hover:border-foreground/20',
                )}
              >
                {chip.label}
                <span
                  className={cn(
                    'inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black',
                    active ? 'bg-portal-accent/20' : 'bg-foreground/[0.06]',
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results count + keyboard hint */}
        <div className="flex items-center justify-between mb-3">
          <TacticalLabel size="xs">
            {filteredCreators.length} of {creators.length} creators
          </TacticalLabel>
          <TacticalLabel size="xs" className="hidden sm:flex items-center gap-1">
            <kbd className="font-mono px-1.5 py-0.5 rounded bg-foreground/[0.06] border border-foreground/[0.08] text-[9px] not-italic">j</kbd>
            <kbd className="font-mono px-1.5 py-0.5 rounded bg-foreground/[0.06] border border-foreground/[0.08] text-[9px] not-italic">k</kbd>
            <span className="text-foreground/20 mx-0.5">navigate</span>
            <span className="text-foreground/15 mx-1">·</span>
            <kbd className="font-mono px-1.5 py-0.5 rounded bg-foreground/[0.06] border border-foreground/[0.08] text-[9px] not-italic">↵</kbd>
            <span className="text-foreground/20 mx-0.5">open</span>
            <span className="text-foreground/15 mx-1">·</span>
            <kbd className="font-mono px-1.5 py-0.5 rounded bg-foreground/[0.06] border border-foreground/[0.08] text-[9px] not-italic">/</kbd>
            <span className="text-foreground/20 mx-0.5">search</span>
          </TacticalLabel>
        </div>

        {/* Data table */}
        <DataTable
          columns={columns}
          data={filteredCreators}
          density={density}
          getRowId={(row) => row.id}
          focusedRowIndex={focusedIdx >= 0 ? focusedIdx : undefined}
          onRowClick={(row) => setSelectedCreator(row)}
        />

        {/* Detail slide-over */}
        <Sheet
          open={!!selectedCreator}
          onOpenChange={(open) => {
            if (!open) setSelectedCreator(null);
          }}
        >
          <CreatorDetailSheet
            creator={selectedCreator}
            optimisticTier={optimisticSelectedTier}
            isPending={isPending}
            onTierUpdate={handleTierUpdate}
          />
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
