"use client";

import { SiteSettings } from "@/lib/creators-db";
import { FormSection, FormField, FormInput, FormSelect } from "../ui/AdminForm";
import { EditableList } from "../ui/EditableList";
import { Layout, Share2, Eye, EyeOff } from "lucide-react";

export function FooterSettings({ settings, setSettings }: { settings: SiteSettings; setSettings: (s: SiteSettings) => void }) {
  const updateFooter = (updates: Partial<SiteSettings["footer"]>) => {
    setSettings({
      ...settings,
      footer: { ...settings.footer, ...updates },
    });
  };

  const platforms = ['tiktok', 'discord', 'instagram', 'youtube', 'twitch', 'website'];

  return (
    <div className="space-y-12">
      <FormSection title="Terminal Base / Footer" icon={Layout}>
        <FormField label="Official Agency Tagline">
          <FormInput
            value={settings.footer.tagline}
            onChange={(e) => updateFooter({ tagline: e.target.value })}
          />
        </FormField>
      </FormSection>

      <FormSection title="Network Links" icon={Share2}>
        <EditableList
          items={settings.footer.socials}
          addLabel="Add Global Link"
          onAdd={() => updateFooter({ socials: [...settings.footer.socials, { platform: 'tiktok', url: '#', show: true }] })}
          onDelete={(index) => updateFooter({ socials: settings.footer.socials.filter((_, i) => i !== index) })}
          renderItem={(social, index) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <FormField label="Platform">
                <FormSelect
                  value={social.platform}
                  onChange={(e) => {
                    const next = [...settings.footer.socials];
                    next[index].platform = e.target.value as any;
                    updateFooter({ socials: next });
                  }}
                >
                  {platforms.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                </FormSelect>
              </FormField>
              <FormField label="Destination URL">
                <FormInput
                  value={social.url}
                  onChange={(e) => {
                    const next = [...settings.footer.socials];
                    next[index].url = e.target.value;
                    updateFooter({ socials: next });
                  }}
                  className="font-mono text-xs"
                />
              </FormField>
              <div className="flex items-center gap-4 pb-1">
                <button
                  onClick={() => {
                    const next = [...settings.footer.socials];
                    next[index].show = !next[index].show;
                    updateFooter({ socials: next });
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    social.show 
                    ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                    : "bg-white/5 text-white/30 border border-white/5"
                  }`}
                >
                  {social.show ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {social.show ? "Visible" : "Hidden"}
                </button>
              </div>
            </div>
          )}
        />
      </FormSection>
    </div>
  );
}
