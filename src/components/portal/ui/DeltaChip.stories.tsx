import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DeltaChip } from './DeltaChip';

const meta: Meta<typeof DeltaChip> = {
  title: 'Portal UI / DeltaChip',
  component: DeltaChip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DeltaChip>;

export const Up: Story = {
  args: { value: '+12.4%', direction: 'up' },
};

export const Down: Story = {
  args: { value: '-3.8%', direction: 'down' },
};

export const Neutral: Story = {
  args: { value: '0.0%', direction: 'neutral' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-4">
      <DeltaChip value="+12.4%" direction="up" />
      <DeltaChip value="-3.8%" direction="down" />
      <DeltaChip value="0.0%" direction="neutral" />
    </div>
  ),
};
