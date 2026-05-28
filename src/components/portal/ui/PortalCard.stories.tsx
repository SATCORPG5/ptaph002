import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PortalCard } from './PortalCard';

const meta: Meta<typeof PortalCard> = {
  title: 'Portal UI / PortalCard',
  component: PortalCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PortalCard>;

export const Default: Story = {
  render: () => (
    <PortalCard>
      <PortalCard.Header>
        <span className="text-sm font-bold text-foreground">Card Title</span>
      </PortalCard.Header>
      <PortalCard.Body>
        <p className="text-xs text-foreground/50">Default surface — near-black with subtle border.</p>
      </PortalCard.Body>
      <PortalCard.Footer>
        <span className="text-[10px] text-foreground/30 font-mono uppercase tracking-widest">Footer</span>
      </PortalCard.Footer>
    </PortalCard>
  ),
};

export const Elevated: Story = {
  render: () => (
    <PortalCard tone="elevated">
      <PortalCard.Header>
        <span className="text-sm font-bold text-foreground">Elevated</span>
      </PortalCard.Header>
      <PortalCard.Body>
        <p className="text-xs text-foreground/50">Slightly lighter surface + shadow.</p>
      </PortalCard.Body>
    </PortalCard>
  ),
};

export const Tactical: Story = {
  render: () => (
    <PortalCard tone="tactical">
      <PortalCard.Header>
        <span className="text-sm font-bold text-portal-accent">Tactical HUD</span>
      </PortalCard.Header>
      <PortalCard.Body>
        <p className="text-xs text-foreground/50">Teal accent border + corner cuts.</p>
      </PortalCard.Body>
    </PortalCard>
  ),
};

export const Loading: Story = {
  render: () => (
    <PortalCard tone="loading">
      <PortalCard.Body>
        <div className="h-4 w-2/3 rounded bg-foreground/10" />
        <div className="h-3 w-1/2 rounded bg-foreground/[0.06] mt-2" />
      </PortalCard.Body>
    </PortalCard>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4 bg-background min-h-screen">
      {(['default', 'elevated', 'tactical', 'loading'] as const).map((tone) => (
        <PortalCard key={tone} tone={tone}>
          <PortalCard.Header>
            <span className="text-xs font-bold text-foreground capitalize">{tone}</span>
          </PortalCard.Header>
          <PortalCard.Body>
            <p className="text-[10px] text-foreground/40">tone=&quot;{tone}&quot;</p>
          </PortalCard.Body>
        </PortalCard>
      ))}
    </div>
  ),
};
