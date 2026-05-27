'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, BarChart3, Plus, X, Check, ChevronRight, Search, Paperclip, Image as ImageIcon, Video, File } from 'lucide-react';
import { Creator } from '@/lib/creators';

interface MyCreatorsClientProps {
  manager: Creator;
  creators: Creator[];
}

interface AttachmentItem {
  name: string;
  type: 'image' | 'video' | 'file';
  size: string;
}

const MOCK_PENDING = [
  { creator: 'NewCreator99', message: 'Hey! I was told to pick you as my manager. Looking forward to working together!' },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export function MyCreatorsClient({ manager, creators }: MyCreatorsClientProps) {
  const [search, setSearch] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [showDataCard, setShowDataCard] = useState(false);
  const [dataCard, setDataCard] = useState({
    month: '',
    diamonds: '', views: '', avgWatch: '', followers: '', engagement: '', notes: ''
  });
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const managedCreators = creators.filter(c => c.handle !== manager.handle).slice(0, 4);
  const filtered = managedCreators.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments: AttachmentItem[] = files.map(f => {
      const isImage = f.type.startsWith('image/');
      const isVideo = f.type.startsWith('video/');
      const sizeKb = Math.round(f.size / 1024);
      const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
      return {
        name: f.name,
        type: isImage ? 'image' : isVideo ? 'video' : 'file',
        size: sizeStr,
      };
    });
    setAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (i: number) => {
    setAttachments(prev => prev.filter((_, idx) => idx !== i));
  };

  const openDataCard = (creator: Creator) => {
    setSelectedCreator(creator);
    setDataCard({ month: '', diamonds: '', views: '', avgWatch: '', followers: '', engagement: '', notes: '' });
    setAttachments([]);
    setShowDataCard(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center">
          <UserCheck size={20} className="text-[#14B8A6]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">My Creators</h1>
          <p className="text-xs text-foreground/30 font-medium">Manage your assigned creators and submit Data Cards</p>
        </div>
      </motion.div>

      {/* Pending requests */}
      {MOCK_PENDING.length > 0 && (
        <div>
          <p className="text-[9px] font-black text-foreground/30 uppercase tracking-widest mb-3">Pending Requests</p>
          <div className="space-y-3">
            {MOCK_PENDING.map((req, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03]">
                <div className="flex-1">
                  <p className="text-sm font-black text-foreground mb-1">{req.creator} wants to join your roster</p>
                  <p className="text-xs text-foreground/40 leading-relaxed italic">"{req.message}"</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-[#14B8A6] text-xs font-black hover:bg-[#14B8A6]/20 transition-all">
                    <Check size={13} /> Accept
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black hover:bg-red-500/20 transition-all">
                    <X size={13} /> Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search + creators list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[9px] font-black text-foreground/30 uppercase tracking-widest">Assigned Creators ({managedCreators.length})</p>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/25" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search creators..."
              className="pl-8 pr-4 py-2 bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl text-xs text-foreground placeholder-foreground/20 outline-none focus:border-[#14B8A6]/30 w-48" />
          </div>
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(creator => (
            <motion.div key={creator.id} variants={fadeUp}
              className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-5 hover:border-[#14B8A6]/15 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-black text-[#14B8A6]">{creator.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-foreground">{creator.name}</p>
                  <p className="text-[9px] text-foreground/30">{creator.handle}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {creator.category.slice(0, 2).map(cat => (
                      <span key={cat} className="text-[8px] px-1.5 py-0.5 rounded bg-foreground/5 text-foreground/30">{cat}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openDataCard(creator)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-[#14B8A6] text-[10px] font-black hover:bg-[#14B8A6]/20 transition-all"
                  >
                    <BarChart3 size={11} /> Data Card
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Data Card Modal */}
      <AnimatePresence>
        {showDataCard && selectedCreator && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDataCard(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-background-surface border border-foreground/10 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-foreground">Submit Data Card</h3>
                  <p className="text-xs text-foreground/40">{selectedCreator.name}</p>
                </div>
                <button onClick={() => setShowDataCard(false)}><X size={18} className="text-foreground/30" /></button>
              </div>

              <div className="space-y-4">
                {/* Month — free text input */}
                <div>
                  <label className="text-[9px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Month</label>
                  <input
                    value={dataCard.month}
                    onChange={e => setDataCard(p => ({ ...p, month: e.target.value }))}
                    placeholder="e.g. May 2025"
                    className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none focus:border-[#14B8A6]/30"
                  />
                </div>

                {/* Metric fields */}
                {[
                  { label: 'Monthly Diamonds', key: 'diamonds', placeholder: 'e.g. 12,847' },
                  { label: 'Total Views', key: 'views', placeholder: 'e.g. 184,200' },
                  { label: 'Avg Watch Time', key: 'avgWatch', placeholder: 'e.g. 4m 32s' },
                  { label: 'Followers Gained', key: 'followers', placeholder: 'e.g. +892' },
                  { label: 'Engagement Rate', key: 'engagement', placeholder: 'e.g. 7.4%' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-[9px] font-black text-foreground/30 uppercase tracking-widest block mb-2">{field.label}</label>
                    <input value={(dataCard as any)[field.key]} onChange={e => setDataCard(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none focus:border-[#14B8A6]/30" />
                  </div>
                ))}

                {/* Staff Notes */}
                <div>
                  <label className="text-[9px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Staff Notes</label>
                  <textarea rows={4} value={dataCard.notes} onChange={e => setDataCard(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Performance notes, observations, recommendations..."
                    className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none resize-none" />
                </div>

                {/* ─── File / Image / Video Attachments ─── */}
                <div>
                  <label className="text-[9px] font-black text-foreground/30 uppercase tracking-widest block mb-2">Attachments</label>
                  <p className="text-[10px] text-foreground/25 mb-3">Add screenshots, clips, or documents to support this data card.</p>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx,.xlsx,.csv"
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  {/* Attachment list */}
                  {attachments.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {attachments.map((att, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06]">
                          <div className="w-7 h-7 rounded-lg bg-foreground/[0.06] flex items-center justify-center flex-shrink-0">
                            {att.type === 'image' && <ImageIcon size={12} className="text-[#14B8A6]" />}
                            {att.type === 'video' && <Video size={12} className="text-purple-400" />}
                            {att.type === 'file' && <File size={12} className="text-blue-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-foreground truncate">{att.name}</p>
                            <p className="text-[9px] text-foreground/30">{att.size}</p>
                          </div>
                          <button onClick={() => removeAttachment(i)} className="text-foreground/20 hover:text-red-400 transition-colors">
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = 'image/*'; fileInputRef.current.click(); } }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] text-foreground/50 text-[10px] font-black hover:border-[#14B8A6]/30 hover:text-[#14B8A6] transition-all"
                    >
                      <ImageIcon size={12} /> Image
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = 'video/*'; fileInputRef.current.click(); } }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] text-foreground/50 text-[10px] font-black hover:border-purple-500/30 hover:text-purple-400 transition-all"
                    >
                      <Video size={12} /> Video
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = '.pdf,.doc,.docx,.xlsx,.csv'; fileInputRef.current.click(); } }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] text-foreground/50 text-[10px] font-black hover:border-blue-500/30 hover:text-blue-400 transition-all"
                    >
                      <Paperclip size={12} /> File
                    </button>
                  </div>
                </div>

                <button className="w-full py-3.5 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-[#14B8A6] font-black hover:bg-[#14B8A6]/20 transition-all">
                  Submit Data Card {attachments.length > 0 && `(+${attachments.length} attachment${attachments.length > 1 ? 's' : ''})`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
