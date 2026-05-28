import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TacticalDivider } from './TacticalDivider';

const meta: Meta<typeof TacticalDivider> = {
  title: 'Portal UI / TacticalDivider',
  component: TacticalDivider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TacticalDivider>;

export const Animated: Story = {
  render: () => (
    <div className="bg-portal-surface-1 p-6 rounded-2xl space-y-4">
      <p className="text-xs text-foreground/50">Above section</p>
      <TacticalDivider />
      <p className="text-xs text-foreground/50">Below section</p>
    </div>
  ),
};

export const Static: Story = {
  render: () => (
    <div className="bg-portal-surface-1 p-6 rounded-2xl space-y-4">
      <p className="text-xs text-foreground/50">Above section</p>
      <TacticalDivider static />
      <p className="text-xs text-foreground/50">Below section</p>
    </div>
  ),
};
