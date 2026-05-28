'use client';

import * as React from 'react';
import { useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/shadcn-ui/command';
import { cn } from '@/lib/utils';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  category: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

interface CommandPaletteProps {
  items: CommandItem[];
  /** Controlled open state — use with onOpenChange for custom triggers */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
}

/** Mount once at portal layout level. Opens on ⌘K / Ctrl+K. */
function CommandPalette({
  items,
  open: controlledOpen,
  onOpenChange,
  placeholder = 'Search portal...',
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, setIsOpen]);

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput
        placeholder={placeholder}
        className={cn(
          'font-sans text-sm text-foreground placeholder:text-foreground/30',
          'border-b border-foreground/[0.08]',
        )}
      />
      <CommandList>
        <CommandEmpty className="py-8 text-center text-xs text-foreground/30 font-mono uppercase tracking-[0.15em]">
          No results found.
        </CommandEmpty>

        {categories.map((category, idx) => {
          const grouped = items.filter((i) => i.category === category);
          return (
            <React.Fragment key={category}>
              {idx > 0 && <CommandSeparator className="bg-foreground/[0.06]" />}
              <CommandGroup
                heading={
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/30">
                    {category}
                  </span>
                }
              >
                {grouped.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.label} ${item.description ?? ''} ${item.category}`}
                    onSelect={() => {
                      item.onSelect();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-portal-accent/[0.08] data-[selected=true]:bg-portal-accent/[0.08]"
                  >
                    {item.icon && (
                      <span className="text-foreground/30 flex-shrink-0">{item.icon}</span>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-foreground/80 truncate">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="text-[10px] text-foreground/30 truncate">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}

export { CommandPalette, type CommandPaletteProps };
