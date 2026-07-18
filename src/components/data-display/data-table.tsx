'use client';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TableSortLabel, IconButton, Tooltip } from '@mui/material';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Column<T> {
  id: string; label: string; minWidth?: number; align?: 'left' | 'right' | 'center';
  sortable?: boolean; render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[]; data: T[]; totalCount: number;
  page: number; pageSize: number;
  onPageChange: (page: number) => void; onPageSizeChange: (size: number) => void;
  onEdit?: (row: T) => void; onDelete?: (row: T) => void; onView?: (row: T) => void;
  loading?: boolean; emptyMessage?: string; actions?: boolean;
}

export function DataTable<T extends { id: string }>({ columns, data, totalCount, page, pageSize, onPageChange, onPageSizeChange, onEdit, onDelete, onView, loading, emptyMessage = 'No data', actions = true }: DataTableProps<T>) {
  if (loading) return <Card><div className="p-6 space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div></Card>;

  return (
    <Card variant="glass">
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>
                  {col.sortable ? <TableSortLabel>{col.label}</TableSortLabel> : col.label}
                </TableCell>
              ))}
              {actions && <TableCell align="center" style={{ minWidth: 150 }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center" className="py-12 text-gray-500">{emptyMessage}</TableCell></TableRow>
            ) : data.map((row) => (
              <TableRow key={row.id} hover className="cursor-pointer">
                {columns.map((col) => {
                  const value = (row as any)[col.id];
                  return <TableCell key={col.id} align={col.align}>{col.render ? col.render(value, row) : value}</TableCell>;
                })}
                {actions && (
                  <TableCell align="center">
                    <div className="flex items-center justify-center gap-1">
                      {onView && <Tooltip title="View"><IconButton size="small" onClick={() => onView(row)} className="text-blue-600"><Eye size={18} /></IconButton></Tooltip>}
                      {onEdit && <Tooltip title="Edit"><IconButton size="small" onClick={() => onEdit(row)} className="text-green-600"><Edit size={18} /></IconButton></Tooltip>}
                      {onDelete && <Tooltip title="Delete"><IconButton size="small" onClick={() => onDelete(row)} className="text-red-600"><Trash2 size={18} /></IconButton></Tooltip>}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination component="div" count={totalCount} page={page - 1} onPageChange={(_, p) => onPageChange(p + 1)} rowsPerPage={pageSize} onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value))} rowsPerPageOptions={[10, 25, 50, 100]} />
    </Card>
  );
}