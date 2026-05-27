"use client";

import { SiteSettings } from "@/lib/creators-db";
import { FormSection, FormField, FormInput, FormTextarea } from "../ui/AdminForm";
import { EditableList } from "../ui/EditableList";
import { HelpCircle } from "lucide-react";

export function FaqSettings({ settings, setSettings }: { settings: SiteSettings; setSettings: (s: SiteSettings) => void }) {
  const updateFaqs = (newFaqs: SiteSettings["faqs"]) => {
    setSettings({ ...settings, faqs: newFaqs });
  };

  return (
    <div className="space-y-12">
      <FormSection title="Intel Archive / FAQ" icon={HelpCircle}>
        <EditableList
          items={settings.faqs}
          addLabel="Integrate Intel"
          onAdd={() => updateFaqs([...settings.faqs, { q: "New Question", a: "Response details here..." }])}
          onDelete={(index) => updateFaqs(settings.faqs.filter((_, i) => i !== index))}
          renderItem={(faq, index) => (
            <div className="space-y-4">
              <FormField label="Inquiry [Q]">
                <FormInput
                  value={faq.q}
                  onChange={(e) => {
                    const next = [...settings.faqs];
                    next[index].q = e.target.value;
                    updateFaqs(next);
                  }}
                  className="font-bold text-primary"
                />
              </FormField>
              <FormField label="Briefing [A]">
                <FormTextarea
                  rows={3}
                  value={faq.a}
                  onChange={(e) => {
                    const next = [...settings.faqs];
                    next[index].a = e.target.value;
                    updateFaqs(next);
                  }}
                />
              </FormField>
            </div>
          )}
        />
      </FormSection>
    </div>
  );
}
