import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionHeader } from './SectionHeader';

const meta: Meta<typeof SectionHeader> = {
  title: 'Portal UI / SectionHeader',
  component: SectionHeader,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {
  args: {
    heading: 'Creator Roster',
  },
};

export const WithEyebrow: Story = {
  args: {
    eyebrow: 'Operations',
    heading: 'Creator Roster',
    description: 'All managed creators across your agency.',
  },
};

export const WithActions: Story = {
  args: {
    eyebrow: 'Live Floor',
    heading: 'Active Streams',
    actions: (
      <button className="text-xs font-bold text-portal-accent border border-portal-accent/30 rounded-xl px-3 py-1.5 hover:bg-portal-accent/10 transition-colors">
        View All
      </button>
    ),
  },
};
