"use client";

import { SiteSettings } from "@/lib/creators-db";
import { FormSection, FormField, FormInput } from "../ui/AdminForm";
import { EditableList } from "../ui/EditableList";
import { Quote, Video } from "lucide-react";

interface TestimonialsSettingsProps {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
}

export function TestimonialsSettings({ settings, setSettings }: TestimonialsSettingsProps) {
  const updateTestimonials = (updates: Partial<SiteSettings["testimonials"]>) => {
    setSettings({
      ...settings,
      testimonials: { ...settings.testimonials, ...updates },
    });
  };

  return (
    <div className="space-y-12">
      <FormSection title="Evidence Configuration" icon={Quote}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Section Tag">
            <FormInput
              value={settings.testimonials.tag}
              onChange={(e) => updateTestimonials({ tag: e.target.value })}
            />
          </FormField>
          <FormField label="Main Title Base">
            <FormInput
              value={settings.testimonials.title}
              onChange={(e) => updateTestimonials({ title: e.target.value })}
            />
          </FormField>
          <FormField label="Title Gradient Accent">
            <FormInput
              value={settings.testimonials.titleGradient}
              onChange={(e) => updateTestimonials({ titleGradient: e.target.value })}
              className="text-primary font-black"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Witness Statements" icon={Video}>
        <EditableList
          items={settings.testimonials.items}
          addLabel="Add Statement"
          onAdd={() => {
            const next = [...settings.testimonials.items, { videoSrc: "", quote: "", creatorName: "Anonymous Creator" }];
            updateTestimonials({ items: next });
          }}
          onDelete={(index) => {
            updateTestimonials({ items: settings.testimonials.items.filter((_, i) => i !== index) });
          }}
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Creator Name">
                <FormInput
                  value={item.creatorName}
                  onChange={(e) => {
                    const next = [...settings.testimonials.items];
                    next[index].creatorName = e.target.value;
                    updateTestimonials({ items: next });
                  }}
                  className="font-bold text-white"
                />
              </FormField>
              <FormField label="Video Asset (Public Link)">
                <FormInput
                  value={item.videoSrc}
                  onChange={(e) => {
                    const next = [...settings.testimonials.items];
                    next[index].videoSrc = e.target.value;
                    updateTestimonials({ items: next });
                  }}
                  placeholder="https://gdrive.link/..."
                  className="text-xs font-mono text-secondary"
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Official Statement / Quote">
                  <FormInput
                    value={item.quote}
                    onChange={(e) => {
                      const next = [...settings.testimonials.items];
                      next[index].quote = e.target.value;
                      updateTestimonials({ items: next });
                    }}
                  />
                </FormField>
              </div>
            </div>
          )}
        />
      </FormSection>
    </div>
  );
}
