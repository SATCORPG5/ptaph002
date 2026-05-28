'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Creator } from '@/lib/creators';
import { updateCreatorAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { PortalCard, SectionHeader } from '@/components/portal/ui';

interface ProfilePortalClientProps {
  creator: Creator;
}

const TABS = ['Card Cover', 'Creator Card', 'Settings'];

const BLUR_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export function ProfilePortalClient({ creator: initialCreator }: ProfilePortalClientProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [creator, setCreator]     = useState(initialCreator);
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const inputClass = "w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/20 outline-none focus:border-portal-accent/40 transition-all";
  const labelClass = "text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] block mb-2";

  async function handleSave() {
    setSaving(true);
    const result = await updateCreatorAction(creator);
    if (result.success) {
      setMessage({ type: 'success', text: 'Profile saved!' });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: result.error || 'Save failed' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <SectionHeader
          eyebrow="identity"
          heading="My Profile & Cards"
          description="Customize how you appear on the agency site"
        />
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className={`text-xs font-bold px-4 py-2 rounded-full border ${message.type === 'success' ? 'text-portal-accent bg-portal-accent/10 border-portal-accent/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-portal-accent/10 border border-portal-accent/20 text-portal-accent text-sm font-black hover:bg-portal-accent/20 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-foreground/[0.03] border border-foreground/[0.06] rounded-2xl p-1.5 mb-8 max-w-sm">
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex-1 transition-all ${
              activeTab === i ? 'bg-portal-accent/15 text-portal-accent border border-portal-accent/20' : 'text-foreground/30 hover:text-foreground/60'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ─── CARD COVER TAB ─── */}
      {activeTab === 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PortalCard className="p-6 space-y-5">
              <div>
                <h3 className="text-sm font-black text-foreground/60 uppercase tracking-widest mb-1">Card Cover</h3>
                <p className="text-xs text-foreground/30">This appears on the /creators listing page.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Display Name</label>
                  <input value={creator.name} onChange={e => setCreator({ ...creator, name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Short Bio (cover)</label>
                  <input value={creator.description?.slice(0, 80) || ''} onChange={e => setCreator({ ...creator, description: e.target.value })} placeholder="Brief tagline for your cover card" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={creator.customization?.themeColor || '#14B8A6'}
                      onChange={e => setCreator({ ...creator, customization: { ...creator.customization, themeColor: e.target.value } })}
                      className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer p-0" />
                    <input type="text" value={creator.customization?.themeColor || '#14B8A6'}
                      onChange={e => setCreator({ ...creator, customization: { ...creator.customization, themeColor: e.target.value } })}
                      className={`flex-1 ${inputClass} font-mono uppercase text-xs`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Font Style</label>
                  <select value={creator.customization?.fontFamily || 'Inter'}
                    onChange={e => setCreator({ ...creator, customization: { ...creator.customization, fontFamily: e.target.value } })}
                    className="w-full bg-[#0F1623] border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none [color-scheme:dark]">
                    <option>Inter</option><option>Outfit</option><option>Space Grotesk</option><option>Syncopate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Top Profile Image URL</label>
                <input value={creator.image || ''} onChange={e => setCreator({ ...creator, image: e.target.value })} placeholder="https://..." className={inputClass} />
              </div>
            </PortalCard>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <p className="text-[9px] font-black text-foreground/30 uppercase tracking-widest mb-3">Preview</p>
              <PortalCard
                className="overflow-hidden aspect-[3/4] flex flex-col"
                style={{ background: `linear-gradient(160deg, ${creator.customization?.themeColor || '#14B8A6'}22 0%, var(--color-background) 100%)` }}
              >
                <div
                  className="h-2 w-full"
                  style={{ background: creator.customization?.themeColor || 'var(--color-portal-accent)' }}
                />
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <div
                    className="relative w-20 h-20 rounded-full bg-foreground/10 border-2 mb-4 overflow-hidden"
                    style={{ borderColor: creator.customization?.themeColor || 'var(--color-portal-accent)' }}
                  >
                    {creator.image ? (
                      <Image
                        src={creator.image}
                        alt={creator.name}
                        fill
                        className="object-cover"
                        unoptimized
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                      />
                    ) : null}
                  </div>
                  <p className="text-lg font-black text-foreground text-center">{creator.name || 'Creator Name'}</p>
                  <p className="text-xs text-foreground/40 mt-1">{creator.handle}</p>
                  {creator.description && (
                    <p className="text-[10px] text-foreground/30 text-center mt-3 line-clamp-2 px-2">{creator.description}</p>
                  )}
                </div>
              </PortalCard>
              <p className="text-[9px] text-foreground/20 text-center mt-2">On-demand preview. Save to update.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── CREATOR CARD TAB ─── */}
      {activeTab === 1 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
          <PortalCard className="p-6 space-y-5">
            <div>
              <h3 className="text-sm font-black text-foreground/60 uppercase tracking-widest mb-1">Full Creator Card</h3>
              <p className="text-xs text-foreground/30">This appears on your /creators/[handle] full profile page.</p>
            </div>
            <div>
              <label className={labelClass}>Full Bio</label>
              <textarea value={creator.description || ''} rows={5}
                onChange={e => setCreator({ ...creator, description: e.target.value })}
                className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>TikTok URL</label>
                <input value={creator.socials?.tiktok || ''} onChange={e => setCreator({ ...creator, socials: { ...creator.socials, tiktok: e.target.value } })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Instagram URL</label>
                <input value={creator.socials?.instagram || ''} onChange={e => setCreator({ ...creator, socials: { ...creator.socials, instagram: e.target.value } })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>YouTube URL</label>
                <input value={creator.socials?.youtube || ''} onChange={e => setCreator({ ...creator, socials: { ...creator.socials, youtube: e.target.value } })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Discord</label>
                <input value={creator.socials?.discord || ''} onChange={e => setCreator({ ...creator, socials: { ...creator.socials, discord: e.target.value } })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Background Image URL</label>
              <input value={creator.backgroundUrl || ''} onChange={e => setCreator({ ...creator, backgroundUrl: e.target.value })} placeholder="https://... (image or gif)" className={inputClass} />
            </div>
          </PortalCard>
        </motion.div>
      )}

      {/* ─── SETTINGS TAB ─── */}
      {activeTab === 2 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-w-2xl">
          <PortalCard className="p-6 space-y-4">
            <h3 className="text-sm font-black text-foreground/60 uppercase tracking-widest">Account Settings</h3>
            <div>
              <label className={labelClass}>Display Name</label>
              <input value={creator.name} onChange={e => setCreator({ ...creator, name: e.target.value })} className={inputClass} />
            </div>
            <div className="p-4 rounded-xl border border-foreground/[0.06] bg-foreground/[0.02]">
              <p className="text-xs font-bold text-foreground/40 mb-1">TikTok Handle</p>
              <p className="text-sm font-bold text-foreground/60">{creator.handle}</p>
              <p className="text-[9px] text-foreground/20 mt-1">Handle cannot be changed. Contact admin if needed.</p>
            </div>
          </PortalCard>
        </motion.div>
      )}
    </div>
  );
}
