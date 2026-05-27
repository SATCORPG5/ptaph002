'use client';

import { motion } from 'framer-motion';

// Simple inline sparkline data
const chartData = [22, 28, 35, 30, 45, 52, 48, 58, 62, 70, 75, 80];
const maxVal = Math.max(...chartData);
const H = 80;
const W = 240;
const pts = chartData
  .map((v, i) => `${(i / (chartData.length - 1)) * W},${H - (v / maxVal) * H}`)
  .join(' ');

export default function CreatorGrowthSystem() {
  return (
    <div className="h-full glass-card rounded-2xl p-6 flex flex-col gap-5 overflow-hidden relative group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/10 blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold text-primary tracking-[0.2em] uppercase mb-1">Analytics</p>
          <h3 className="text-lg font-black text-foreground">Creator Growth System</h3>
          <p className="text-xs text-foreground-muted mt-0.5">Live viewer growth, last 12 sessions</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1.5">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
          <span className="text-[11px] font-semibold text-primary">Live</span>
        </div>
      </div>

      {/* Big metric */}
      <div className="relative z-10">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-black text-foreground tracking-tighter">+80%</span>
          <span className="text-sm text-emerald-400 font-semibold mb-1.5 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17l5-5 5 5M7 7l5 5 5-5" />
            </svg>
            12.4% this week
          </span>
        </div>
        <p className="text-xs text-foreground-muted mt-0.5">Average viewer growth across roster</p>
      </div>

      {/* Sparkline */}
      <div className="relative z-10 flex-1 min-h-0 flex items-end">
        <div className="w-full relative">
          {/* Area fill gradient */}
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: '90px' }}
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF3C5F" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#FF3C5F" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area */}
            <polygon
              points={`0,${H} ${pts} ${W},${H}`}
              fill="url(#areaGrad)"
            />
            {/* Line */}
            <polyline
              points={pts}
              fill="none"
              stroke="#FF3C5F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* End dot */}
            <circle
              cx={(((chartData.length - 1) / (chartData.length - 1)) * W).toString()}
              cy={(H - (chartData[chartData.length - 1] / maxVal) * H).toString()}
              r="4"
              fill="#FF3C5F"
            />
          </svg>
        </div>
      </div>

      {/* Stats row */}
      <div className="relative z-10 grid grid-cols-3 gap-3">
        {[
          { label: "Peak Viewers", value: "18.9k" },
          { label: "Avg Session", value: "47m" },
          { label: "Gifting Rate", value: "8.3%" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-foreground/[0.04] border border-border p-3 text-center">
            <div className="text-base font-black text-foreground">{s.value}</div>
            <div className="text-[10px] text-foreground-muted mt-0.5 font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
