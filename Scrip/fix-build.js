// fix-build.js
const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Fixed: ' + filePath);
}

console.log('🚀 Applying build fixes...\n');

// ==========================================
// 1. FIX API ROUTES (Force Dynamic)
// ==========================================
const apiRoutes = [
  'src/app/api/dashboard/monthly/route.ts',
  'src/app/api/dashboard/recent-activities/route.ts',
  'src/app/api/dashboard/stats/route.ts',
  'src/app/api/dashboard/top-technicians/route.ts',
  'src/app/api/users/route.ts',
  'src/app/api/users/[id]/route.ts',
  'src/app/api/merchants/route.ts',
  'src/app/api/merchants/[id]/route.ts',
  'src/app/api/technicians/route.ts',
  'src/app/api/technicians/[id]/route.ts',
  'src/app/api/assets/route.ts',
  'src/app/api/assets/[id]/route.ts',
  'src/app/api/warehouses/route.ts',
  'src/app/api/warehouses/[id]/route.ts',
  'src/app/api/work-orders/route.ts',
  'src/app/api/work-orders/[id]/route.ts',
  'src/app/api/withdrawals/route.ts',
  'src/app/api/withdrawals/[id]/route.ts',
  'src/app/api/receives/route.ts',
  'src/app/api/receives/[id]/route.ts',
  'src/app/api/qc/route.ts',
  'src/app/api/qc/[id]/route.ts',
  'src/app/api/repairs/route.ts',
  'src/app/api/repairs/[id]/route.ts',
  'src/app/api/stock/route.ts',
  'src/app/api/logs/route.ts',
];

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    let content = fs.readFileSync(route, 'utf8');
    if (!content.includes("export const dynamic = 'force-dynamic';")) {
      content = "export const dynamic = 'force-dynamic';\n" + content;
      fs.writeFileSync(route, content, 'utf8');
      console.log('✅ Added force-dynamic to: ' + route);
    }
  }
});

// ==========================================
// 2. FIX MISSING UI COMPONENTS
// ==========================================
const dataTableContent = `'use client';
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
}`;

writeFile('src/components/data-display/data-table.tsx', dataTableContent);

const formFieldContent = `'use client';
import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string; error?: string; icon?: LucideIcon;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, icon: Icon, className, ...props }, ref) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}{props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon size={20} /></div>}
        <input ref={ref} className={cn('w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500', Icon && 'pl-10', error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600', className)} {...props} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
);
FormField.displayName = 'FormField';`;

writeFile('src/components/forms/form-field.tsx', formFieldContent);

const formSelectContent = `'use client';
import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface Option { value: string; label: string; }
interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string; options: Option[]; error?: string; placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, placeholder, className, ...props }, ref) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}{props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select ref={ref} className={cn('w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500', error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600', className)} {...props}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
);
FormSelect.displayName = 'FormSelect';`;

writeFile('src/components/forms/form-select.tsx', formSelectContent);

console.log('\n✅ Build fixes applied successfully!');
console.log('Next steps:');
console.log('1. git add .');
console.log('2. git commit -m "fix: add force-dynamic to API routes and missing components"');
console.log('3. git push');