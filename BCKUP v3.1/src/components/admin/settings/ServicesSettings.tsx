"use client";

import { SiteSettings } from "@/lib/creators-db";
import { FormSection, FormField, FormInput, FormTextarea } from "../ui/AdminForm";
import { EditableList } from "../ui/EditableList";
import { Briefcase } from "lucide-react";

interface ServicesSettingsProps {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
}

export function ServicesSettings({ settings, setSettings }: ServicesSettingsProps) {
  const updateServices = (newServices: SiteSettings["services"]) => {
    setSettings({ ...settings, services: newServices });
  };

  return (
    <div className="space-y-12">
      <FormSection title="Operational Departments" icon={Briefcase}>
        <EditableList
          items={settings.services}
          addLabel="Add Service"
          onAdd={() => {
            const newItem = {
              index: String(settings.services.length + 1).padStart(2, '0'),
              title: "New Service",
              description: "Service description here...",
              accent: "text-primary",
              bar: "bg-primary",
              tag: "Department",
            };
            updateServices([...settings.services, newItem]);
          }}
          onDelete={(index) => {
            updateServices(settings.services.filter((_, i) => i !== index));
          }}
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Index">
                  <FormInput
                    value={item.index}
                    onChange={(e) => {
                      const next = [...settings.services];
                      next[index].index = e.target.value;
                      updateServices(next);
                    }}
                  />
                </FormField>
                <FormField label="Tag">
                  <FormInput
                    value={item.tag}
                    onChange={(e) => {
                      const next = [...settings.services];
                      next[index].tag = e.target.value;
                      updateServices(next);
                    }}
                  />
                </FormField>
              </div>
              <FormField label="Title">
                <FormInput
                  value={item.title}
                  onChange={(e) => {
                    const next = [...settings.services];
                    next[index].title = e.target.value;
                    updateServices(next);
                  }}
                  className="font-bold text-white uppercase"
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Description">
                  <FormTextarea
                    rows={3}
                    value={item.description}
                    onChange={(e) => {
                      const next = [...settings.services];
                      next[index].description = e.target.value;
                      updateServices(next);
                    }}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Accent Class">
                  <FormInput
                    value={item.accent}
                    onChange={(e) => {
                      const next = [...settings.services];
                      next[index].accent = e.target.value;
                      updateServices(next);
                    }}
                    className="text-primary/50 text-xs font-mono"
                  />
                </FormField>
                <FormField label="Bar Class">
                  <FormInput
                    value={item.bar}
                    onChange={(e) => {
                      const next = [...settings.services];
                      next[index].bar = e.target.value;
                      updateServices(next);
                    }}
                    className="text-primary/50 text-xs font-mono"
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
