"use client";

import { useState, useEffect } from "react";
import { getNewsAction, saveNewsAction } from "@/app/admin/actions";
import { Article } from "@/lib/news";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Search, Loader2, Trash2, Newspaper, Calendar, User, ArrowRight } from "lucide-react";
import { AdminConfirm } from "./ui/AdminConfirm";
import { useAdminToast } from "./ui/AdminToast";

export function NewsEditor({ 
  editingArticle, 
  setEditingArticle 
}: { 
  editingArticle: Article | null;
  setEditingArticle: (a: Article | null) => void;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(null);
  const { showToast } = useAdminToast();

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh articles when modal closes (to show new data)
  useEffect(() => {
    if (!editingArticle) {
      fetchData();
    }
  }, [editingArticle]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getNewsAction();
      setArticles(data || []);
    } catch (err) {
      console.error(err);
      showToast("Intel archive access failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (slug: string) => {
    setConfirmDeleteSlug(slug);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteSlug) return;
    const newArticles = articles.filter((a) => a.slug !== confirmDeleteSlug);
    setSaving(true);
    try {
      await saveNewsAction(newArticles);
      setArticles(newArticles);
      showToast("Intel entry purged.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to purge intel entry.", "error");
    } finally {
      setSaving(false);
      setConfirmDeleteSlug(null);
    }
  };

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-8 bg-white/[0.01]">
      <div className="absolute inset-0 bg-dot-grid opacity-5 pointer-events-none" />
      
      {/* ── Header Actions ── */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div className="relative group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search intel archives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/40 text-white placeholder-white/20 transition-all backdrop-blur-md"
          />
        </div>
      </div>

      {/* ── Articles List ── */}
      <div className="flex-1 relative z-10 overflow-hidden flex flex-col">
        {loading && articles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
            <Loader2 className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-[10px] uppercase tracking-[0.3em] font-black">Decrypting Archives</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12 overflow-y-auto pr-2 scrollbar-thin">
            {filteredArticles.map((article) => (
              <motion.div
                key={article.slug}
                layout
                className="group relative glass-card p-6 gradient-border-primary hover:shadow-neon-primary/10 transition-all duration-300"
              >
                <div className="flex gap-6">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0 group-hover:border-primary/40 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image || 'https://via.placeholder.com/300x200'}
                      alt={article.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md text-[8px] font-black uppercase tracking-widest text-primary">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[8px] font-bold text-foreground-muted uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-foreground-muted leading-relaxed line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                          <User className="w-3 h-3 text-white/40" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                          {article.author || "Agency Terminal"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingArticle(article)}
                          className="p-2.5 bg-white/5 hover:bg-primary text-white rounded-xl border border-white/10 hover:border-primary/50 transition-all shadow-xl"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.slug)}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500 text-white rounded-xl border border-white/10 hover:border-red-500/50 transition-all shadow-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredArticles.length === 0 && !loading && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                <Newspaper className="w-12 h-12 text-white/10 mb-4" />
                <h4 className="text-white/40 font-black uppercase tracking-widest text-sm">No match for "{search}"</h4>
                <p className="text-white/20 text-xs mt-1">Refine your inquiry or deploy new intel.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <AdminConfirm
        isOpen={!!confirmDeleteSlug}
        onClose={() => setConfirmDeleteSlug(null)}
        onConfirm={confirmDelete}
        title="Purge Intel Entry"
        message="This action will permanently redact this intelligence report from the agency archives. This cannot be undone. Proceed?"
        confirmLabel="Confirm Purge"
        loading={saving}
      />
    </div>
  );
}
