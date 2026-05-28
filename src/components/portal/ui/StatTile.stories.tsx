import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TrendingUp } from 'lucide-react';
import { StatTile } from './StatTile';

const meta: Meta<typeof StatTile> = {
  title: 'Portal UI / StatTile',
  component: StatTile,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatTile>;

export const Default: Story = {
  args: {
    label: 'Total Views',
    value: '124.8K',
  },
};

export const WithDeltaUp: Story = {
  args: {
    label: 'Avg Watch Time',
    value: '4:32',
    delta: '+12.4%',
    deltaDirection: 'up',
    sub: 'vs last 7 days',
  },
};

export const WithDeltaDown: Story = {
  args: {
    label: 'Churn Rate',
    value: '3.2%',
    delta: '-0.8%',
    deltaDirection: 'down',
    sub: 'vs previous month',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Growth Score',
    value: '92',
    delta: '+5',
    deltaDirection: 'up',
    icon: <TrendingUp size={14} />,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 bg-background p-4">
      <StatTile label="Total Views" value="124.8K" delta="+18.2%" deltaDirection="up" sub="last 30d" />
      <StatTile label="Followers" value="48.3K" delta="+2.1K" deltaDirection="up" />
      <StatTile label="Revenue" value="$6,240" delta="-4.1%" deltaDirection="down" sub="vs last month" />
    </div>
  ),
};
