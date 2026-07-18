'use client';

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
}