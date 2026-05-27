import { SiteSettings } from "@/lib/creators-db";
import { FormSection, FormField, FormInput } from "../ui/AdminForm";
import { Monitor, Layout } from "lucide-react";

export function LiveHudSettings({ settings, setSettings }: { settings: SiteSettings; setSettings: (s: SiteSettings) => void }) {
  const updateLive = (updates: Partial<SiteSettings["liveSection"]>) => {
    setSettings({
      ...settings,
      liveSection: { ...settings.liveSection, ...updates },
    });
  };

  return (
    <div className="space-y-12">
      <FormSection title="Live HUD Interface" icon={Layout}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField label="Active Status Tag">
            <FormInput
              value={settings.liveSection.tag}
              onChange={(e) => updateLive({ tag: e.target.value })}
              className="text-red-500 font-black animate-pulse-soft"
            />
          </FormField>
          <FormField label="Section Intel Title">
            <FormInput
              value={settings.liveSection.title}
              onChange={(e) => updateLive({ title: e.target.value })}
              className="font-bold text-white uppercase"
            />
          </FormField>
        </div>
        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
           <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest leading-relaxed">
             Note: This section dynamically hooks into the database to display creators with active 'liveUrl' properties. The settings above only control the static headers for this module.
           </p>
        </div>
      </FormSection>
    </div>
  );
}
