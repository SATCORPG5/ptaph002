"use client";

import { SiteSettings } from "@/lib/creators-db";
import { FormSection, FormField, FormInput, FormTextarea } from "../ui/AdminForm";
import { EditableList } from "../ui/EditableList";
import { TrendingUp, Milestone } from "lucide-react";

interface GrowthSettingsProps {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
}

export function GrowthSettings({ settings, setSettings }: GrowthSettingsProps) {
  const updateGrowth = (updates: Partial<SiteSettings["growthPhases"]>) => {
    setSettings({
      ...settings,
      growthPhases: { ...settings.growthPhases, ...updates },
    });
  };

  return (
    <div className="space-y-12">
      <FormSection title="Growth Narrative" icon={TrendingUp}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField label="Section Tag">
            <FormInput
              value={settings.growthPhases.tag}
              onChange={(e) => updateGrowth({ tag: e.target.value })}
            />
          </FormField>
          <FormField label="Main Title">
            <FormInput
              value={settings.growthPhases.title}
              onChange={(e) => updateGrowth({ title: e.target.value })}
            />
          </FormField>
          <FormField label="Title Gradient Accent">
            <FormInput
              value={settings.growthPhases.titleGradient}
              onChange={(e) => updateGrowth({ titleGradient: e.target.value })}
              className="text-primary font-black"
            />
          </FormField>
          <div className="md:col-span-2 lg:col-span-3">
            <FormField label="Description text">
              <FormTextarea
                rows={2}
                value={settings.growthPhases.description}
                onChange={(e) => updateGrowth({ description: e.target.value })}
              />
            </FormField>
          </div>
        </div>
      </FormSection>

      <FormSection title="Phased Milestones" icon={Milestone}>
        <EditableList
          items={settings.growthPhases.phases}
          addLabel="Add Phase"
          onAdd={() => {
            const next = [...settings.growthPhases.phases, {
              number: String(settings.growthPhases.phases.length + 1).padStart(2, '0'),
              name: "New Phase",
              focus: "Target Focus",
              role: "Phase role and details...",
              accent: "text-primary",
              border: "border-primary/30",
              bg: "bg-primary/10",
              glow: "shadow-neon-primary/10",
              connector: "from-primary/40"
            }];
            updateGrowth({ phases: next });
          }}
          onDelete={(index) => {
            updateGrowth({ phases: settings.growthPhases.phases.filter((_, i) => i !== index) });
          }}
          renderItem={(phase, index) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Phase #">
                  <FormInput
                    value={phase.number}
                    onChange={(e) => {
                      const next = [...settings.growthPhases.phases];
                      next[index].number = e.target.value;
                      updateGrowth({ phases: next });
                    }}
                  />
                </FormField>
                <FormField label="Phase Title">
                  <FormInput
                    value={phase.name}
                    onChange={(e) => {
                      const next = [...settings.growthPhases.phases];
                      next[index].name = e.target.value;
                      updateGrowth({ phases: next });
                    }}
                    className="font-bold text-white uppercase"
                  />
                </FormField>
              </div>
              <FormField label="Strategic Focus">
                <FormInput
                  value={phase.focus}
                  onChange={(e) => {
                    const next = [...settings.growthPhases.phases];
                    next[index].focus = e.target.value;
                    updateGrowth({ phases: next });
                  }}
                  className="text-secondary font-black"
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Role / Mission">
                  <FormTextarea
                    rows={3}
                    value={phase.role}
                    onChange={(e) => {
                      const next = [...settings.growthPhases.phases];
                      next[index].role = e.target.value;
                      updateGrowth({ phases: next });
                    }}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:col-span-2">
                {['accent', 'border', 'bg', 'glow', 'connector'].map((field) => (
                  <FormField key={field} label={field}>
                    <FormInput
                      value={(phase as any)[field]}
                      onChange={(e) => {
                        const next = [...settings.growthPhases.phases];
                        (next[index] as any)[field] = e.target.value;
                        updateGrowth({ phases: next });
                      }}
                      className="text-[9px] font-mono px-2 py-1"
                    />
                  </FormField>
                ))}
              </div>
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Call to Action">
        <FormField label="Bottom Callout text">
          <FormInput
            value={settings.growthPhases.bottomCallout}
            onChange={(e) => updateGrowth({ bottomCallout: e.target.value })}
            className="italic text-white/50"
          />
        </FormField>
      </FormSection>
    </div>
  );
}
