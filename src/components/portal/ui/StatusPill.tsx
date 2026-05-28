import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusPillVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] font-bold',
  {
    variants: {
      status: {
        live: 'bg-live/10 text-live border border-live/20',
        active: 'bg-portal-accent/10 text-portal-accent border border-portal-accent/20',
        pending: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
        inactive: 'bg-foreground/[0.05] text-foreground/30 border border-foreground/[0.08]',
        error: 'bg-red-400/10 text-red-400 border border-red-400/20',
      },
    },
    defaultVariants: { status: 'inactive' },
  },
);

const dotVariants = cva('w-1.5 h-1.5 rounded-full flex-shrink-0', {
  variants: {
    status: {
      live: 'bg-live animate-pulse',
      active: 'bg-portal-accent',
      pending: 'bg-amber-400',
      inactive: 'bg-foreground/20',
      error: 'bg-red-400',
    },
  },
  defaultVariants: { status: 'inactive' },
});

interface StatusPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusPillVariants> {
  label?: string;
}

function StatusPill({ status, label, className, ...props }: StatusPillProps) {
  const text = label ?? status ?? 'inactive';
  return (
    <span className={cn(statusPillVariants({ status }), className)} {...props}>
      <span className={dotVariants({ status })} aria-hidden="true" />
      {text}
    </span>
  );
}

export { StatusPill, statusPillVariants, type StatusPillProps };
