'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-2xl border transition-colors', {
  variants: {
    tone: {
      default: 'bg-portal-surface-1 border-foreground/[0.06]',
      elevated: 'bg-portal-surface-2 border-foreground/[0.08] shadow-lg shadow-black/30',
      tactical:
        'bg-portal-surface-1 border-portal-accent/20 relative before:absolute before:top-0 before:right-0 before:w-3 before:h-3 before:border-t before:border-r before:border-portal-accent/40 after:absolute after:bottom-0 after:left-0 after:w-3 after:h-3 after:border-b after:border-l after:border-portal-accent/40',
      loading: 'bg-portal-surface-1 border-foreground/[0.06] animate-pulse',
    },
  },
  defaultVariants: { tone: 'default' },
});

interface PortalCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

function PortalCard({ tone, asChild, className, children, ...props }: PortalCardProps) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp className={cn(cardVariants({ tone }), className)} {...props}>
      {children}
    </Comp>
  );
}

function PortalCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-5 py-4 border-b border-foreground/[0.06]',
        className,
      )}
      {...props}
    />
  );
}

function PortalCardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />;
}

function PortalCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center px-5 py-3 border-t border-foreground/[0.06]',
        className,
      )}
      {...props}
    />
  );
}

PortalCard.Header = PortalCardHeader;
PortalCard.Body = PortalCardBody;
PortalCard.Footer = PortalCardFooter;

export { PortalCard, cardVariants, type PortalCardProps };
