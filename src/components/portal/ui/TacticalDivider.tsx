'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TacticalDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Disable the scan-line animation */
  static?: boolean;
}

function TacticalDivider({ static: isStatic = false, className, ...props }: TacticalDividerProps) {
  return (
    <div
      className={cn('relative h-px w-full overflow-hidden bg-foreground/[0.06]', className)}
      role="separator"
      aria-orientation="horizontal"
      {...props}
    >
      {!isStatic && (
        <motion.span
          className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-portal-accent/50 to-transparent"
          initial={{ left: '-20%' }}
          animate={{ left: '120%' }}
          transition={{
            duration: 1.6,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 3,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export { TacticalDivider, type TacticalDividerProps };
