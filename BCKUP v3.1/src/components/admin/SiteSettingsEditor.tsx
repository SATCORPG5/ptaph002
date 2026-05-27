"use client";

import { useState, useEffect } from "react";
import { getSiteSettingsAction, saveSiteSettingsAction } from "@/app/admin/actions";
import { SiteSettings } from "@/lib/creators-db";
import { Loader2, Save, Layout, Sliders, MessageSquare, Quote, Info, Briefcase, TrendingUp, Video, HelpCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminToast } from "./ui/AdminToast";

// Section Components
import { HeroSettings } from "./settings/HeroSettings";
import { RosterSettings } from "./settings/RosterSettings";
import { ServicesSettings } from "./settings/ServicesSettings";
import { GrowthSettings } from "./settings/GrowthSettings";
import { TestimonialsSettings } from "./settings/TestimonialsSettings";
import { LiveHudSettings } from "./settings/LiveHudSettings";
import { FaqSettings } from "./settings/FaqSettings";
import { FooterSettings } from "./settings/FooterSettings";
import { ApplySettings } from "./settings/ApplySettings";

export function SiteSettingsEditor() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string>("hero");
  const { showToast } = useAdminToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSiteSettingsAction();
      setSettings(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await saveSiteSettingsAction(settings);
      showToast("Settings saved successfully.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-foreground-muted animate-pulse">Loading Settings</p>
      </div>
    );
  }

  const sections = [
    { id: "hero", label: "Hero", icon: Layout },
    { id: "apply", label: "Apply Form", icon: FileText },
    { id: "roster", label: "Roster", icon: Sliders },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "growth", label: "Growth", icon: TrendingUp },
    { id: "testimonials", label: "Testimonials", icon: Video },
    { id: "livehud", label: "Live HUD", icon: Sliders },
    { id: "faqs", label: "FAQ", icon: HelpCircle },
    { id: "footer", label: "Footer", icon: Layout },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white/[0.01]">
      <div className="absolute inset-0 bg-dot-grid opacity-5 pointer-events-none" />

      {/* ── Sub-Navigation ── */}
      <div className="relative z-10 px-8 py-4 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSegment(sec.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeSegment === sec.id
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-neon-primary/10"
                  : "text-foreground-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <sec.icon className="w-3.5 h-3.5" />
              {sec.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 ml-4">
           <div className="hidden lg:flex items-center gap-2 text-[9px] font-bold text-foreground-subtle tracking-widest uppercase">
              <Info className="w-3 h-3 text-secondary" />
              Status: <span className="text-white/60">Active</span>
           </div>
           <button
             onClick={handleSave}
             disabled={saving}
             className="group relative h-10 px-6 bg-gradient-to-r from-secondary to-secondary-dark rounded-xl flex items-center gap-2 overflow-hidden transition-all shadow-neon-secondary/20 hover:shadow-neon-secondary/40 disabled:opacity-50"
           >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white relative z-10" />
              ) : (
                <Save className="w-3.5 h-3.5 text-white relative z-10" />
              )}
              <span className="text-white text-[10px] font-black uppercase tracking-widest relative z-10">
                {saving ? "Saving..." : "Save Settings"}
              </span>
           </button>
        </div>
      </div>

      {/* ── Scrollable Form Area ── */}
      <div className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-thin">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSegment}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-5xl mx-auto pb-12"
          >
            { activeSegment === "hero" ? (
              <HeroSettings settings={settings} setSettings={setSettings} />
            ) : activeSegment === "apply" ? (
              <ApplySettings settings={settings} setSettings={setSettings} />
            ) : activeSegment === "roster" ? (
              <RosterSettings settings={settings} setSettings={setSettings} />
            ) : activeSegment === "services" ? (
              <ServicesSettings settings={settings} setSettings={setSettings} />
            ) : activeSegment === "growth" ? (
              <GrowthSettings settings={settings} setSettings={setSettings} />
            ) : activeSegment === "testimonials" ? (
              <TestimonialsSettings settings={settings} setSettings={setSettings} />
            ) : activeSegment === "livehud" ? (
              <LiveHudSettings settings={settings} setSettings={setSettings} />
            ) : activeSegment === "faqs" ? (
              <FaqSettings settings={settings} setSettings={setSettings} />
            ) : activeSegment === "footer" ? (
              <FooterSettings settings={settings} setSettings={setSettings} />
            ) : null }
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
