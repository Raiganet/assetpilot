'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-display/data-table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/forms/form-field';
import { useToast } from '@/lib/hooks/use-toast';
import { Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const withdrawalSchema = z.object({
  withdrawal_number: z.string().min(2, 'Withdrawal Number is required'),
  work_order_id: z.string().min(2, 'Work Order is required'),
  technician_id: z.string().min(2, 'Technician is required'),
  merchant_id: z.string().min(2, 'Merchant is required'),
  asset_id: z.string().min(2, 'Asset is required'),
  edc_barcode: z.string().min(2, 'EDC Barcode is required'),
  gps_latitude: z.string().optional(),
  gps_longitude: z.string().optional(),
  gps_address: z.string().optional(),
  google_maps_link: z.string().optional(),
  remarks: z.string().optional(),
  status: z.enum(['pending', 'submitted', 'approved', 'rejected']).optional(),
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

export const WithdrawalsClient = () => {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWD, setEditingWD] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
  });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/withdrawals');
      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingWD(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (wd: any) => {
    setEditingWD(wd);
    reset(wd);
    setIsModalOpen(true);
  };

  const handleDelete = async (wd: any) => {
    if (!confirm('Delete this withdrawal?')) return;
    
    try {
      const response = await fetch('/api/withdrawals/' + wd.id, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Withdrawal deleted');
        fetchWithdrawals();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: WithdrawalFormData) => {
    try {
      const url = editingWD ? '/api/withdrawals/' + editingWD.id : '/api/withdrawals';
      const method = editingWD ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingWD ? 'Withdrawal updated' : 'Withdrawal created');
        setIsModalOpen(false);
        fetchWithdrawals();
      }
    } catch {
      toast.error('Failed to save');
    }
  };

  const columns = [
    { id: 'withdrawal_number', label: 'Withdrawal #', sortable: true },
    { id: 'wo_number', label: 'WO Number', sortable: true },
    { id: 'merchant_name', label: 'Merchant', sortable: true },
    { id: 'asset_id', label: 'Asset ID', sortable: true },
    { id: 'withdrawal_date', label: 'Date', sortable: true, render: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
    { 
      id: 'status', 
      label: 'Status', 
      render: (value: string) => (
        <Badge variant={value === 'approved' ? 'success' : value === 'submitted' ? 'info' : value === 'pending' ? 'warning' : 'error'}>
          {value}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Withdrawals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track asset withdrawals from merchants</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} />
          New Withdrawal
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search withdrawals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={withdrawals}
        totalCount={withdrawals.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No withdrawals found"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingWD ? 'Edit Withdrawal' : 'New Withdrawal'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Withdrawal Number" {...register('withdrawal_number')} error={errors.withdrawal_number?.message} required />
            <FormField label="Work Order ID" {...register('work_order_id')} error={errors.work_order_id?.message} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Technician ID" {...register('technician_id')} error={errors.technician_id?.message} required />
            <FormField label="Merchant ID" {...register('merchant_id')} error={errors.merchant_id?.message} required />
          </div>
          <FormField label="Asset ID" {...register('asset_id')} error={errors.asset_id?.message} required />
          <FormField label="EDC Barcode" {...register('edc_barcode')} error={errors.edc_barcode?.message} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="GPS Latitude" {...register('gps_latitude')} />
            <FormField label="GPS Longitude" {...register('gps_longitude')} />
          </div>
          <FormField label="GPS Address" {...register('gps_address')} />
          <FormField label="Google Maps Link" {...register('google_maps_link')} />
          <FormField label="Remarks" {...register('remarks')} />
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingWD ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};