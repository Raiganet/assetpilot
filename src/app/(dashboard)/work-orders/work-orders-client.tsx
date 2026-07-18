'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-display/data-table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/forms/form-field';
import { FormSelect } from '@/components/forms/form-select';
import { useToast } from '@/lib/hooks/use-toast';
import { Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const woSchema = z.object({
  wo_number: z.string().min(2, 'WO Number is required'),
  reference_number: z.string().optional(),
  merchant_id: z.string().min(2, 'Merchant is required'),
  technician_id: z.string().optional(),
  service_point: z.string().optional(),
  target_date: z.string().min(1, 'Target date is required'),
  response_date: z.string().optional(),
  description: z.string().min(5, 'Description is required'),
  activity: z.string().optional(),
  case_type: z.enum(['installation', 'replacement', 'maintenance', 'repair', 'withdrawal', 'inspection']),
  product: z.string().optional(),
  serial_number: z.string().optional(),
  sim_number: z.string().optional(),
  status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'on_hold']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  notes: z.string().optional(),
});

type WOFormData = z.infer<typeof woSchema>;

export const WorkOrdersClient = () => {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWO, setEditingWO] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<WOFormData>({
    resolver: zodResolver(woSchema),
  });

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/work-orders');
      if (response.ok) {
        const data = await response.json();
        setWorkOrders(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingWO(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (wo: any) => {
    setEditingWO(wo);
    reset(wo);
    setIsModalOpen(true);
  };

  const handleDelete = async (wo: any) => {
    if (!confirm('Delete this work order?')) return;
    
    try {
      const response = await fetch('/api/work-orders/' + wo.id, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Work order deleted');
        fetchWorkOrders();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: WOFormData) => {
    try {
      const url = editingWO ? '/api/work-orders/' + editingWO.id : '/api/work-orders';
      const method = editingWO ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingWO ? 'Work order updated' : 'Work order created');
        setIsModalOpen(false);
        fetchWorkOrders();
      }
    } catch {
      toast.error('Failed to save');
    }
  };

  const columns = [
    { id: 'wo_number', label: 'WO Number', sortable: true },
    { id: 'merchant_name', label: 'Merchant', sortable: true },
    { id: 'case_type', label: 'Case Type', sortable: true },
    { id: 'target_date', label: 'Target Date', sortable: true, render: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
    { 
      id: 'status', 
      label: 'Status', 
      render: (value: string) => (
        <Badge variant={value === 'completed' ? 'success' : value === 'in_progress' ? 'info' : value === 'pending' ? 'warning' : value === 'cancelled' ? 'error' : 'default'}>
          {value?.replace('_', ' ')}
        </Badge>
      )
    },
    { 
      id: 'priority', 
      label: 'Priority', 
      render: (value: string) => (
        <Badge variant={value === 'urgent' ? 'error' : value === 'high' ? 'warning' : value === 'normal' ? 'info' : 'default'}>
          {value}
        </Badge>
      )
    },
  ];

  const caseTypeOptions = [
    { value: 'installation', label: 'Installation' },
    { value: 'replacement', label: 'Replacement' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'repair', label: 'Repair' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'inspection', label: 'Inspection' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'on_hold', label: 'On Hold' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Work Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage service requests and assignments</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} />
          Create Work Order
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search work orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={workOrders}
        totalCount={workOrders.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No work orders found"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingWO ? 'Edit Work Order' : 'Create Work Order'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="WO Number" {...register('wo_number')} error={errors.wo_number?.message} required />
            <FormField label="Reference Number" {...register('reference_number')} />
          </div>
          <FormField label="Merchant ID" {...register('merchant_id')} error={errors.merchant_id?.message} required />
          <FormField label="Technician ID" {...register('technician_id')} />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Case Type" options={caseTypeOptions} {...register('case_type')} required />
            <FormSelect label="Priority" options={priorityOptions} {...register('priority')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Target Date" type="date" {...register('target_date')} error={errors.target_date?.message} required />
            <FormField label="Response Date" type="date" {...register('response_date')} />
          </div>
          <FormField label="Service Point" {...register('service_point')} />
          <FormField label="Description" {...register('description')} error={errors.description?.message} required />
          <FormField label="Activity" {...register('activity')} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Product" {...register('product')} />
            <FormField label="Serial Number" {...register('serial_number')} />
          </div>
          <FormField label="SIM Number" {...register('sim_number')} />
          <FormSelect label="Status" options={statusOptions} {...register('status')} />
          <FormField label="Notes" {...register('notes')} />
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingWO ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};