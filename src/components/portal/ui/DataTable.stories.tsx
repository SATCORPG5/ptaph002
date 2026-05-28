import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import { StatusPill } from './StatusPill';
import { DeltaChip } from './DeltaChip';

interface Creator {
  id: string;
  name: string;
  handle: string;
  followers: string;
  views: string;
  delta: string;
  status: 'live' | 'active' | 'inactive';
}

const SAMPLE_DATA: Creator[] = [
  { id: '1', name: 'Alex Rivera', handle: '@alexriv', followers: '48.3K', views: '1.2M', delta: '+18.2%', status: 'live' },
  { id: '2', name: 'Jordan Lee', handle: '@jordlee', followers: '32.1K', views: '890K', delta: '+5.4%', status: 'active' },
  { id: '3', name: 'Sam Chen', handle: '@samchen', followers: '21.7K', views: '445K', delta: '-2.1%', status: 'inactive' },
  { id: '4', name: 'Taylor Kim', handle: '@tkim', followers: '15.9K', views: '312K', delta: '+11.8%', status: 'active' },
  { id: '5', name: 'Morgan Diaz', handle: '@mdiaz', followers: '9.4K', views: '178K', delta: '+0.3%', status: 'active' },
];

const COLUMNS: ColumnDef<Creator, unknown>[] = [
  { accessorKey: 'name', header: 'Creator', size: 180 },
  { accessorKey: 'handle', header: 'Handle', size: 120 },
  { accessorKey: 'followers', header: 'Followers', size: 100 },
  {
    accessorKey: 'views',
    header: 'Views',
    size: 100,
    cell: ({ getValue }) => (
      <span className="tabular-nums slashed-zero">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'delta',
    header: 'WoW',
    size: 90,
    cell: ({ row }) => (
      <DeltaChip
        value={row.original.delta}
        direction={row.original.delta.startsWith('+') ? 'up' : row.original.delta.startsWith('-') ? 'down' : 'neutral'}
      />
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 110,
    cell: ({ getValue }) => {
      const val = getValue() as Creator['status'];
      return <StatusPill status={val} label={val} />;
    },
  },
];

const meta: Meta<typeof DataTable> = {
  title: 'Portal UI / DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  render: () => (
    <div className="bg-background p-4">
      <DataTable columns={COLUMNS} data={SAMPLE_DATA} getRowId={(r) => r.id} />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="bg-background p-4">
      <DataTable columns={COLUMNS} data={SAMPLE_DATA} density="compact" getRowId={(r) => r.id} />
    </div>
  ),
};

export const Comfortable: Story = {
  render: () => (
    <div className="bg-background p-4">
      <DataTable columns={COLUMNS} data={SAMPLE_DATA} density="comfortable" getRowId={(r) => r.id} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="bg-background p-4">
      <DataTable columns={COLUMNS} data={[]} getRowId={(r) => r.id} />
    </div>
  ),
};
