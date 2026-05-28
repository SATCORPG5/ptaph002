'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const deltaVariants = cva(
  'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums slashed-zero transition-colors',
  {
    variants: {
      direction: {
        up: 'bg-emerald-400/10 text-emerald-400',
        down: 'bg-red-400/10 text-red-400',
        neutral: 'bg-foreground/[0.06] text-foreground/40',
      },
    },
    defaultVariants: { direction: 'neutral' },
  },
);

interface DeltaChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof deltaVariants> {
  value: string;
  direction?: 'up' | 'down' | 'neutral';
}

function DeltaChip({ value, direction = 'neutral', className, ...props }: DeltaChipProps) {
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→';
  return (
    <span className={cn(deltaVariants({ direction }), className)} {...props}>
      {value}
      <span aria-hidden="true">{arrow}</span>
    </span>
  );
}

export { DeltaChip, deltaVariants, type DeltaChipProps };
