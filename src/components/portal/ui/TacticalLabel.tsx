import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tacticalLabelVariants = cva(
  'font-mono uppercase tracking-[0.2em] leading-none select-none',
  {
    variants: {
      size: {
        xs: 'text-[9px]',
        sm: 'text-[10px]',
        md: 'text-xs',
      },
      tone: {
        muted: 'text-foreground/40',
        accent: 'text-portal-accent',
        live: 'text-live',
      },
    },
    defaultVariants: { size: 'sm', tone: 'muted' },
  },
);

interface TacticalLabelProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tacticalLabelVariants> {}

function TacticalLabel({ size, tone, className, ...props }: TacticalLabelProps) {
  return <span className={cn(tacticalLabelVariants({ size, tone }), className)} {...props} />;
}

export { TacticalLabel, tacticalLabelVariants, type TacticalLabelProps };
