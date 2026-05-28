import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatusPill } from './StatusPill';

const meta: Meta<typeof StatusPill> = {
  title: 'Portal UI / StatusPill',
  component: StatusPill,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatusPill>;

export const Live: Story = {
  args: { status: 'live', label: 'Live' },
};

export const Active: Story = {
  args: { status: 'active', label: 'Active' },
};

export const Pending: Story = {
  args: { status: 'pending', label: 'Pending' },
};

export const Inactive: Story = {
  args: { status: 'inactive', label: 'Inactive' },
};

export const Error: Story = {
  args: { status: 'error', label: 'Error' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <StatusPill status="live" label="Live" />
      <StatusPill status="active" label="Active" />
      <StatusPill status="pending" label="Pending" />
      <StatusPill status="inactive" label="Inactive" />
      <StatusPill status="error" label="Error" />
    </div>
  ),
};
