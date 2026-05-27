'use client';

import { motion } from 'framer-motion';

interface BackgroundEffectsProps {
  type: 'none' | 'stars' | 'bubbles' | 'waves';
  accentColor?: string;
}

export function BackgroundEffects({ type, accentColor = 'var(--color-primary)' }: BackgroundEffectsProps) {
  if (type === 'none') return null;

  if (type === 'stars') {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
            style={{ 
              width: Math.random() * 3 + 'px', 
              height: Math.random() * 3 + 'px',
              boxShadow: `0 0 10px ${accentColor}`
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'bubbles') {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/10"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '110%',
              scale: Math.random() * 2 + 0.5,
              opacity: 0
            }}
            animate={{ 
              y: '-10%',
              opacity: [0, 0.2, 0],
              x: (Math.random() * 100) + (Math.random() > 0.5 ? 5 : -5) + '%'
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            style={{ 
              width: Math.random() * 100 + 50 + 'px', 
              height: Math.random() * 100 + 50 + 'px',
              backgroundColor: `color-mix(in srgb, ${accentColor}, transparent 95%)`
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
