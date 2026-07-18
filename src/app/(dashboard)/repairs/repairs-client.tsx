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

const repairSchema = z.object({
  repair_number: z.string().min(2, 'Repair Number is required'),
  qc_id: z.string().optional(),
  asset_id: z.string().min(2, 'Asset is required'),
  technician_id: z.string().min(2, 'Technician is required'),
  repair_date: z.string().optional(),
  completion_date: z.string().optional(),
  parts_replaced: z.string().optional(),
  repair_cost: z.string().optional(),
  description: z.string().min(5, 'Description is required'),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
  notes: z.string().optional(),
});

type RepairFormData = z.infer<typeof repairSchema>;

export const RepairsClient = () => {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RepairFormData>({
    resolver: zodResolver(repairSchema),
  });

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/repairs');
      if (response.ok) {
        const data = await response.json();
        setRepairs(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRepair(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (repair: any) => {
    setEditingRepair(repair);
    reset(repair);
    setIsModalOpen(true);
  };

  const handleDelete = async (repair: any) => {
    if (!confirm('Delete this repair record?')) return;
    
    try {
      const response = await fetch('/api/repairs/' + repair.id, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Repair deleted');
        fetchRepairs();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: RepairFormData) => {
    try {
      const url = editingRepair ? '/api/repairs/' + editingRepair.id : '/api/repairs';
      const method = editingRepair ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingRepair ? 'Repair updated' : 'Repair created');
        setIsModalOpen(false);
        fetchRepairs();
      }
    } catch {
      toast.error('Failed to save');
    }
  };

  const columns = [
    { id: 'repair_number', label: 'Repair #', sortable: true },
    { id: 'asset_id', label: 'Asset ID', sortable: true },
    { id: 'technician_id', label: 'Technician', sortable: true },
    { id: 'repair_date', label: 'Repair Date', sortable: true, render: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
    { id: 'repair_cost', label: 'Cost', sortable: false, render: (v: string) => v ? 'Rp ' + parseInt(v).toLocaleString() : '-' },
    { 
      id: 'status', 
      label: 'Status', 
      render: (value: string) => (
        <Badge variant={value === 'completed' ? 'success' : value === 'in_progress' ? 'warning' : value === 'cancelled' ? 'error' : 'info'}>
          {value?.replace('_', ' ')}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Repairs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage asset repairs and maintenance</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} />
          New Repair
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search repairs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={repairs}
        totalCount={repairs.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No repairs found"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRepair ? 'Edit Repair' : 'New Repair'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Repair Number" {...register('repair_number')} error={errors.repair_number?.message} required />
            <FormField label="Asset ID" {...register('asset_id')} error={errors.asset_id?.message} required />
          </div>
          <FormField label="Technician ID" {...register('technician_id')} error={errors.technician_id?.message} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Repair Date" type="date" {...register('repair_date')} />
            <FormField label="Completion Date" type="date" {...register('completion_date')} />
          </div>
          <FormField label="Parts Replaced" {...register('parts_replaced')} />
          <FormField label="Repair Cost" type="number" {...register('repair_cost')} />
          <FormField label="Description" {...register('description')} error={errors.description?.message} required />
          <FormField label="Notes" {...register('notes')} />
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingRepair ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};