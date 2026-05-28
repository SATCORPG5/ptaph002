'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ActivityRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
}

function getColor(value: number): string {
  if (value >= 70) return '#EF4444'; // red - hot
  if (value >= 40) return '#F59E0B'; // amber - warm
  return 'var(--color-portal-accent)'; // teal - normal
}

export function ActivityRing({ value, size = 36, strokeWidth = 3.5 }: ActivityRingProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = getColor(value);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg ref={ref} width={size} height={size} className="flex-shrink-0">
      {/* Track */}
      <circle
        cx={cx} cy={cy} r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      {/* Progress — animates in only when scrolled into view */}
      <motion.circle
        cx={cx} cy={cy} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: inView ? offset : circumference }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
      />
      {/* Pulse dot at tip when high activity */}
      {inView && value >= 40 && (
        <motion.circle
          cx={cx + radius * Math.cos(((-90 + (value / 100) * 360) * Math.PI) / 180)}
          cy={cy + radius * Math.sin(((-90 + (value / 100) * 360) * Math.PI) / 180)}
          r={strokeWidth / 2}
          fill={color}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </svg>
  );
}
