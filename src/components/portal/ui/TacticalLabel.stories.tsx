import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TacticalLabel } from './TacticalLabel';

const meta: Meta<typeof TacticalLabel> = {
  title: 'Portal UI / TacticalLabel',
  component: TacticalLabel,
  parameters: { layout: 'padded', backgrounds: { default: 'dark' } },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TacticalLabel>;

export const Default: Story = {
  args: { children: 'Section Label', size: 'sm', tone: 'muted' },
};

export const Accent: Story = {
  args: { children: 'Portal Active', size: 'sm', tone: 'accent' },
};

export const Live: Story = {
  args: { children: 'Live Now', size: 'sm', tone: 'live' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 bg-portal-surface-1 rounded-2xl">
      {(['muted', 'accent', 'live'] as const).map((tone) =>
        (['xs', 'sm', 'md'] as const).map((size) => (
          <TacticalLabel key={`${tone}-${size}`} tone={tone} size={size}>
            {tone} / {size} — Operations
          </TacticalLabel>
        )),
      )}
    </div>
  ),
};
