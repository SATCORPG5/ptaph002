import { Section } from "@/components/layout/Section";

import { SiteSettings } from "@/lib/creators-db";

export function Services({ settings }: { settings: SiteSettings['services'] }) {
  return (
    <Section id="services" className="bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-primary tracking-[0.2em] uppercase mb-3">Three Departments. One Mission.</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            Built to support every
            <br />
            <span className="text-gradient-primary">layer of your growth.</span>
          </h2>
          <p className="text-foreground-muted text-base leading-relaxed">
            Peace Time operates through three specialized departments plus a set of creator-first
            guarantees that redefine agency standards.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {settings.map((s, i) => (
            <div
              key={i}
              className="group relative glass-card rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              {/* Left accent bar on hover */}
              <div className={`absolute left-0 top-4 bottom-4 w-[3px] ${s.bar} rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom`} />

              {/* Index + Tag row */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-black tracking-widest ${s.accent} font-mono`}>{s.index}</span>
                <span className="text-[10px] font-semibold tracking-widest text-foreground-muted uppercase border border-border rounded-full px-2 py-0.5">
                  {s.tag}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-gradient-primary transition-all duration-300">
                {s.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-foreground-muted leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
