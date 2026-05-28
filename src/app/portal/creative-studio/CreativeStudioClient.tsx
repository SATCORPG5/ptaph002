'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ThumbsUp, ThumbsDown, Play, Upload, Flame, Trophy,
  TrendingUp, Plus, X, Radio, BarChart2, Image as ImageIcon, Check,
  GripVertical,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActivityRing } from '@/components/portal/ActivityRing';
import { PortalCard, SectionHeader } from '@/components/portal/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/shadcn-ui/dialog';

const TABS = ['Video Gallery', 'Like Weigh-In', 'Showcase & Wins', 'Hot Right Now'];

interface Video {
  id: number; creator: string; title: string;
  views: string; likes: number; duration: string; hot: boolean;
}

const INITIAL_VIDEOS: Video[] = [
  { id: 1, creator: 'ColdP1zza',    title: 'Late Night Grind Stream',        views: '12.4K', likes: 847,  duration: '2:31:04', hot: true  },
  { id: 2, creator: 'ItsJakee_78',  title: 'My First 1K Viewer Stream!',     views: '8.1K',  likes: 623,  duration: '1:45:22', hot: false },
  { id: 3, creator: 'General Spuds',title: 'Cooking IRL Goes Wrong Lmao',    views: '5.6K',  likes: 411,  duration: '55:10',   hot: false },
  { id: 4, creator: 'STEALYN',      title: 'New Setup Tour + Q&A',           views: '4.2K',  likes: 389,  duration: '38:44',   hot: false },
  { id: 5, creator: 'Slingin6.0',   title: 'Collab Stream w/ Baked',         views: '19.3K', likes: 1204, duration: '3:12:55', hot: true  },
  { id: 6, creator: 'Papa J',       title: 'Just Chatting: Life Update',     views: '3.1K',  likes: 298,  duration: '1:02:14', hot: false },
];

interface WeighIn {
  id: number; creator: string; title: string;
  thumbsUp: number; thumbsDown: number; userVote: null | 'up' | 'down';
  isPoll?: boolean; options?: string[]; votes?: number[]; duration?: string; mediaUrl?: string;
}

const MOCK_WEIGH_INS: WeighIn[] = [
  { id: 1, creator: 'ItsJakee_78',  title: 'Thumbnail A vs B: which is better?',    thumbsUp: 42, thumbsDown: 8,  userVote: null },
  { id: 2, creator: 'General Spuds',title: 'Should I try cooking content more?',     thumbsUp: 67, thumbsDown: 14, userVote: null },
  {
    id: 3, creator: 'STEALYN', title: 'Best stream day for the community?',
    thumbsUp: 0, thumbsDown: 0, userVote: null,
    isPoll: true, options: ['Friday Night', 'Saturday Afternoon', 'Sunday Evening', 'Weekday Morning'],
    votes: [14, 22, 31, 7], duration: '3 days left',
  },
];

interface ShowcasePost {
  id: number; creator: string; type: 'showcase' | 'win';
  title: string; body: string; mediaUrl?: string; time: string; likes: number;
}

const MOCK_SHOWCASE: ShowcasePost[] = [
  { id: 1, creator: 'ColdP1zza',    type: 'win',      title: 'Broke 2K CCV!',         body: 'Hit a new peak today. 2K concurrent viewers for the first time ever 🚀 Months of work finally paying off.', time: '2h ago', likes: 34 },
  { id: 2, creator: 'ItsJakee_78',  type: 'win',      title: 'Hit 10K Followers!',    body: 'TikTok officially shows 10K today. Beyond grateful for the PTA community support 🙏', time: '5h ago', likes: 56 },
  { id: 3, creator: 'Slingin6.0',   type: 'showcase', title: 'First Brand Deal',      body: "Just signed my first brand collab through Agency Ops. Can't share details yet but it's real and it's here 💼", time: '1d ago', likes: 71 },
  { id: 4, creator: 'General Spuds',type: 'win',      title: 'Viral Stream Clip',     body: 'Stream clip hit 50K+ impressions on its own. Algorithm picked it up overnight. New setup is clearly working.', time: '2d ago', likes: 92 },
  { id: 5, creator: 'STEALYN',      type: 'showcase', title: 'New Overlay Design',    body: 'Spent a week rebuilding my stream layout from scratch. Super clean now. Check it out in the video gallery.', time: '3d ago', likes: 47 },
];

const HOT_RIGHT_NOW = [
  { creator: 'Slingin6.0', stat: '19.3K views',       type: 'video', hot: 98 },
  { creator: 'ColdP1zza',  stat: 'Live · 2.1K viewers',type: 'live',  hot: 95 },
  { creator: 'STEALYN',    stat: 'Live · 1.3K viewers',type: 'live',  hot: 87 },
  { creator: 'ItsJakee_78',stat: '8.1K views',        type: 'video', hot: 72 },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp  = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

// ─── Sortable Video Card ────────────────────────────────────────────────────────
function SortableVideoCard({ video, onSelect }: { video: Video; onSelect: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: video.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined }}
      className={isDragging ? 'opacity-50' : ''}
    >
      <PortalCard className="overflow-hidden group hover:border-foreground/[0.12]">
        {/* Thumbnail — click to open lightbox */}
        <button className="w-full text-left" onClick={onSelect}>
          <div className="relative aspect-video bg-gradient-to-br from-purple-900/20 to-background flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-all">
              <Play size={20} className="text-foreground ml-0.5" />
            </div>
            {video.hot && (
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/80 backdrop-blur-sm text-[9px] font-black text-white">
                <Flame size={10} /> Hot
              </div>
            )}
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white tabular-nums">
              {video.duration}
            </div>
          </div>
        </button>

        <div className="p-4 flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground mb-1 line-clamp-1">{video.title}</p>
            <p className="text-[10px] text-foreground/30 mb-3">{video.creator}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-foreground/30 font-semibold tabular-nums">{video.views} views</span>
              <div className="flex items-center gap-1 text-[10px] text-foreground/40">
                <ThumbsUp size={11} />
                <span className="tabular-nums">{video.likes}</span>
              </div>
            </div>
          </div>
          {/* Drag handle */}
          <button
            className="flex-shrink-0 p-1 mt-0.5 rounded cursor-grab active:cursor-grabbing text-foreground/20 hover:text-foreground/40 transition-colors touch-none"
            aria-label="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={14} />
          </button>
        </div>
      </PortalCard>
    </div>
  );
}

// ─── Poll Create Modal ──────────────────────────────────────────────────────────
function PollModal({ onClose, onPublish }: { onClose: () => void; onPublish: (poll: WeighIn) => void }) {
  const [title, setTitle]     = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState('24h');
  const [mediaUrl, setMediaUrl] = useState('');

  const addOption    = () => { if (options.length < 4) setOptions([...options, '']); };
  const removeOption = (i: number) => setOptions(options.filter((_, idx) => idx !== i));
  const updateOption = (i: number, v: string) => setOptions(options.map((o, idx) => idx === i ? v : o));

  const handlePublish = () => {
    if (!title.trim() || options.filter(o => o.trim()).length < 2) return;
    const filled = options.filter(o => o.trim());
    onPublish({
      id: Date.now(), creator: 'You', title: title.trim(),
      thumbsUp: 0, thumbsDown: 0, userVote: null,
      isPoll: true, options: filled, votes: filled.map(() => 0), duration, mediaUrl,
    });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-background-surface border border-foreground/10 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center">
              <BarChart2 size={16} className="text-portal-accent" />
            </div>
            <h3 className="text-lg font-black text-foreground">Create Poll</h3>
          </div>
          <button onClick={onClose}><X size={18} className="text-foreground/30 hover:text-foreground transition-colors" /></button>
        </div>

        <div className="mb-5">
          <label className="text-[10px] font-black text-portal-accent uppercase tracking-widest mb-2 block">Poll Question</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Ask your community something..."
            className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none focus:border-portal-accent/40 transition-colors" />
        </div>

        <div className="mb-5">
          <label className="text-[10px] font-black text-portal-accent uppercase tracking-widest mb-2 block">
            Answers <span className="text-foreground/20 normal-case font-normal">(2–4 options)</span>
          </label>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input value={opt} onChange={e => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-foreground/20 outline-none focus:border-portal-accent/40 transition-colors" />
                {options.length > 2 && (
                  <button onClick={() => removeOption(i)} className="w-9 h-9 flex items-center justify-center rounded-xl border border-foreground/10 text-foreground/30 hover:text-red-400 hover:border-red-400/30 transition-all">
                    <X size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {options.length < 4 && (
            <button onClick={addOption} className="mt-2 flex items-center gap-2 text-[11px] font-bold text-portal-accent/60 hover:text-portal-accent transition-colors">
              <Plus size={12} /> Add option
            </button>
          )}
        </div>

        <div className="mb-5">
          <label className="text-[10px] font-black text-portal-accent uppercase tracking-widest mb-2 block">Duration</label>
          <div className="flex gap-2 flex-wrap">
            {['1h', '6h', '12h', '24h', '3 days', '7 days'].map(d => (
              <button key={d} onClick={() => setDuration(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${duration === d ? 'bg-portal-accent/20 border border-portal-accent/40 text-portal-accent' : 'bg-foreground/5 border border-foreground/10 text-foreground/40 hover:text-foreground'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-[10px] font-black text-portal-accent uppercase tracking-widest mb-2 block">
            Media URL <span className="text-foreground/20 normal-case font-normal">(optional)</span>
          </label>
          <div className="relative">
            <ImageIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/25" />
            <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder-foreground/20 outline-none focus:border-portal-accent/40 transition-colors" />
          </div>
        </div>

        <button onClick={handlePublish}
          disabled={!title.trim() || options.filter(o => o.trim()).length < 2}
          className="w-full py-3 rounded-xl bg-portal-accent/20 border border-portal-accent/30 text-portal-accent text-sm font-black hover:bg-portal-accent/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          Publish Poll
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Showcase Post Modal ────────────────────────────────────────────────────────
function ShowcaseModal({ onClose, onPublish }: { onClose: () => void; onPublish: (post: ShowcasePost) => void }) {
  const [type, setType]     = useState<'showcase' | 'win'>('showcase');
  const [title, setTitle]   = useState('');
  const [body, setBody]     = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const handlePublish = () => {
    if (!title.trim() || !body.trim()) return;
    onPublish({ id: Date.now(), creator: 'You', type, title: title.trim(), body: body.trim(), mediaUrl, time: 'Just now', likes: 0 });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-background-surface border border-foreground/10 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-foreground">New Post</h3>
          <button onClick={onClose}><X size={18} className="text-foreground/30 hover:text-foreground transition-colors" /></button>
        </div>

        <div className="mb-5">
          <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2 block">Post Type</label>
          <div className="flex gap-2">
            <button onClick={() => setType('showcase')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all border ${type === 'showcase' ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-foreground/5 border-foreground/10 text-foreground/40 hover:text-foreground'}`}>
              🎨 Showcase
            </button>
            <button onClick={() => setType('win')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all border ${type === 'win' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-foreground/5 border-foreground/10 text-foreground/40 hover:text-foreground'}`}>
              🏆 Win / Achievement
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 block">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder={type === 'win' ? 'What did you achieve?' : 'What are you showcasing?'}
            className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none focus:border-foreground/20 transition-colors" />
        </div>

        <div className="mb-4">
          <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 block">Description</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={4}
            placeholder="Share the story behind it..."
            className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none focus:border-foreground/20 transition-colors resize-none" />
        </div>

        <div className="mb-6">
          <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 block">
            Image / Video URL <span className="text-foreground/20 normal-case font-normal">(optional)</span>
          </label>
          <div className="relative">
            <ImageIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/25" />
            <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder-foreground/20 outline-none focus:border-foreground/20 transition-colors" />
          </div>
        </div>

        <button onClick={handlePublish}
          disabled={!title.trim() || !body.trim()}
          className={`w-full py-3 rounded-xl text-sm font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            type === 'win'
              ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30'
              : 'bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30'
          }`}>
          <Check size={14} className="inline mr-2" />
          Publish Post
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export function CreativeStudioClient() {
  const [activeTab, setActiveTab]           = useState(0);
  const [videos, setVideos]                 = useState<Video[]>(INITIAL_VIDEOS);
  const [weighIns, setWeighIns]             = useState<WeighIn[]>(MOCK_WEIGH_INS);
  const [showcase, setShowcase]             = useState<ShowcasePost[]>(MOCK_SHOWCASE);
  const [filter, setFilter]                 = useState('All');
  const [showcaseFilter, setShowcaseFilter] = useState<'all' | 'showcase' | 'win'>('all');
  const [showUpload, setShowUpload]         = useState(false);
  const [showPollModal, setShowPollModal]   = useState(false);
  const [showShowcaseModal, setShowShowcaseModal] = useState(false);
  const [selectedVideo, setSelectedVideo]   = useState<Video | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setVideos(prev => {
        const oldIdx = prev.findIndex(v => v.id === active.id);
        const newIdx = prev.findIndex(v => v.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  }

  const handleVote = (id: number, vote: 'up' | 'down') => {
    setWeighIns(prev => prev.map(w => {
      if (w.id !== id) return w;
      if (w.userVote === vote) return { ...w, userVote: null, [vote === 'up' ? 'thumbsUp' : 'thumbsDown']: w[vote === 'up' ? 'thumbsUp' : 'thumbsDown'] - 1 };
      const prevVote = w.userVote;
      return {
        ...w, userVote: vote,
        thumbsUp: vote === 'up' ? w.thumbsUp + 1 : (prevVote === 'up' ? w.thumbsUp - 1 : w.thumbsUp),
        thumbsDown: vote === 'down' ? w.thumbsDown + 1 : (prevVote === 'down' ? w.thumbsDown - 1 : w.thumbsDown),
      };
    }));
  };

  const handlePollVote = (pollId: number, optionIndex: number) => {
    setWeighIns(prev => prev.map(w => {
      if (w.id !== pollId || !w.isPoll || !w.votes) return w;
      const newVotes = [...w.votes];
      newVotes[optionIndex]++;
      return { ...w, votes: newVotes };
    }));
  };

  const filteredShowcase = showcase.filter(p => showcaseFilter === 'all' || p.type === showcaseFilter);
  const filteredVideos   = videos.filter(v => filter === 'All' || (filter === 'Hot' && v.hot));

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <SectionHeader
          eyebrow="creator"
          heading="Creative Studio"
          description="Share content, get feedback, celebrate wins"
        />
        <ActivityRing value={78} size={40} strokeWidth={3.5} />
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-foreground/[0.03] border border-foreground/[0.06] rounded-2xl p-1.5 mb-8 overflow-x-auto scrollbar-none">
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === i
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20'
                : 'text-foreground/30 hover:text-foreground/60 hover:bg-foreground/[0.04]'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ─── VIDEO GALLERY ─── */}
      {activeTab === 0 && (
        <motion.div variants={stagger} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {['All', 'Hot', 'Recent'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filter === f ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' : 'text-foreground/25 hover:text-foreground/50 bg-foreground/[0.03]'}`}>
                  {f}
                </button>
              ))}
            </div>
            <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-black hover:bg-purple-500/20 transition-all">
              <Upload size={14} /> Upload
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredVideos.map(v => v.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideos.map(video => (
                  <SortableVideoCard
                    key={video.id}
                    video={video}
                    onSelect={() => setSelectedVideo(video)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </motion.div>
      )}

      {/* ─── LIKE WEIGH-IN ─── */}
      {activeTab === 1 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-foreground/30 font-bold uppercase tracking-widest">Community Votes & Polls</p>
            <button onClick={() => setShowPollModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-portal-accent/10 border border-portal-accent/20 text-portal-accent text-xs font-black hover:bg-portal-accent/20 transition-all">
              <BarChart2 size={14} /> Create Poll
            </button>
          </div>
          <div className="space-y-4">
            {weighIns.map((item) => (
              <motion.div key={item.id} variants={fadeUp}>
                <PortalCard className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-bold text-foreground/50 mb-1">{item.creator}</p>
                      <p className="text-sm font-black text-foreground">{item.title}</p>
                    </div>
                    {item.isPoll && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-portal-accent/10 border border-portal-accent/20">
                        <BarChart2 size={10} className="text-portal-accent" />
                        {item.duration && <span className="text-[9px] font-bold text-portal-accent">{item.duration}</span>}
                      </div>
                    )}
                  </div>

                  {item.isPoll && item.options && item.votes ? (
                    <div className="space-y-2">
                      {item.options.map((opt, i) => {
                        const total = item.votes!.reduce((a, b) => a + b, 0);
                        const pct   = total > 0 ? Math.round((item.votes![i] / total) * 100) : 0;
                        return (
                          <button key={i} onClick={() => handlePollVote(item.id, i)}
                            className="w-full text-left rounded-xl border border-foreground/[0.06] hover:border-portal-accent/30 overflow-hidden transition-all group">
                            <div className="relative px-4 py-2.5">
                              <motion.div className="absolute inset-0 bg-portal-accent/10 rounded-xl"
                                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
                              <div className="relative flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground group-hover:text-portal-accent transition-colors">{opt}</span>
                                <span className="text-[10px] font-black text-foreground/40 tabular-nums">{pct}%</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                      <p className="text-[9px] text-foreground/20 font-bold mt-2 tabular-nums">
                        {item.votes.reduce((a, b) => a + b, 0)} votes
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="h-2 rounded-full bg-foreground/[0.05] overflow-hidden mb-4">
                        <motion.div className="h-full bg-gradient-to-r from-portal-accent to-[#0EA5E9] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.thumbsUp + item.thumbsDown > 0 ? Math.round((item.thumbsUp / (item.thumbsUp + item.thumbsDown)) * 100) : 50}%` }}
                          transition={{ duration: 0.6 }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button onClick={() => handleVote(item.id, 'up')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${item.userVote === 'up' ? 'bg-portal-accent/20 border border-portal-accent/40 text-portal-accent' : 'bg-foreground/[0.04] border border-foreground/[0.06] text-foreground/40 hover:text-foreground hover:border-foreground/20'}`}>
                            <ThumbsUp size={14} /> <span className="tabular-nums">{item.thumbsUp}</span>
                          </button>
                          <button onClick={() => handleVote(item.id, 'down')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${item.userVote === 'down' ? 'bg-red-500/20 border border-red-500/40 text-red-400' : 'bg-foreground/[0.04] border border-foreground/[0.06] text-foreground/40 hover:text-foreground hover:border-foreground/20'}`}>
                            <ThumbsDown size={14} /> <span className="tabular-nums">{item.thumbsDown}</span>
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-portal-accent tabular-nums">
                          {item.thumbsUp + item.thumbsDown > 0 ? Math.round((item.thumbsUp / (item.thumbsUp + item.thumbsDown)) * 100) : 50}% positive
                        </span>
                      </div>
                    </>
                  )}
                </PortalCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── SHOWCASE & WINS ─── */}
      {activeTab === 2 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {(['all', 'showcase', 'win'] as const).map(f => (
                <button key={f} onClick={() => setShowcaseFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${showcaseFilter === f
                    ? f === 'win' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/20'
                      : f === 'showcase' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20'
                      : 'bg-foreground/10 text-foreground border border-foreground/20'
                    : 'text-foreground/25 hover:text-foreground/50 bg-foreground/[0.03]'}`}>
                  {f === 'all' ? 'All Posts' : f === 'showcase' ? '🎨 Showcases' : '🏆 Wins'}
                </button>
              ))}
            </div>
            <button onClick={() => setShowShowcaseModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black hover:bg-amber-500/20 transition-all">
              <Plus size={14} /> New Post
            </button>
          </div>

          <div className="space-y-4">
            {filteredShowcase.map((post) => (
              <motion.div key={post.id} variants={fadeUp}>
                <PortalCard
                  className={`p-5 transition-all ${post.type === 'win' ? 'border-amber-500/10 hover:border-amber-500/20' : 'border-purple-500/10 hover:border-purple-500/20'}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black border ${post.type === 'win' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}`}>
                      {post.creator.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-foreground">{post.creator}</p>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${post.type === 'win' ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {post.type === 'win' ? '🏆 Win' : '🎨 Showcase'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] text-foreground/25 flex-shrink-0">{post.time}</span>
                  </div>

                  <p className="text-sm font-black text-foreground mb-1">{post.title}</p>
                  <p className="text-xs text-foreground/50 leading-relaxed mb-3">{post.body}</p>

                  {post.mediaUrl && (
                    <div className="rounded-xl overflow-hidden border border-foreground/[0.06] mb-3 aspect-video bg-foreground/[0.03] flex items-center justify-center">
                      <ImageIcon size={24} className="text-foreground/10" />
                    </div>
                  )}

                  <button className={`flex items-center gap-1.5 text-[10px] font-black transition-colors ${post.type === 'win' ? 'text-amber-400/60 hover:text-amber-400' : 'text-purple-400/60 hover:text-purple-400'}`}>
                    <Trophy size={11} /> <span className="tabular-nums">{post.likes}</span> celebrating
                  </button>
                </PortalCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── HOT RIGHT NOW ─── */}
      {activeTab === 3 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3 max-w-2xl">
          <p className="text-xs text-foreground/30 font-bold uppercase tracking-widest mb-4">Trending in the agency right now</p>
          {HOT_RIGHT_NOW.map((h, i) => (
            <motion.div key={h.creator} variants={fadeUp}>
              <PortalCard className="flex items-center gap-4 p-4 hover:border-red-500/20">
                <div className="text-lg font-black text-foreground/10 w-6 text-center tabular-nums">{i + 1}</div>
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  {h.type === 'live' ? <Radio size={16} className="text-red-400" /> : <TrendingUp size={16} className="text-red-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-foreground">{h.creator}</p>
                  <p className="text-[10px] text-foreground/30">{h.stat}</p>
                </div>
                <ActivityRing value={h.hot} size={28} strokeWidth={2.5} />
              </PortalCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ─── VIDEO LIGHTBOX DIALOG ─── */}
      <Dialog open={!!selectedVideo} onOpenChange={open => { if (!open) setSelectedVideo(null); }}>
        <DialogContent className="bg-background-elevated border-foreground/10 text-foreground sm:max-w-2xl">
          {selectedVideo && (
            <>
              <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-background rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                <button className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center hover:bg-purple-500/30 transition-all">
                  <Play size={28} className="text-purple-300 ml-1" />
                </button>
              </div>
              <DialogHeader>
                <DialogTitle className="text-foreground font-black text-base">{selectedVideo.title}</DialogTitle>
                <DialogDescription className="text-foreground/40">{selectedVideo.creator}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { label: 'Views',    value: selectedVideo.views    },
                  { label: 'Likes',    value: String(selectedVideo.likes) },
                  { label: 'Duration', value: selectedVideo.duration },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center p-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06]">
                    <p className="text-sm font-black text-foreground tabular-nums slashed-zero">{value}</p>
                    <p className="text-[10px] text-foreground/30 font-mono uppercase tracking-[0.15em] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── UPLOAD MODAL ─── */}
      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowUpload(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-background-surface border border-foreground/10 rounded-3xl p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-foreground">Upload Video</h3>
                <button onClick={() => setShowUpload(false)}><X size={18} className="text-foreground/30" /></button>
              </div>
              <div className="border-2 border-dashed border-foreground/10 rounded-2xl p-12 text-center mb-6 hover:border-purple-500/30 transition-colors cursor-pointer">
                <Upload size={24} className="text-foreground/20 mx-auto mb-3" />
                <p className="text-xs text-foreground/40 font-semibold">Drop your video or click to browse</p>
                <p className="text-[9px] text-foreground/20 mt-1">MP4, MOV up to 500MB</p>
              </div>
              <input type="text" placeholder="Video title..." className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none mb-4" />
              <button className="w-full py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-black hover:bg-purple-500/30 transition-all">
                Upload to Studio
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPollModal && (
          <PollModal onClose={() => setShowPollModal(false)} onPublish={poll => setWeighIns(prev => [poll, ...prev])} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShowcaseModal && (
          <ShowcaseModal onClose={() => setShowShowcaseModal(false)} onPublish={post => setShowcase(prev => [post, ...prev])} />
        )}
      </AnimatePresence>
    </div>
  );
}
