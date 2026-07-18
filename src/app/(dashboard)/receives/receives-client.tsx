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

const receiveSchema = z.object({
  receive_number: z.string().min(2, 'Receive Number is required'),
  withdrawal_id: z.string().min(2, 'Withdrawal is required'),
  warehouse_id: z.string().min(2, 'Warehouse is required'),
  asset_id: z.string().min(2, 'Asset is required'),
  serial_number: z.string().min(2, 'Serial Number is required'),
  wo_number: z.string().min(2, 'WO Number is required'),
  condition: z.enum(['good', 'minor_damage', 'major_damage', 'broken', 'repair_required', 'scrap']),
  rejection_reason: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'received', 'rejected']).optional(),
});

type ReceiveFormData = z.infer<typeof receiveSchema>;

export const ReceivesClient = () => {
  const [receives, setReceives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRCV, setEditingRCV] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReceiveFormData>({
    resolver: zodResolver(receiveSchema),
  });

  useEffect(() => {
    fetchReceives();
  }, []);

  const fetchReceives = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/receives');
      if (response.ok) {
        const data = await response.json();
        setReceives(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRCV(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (rcv: any) => {
    setEditingRCV(rcv);
    reset(rcv);
    setIsModalOpen(true);
  };

  const handleDelete = async (rcv: any) => {
    if (!confirm('Delete this receive record?')) return;
    
    try {
      const response = await fetch('/api/receives/' + rcv.id, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Receive deleted');
        fetchReceives();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: ReceiveFormData) => {
    try {
      const url = editingRCV ? '/api/receives/' + editingRCV.id : '/api/receives';
      const method = editingRCV ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingRCV ? 'Receive updated' : 'Receive created');
        setIsModalOpen(false);
        fetchReceives();
      }
    } catch {
      toast.error('Failed to save');
    }
  };

  const columns = [
    { id: 'receive_number', label: 'Receive #', sortable: true },
    { id: 'withdrawal_number', label: 'Withdrawal #', sortable: true },
    { id: 'warehouse_name', label: 'Warehouse', sortable: true },
    { id: 'asset_id', label: 'Asset ID', sortable: true },
    { id: 'receive_date', label: 'Date', sortable: true, render: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
    { 
      id: 'condition', 
      label: 'Condition', 
      render: (value: string) => (
        <Badge variant={value === 'good' ? 'success' : value === 'minor_damage' ? 'warning' : 'error'}>
          {value?.replace('_', ' ')}
        </Badge>
      )
    },
    { 
      id: 'status', 
      label: 'Status', 
      render: (value: string) => (
        <Badge variant={value === 'received' ? 'success' : value === 'pending' ? 'warning' : 'error'}>
          {value}
        </Badge>
      )
    },
  ];

  const conditionOptions = [
    { value: 'good', label: 'Good' },
    { value: 'minor_damage', label: 'Minor Damage' },
    { value: 'major_damage', label: 'Major Damage' },
    { value: 'broken', label: 'Broken' },
    { value: 'repair_required', label: 'Repair Required' },
    { value: 'scrap', label: 'Scrap' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'received', label: 'Received' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Receives</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track asset returns to warehouse</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} />
          New Receive
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search receives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={receives}
        totalCount={receives.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No receives found"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRCV ? 'Edit Receive' : 'New Receive'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Receive Number" {...register('receive_number')} error={errors.receive_number?.message} required />
            <FormField label="Withdrawal ID" {...register('withdrawal_id')} error={errors.withdrawal_id?.message} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Warehouse ID" {...register('warehouse_id')} error={errors.warehouse_id?.message} required />
            <FormField label="Asset ID" {...register('asset_id')} error={errors.asset_id?.message} required />
          </div>
          <FormField label="Serial Number" {...register('serial_number')} error={errors.serial_number?.message} required />
          <FormField label="WO Number" {...register('wo_number')} error={errors.wo_number?.message} required />
          <FormSelect label="Condition" options={conditionOptions} {...register('condition')} required />
          <FormSelect label="Status" options={statusOptions} {...register('status')} />
          <FormField label="Rejection Reason" {...register('rejection_reason')} />
          <FormField label="Notes" {...register('notes')} />
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingRCV ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};