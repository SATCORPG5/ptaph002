"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/layout/Section";
import Link from "next/link";
import { X, Globe, Video, Gamepad2, Music, Youtube, Instagram, Facebook, Disc as DiscordIcon, Laptop, Twitch, Share2 } from "lucide-react";

// Platform options with icons
const PLATFORMS = [
  { id: "youtube", name: "YouTube", icon: <Youtube className="w-4 h-4" /> },
  { id: "discord", name: "Discord", icon: <DiscordIcon className="w-4 h-4" /> },
  { id: "twitch", name: "Twitch", icon: <Twitch className="w-4 h-4" /> },
  { id: "kick", name: "Kick", icon: <Laptop className="w-4 h-4" /> },
  { id: "instagram", name: "Instagram", icon: <Instagram className="w-4 h-4" /> },
  { id: "facebook", name: "Facebook", icon: <Facebook className="w-4 h-4" /> },
  { id: "spotify", name: "Spotify", icon: <Music className="w-4 h-4" /> },
  { id: "x", name: "X (Twitter)", icon: <Share2 className="w-4 h-4" /> },
  { id: "playstation", name: "PlayStation", icon: <Gamepad2 className="w-4 h-4" /> },
  { id: "steam", name: "Steam", icon: <Gamepad2 className="w-4 h-4" /> },
  { id: "xbox", name: "Xbox", icon: <Gamepad2 className="w-4 h-4" /> },
  { id: "epicgames", name: "Epic Games", icon: <Gamepad2 className="w-4 h-4" /> },
  { id: "weblink", name: "Web Link (custom)", icon: <Globe className="w-4 h-4" /> },
];

const CATEGORIES = [
  "Gaming",
  "Just Chatting / IRL",
  "Music / Singing",
  "Comedy / Skits",
  "Art / Drawing",
  "Dance",
  "ASMR",
  "Beauty / Fashion",
  "Fitness",
  "Cooking / Food",
  "Battles"
];

const AFFILIATIONS = ["Staff", "Recruiter", "Creator"];

function CreatorCardForm() {
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    tiktokHandle: "",
    tiktokLiveLink: "",
    categories: [] as string[],
    affiliation: "",
    selectedPlatforms: [] as string[],
    socialDetails: {} as Record<string, { username: string; link: string; label?: string }>,
    mediaLinks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name: string, value: string | string[] | Record<string, any>) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(category);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter(c => c !== category) };
      } else if (prev.categories.length < 3) {
        return { ...prev, categories: [...prev.categories, category] };
      }
      return prev;
    });
  };

  const togglePlatform = (platformId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedPlatforms.includes(platformId);
      if (isSelected) {
        const newSocialDetails = { ...prev.socialDetails };
        delete newSocialDetails[platformId];
        return { 
          ...prev, 
          selectedPlatforms: prev.selectedPlatforms.filter(p => p !== platformId),
          socialDetails: newSocialDetails
        };
      } else {
        return { 
          ...prev, 
          selectedPlatforms: [...prev.selectedPlatforms, platformId],
          socialDetails: { 
            ...prev.socialDetails, 
            [platformId]: { username: "", link: "", label: platformId === "weblink" ? "" : undefined } 
          }
        };
      }
    });
  };

  const handleSocialDetailChange = (platformId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialDetails: {
        ...prev.socialDetails,
        [platformId]: { ...prev.socialDetails[platformId], [field]: value }
      }
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.displayName.trim()) newErrors.displayName = "Required";
    if (!formData.bio.trim()) newErrors.bio = "Required";
    if (!formData.tiktokHandle.trim()) newErrors.tiktokHandle = "Required";
    if (!formData.tiktokLiveLink.trim()) newErrors.tiktokLiveLink = "Required";
    if (formData.categories.length === 0) newErrors.categories = "Select at least one category";
    if (!formData.affiliation) newErrors.affiliation = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/cardform/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6 border-t border-border mt-[68px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card max-w-lg w-full p-12 text-center rounded-[40px] border-primary/20"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Stay Hydrated! 🚀</h1>
          <p className="text-foreground-muted mb-4 font-black text-primary uppercase tracking-[0.3em]">
            STAY HYDRATED! 🚀
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            Your creator card will be processed soon. Please stay on this page or check Discord for updates.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-24 overflow-hidden relative border-t border-border mt-[68px]">
      <div className="fixed inset-0 bg-dot-grid opacity-20 pointer-events-none mix-blend-screen" />
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/90 to-background pointer-events-none" />

      <Section className="relative z-10">
        <div className="max-w-3xl mx-auto auto-rows-max glass-card p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl">
          
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 uppercase">
              Creator <span className="text-gradient-primary">Card Form</span>
            </h1>
            <p className="text-foreground-muted leading-relaxed">
              Submit your info to get your official Peace Time Agency Creator Card! This helps us showcase you in our network, connect you with collabs, and support your growth on TikTok LIVE and beyond.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground-muted space-y-1">
              <p>• Use accurate details so your card looks pro.</p>
              <p>• For photos/GIFs: Provide shareable Google Drive links (set to &quot;Anyone with the link can view&quot;).</p>
              <p>• For videos: DM links directly to @baked.lays or @brandonnotstew on Discord.</p>
              <p className="pt-2">If you run into any issues, contact @iiiiianuiiiii, @brandonnotstew, or @baked.lays on Discord for help.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Section 1: Basic Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Basic Info</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white tracking-wide flex justify-between">
                    Display Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                    placeholder="Your nickname or preferred public name"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                  />
                  {errors.displayName && <p className="text-xs text-primary font-bold">{errors.displayName}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-white tracking-wide">
                    About / Bio <span className="text-primary">*</span>
                  </label>
                  <textarea
                    className="w-full min-h-[120px] bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                    placeholder="Tell us about yourself! Vibe, style, fun facts..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                  />
                  {errors.bio && <p className="text-xs text-primary font-bold">{errors.bio}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white tracking-wide">
                      TikTok Username <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-bold">@</span>
                      <input
                        type="text"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 pl-8 text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                        placeholder="yourusername"
                        value={formData.tiktokHandle}
                        onChange={(e) => handleInputChange("tiktokHandle", e.target.value)}
                      />
                    </div>
                    {errors.tiktokHandle && <p className="text-xs text-primary font-bold">{errors.tiktokHandle}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white tracking-wide">
                      TikTok Live Web Link <span className="text-primary">*</span>
                    </label>
                    <input
                      type="url"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                      placeholder="Full TikTok LIVE URL"
                      value={formData.tiktokLiveLink}
                      onChange={(e) => handleInputChange("tiktokLiveLink", e.target.value)}
                    />
                    {errors.tiktokLiveLink && <p className="text-xs text-primary font-bold">{errors.tiktokLiveLink}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Creator Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Creator Details</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-white tracking-wide">
                    Creator Category (Select up to 3) <span className="text-primary">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                          formData.categories.includes(cat)
                            ? "bg-primary border-primary text-white shadow-neon-primary"
                            : "bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:bg-white/10"
                        }`}
                        disabled={!formData.categories.includes(cat) && formData.categories.length >= 3}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  {errors.categories && <p className="text-xs text-primary font-bold">{errors.categories}</p>}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-white tracking-wide">
                    Affiliation <span className="text-primary">*</span>
                  </label>
                  <div className="flex gap-3">
                    {AFFILIATIONS.map(aff => (
                      <button
                        key={aff}
                        type="button"
                        onClick={() => handleInputChange("affiliation", aff)}
                        className={`flex-1 p-4 rounded-xl border text-sm font-bold transition-all ${
                          formData.affiliation === aff
                            ? "bg-primary border-primary text-white shadow-neon-primary"
                            : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                        }`}
                      >
                        {aff}
                      </button>
                    ))}
                  </div>
                  {errors.affiliation && <p className="text-xs text-primary font-bold">{errors.affiliation}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Social Links */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Social Links</h2>
              </div>

              <p className="text-xs text-foreground-muted mb-4">Select all platforms you want shown on your creator card.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-[10px] font-bold transition-all ${
                      formData.selectedPlatforms.includes(p.id)
                        ? "bg-white/15 border-white/30 text-white"
                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                    }`}
                  >
                    {p.icon}
                    <span className="truncate">{p.name}</span>
                    {formData.selectedPlatforms.includes(p.id) && <X className="w-3 h-3 ml-auto text-primary" />}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {formData.selectedPlatforms.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 space-y-6 p-6 rounded-2xl bg-white/[0.02] border border-white/10"
                  >
                    <h3 className="text-sm font-black text-white uppercase tracking-widest text-primary/80">Platform Details</h3>
                    {formData.selectedPlatforms.map(platformId => {
                      const platform = PLATFORMS.find(p => p.id === platformId);
                      return (
                        <div key={platformId} className="space-y-4 pt-4 first:pt-0 border-t border-white/5 first:border-0">
                          <div className="flex items-center gap-2 text-white mb-2">
                            {platform?.icon}
                            <span className="text-sm font-bold uppercase">{platform?.name}</span>
                          </div>
                          
                          <div className={`grid grid-cols-1 ${["playstation", "steam", "xbox", "epicgames", "spotify"].includes(platformId) ? "md:grid-cols-1" : "md:grid-cols-2"} gap-4`}>
                            {platformId === "weblink" ? (
                              <>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-white/50 uppercase">Link Label <span className="text-primary">*</span></label>
                                  <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary/30"
                                    placeholder="e.g. My Portfolio"
                                    value={formData.socialDetails[platformId]?.label || ""}
                                    onChange={(e) => handleSocialDetailChange(platformId, "label", e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-white/50 uppercase">Actual URL <span className="text-primary">*</span></label>
                                  <input
                                    type="url"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary/30"
                                    placeholder="https://..."
                                    value={formData.socialDetails[platformId]?.link || ""}
                                    onChange={(e) => handleSocialDetailChange(platformId, "link", e.target.value)}
                                    required
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-white/50 uppercase">Username / Handle <span className="text-primary">*</span></label>
                                  <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary/30"
                                    placeholder="Username"
                                    value={formData.socialDetails[platformId]?.username || ""}
                                    onChange={(e) => handleSocialDetailChange(platformId, "username", e.target.value)}
                                    required
                                  />
                                </div>
                                {!["playstation", "steam", "xbox", "epicgames", "spotify"].includes(platformId) && (
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-white/50 uppercase">Profile Link (Optional)</label>
                                    <input
                                      type="url"
                                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary/30"
                                      placeholder="https://..."
                                      value={formData.socialDetails[platformId]?.link || ""}
                                      onChange={(e) => handleSocialDetailChange(platformId, "link", e.target.value)}
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section 4: Media Uploads */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Media & Final</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white tracking-wide">
                    Photos / GIFs (Google Drive Links)
                  </label>
                  <textarea
                    className="w-full min-h-[100px] bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                    placeholder="List multiple links separated by commas or new lines..."
                    value={formData.mediaLinks}
                    onChange={(e) => handleInputChange("mediaLinks", e.target.value)}
                  />
                  <p className="text-[10px] text-white/30 italic">Set links to &quot;Anyone with the link can view&quot;.</p>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex gap-3 items-start">
                    <Video className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm font-bold text-white">Videos for Your Card</p>
                      <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                        If you have videos/clips/reels you want featured, please send Google Drive links directly via DM to @baked.lays or @brandonnotstew on Discord (do NOT upload here).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-8">
              <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
                <p className="text-center text-[10px] text-white/40 leading-relaxed max-w-lg mx-auto italic">
                  Privacy Disclaimer: Your submitted information may be displayed publicly on your Peace Time Agency Creator Card and used internally for network/promotion purposes. We respect your privacy and won&apos;t sell or misuse your data.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl transition-all uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? "Processing..." : "Submit Creator Card Info"}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>
            </div>

          </form>
        </div>
      </Section>
    </main>
  );
}

export default function CardFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center text-primary font-black uppercase tracking-widest text-sm mt-[68px]">Loading Form...</div>}>
      <CreatorCardForm />
    </Suspense>
  );
}
