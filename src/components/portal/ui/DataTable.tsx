'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TacticalLabel } from './TacticalLabel';

type Density = 'compact' | 'default' | 'comfortable';

const rowHeight: Record<Density, string> = {
  compact: 'h-8',
  default: 'h-11',
  comfortable: 'h-14',
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  density?: Density;
  getRowId?: (row: TData) => string;
  /** Optional controlled filter value for global text search */
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  /** Fires when a row is clicked */
  onRowClick?: (row: TData) => void;
  /** Row index (0-based) to highlight as keyboard-focused */
  focusedRowIndex?: number;
  className?: string;
}

function DataTable<TData, TValue>({
  columns,
  data,
  density = 'default',
  getRowId,
  globalFilter,
  onGlobalFilterChange,
  onRowClick,
  focusedRowIndex,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(globalFilter !== undefined ? { globalFilter } : {}),
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    ...(onGlobalFilterChange ? { onGlobalFilterChange } : {}),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className={cn('w-full overflow-auto rounded-2xl border border-foreground/[0.06]', className)}>
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-portal-surface-2">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left border-b border-foreground/[0.06]"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className={cn(
                          'flex items-center gap-1 group',
                          canSort ? 'cursor-pointer' : 'cursor-default',
                        )}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        aria-sort={
                          sorted === 'asc'
                            ? 'ascending'
                            : sorted === 'desc'
                              ? 'descending'
                              : undefined
                        }
                      >
                        <TacticalLabel size="xs" className="group-hover:text-foreground/60 transition-colors">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TacticalLabel>
                        {canSort && (
                          <span className="text-foreground/20 group-hover:text-foreground/40 transition-colors">
                            {sorted === 'asc' ? (
                              <ChevronUp size={10} />
                            ) : sorted === 'desc' ? (
                              <ChevronDown size={10} />
                            ) : (
                              <ChevronsUpDown size={10} />
                            )}
                          </span>
                        )}
                      </button>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-foreground/30 text-xs font-medium"
              >
                No results.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                data-selected={row.getIsSelected()}
                data-kb-focused={focusedRowIndex !== undefined && row.index === focusedRowIndex ? '' : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={cn(
                  rowHeight[density],
                  'border-b border-foreground/[0.04] last:border-0 transition-colors',
                  'hover:bg-foreground/[0.02] data-[selected=true]:bg-portal-accent/[0.04]',
                  'data-[kb-focused]:bg-portal-accent/[0.06] data-[kb-focused]:outline-none',
                  onRowClick && 'cursor-pointer',
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 text-xs text-foreground/70 tabular-nums slashed-zero"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export { DataTable, type DataTableProps, type Density };
