const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Overwritten: ' + filePath);
}

console.log('🚀 Fixing Technicians page and components...\n');

// 1. Technicians Page (Default Import)
writeFile('src/app/(dashboard)/technicians/page.tsx', `import { Metadata } from 'next';
import TechniciansClient from './technicians-client';

export const metadata: Metadata = {
  title: 'Technicians - AssetPilot',
};

export default function TechniciansPage() {
  return <TechniciansClient />;
}`);

// 2. Technicians Client (Default Export)
writeFile('src/app/(dashboard)/technicians/technicians-client.tsx', `'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/data-display/data-table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/forms/form-field';
import { useToast } from '@/lib/hooks/use-toast';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const technicianSchema = z.object({
  employee_id: z.string().min(2, 'Employee ID is required'),
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  specialization: z.string().optional(),
  service_area: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).optional(),
});

export default function TechniciansClient() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<any>(null);

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(technicianSchema),
  });

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/technicians');
      if (response.ok) {
        const data = await response.json();
        setTechnicians(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTechnician(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (technician: any) => {
    setEditingTechnician(technician);
    reset(technician);
    setIsModalOpen(true);
  };

  const handleDelete = async (technician: any) => {
    if (!confirm('Delete technician ' + technician.full_name + '?')) return;
    try {
      const response = await fetch('/api/technicians/' + technician.id, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Technician deleted');
        fetchTechnicians();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const url = editingTechnician ? '/api/technicians/' + editingTechnician.id : '/api/technicians';
      const method = editingTechnician ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success(editingTechnician ? 'Technician updated' : 'Technician created');
        setIsModalOpen(false);
        fetchTechnicians();
      }
    } catch {
      toast.error('Failed to save');
    }
  };

  const columns = [
    { id: 'full_name', label: 'Name', sortable: true },
    { id: 'employee_id', label: 'Employee ID', sortable: true },
    { id: 'specialization', label: 'Specialization', sortable: false },
    { id: 'service_area', label: 'Service Area', sortable: false },
    { id: 'phone', label: 'Phone', sortable: false },
    { 
      id: 'status', 
      label: 'Status', 
      render: (value: any) => (
        <Badge variant={value === 'active' ? 'success' : value === 'inactive' ? 'warning' : 'error'}>
          {value || 'Unknown'}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Technicians</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage field technicians</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} />
          Add Technician
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={technicians}
        totalCount={technicians.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No technicians found"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTechnician ? 'Edit Technician' : 'Create Technician'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Employee ID" {...register('employee_id')} error={errors.employee_id?.message} required />
            <FormField label="Full Name" {...register('full_name')} error={errors.full_name?.message} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email" type="email" {...register('email')} error={errors.email?.message} required />
            <FormField label="Phone" {...register('phone')} error={errors.phone?.message} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Specialization" {...register('specialization')} />
            <FormField label="Service Area" {...register('service_area')} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingTechnician ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}`);

// 3. DataTable (Default Export)
writeFile('src/components/data-display/data-table.tsx', `'use client';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TableSortLabel, IconButton, Tooltip } from '@mui/material';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Column<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  actions?: boolean;
}

export default function DataTable<T extends { id: string }>({
  columns, data, totalCount, page, pageSize, onPageChange, onPageSizeChange,
  onEdit, onDelete, onView, loading, emptyMessage = 'No data', actions = true,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <Card>
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      </Card>
    );
  }

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
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center" className="py-12 text-gray-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div" count={totalCount} page={page - 1}
        onPageChange={(_, p) => onPageChange(p + 1)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value))}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Card>
  );
}`);

// 4. FormField (Named Export is fine here, but let's make it bulletproof)
writeFile('src/components/forms/form-field.tsx', `'use client';
import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, icon: Icon, className, ...props }, ref) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}{props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon size={20} /></div>}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500',
            Icon && 'pl-10',
            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
);
FormField.displayName = 'FormField';`);

console.log('\n✅ Technicians page and components fixed!');
console.log('Next steps:');
console.log('1. git add .');
console.log('2. git commit -m "fix: resolve unsupported server component type in technicians"');
console.log('3. git push');