"use client";

import { useState } from "react";
import { Article } from "@/lib/news";
import { motion } from "framer-motion";
import { X, Newspaper, Save, Loader2 } from "lucide-react";

export function ArticleEditModal({
  article,
  onClose,
  onSave,
  saving,
}: {
  article: Article;
  onClose: () => void;
  onSave: (a: Article) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<Article>(article);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative w-full max-w-4xl h-full max-h-[85vh] bg-[#0A0F1A] border border-white/10 rounded-[40px] flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
              <Newspaper className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-white">
                Intel Deployment
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground-muted">Article UUID: {formData.slug}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors">
            <X className="w-6 h-6 text-white/50" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 relative z-10 scrollbar-thin">
          <form id="news-form" onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Archive SLUG (URL)</label>
                <input
                  id="slug"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Article Headline</label>
                <input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-black text-white focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Category</label>
                  <input
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-xs font-black uppercase tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Deploy Date</label>
                  <input
                    id="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Intel Author</label>
                  <input
                    id="author"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Intel Excerpt</label>
                <textarea
                  id="excerpt"
                  required
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white/70 focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Asset URL (Header Image)</label>
                <div className="flex gap-4">
                  <input
                    id="image"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-secondary/70 text-xs font-mono truncate"
                  />
                  {formData.image && (
                    <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden bg-black flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="relative z-10 p-8 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.2em] font-black text-foreground-subtle">Awaiting Commit Execution</span>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-all"
              >
                Abort
              </button>
              <button
                form="news-form"
                type="submit"
                disabled={saving}
                className="group relative h-12 px-10 bg-gradient-to-r from-secondary to-secondary-dark rounded-2xl flex items-center gap-2 overflow-hidden transition-all shadow-neon-secondary/20 hover:shadow-neon-secondary/40 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white relative z-10" />
                    <span className="text-white text-xs font-black uppercase tracking-widest relative z-10">Deploying...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-white relative z-10" />
                    <span className="text-white text-xs font-black uppercase tracking-widest relative z-10">Commit Article</span>
                  </>
                )}
              </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
