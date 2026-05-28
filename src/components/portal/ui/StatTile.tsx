'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { TacticalLabel } from './TacticalLabel';
import { DeltaChip, type DeltaChipProps } from './DeltaChip';

interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  delta?: string;
  deltaDirection?: DeltaChipProps['direction'];
  /** Optional supporting text rendered below the value */
  sub?: string;
  /** Icon to render at top-left of tile */
  icon?: React.ReactNode;
}

function StatTile({
  label,
  value,
  delta,
  deltaDirection,
  sub,
  icon,
  className,
  ...props
}: StatTileProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-2xl bg-portal-surface-1 border border-foreground/[0.06] p-5',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <TacticalLabel>{label}</TacticalLabel>
        {icon && <span className="text-foreground/20">{icon}</span>}
      </div>

      <div className="flex items-end gap-2">
        <span className="font-display text-3xl font-black text-foreground tabular-nums slashed-zero leading-none">
          {value}
        </span>
        {delta && <DeltaChip value={delta} direction={deltaDirection} className="mb-0.5" />}
      </div>

      {sub && (
        <p className="text-[10px] text-foreground/30 font-medium">{sub}</p>
      )}
    </div>
  );
}

export { StatTile, type StatTileProps };
