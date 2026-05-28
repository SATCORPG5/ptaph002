import * as React from 'react';
import { cn } from '@/lib/utils';
import { TacticalLabel } from './TacticalLabel';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional Michroma eyebrow above the headline */
  eyebrow?: string;
  /** Main headline — rendered in Outfit display font */
  heading: string;
  /** Optional description below the heading */
  description?: string;
  /** Slot for action buttons / badges on the right */
  actions?: React.ReactNode;
}

function SectionHeader({
  eyebrow,
  heading,
  description,
  actions,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)} {...props}>
      <div className="flex flex-col gap-1">
        {eyebrow && <TacticalLabel>{eyebrow}</TacticalLabel>}
        <h2 className="font-display text-xl font-black text-foreground leading-tight tracking-tight">
          {heading}
        </h2>
        {description && (
          <p className="text-sm text-foreground/40 font-medium">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

export { SectionHeader, type SectionHeaderProps };
