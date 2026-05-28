import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Home, Users, BarChart3, Settings, Zap } from 'lucide-react';
import { CommandPalette, type CommandItem } from './CommandPalette';

const DEMO_ITEMS: CommandItem[] = [
  { id: 'home', label: 'Lobby', description: 'Home base for your portal', category: 'Navigation', icon: <Home size={13} />, onSelect: () => {} },
  { id: 'creators', label: 'My Creators', description: 'Manage your creator roster', category: 'Navigation', icon: <Users size={13} />, onSelect: () => {} },
  { id: 'reports', label: 'Data Cards', description: 'Stream reports and analytics', category: 'Navigation', icon: <BarChart3 size={13} />, onSelect: () => {} },
  { id: 'live', label: 'Live Floor', description: 'Live stats, clip archive', category: 'Navigation', icon: <Zap size={13} />, onSelect: () => {} },
  { id: 'settings', label: 'Settings', description: 'Account settings and preferences', category: 'Account', icon: <Settings size={13} />, onSelect: () => {} },
];

const meta: Meta<typeof CommandPalette> = {
  title: 'Portal UI / CommandPalette',
  component: CommandPalette,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Open: Story = {
  args: {
    items: DEMO_ITEMS,
    open: true,
    onOpenChange: () => {},
    placeholder: 'Search portal...',
  },
};

export const Interactive: Story = {
  render: () => {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-foreground/50">Press ⌘K / Ctrl+K to open</p>
        <CommandPalette items={DEMO_ITEMS} />
      </div>
    );
  },
};
