'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const STAGES = [
  { id: 'ideation',  label: 'Ideation',  short: '💡' },
  { id: 'creation',  label: 'Creation',  short: '✏️' },
  { id: 'review',    label: 'Review',    short: '🔍' },
  { id: 'launch',    label: 'Launch',    short: '🚀' },
  { id: 'collab',    label: 'Collab',    short: '🤝' },
  { id: 'impact',    label: 'Impact',    short: '⚡' },
];

interface TopMomentumBarProps {
  activeStage?: number;    // 0-5 index of filled stages
  livePosts?: number;
  liveCollabs?: number;
  activeCreators?: number;
}

export function TopMomentumBar({
  activeStage = 3,
  livePosts = 47,
  liveCollabs = 12,
  activeCreators = 28,
}: TopMomentumBarProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="w-full bg-background-surface border-b border-border-subtle px-4 sm:px-6 flex-shrink-0">
      <div className="flex items-center gap-4 h-10 w-full mx-auto max-w-[1600px]">
        {/* Label */}
        <span className="text-[9px] font-black text-[#14B8A6]/60 uppercase tracking-[0.18em] flex-shrink-0 hidden sm:block">
          Momentum
        </span>

        {/* Stages */}
        <div className="flex items-center gap-0 flex-1 min-w-[280px]">
          {STAGES.map((stage, i) => {
            const isFilled = i <= activeStage;
            const isActive = i === activeStage;

            return (
              <div
                key={stage.id}
                className="flex items-center flex-1"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Segment bar */}
                <div className="relative flex-1 h-1 mx-0.5 rounded-full overflow-hidden bg-white/[0.05]">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: isFilled
                        ? isActive
                          ? 'linear-gradient(90deg, #14B8A6, #0EA5E9)'
                          : '#14B8A6'
                        : 'transparent',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: isFilled ? '100%' : '0%' }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute inset-y-0 right-0 w-4 rounded-full"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.6))' }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Stage dot + label */}
                <div className="relative flex-shrink-0 flex flex-col items-center">
                  <motion.div
                    className={`w-2 h-2 rounded-full border transition-colors ${
                      isFilled
                        ? isActive
                          ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                          : 'bg-[#14B8A6] border-[#14B8A6]'
                        : 'bg-transparent border-white/15'
                    }`}
                    whileHover={{ scale: 1.4 }}
                  />
                  {hovered === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 text-[9px] font-bold text-white/70 whitespace-nowrap bg-[#0F1623] border border-white/10 px-2 py-0.5 rounded-md z-50"
                    >
                      {stage.label}
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Stats */}
        <div className="flex items-center gap-3 flex-shrink-0 border-l border-white/[0.05] pl-4">
          {[
            { label: 'Posts', value: livePosts },
            { label: 'Collabs', value: liveCollabs },
            { label: 'Active', value: activeCreators },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-white/80 tabular-nums">{stat.value}</span>
              <span className="text-[9px] font-bold text-white/25 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[9px] font-black text-[#14B8A6] uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
