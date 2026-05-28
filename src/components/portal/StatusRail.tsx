'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StatusRailProps {
  liveCount?: number;
}

function formatUTC(d: Date): string {
  return d.toISOString().slice(11, 19);
}

/** Peace-time signature line: Operational • N LIVE • SYNCED HH:MM:SS UTC */
export function StatusRail({ liveCount = 28 }: StatusRailProps) {
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setClock(formatUTC(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full bg-background-surface border-b border-border-subtle px-4 sm:px-6 flex-shrink-0">
      <div className="flex items-center gap-3 h-7 w-full mx-auto max-w-[1600px] font-mono text-[10px] uppercase tracking-[0.2em]">
        <span className="flex items-center gap-1.5 text-portal-accent">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-portal-accent"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Operational
        </span>
        <span className="text-foreground/15">•</span>
        <span className="text-foreground/40 tabular-nums slashed-zero">
          {liveCount} Live
        </span>
        <span className="text-foreground/15 hidden sm:inline">•</span>
        <span className="text-foreground/30 tabular-nums slashed-zero hidden sm:inline">
          Synced {clock ?? '--:--:--'} UTC
        </span>
      </div>
    </div>
  );
}
