'use client';

import { useState } from 'react';
import { Creator } from '@/lib/creators';
import { Button } from '@/components/ui/Button';
import { updateCreatorAction } from '@/app/actions/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  User,
  Layout,
  Share2,
  Settings,
  Video,
  Music,
  Type,
  Zap,
  Search,
  Link as LinkIcon,
  Plus,
  Trash2,
  Globe,
  Timer,
  BarChart3,
  Eye,
  Edit3,
  Upload,
  Copy,
  Check,
  Radio,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface PortalClientProps {
  initialCreator: Creator;
}

type TabType = 'overview' | 'profile' | 'media' | 'design' | 'advanced';

export function PortalClient({ initialCreator }: PortalClientProps) {
  const [creator, setCreator] = useState<Creator>(initialCreator);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newLink, setNewLink] = useState({ label: '', url: '' });
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const result = await updateCreatorAction(creator);
    if (result.success && result.creator) {
      setCreator(result.creator);
      setMessage({ type: 'success', text: 'Profile synchronized!' });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  }

  const addCustomLink = () => {
    if (!newLink.label || !newLink.url) return;
    const links = creator.customLinks || [];
    setCreator({ ...creator, customLinks: [...links, { ...newLink }] });
    setNewLink({ label: '', url: '' });
  };

  const removeCustomLink = (index: number) => {
    const links = [...(creator.customLinks || [])];
    links.splice(index, 1);
    setCreator({ ...creator, customLinks: links });
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/creators/${creator.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'media', label: 'Media & Links', icon: Share2 },
    { id: 'design', label: 'Design', icon: Layout },
    { id: 'advanced', label: 'Advanced', icon: Settings },
  ];

  // ── Shared input styles ──
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder-foreground-subtle";
  const labelClass = "text-[10px] font-black text-foreground-subtle uppercase tracking-[0.15em]";
  const sectionClass = "bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8 space-y-6";
  const sectionHeaderClass = "flex items-center gap-3 border-b border-white/[0.06] pb-4";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

      {/* ═══════════════════════════════════════════════════
          HERO BANNER
          ═══════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl mb-10 p-8 md:p-10"
        style={{
          background: `linear-gradient(135deg, ${creator.accentColor || creator.customization?.themeColor || '#6C5CE7'}22 0%, #01020A 60%, ${creator.accentColor || creator.customization?.themeColor || '#FF3C5F'}11 100%)`,
        }}
      >
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl flex-shrink-0">
            <Image
              src={creator.image}
              alt={creator.name}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">
              {creator.name}
            </h1>
            <p className="text-foreground-muted font-medium text-sm mb-3">{creator.handle} · {creator.title || 'Creator'}</p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Followers', value: creator.stats.followers },
                { label: 'Avg Watch', value: creator.stats.avgWatchTime },
                { label: 'Peak CCV', value: creator.stats.peakCCV },
                { label: 'Likes', value: creator.stats.totalLikes },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg font-black text-white">{stat.value}</p>
                  <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`text-xs font-bold px-4 py-2 rounded-full border ${
                    message.type === 'success'
                      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                      : 'text-red-400 bg-red-400/10 border-red-400/20'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
            <Button onClick={handleSave} disabled={saving} glow size="lg" className="min-w-[160px]">
              {saving ? 'Syncing...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          TAB NAVIGATION
          ═══════════════════════════════════════════════════ */}
      <div className="mb-10 overflow-x-auto scrollbar-none">
        <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-foreground-subtle hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          TAB CONTENT
          ═══════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="space-y-8 pb-16"
        >

          {/* ─── OVERVIEW TAB ─── */}
          {activeTab === 'overview' && (
            <>
              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Edit Profile', desc: 'Update your identity and bio', icon: Edit3, action: () => setActiveTab('profile'), color: 'from-cyan-500/10 to-cyan-500/5' },
                  { label: 'Upload Media', desc: 'Add embeds and links', icon: Upload, action: () => setActiveTab('media'), color: 'from-purple-500/10 to-purple-500/5' },
                  { label: 'Customize Design', desc: 'Theme and visual effects', icon: Sparkles, action: () => setActiveTab('design'), color: 'from-amber-500/10 to-amber-500/5' },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.label}
                      onClick={card.action}
                      className={`glass-card rounded-2xl p-6 text-left bg-gradient-to-br ${card.color} hover:border-primary/20 transition-all group`}
                    >
                      <Icon className="text-foreground-muted group-hover:text-primary transition-colors mb-3" size={24} />
                      <p className="text-sm font-bold text-white mb-1">{card.label}</p>
                      <p className="text-xs text-foreground-subtle">{card.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Public URL */}
              <div className={sectionClass}>
                <div className={sectionHeaderClass}>
                  <Globe className="text-primary" size={20} />
                  <h2 className="text-lg font-bold text-white">Your Public Page</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground-muted font-mono truncate">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/creators/{creator.id}
                  </div>
                  <Button onClick={copyUrl} variant="secondary" size="sm" className="flex-shrink-0">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                  </Button>
                  <a href={`/creators/${creator.id}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="flex-shrink-0">
                      <ExternalLink size={16} />
                      <span className="ml-2">Preview</span>
                    </Button>
                  </a>
                </div>
              </div>

              {/* Creator Card Preview */}
              <div className={sectionClass}>
                <div className={sectionHeaderClass}>
                  <Eye className="text-primary" size={20} />
                  <h2 className="text-lg font-bold text-white">Card Preview</h2>
                </div>
                <div className="flex justify-center py-6">
                  <div className="relative w-80 h-96 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-30" />
                    <div className="p-6 flex flex-col items-center h-full relative z-10">
                      <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-white/30">
                        <Image src={creator.image} alt={creator.name} fill className="object-cover" />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-1">{creator.name}</h2>
                      <p className="text-sm text-white/70 mb-1">{creator.handle}</p>
                      {creator.title && <p className="text-xs text-white/50 mb-3">{creator.title}</p>}
                      <div className="flex flex-wrap gap-1 justify-center mb-3">
                        {creator.category.slice(0, 3).map((cat) => (
                          <span key={cat} className="px-2 py-0.5 bg-white/10 text-xs rounded-full text-white">{cat}</span>
                        ))}
                      </div>
                      <p className="text-xs text-white/60 text-center mt-auto mb-4 line-clamp-3">{creator.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Overview */}
              <div className={sectionClass}>
                <div className={sectionHeaderClass}>
                  <Share2 className="text-primary" size={20} />
                  <h2 className="text-lg font-bold text-white">Connected Platforms</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(creator.socials).filter(([, v]) => v).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/[0.08] transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ExternalLink size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white capitalize">{platform}</p>
                        <p className="text-[10px] text-foreground-subtle">Connected</p>
                      </div>
                    </a>
                  ))}
                  {Object.entries(creator.socials).filter(([, v]) => v).length === 0 && (
                    <p className="col-span-full text-sm text-foreground-subtle italic">No platforms connected yet.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ─── PROFILE TAB ─── */}
          {activeTab === 'profile' && (
            <>
              <section className={sectionClass}>
                <div className={sectionHeaderClass}>
                  <User className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-white tracking-tight">Identity Profile</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={labelClass}>Display Name</label>
                    <input
                      type="text"
                      value={creator.name}
                      onChange={(e) => setCreator({ ...creator, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Professional Title</label>
                    <input
                      type="text"
                      value={creator.title || ''}
                      onChange={(e) => setCreator({ ...creator, title: e.target.value })}
                      placeholder="e.g. Variety Streamer"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Bio</label>
                    <span className="text-[10px] text-foreground-subtle font-mono">{creator.description.length} chars</span>
                  </div>
                  <textarea
                    value={creator.description}
                    onChange={(e) => setCreator({ ...creator, description: e.target.value })}
                    rows={5}
                    className={`${inputClass} resize-none leading-relaxed`}
                  />
                </div>
              </section>

              <section className={sectionClass}>
                <div className={sectionHeaderClass}>
                  <Share2 className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-white tracking-tight">Social Grid</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'TikTok URL', key: 'tiktok' },
                    { label: 'Instagram URL', key: 'instagram' },
                    { label: 'YouTube URL', key: 'youtube' },
                    { label: 'Twitch URL', key: 'twitch' },
                    { label: 'Discord Handle', key: 'discord' },
                    { label: 'X (Twitter) URL', key: 'x' },
                  ].map((social) => (
                    <div key={social.key} className="space-y-2">
                      <label className={labelClass}>{social.label}</label>
                      <input
                        type="text"
                        value={(creator.socials as any)[social.key] || ''}
                        onChange={(e) => setCreator({
                          ...creator,
                          socials: { ...creator.socials, [social.key]: e.target.value }
                        })}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ─── MEDIA & LINKS TAB ─── */}
          {activeTab === 'media' && (
            <>
              <section className={sectionClass}>
                <div className={sectionHeaderClass}>
                  <Video className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-white tracking-tight">Media Embeds</h2>
                </div>
                <p className="text-sm text-foreground-subtle italic">Native players for fans to consume content without leaving your card.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={`flex items-center gap-2 ${labelClass}`}>
                      <Video size={12} /> YouTube Video URL
                    </label>
                    <input
                      type="text"
                      value={creator.embeds?.youtube || ''}
                      onChange={(e) => setCreator({
                        ...creator,
                        embeds: { ...creator.embeds, youtube: e.target.value }
                      })}
                      placeholder="https://youtube.com/watch?v=..."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-2 ${labelClass}`}>
                      <Music size={12} /> Spotify Playlist/Track URL
                    </label>
                    <input
                      type="text"
                      value={creator.embeds?.spotify || ''}
                      onChange={(e) => setCreator({
                        ...creator,
                        embeds: { ...creator.embeds, spotify: e.target.value }
                      })}
                      placeholder="https://open.spotify.com/..."
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              <section className={sectionClass}>
                <div className={sectionHeaderClass}>
                  <LinkIcon className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-white tracking-tight">Custom Links</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    value={newLink.label}
                    onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                    placeholder="Link Label (e.g. My Merch Store)"
                    className={`flex-[2] ${inputClass}`}
                  />
                  <input
                    type="text"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://..."
                    className={`flex-[3] ${inputClass}`}
                  />
                  <Button onClick={addCustomLink} variant="secondary" className="px-8 font-black flex-shrink-0">
                    <Plus className="mr-2" size={18} /> Add Link
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(creator.customLinks || []).map((link, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-primary/30 transition-all">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{link.label}</p>
                        <p className="text-xs text-foreground-subtle truncate">{link.url}</p>
                      </div>
                      <button
                        onClick={() => removeCustomLink(i)}
                        className="text-red-400/40 hover:text-red-400 transition-colors p-2 flex-shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ─── DESIGN TAB ─── */}
          {activeTab === 'design' && (
            <>
              <section className={sectionClass}>
                <div className={sectionHeaderClass}>
                  <Type className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-white tracking-tight">Visual Customization</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className={labelClass}>Accent Theme Color</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={creator.customization?.themeColor || '#6C5CE7'}
                        onChange={(e) => setCreator({
                          ...creator,
                          customization: { ...creator.customization, themeColor: e.target.value }
                        })}
                        className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer overflow-hidden p-0"
                      />
                      <input
                        type="text"
                        value={creator.customization?.themeColor || '#6C5CE7'}
                        onChange={(e) => setCreator({
                          ...creator,
                          customization: { ...creator.customization, themeColor: e.target.value }
                        })}
                        className={`flex-grow ${inputClass} font-mono uppercase`}
                      />
                    </div>
                    {/* Preset Swatches */}
                    <div className="flex gap-2 flex-wrap">
                      {['#6C5CE7', '#FF3C5F', '#00D2D3', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#3B82F6'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setCreator({
                            ...creator,
                            customization: { ...creator.customization, themeColor: color }
                          })}
                          className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                            creator.customization?.themeColor === color ? 'border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className={labelClass}>Global Typography</label>
                    <select
                      value={creator.customization?.fontFamily || 'Inter'}
                      onChange={(e) => setCreator({
                        ...creator,
                        customization: { ...creator.customization, fontFamily: e.target.value }
                      })}
                      className={inputClass}
                    >
                      <option value="Inter">Standard Inter</option>
                      <option value="Outfit">Modern Outfit</option>
                      <option value="Space Grotesk">Technical Space Grotesk</option>
                      <option value="Syncopate">Cyber Syncopate</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className={labelClass}>Dynamic Environment Effects</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['none', 'stars', 'bubbles', 'waves'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setCreator({
                          ...creator,
                          customization: { ...creator.customization, bgAnimation: type as any }
                        })}
                        className={`px-4 py-4 rounded-2xl border font-black uppercase text-[10px] tracking-widest transition-all ${
                          creator.customization?.bgAnimation === type
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-white/5 border-white/10 text-foreground-subtle hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className={sectionClass}>
                <div className={sectionHeaderClass}>
                  <Layout className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-white tracking-tight">Background Atmosphere</h2>
                </div>
                <div className="space-y-4">
                  <label className={labelClass}>Background Image/GIF URL</label>
                  <input
                    type="text"
                    value={creator.backgroundUrl || ''}
                    onChange={(e) => setCreator({ ...creator, backgroundUrl: e.target.value })}
                    placeholder="https://... (Direct image/gif link)"
                    className={inputClass}
                  />

                  <div className="space-y-4 mt-6">
                    <div className="flex justify-between items-center">
                      <label className={labelClass}>Master Contrast ({creator.backgroundContrast ?? 100}%)</label>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={creator.backgroundContrast ?? 100}
                      onChange={(e) => setCreator({ ...creator, backgroundContrast: parseInt(e.target.value) })}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ─── ADVANCED TAB ─── */}
          {activeTab === 'advanced' && (
            <>

              <section className={sectionClass}>
                <div className={sectionHeaderClass}>
                  <Search className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-white tracking-tight">SEO Engine</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>Meta Title</label>
                      <span className="text-[10px] text-foreground-subtle font-mono">{(creator.seo?.metaTitle || '').length}/60</span>
                    </div>
                    <input
                      type="text"
                      value={creator.seo?.metaTitle || ''}
                      onChange={(e) => setCreator({
                        ...creator,
                        seo: { ...creator.seo, metaTitle: e.target.value }
                      })}
                      placeholder={`${creator.name} | Peace Time Network`}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>Meta Description</label>
                      <span className="text-[10px] text-foreground-subtle font-mono">{(creator.seo?.metaDescription || '').length}/160</span>
                    </div>
                    <input
                      type="text"
                      value={creator.seo?.metaDescription || ''}
                      onChange={(e) => setCreator({
                        ...creator,
                        seo: { ...creator.seo, metaDescription: e.target.value }
                      })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* SEO Preview Snippet */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.2em] mb-3">Search Preview</p>
                  <p className="text-blue-400 text-sm font-bold mb-1">{creator.seo?.metaTitle || `${creator.name} | Peace Time Network`}</p>
                  <p className="text-emerald-400 text-xs mb-1">peacetimeagency.com/creators/{creator.id}</p>
                  <p className="text-xs text-foreground-muted line-clamp-2">{creator.seo?.metaDescription || creator.description}</p>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className={sectionClass}>
                  <div className={sectionHeaderClass}>
                    <Timer className="text-primary" size={24} />
                    <h2 className="text-xl font-bold text-white tracking-tight">Countdown Timer</h2>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={creator.countdown?.label || ''}
                      onChange={(e) => setCreator({
                        ...creator,
                        countdown: { ...creator.countdown, label: e.target.value }
                      })}
                      placeholder="Event Label (e.g. Next Big Drop)"
                      className={inputClass}
                    />
                    <input
                      type="datetime-local"
                      value={creator.countdown?.targetDate || ''}
                      onChange={(e) => setCreator({
                        ...creator,
                        countdown: { ...creator.countdown, targetDate: e.target.value }
                      })}
                      className={`${inputClass} color-scheme-dark`}
                    />
                  </div>
                </section>

                <section className={sectionClass}>
                  <div className={sectionHeaderClass}>
                    <BarChart3 className="text-primary" size={24} />
                    <h2 className="text-xl font-bold text-white tracking-tight">A/B Testing</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div>
                        <p className="text-sm font-bold text-white">A/B Traffic Testing</p>
                        <p className="text-xs text-foreground-subtle">Test alternate versions of bio and image</p>
                      </div>
                      <button
                        onClick={() => setCreator({
                          ...creator,
                          abTest: { ...creator.abTest, enabled: !creator.abTest?.enabled }
                        })}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          creator.abTest?.enabled ? 'bg-primary' : 'bg-white/10'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                          creator.abTest?.enabled ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    {creator.abTest?.enabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <label className={labelClass}>Variant B Bio</label>
                          <textarea
                            value={creator.abTest?.altBio || ''}
                            onChange={(e) => setCreator({
                              ...creator,
                              abTest: { ...creator.abTest, altBio: e.target.value }
                            })}
                            placeholder="A different version of your bio..."
                            className={`${inputClass} min-h-[100px] resize-none`}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>Variant B Image URL</label>
                          <input
                            type="text"
                            value={creator.abTest?.altImage || ''}
                            onChange={(e) => setCreator({
                              ...creator,
                              abTest: { ...creator.abTest, altImage: e.target.value }
                            })}
                            placeholder="https://example.com/other-image.jpg"
                            className={inputClass}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
