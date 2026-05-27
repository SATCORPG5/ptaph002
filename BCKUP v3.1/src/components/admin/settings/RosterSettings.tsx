"use client";

import { SiteSettings } from "@/lib/creators-db";
import { FormSection, FormField, FormInput, FormTextarea } from "../ui/AdminForm";
import { Users } from "lucide-react";

interface RosterSettingsProps {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
}

export function RosterSettings({ settings, setSettings }: RosterSettingsProps) {
  const updateRoster = (updates: Partial<SiteSettings["rosterSettings"]>) => {
    setSettings({
      ...settings,
      rosterSettings: { ...settings.rosterSettings, ...updates },
    });
  };

  const updateSection = (key: string, updates: { title?: string; desc?: string }) => {
    const newSections = { ...settings.rosterSettings.sections };
    (newSections as any)[key] = { ...(newSections as any)[key], ...updates };
    updateRoster({ sections: newSections });
  };

  return (
    <div className="space-y-12">
      <FormSection title="Global Roster Headers" icon={Users}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField label="Main Tag">
            <FormInput
              value={settings.rosterSettings.mainTag}
              onChange={(e) => updateRoster({ mainTag: e.target.value })}
            />
          </FormField>
          <FormField label="Main Title Base">
            <FormInput
              value={settings.rosterSettings.mainTitle}
              onChange={(e) => updateRoster({ mainTitle: e.target.value })}
            />
          </FormField>
          <FormField label="Main Title Accent">
            <FormInput
              value={settings.rosterSettings.mainTitleAccent}
              onChange={(e) => updateRoster({ mainTitleAccent: e.target.value })}
              className="text-primary font-black"
            />
          </FormField>
          <div className="md:col-span-2 lg:col-span-3">
            <FormField label="Main Description">
              <FormTextarea
                rows={3}
                value={settings.rosterSettings.mainDescription}
                onChange={(e) => updateRoster({ mainDescription: e.target.value })}
              />
            </FormField>
          </div>
        </div>
      </FormSection>

      <FormSection title="Segment Definitions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(settings.rosterSettings.sections).map(([key, sec]) => (
            <div key={key} className="glass-card p-6 border-white/5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-secondary tracking-widest">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <div className="w-2 h-2 rounded-full bg-secondary shadow-neon-secondary" />
              </div>
              <FormField label="Title Override">
                <FormInput
                  value={sec.title}
                  onChange={(e) => updateSection(key, { title: e.target.value })}
                  className="font-bold border-white/5 bg-black/20"
                />
              </FormField>
              <FormField label="Context Description">
                <FormTextarea
                  rows={2}
                  value={sec.desc}
                  onChange={(e) => updateSection(key, { desc: e.target.value })}
                  className="text-xs border-white/5 bg-black/20"
                />
              </FormField>
            </div>
          ))}
        </div>
      </FormSection>
    </div>
  );
}
