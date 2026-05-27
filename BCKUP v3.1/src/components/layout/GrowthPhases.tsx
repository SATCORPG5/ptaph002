'use client';

import { Section } from "@/components/layout/Section";
import { motion } from "framer-motion";

import { SiteSettings } from "@/lib/creators-db";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export function GrowthPhases({ settings }: { settings: SiteSettings['growthPhases'] }) {
  if (!settings) return null;
  const { tag, title, titleGradient, description, phases, bottomCallout } = settings;

  return (
    <Section id="growth-phases" className="relative overflow-hidden bg-background-surface">
      {/* Background */}
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-primary tracking-[0.2em] uppercase mb-3">
            {tag}
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            {title}
            <br />
            <span className="text-gradient-primary">{titleGradient}</span>
          </h2>
          <p className="text-foreground-muted text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* Phase Cards */}
        <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-0 max-w-6xl mx-auto">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.number}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="relative flex-1 group"
            >
              {/* Connector line between cards (desktop) */}
              {i < phases.length - 1 && (
                <div
                  className={`hidden lg:block absolute top-[3.5rem] right-0 translate-x-1/2 w-full h-px bg-gradient-to-r ${phase.connector} to-transparent z-10 pointer-events-none`}
                />
              )}

              <div
                className={`relative h-full glass-card rounded-2xl p-8 border ${phase.border} transition-all duration-300 hover:-translate-y-1 ${phase.glow} lg:mx-3 overflow-hidden`}
              >
                {/* Top accent strip */}
                <div className={`absolute top-0 inset-x-0 h-[2px] ${phase.bg} rounded-t-2xl`} />

                {/* Phase number */}
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${phase.bg} border ${phase.border} text-sm font-black font-mono ${phase.accent}`}
                  >
                    {phase.number}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground-muted uppercase tracking-widest">
                      Phase {phase.number}
                    </p>
                    <h3 className={`text-xl font-black ${phase.accent}`}>{phase.name}</h3>
                  </div>
                </div>

                {/* Focus badge */}
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full ${phase.bg} border ${phase.border} px-3 py-1 mb-5`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${phase.bg.replace("bg-", "bg-").replace("/10", "")} inline-block`} />
                  <span className={`text-xs font-semibold ${phase.accent} tracking-wide`}>
                    {phase.focus}
                  </span>
                </div>

                {/* Role description */}
                <p className="text-sm text-foreground-muted leading-relaxed">{phase.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-foreground-muted text-sm">
            {bottomCallout}
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
