'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-display/data-table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/forms/form-field';
import { useToast } from '@/lib/hooks/use-toast';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const warehouseSchema = z.object({
  warehouse_name: z.string().min(2, 'Name is required'),
  warehouse_code: z.string().min(2, 'Code is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postal_code: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export default function WarehousesClient() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(warehouseSchema),
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/warehouses');
      if (response.ok) {
        const data = await response.json();
        setWarehouses(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingWarehouse(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (warehouse: any) => {
    setEditingWarehouse(warehouse);
    reset(warehouse);
    setIsModalOpen(true);
  };

  const handleDelete = async (warehouse: any) => {
    if (!confirm('Delete warehouse ' + warehouse.warehouse_name + '?')) return;
    try {
      const response = await fetch('/api/warehouses/' + warehouse.id, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Warehouse deleted');
        fetchWarehouses();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const url = editingWarehouse ? '/api/warehouses/' + editingWarehouse.id : '/api/warehouses';
      const method = editingWarehouse ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success(editingWarehouse ? 'Warehouse updated' : 'Warehouse created');
        setIsModalOpen(false);
        fetchWarehouses();
      }
    } catch {
      toast.error('Failed to save');
    }
  };

  const columns = [
    { id: 'warehouse_name', label: 'Name', sortable: true },
    { id: 'warehouse_code', label: 'Code', sortable: true },
    { id: 'city', label: 'City', sortable: true },
    { id: 'province', label: 'Province', sortable: false },
    { id: 'phone', label: 'Phone', sortable: false },
    { 
      id: 'status', 
      label: 'Status', 
      render: (value: any) => (
        <Badge variant={value === 'active' ? 'success' : 'warning'}>
          {value || 'Unknown'}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Warehouses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage warehouse locations</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} />
          Add Warehouse
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={warehouses}
        totalCount={warehouses.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No warehouses found"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingWarehouse ? 'Edit Warehouse' : 'Create Warehouse'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Warehouse Name" {...register('warehouse_name')} error={errors.warehouse_name?.message} required />
            <FormField label="Warehouse Code" {...register('warehouse_code')} error={errors.warehouse_code?.message} required />
          </div>
          <FormField label="Address" {...register('address')} error={errors.address?.message} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="City" {...register('city')} error={errors.city?.message} required />
            <FormField label="Province" {...register('province')} error={errors.province?.message} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Postal Code" {...register('postal_code')} />
            <FormField label="Phone" {...register('phone')} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingWarehouse ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}