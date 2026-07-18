'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-display/data-table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/forms/form-field';
import { FormSelect } from '@/components/forms/form-select';
import { useToast } from '@/lib/hooks/use-toast';
import { Plus, Search, CheckCircle, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const qcSchema = z.object({
  qc_number: z.string().min(2, 'QC Number is required'),
  receive_id: z.string().optional(),
  asset_id: z.string().min(2, 'Asset is required'),
  condition: z.enum(['good', 'minor_damage', 'major_damage', 'broken', 'repair_required', 'scrap']),
  check_result: z.enum(['pass', 'fail', 'repair_required']),
  defects_description: z.string().optional(),
  repair_required: z.boolean().optional(),
  repair_notes: z.string().optional(),
  status: z.enum(['pending', 'completed', 'rejected']).optional(),
});

type QCFormData = z.infer<typeof qcSchema>;

export const QCClient = () => {
  const [qcRecords, setQcRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQC, setEditingQC] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<QCFormData>({
    resolver: zodResolver(qcSchema),
  });

  useEffect(() => {
    fetchQC();
  }, []);

  const fetchQC = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/qc');
      if (response.ok) {
        const data = await response.json();
        setQcRecords(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingQC(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (qc: any) => {
    setEditingQC(qc);
    reset(qc);
    setIsModalOpen(true);
  };

  const handleDelete = async (qc: any) => {
    if (!confirm('Delete this QC record?')) return;
    
    try {
      const response = await fetch('/api/qc/' + qc.id, { method: 'DELETE' });
      if (response.ok) {
        toast.success('QC record deleted');
        fetchQC();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: QCFormData) => {
    try {
      const url = editingQC ? '/api/qc/' + editingQC.id : '/api/qc';
      const method = editingQC ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingQC ? 'QC updated' : 'QC created');
        setIsModalOpen(false);
        fetchQC();
      }
    } catch {
      toast.error('Failed to save');
    }
  };

  const columns = [
    { id: 'qc_number', label: 'QC Number', sortable: true },
    { id: 'asset_id', label: 'Asset ID', sortable: true },
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
      id: 'check_result', 
      label: 'Result', 
      render: (value: string) => (
        <Badge variant={value === 'pass' ? 'success' : value === 'fail' ? 'error' : 'warning'}>
          {value?.replace('_', ' ').toUpperCase()}
        </Badge>
      )
    },
    { id: 'qc_date', label: 'Date', sortable: true, render: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
    { 
      id: 'status', 
      label: 'Status', 
      render: (value: string) => (
        <Badge variant={value === 'completed' ? 'success' : value === 'pending' ? 'warning' : 'error'}>
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

  const resultOptions = [
    { value: 'pass', label: 'Pass' },
    { value: 'fail', label: 'Fail' },
    { value: 'repair_required', label: 'Repair Required' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quality Check</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Inspect and validate received assets</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} />
          New QC
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search QC records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={qcRecords}
        totalCount={qcRecords.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No QC records found"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingQC ? 'Edit QC' : 'New Quality Check'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="QC Number" {...register('qc_number')} error={errors.qc_number?.message} required />
            <FormField label="Asset ID" {...register('asset_id')} error={errors.asset_id?.message} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Condition" options={conditionOptions} {...register('condition')} required />
            <FormSelect label="Check Result" options={resultOptions} {...register('check_result')} required />
          </div>
          <FormField label="Defects Description" {...register('defects_description')} />
          <FormField label="Repair Notes" {...register('repair_notes')} />
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register('repair_required')} className="w-4 h-4" />
            <label className="text-sm font-medium">Repair Required</label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingQC ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};