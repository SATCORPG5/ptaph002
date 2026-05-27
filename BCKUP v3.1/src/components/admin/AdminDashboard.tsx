"use client";

import { useState, useEffect } from "react";
import { getCreatorsAction, saveCreatorsAction, logout, saveNewsAction } from "@/app/admin/actions";
import { Creator } from "@/lib/creators";
import { Article } from "@/lib/news";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, LogOut, Plus, Search, Loader2, Save, X, Trash2, LayoutDashboard, Settings, UserPlus, RefreshCcw, Newspaper } from "lucide-react";

import { SiteSettingsEditor } from "@/components/admin/SiteSettingsEditor";
import { NewsEditor } from "@/components/admin/NewsEditor";
import { ArticleEditModal } from "@/components/admin/ArticleEditModal";

import { useAdminToast } from "@/components/admin/ui/AdminToast";
import { AdminConfirm } from "@/components/admin/ui/AdminConfirm";
import { GlobalSearch } from "@/components/admin/ui/GlobalSearch";
import { getSiteSettingsAction } from "@/app/admin/actions";
import { SiteSettings } from "@/lib/creators-db";

export default function AdminDashboard() {
  const [activeMainTab, setActiveMainTab] = useState<"creators" | "settings" | "news">("creators");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { showToast } = useAdminToast();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    const handleGlobalK = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleGlobalK);
    return () => window.removeEventListener("keydown", handleGlobalK);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [creatorsData, settingsData] = await Promise.all([
        getCreatorsAction(),
        getSiteSettingsAction()
      ]);
      setCreators(creatorsData);
      setSettings(settingsData);
    } catch (err) {
      console.error(err);
      showToast("Failed to load data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  const handleSaveAll = async (updatedCreators: Creator[]) => {
    setSaving(true);
    try {
      await saveCreatorsAction(updatedCreators);
      setCreators(updatedCreators);
      setEditingCreator(null);
      showToast("Data saved successfully.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save data.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSingle = (creator: Creator) => {
    const existingIndex = creators.findIndex((c) => c.id === creator.id);
    let newCreators = [...creators];
    if (existingIndex >= 0) {
      newCreators[existingIndex] = creator;
    } else {
      newCreators.push(creator);
    }
    handleSaveAll(newCreators);
  };

  const handleSaveNews = async (article: Article) => {
    setSaving(true);
    try {
      const existingIndex = news.findIndex((a) => a.slug === article.slug);
      let newNews = [...news];
      if (existingIndex >= 0) {
        newNews[existingIndex] = article;
      } else {
        newNews.unshift(article);
      }
      await saveNewsAction(newNews);
      setNews(newNews);
      setEditingArticle(null);
      showToast("News article saved.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save article.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (!confirmDeleteId) return;
    const newCreators = creators.filter((c) => c.id !== confirmDeleteId);
    handleSaveAll(newCreators);
    setConfirmDeleteId(null);
  };

  const filteredCreators = creators.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase())
  );

  const isMockMode = creators.length > 0 && !creators[0].id.includes('-');

  return (
    <div className="w-full min-h-[90vh] flex flex-col bg-[#05060F]/80 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
      <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />

      {/* ── Header HUD ── */}
      <div className="relative z-10 px-8 py-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-primary/20 shadow-neon-primary/10">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground-muted">System Online</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Main Navigation Tabs */}
          <div className="flex bg-black/40 rounded-xl p-1 border border-white/5 backdrop-blur-md">
            <button
              onClick={() => setActiveMainTab("creators")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeMainTab === "creators" 
                ? "bg-white/10 text-white shadow-lg" 
                : "text-foreground-muted hover:text-white"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Creators
            </button>
            <button
              onClick={() => setActiveMainTab("news")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeMainTab === "news" 
                ? "bg-white/10 text-white shadow-lg" 
                : "text-foreground-muted hover:text-white"
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              News
            </button>
            <button
              onClick={() => setActiveMainTab("settings")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeMainTab === "settings" 
                ? "bg-white/10 text-white shadow-lg" 
                : "text-foreground-muted hover:text-white"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Site
            </button>
          </div>

          <div className="h-8 w-px bg-white/5 mx-2 hidden md:block" />

          {activeMainTab === "creators" && (
            <button
              onClick={() => setEditingCreator({
                id: `new-${Date.now()}`,
                name: "",
                handle: "@",
                description: "",
                image: "",
                category: [],
                tags: [],
                tier: "new",
                stats: { followers: "0", avgWatchTime: "0", peakCCV: "0", totalLikes: "0" },
                socials: { tiktok: "" }
              })}
              className="group relative h-11 px-6 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center gap-2 overflow-hidden transition-all shadow-neon-primary/20 hover:shadow-neon-primary/40 hover:-translate-y-0.5"
            >
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
               <Plus className="w-4 h-4 text-white relative z-10" />
               <span className="text-white text-xs font-black uppercase tracking-widest relative z-10">Add Creator</span>
            </button>
          )}

          {activeMainTab === "news" && (
            <button
              onClick={() => setEditingArticle({
                slug: `new-intel-${Date.now()}`,
                title: "",
                excerpt: "",
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                category: "Insights",
                image: "",
                author: "Agency Terminal"
              })}
              className="group relative h-11 px-6 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center gap-2 overflow-hidden transition-all shadow-neon-primary/20 hover:shadow-neon-primary/40 hover:-translate-y-0.5"
            >
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
               <Plus className="w-4 h-4 text-white relative z-10" />
               <span className="text-white text-xs font-black uppercase tracking-widest relative z-10">Add Article</span>
            </button>
          )}
          
          <button
            onClick={activeMainTab === "creators" ? fetchData : undefined}
            disabled={loading}
            className={`h-11 w-11 flex items-center justify-center border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-all ${(activeMainTab === "settings" || activeMainTab === "news") && "hidden"}`}
          >
            <RefreshCcw className={`w-4 h-4 text-foreground-muted ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="h-11 w-11 flex items-center justify-center border border-white/10 rounded-xl bg-white/5 hover:bg-primary/20 hover:border-primary/40 transition-all group"
            title="Search Console (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-foreground-muted group-hover:text-primary transition-colors" />
          </button>

          <button
            onClick={handleLogout}
            className="h-11 px-4 flex items-center gap-2 border border-red-500/20 rounded-xl bg-red-500/5 hover:bg-red-500/20 hover:border-red-500/40 transition-all group"
          >
            <LogOut className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
            <span className="text-red-400 text-[10px] font-black uppercase tracking-widest">Exit</span>
          </button>
        </div>
      </div>

      {/* Mock Mode Alert */}
      {isMockMode && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="bg-accent/10 border-b border-accent/20 px-8 py-2.5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              Mock Mode Active <span className="mx-2 text-white/20">|</span> Local Persistence Only
            </p>
          </div>
          <p className="text-[9px] text-accent/60 font-medium">Redis credentials not found in environment.</p>
        </motion.div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeMainTab === "settings" ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 overflow-hidden"
            >
              <SiteSettingsEditor />
            </motion.div>
          ) : activeMainTab === "news" ? (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-hidden"
            >
              <NewsEditor 
                editingArticle={editingArticle} 
                setEditingArticle={setEditingArticle} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="creators"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col p-8 overflow-hidden"
            >
              <div className="mb-8 relative group max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted transition-colors group-focus-within:text-primary" />
                <input
                  type="text"
                  placeholder="Search agency database..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/40 text-white placeholder-white/20 transition-all backdrop-blur-md"
                />
              </div>

              {loading && creators.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-50">
                  <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black">Loading Data</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 overflow-y-auto pr-2 scrollbar-thin">
                  {filteredCreators.map((creator) => (
                    <motion.div
                      key={creator.id}
                      layoutId={`card-${creator.id}`}
                      className="group relative glass-card p-5 gradient-border-primary hover:shadow-neon-primary/20 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex gap-5">
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={creator.image || 'https://via.placeholder.com/150'}
                            alt={creator.name}
                            className="w-20 h-20 rounded-2xl object-cover bg-black border border-white/10 p-1 group-hover:border-primary/40 transition-colors"
                          />
                          <div className="absolute -bottom-2 -right-2 bg-background-surface border border-white/10 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest text-primary shadow-lg">
                            {creator.tier || "Standard"}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="font-black text-lg text-white tracking-tight truncate">{creator.name}</h3>
                          <span className="text-secondary text-xs font-bold tracking-tight">{creator.handle}</span>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                             <div className="px-2 py-0.5 bg-white/5 rounded-full text-[9px] text-foreground-muted font-bold">
                                {creator.stats?.followers || '0'} Subs
                             </div>
                             {creator.liveUrl && (
                               <div className="px-2 py-0.5 bg-primary/10 rounded-full text-[9px] text-primary font-bold animate-pulse-soft">
                                  LIVE
                               </div>
                             )}
                          </div>
                        </div>
                      </div>

                      <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => setEditingCreator(creator)}
                          className="p-2 bg-white/5 hover:bg-primary text-white rounded-xl border border-white/10 hover:border-primary/50 transition-all shadow-xl"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(creator.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 text-white rounded-xl border border-white/10 hover:border-red-500/50 transition-all shadow-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {filteredCreators.length === 0 && !loading && (
                     <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                        <UserPlus className="w-12 h-12 text-white/10 mb-4" />
                        <h4 className="text-white/40 font-black uppercase tracking_widest text-sm">No match for "{search}"</h4>
                        <p className="text-white/20 text-xs mt-1">Refine your inquiry or add a new creator.</p>
                     </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {editingCreator && (
          <CreatorEditModal
            creator={editingCreator}
            onClose={() => setEditingCreator(null)}
            onSave={handleSaveSingle}
            saving={saving}
          />
        )}
        {editingArticle && (
          <ArticleEditModal
            article={editingArticle}
            onClose={() => setEditingArticle(null)}
            onSave={handleSaveNews}
            saving={saving}
          />
        )}
      </AnimatePresence>

      <AdminConfirm
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Creator"
        message="This action will permanently delete this creator. Are you sure?"
        loading={saving}
      />

      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        creators={creators}
        news={news}
        settings={settings}
        onSelectCreator={(c) => {
          setActiveMainTab("creators");
          setEditingCreator(c);
        }}
        onSelectArticle={(a) => {
          setActiveMainTab("news");
          setEditingArticle(a);
        }}
        onSelectFaq={() => {
          setActiveMainTab("settings");
        }}
      />
    </div>
  );
}

function CreatorEditModal({
  creator,
  onClose,
  onSave,
  saving,
}: {
  creator: Creator;
  onClose: () => void;
  onSave: (c: Creator) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<Creator>(creator);

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
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-5xl h-full max-h-[85vh] bg-[#0A0F1A] border border-white/10 rounded-[40px] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-white">
                {creator.name ? `Editing: ${creator.name}` : "Add Creator"}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground-muted">Creator ID: {formData.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors">
            <X className="w-6 h-6 text-white/50" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 relative z-10 scrollbar-thin">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="w-1.5 h-6 bg-primary rounded-full shadow-neon-primary" />
                  <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">Identity Profile</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Creator ID</label>
                    <input
                      required
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all font-mono"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Name</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Social Handle</label>
                      <input
                        required
                        value={formData.handle}
                        onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-secondary focus:outline-none focus:ring-1 focus:ring-secondary/60 transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Biography</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white/80 focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Image URL</label>
                      <input
                        required
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs text-secondary/70 focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all truncate"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Assigned Tier</label>
                      <select
                        value={formData.tier || "new"}
                        onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                        className="w-full bg-[#121826] border border-white/10 rounded-2xl px-5 py-3 text-white font-black uppercase tracking-widest text-xs focus:outline-none focus:ring-1 focus:ring-primary/60 appearance-none cursor-pointer"
                      >
                        <option value="staff">Executive Staff</option>
                        <option value="top">Premier Creator</option>
                        <option value="new">Emerging Talent</option>
                        <option value="recruiter">Strategic Recruiter</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="w-1.5 h-6 bg-secondary rounded-full shadow-neon-secondary" />
                    <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">Analytics & Socials</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(formData.stats || {}).map((key) => (
                      <div key={key} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <input
                          value={(formData.stats as any)?.[key] || ""}
                          onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, [key]: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-1 focus:ring-secondary/60 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4 text-secondary/40" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Network Links</h4>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                    {["tiktok", "twitch", "youtube", "discord", "website", "liveUrl"].map((social) => (
                      <div key={social} className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground-subtle ml-1">{social}</label>
                        <input
                          value={social === 'liveUrl' ? formData.liveUrl || "" : (formData.socials as any)?.[social] || ""}
                          placeholder={`https://${social}.com/...`}
                          onChange={(e) => {
                            if (social === 'liveUrl') {
                              setFormData({...formData, liveUrl: e.target.value});
                            } else {
                              setFormData({
                                ...formData,
                                socials: { ...formData.socials, [social]: e.target.value }
                              });
                            }
                          }}
                          className="w-full bg-white/2 border border-white/5 rounded-xl px-4 py-2 text-xs text-white/60 focus:outline-none focus:ring-1 focus:ring-secondary/40 transition-all font-mono"
                        />
                      </div>
                    ))}
                   </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="relative z-10 p-8 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4 text-foreground-subtle animate-spin-slow opacity-20" />
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-foreground-subtle">Unsaved Changes</span>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-all"
            >
              Close / Revert
            </button>
            <button
              form="edit-form"
              type="submit"
              disabled={saving}
              className="group relative h-12 px-10 bg-gradient-to-r from-secondary to-secondary-dark rounded-2xl flex items-center gap-2 overflow-hidden transition-all shadow-neon-secondary/20 hover:shadow-neon-secondary/40 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white relative z-10" />
                  <span className="text-white text-xs font-black uppercase tracking-widest relative z-10">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-white relative z-10" />
                  <span className="text-white text-xs font-black uppercase tracking-widest relative z-10">Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
