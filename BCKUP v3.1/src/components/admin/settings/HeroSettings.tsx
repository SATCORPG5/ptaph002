"use client";

import { SiteSettings } from "@/lib/creators-db";
import { FormSection, FormField, FormInput, FormTextarea } from "../ui/AdminForm";
import { EditableList } from "../ui/EditableList";
import { Layout, Zap } from "lucide-react";

interface HeroSettingsProps {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
}

export function HeroSettings({ settings, setSettings }: HeroSettingsProps) {
  const updateHero = (updates: Partial<SiteSettings["hero"]>) => {
    setSettings({
      ...settings,
      hero: { ...settings.hero, ...updates },
    });
  };

  return (
    <div className="space-y-12">
      <FormSection title="Landing Directives" icon={Layout}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FormField label="Primary Headline">
              <FormInput
                value={settings.hero.headlineLine1}
                onChange={(e) => updateHero({ headlineLine1: e.target.value })}
                placeholder="The Creator Agency"
              />
            </FormField>
            <FormField label="Accent Headline">
              <FormInput
                value={settings.hero.headlineLine2}
                onChange={(e) => updateHero({ headlineLine2: e.target.value })}
                className="text-primary font-black"
                placeholder="Built for Streamers."
              />
            </FormField>
          </div>
          <FormField label="Strategic Subtext">
            <FormTextarea
              rows={5}
              value={settings.hero.subheadline}
              onChange={(e) => updateHero({ subheadline: e.target.value })}
              placeholder="Agency mission statement..."
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Force Projection (Live Stats)" icon={Zap}>
        <EditableList
          items={settings.hero.stats}
          addLabel="Add Metric"
          emptyLabel="No stats deployed."
          onAdd={() => {
            const newStats = [...settings.hero.stats, { value: "0", label: "New Metric" }];
            updateHero({ stats: newStats });
          }}
          onDelete={(index) => {
            const newStats = settings.hero.stats.filter((_, i) => i !== index);
            updateHero({ stats: newStats });
          }}
          renderItem={(stat, index) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Value">
                <FormInput
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...settings.hero.stats];
                    newStats[index].value = e.target.value;
                    updateHero({ stats: newStats });
                  }}
                  className="font-black text-white"
                />
              </FormField>
              <FormField label="Designator">
                <FormInput
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...settings.hero.stats];
                    newStats[index].label = e.target.value;
                    updateHero({ stats: newStats });
                  }}
                  className="text-white/50"
                />
              </FormField>
            </div>
          )}
        />
      </FormSection>
    </div>
  );
}
