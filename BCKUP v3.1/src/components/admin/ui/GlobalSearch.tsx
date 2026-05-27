"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, User, Receipt, HelpCircle, ArrowRight, Loader2 } from "lucide-react";
import { Creator } from "@/lib/creators";
import { Article } from "@/lib/news";
import { SiteSettings } from "@/lib/creators-db";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  creators: Creator[];
  news: Article[];
  settings: SiteSettings | null;
  onSelectCreator: (c: Creator) => void;
  onSelectArticle: (a: Article) => void;
  onSelectFaq: (q: string) => void;
}

export function GlobalSearch({
  isOpen,
  onClose,
  creators,
  news,
  settings,
  onSelectCreator,
  onSelectArticle,
  onSelectFaq,
}: GlobalSearchProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle logic should be handled by parent, but we can call onClose if open
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return { creators: [], news: [], faqs: [] };
    const q = query.toLowerCase();

    return {
      creators: creators.filter(c => 
        c.name.toLowerCase().includes(q) || 
        (c.title || "").toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      ).slice(0, 5),
      news: news.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.excerpt.toLowerCase().includes(q)
      ).slice(0, 5),
      faqs: (settings?.faqs || []).filter(f => 
        f.q.toLowerCase().includes(q) || 
        f.a.toLowerCase().includes(q)
      ).slice(0, 5)
    };
  }, [query, creators, news, settings]);

  const hasResults = results.creators.length > 0 || results.news.length > 0 || results.faqs.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-6 md:pt-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-[#0D1117] border border-white/10 rounded-[32px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="flex items-center px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <Search className="w-5 h-5 text-primary mr-4" />
              <input
                autoFocus
                placeholder="Search database (Creators, Intel, FAQs)..."
                className="flex-1 bg-transparent border-none text-lg text-white placeholder-white/20 focus:outline-none focus:ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl text-white/20 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 scrollbar-thin">
              {!query.trim() ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-primary/40" />
                  </div>
                  <h4 className="text-white/40 font-black uppercase tracking-[0.2em] text-xs">Awaiting Input</h4>
                  <p className="text-white/10 text-[10px] mt-2 tracking-widest uppercase">Query the central nervous system</p>
                </div>
              ) : !hasResults ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <h4 className="text-white/40 font-black uppercase tracking-[0.2em] text-xs">No matches found</h4>
                  <p className="text-white/10 text-[10px] mt-2 tracking-widest uppercase">Refine your search parameters</p>
                </div>
              ) : (
                <div className="space-y-8 p-2">
                  {results.creators.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-2">
                        <User className="w-3.5 h-3.5 text-secondary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Roster Members</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {results.creators.map(c => (
                          <button
                            key={c.id}
                            onClick={() => { onSelectCreator(c); onClose(); }}
                            className="group flex items-center gap-4 p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all text-left"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                               <img src={c.image} alt={c.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-bold text-white tracking-tight">{c.name}</div>
                              <div className="text-[10px] text-white/40 uppercase tracking-widest">{c.title || "Creator"}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.news.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-2">
                        <Receipt className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Intelligence Reports</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {results.news.map(a => (
                          <button
                            key={a.slug}
                            onClick={() => { onSelectArticle(a); onClose(); }}
                            className="group flex items-center gap-4 p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all text-left"
                          >
                            <div className="flex-1">
                              <div className="text-sm font-bold text-white tracking-tight group-hover:text-primary transition-colors">{a.title}</div>
                              <div className="text-[10px] text-white/30 line-clamp-1">{a.excerpt}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.faqs.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-2">
                        <HelpCircle className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Knowledge Base / FAQ</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {results.faqs.map(f => (
                          <button
                            key={f.q}
                            onClick={() => { onSelectFaq(f.q); onClose(); }}
                            className="group flex flex-col gap-1 p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all text-left"
                          >
                            <div className="text-sm font-bold text-white tracking-tight">{f.q}</div>
                            <div className="text-[10px] text-white/30 line-clamp-1 italic">{f.a}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
               <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 grayscale opacity-50">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[9px] font-black text-white">ESC</kbd>
                    <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Close</span>
                  </div>
                  <div className="flex items-center gap-1.5 grayscale opacity-50">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[9px] font-black text-white">⏎</kbd>
                    <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Select</span>
                  </div>
               </div>
               <div className="text-[9px] font-black uppercase text-white/20 tracking-widest flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                 Neural Indexer v2.0
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
