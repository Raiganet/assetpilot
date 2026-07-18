'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-display/data-table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/forms/form-field';
import { FormSelect } from '@/components/forms/form-select';
import { useToast } from '@/lib/hooks/use-toast';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const assetSchema = z.object({
  asset_id: z.string().min(2, 'Asset ID is required'),
  asset_type: z.enum(['edc', 'sim_card', 'sam_card', 'battery', 'adapter', 'printer', 'scanner', 'other_device']),
  brand: z.string().min(2, 'Brand is required'),
  model: z.string().min(2, 'Model is required'),
  serial_number: z.string().min(2, 'Serial number is required'),
  barcode: z.string().optional(),
  status: z.enum(['ready_stock', 'deployed', 'on_technician', 'in_transit', 'in_qc', 'in_repair', 'scrap', 'lost', 'returned']).optional(),
  condition: z.enum(['good', 'minor_damage', 'major_damage', 'broken', 'repair_required', 'scrap']).optional(),
});

export default function AssetsClient() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(assetSchema),
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assets');
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAsset(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (asset: any) => {
    setEditingAsset(asset);
    reset(asset);
    setIsModalOpen(true);
  };

  const handleDelete = async (asset: any) => {
    if (!confirm('Delete asset ' + asset.asset_id + '?')) return;
    try {
      const response = await fetch('/api/assets/' + asset.id, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Asset deleted');
        fetchAssets();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const url = editingAsset ? '/api/assets/' + editingAsset.id : '/api/assets';
      const method = editingAsset ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success(editingAsset ? 'Asset updated' : 'Asset created');
        setIsModalOpen(false);
        fetchAssets();
      }
    } catch {
      toast.error('Failed to save');
    }
  };

  const columns = [
    { id: 'asset_id', label: 'Asset ID', sortable: true },
    { id: 'asset_type', label: 'Type', sortable: true },
    { id: 'brand', label: 'Brand', sortable: true },
    { id: 'model', label: 'Model', sortable: true },
    { id: 'serial_number', label: 'Serial Number', sortable: true },
    { 
      id: 'status', 
      label: 'Status', 
      render: (value: any) => (
        <Badge variant={value === 'ready_stock' ? 'success' : value === 'deployed' ? 'info' : value === 'in_repair' ? 'warning' : 'error'}>
          {value?.replace('_', ' ') || 'Unknown'}
        </Badge>
      )
    },
    { 
      id: 'condition', 
      label: 'Condition', 
      render: (value: any) => (
        <Badge variant={value === 'good' ? 'success' : value === 'minor_damage' ? 'warning' : 'error'}>
          {value?.replace('_', ' ') || 'Unknown'}
        </Badge>
      )
    },
  ];

  const assetTypeOptions = [
    { value: 'edc', label: 'EDC' },
    { value: 'sim_card', label: 'SIM Card' },
    { value: 'sam_card', label: 'SAM Card' },
    { value: 'battery', label: 'Battery' },
    { value: 'adapter', label: 'Adapter' },
    { value: 'printer', label: 'Printer' },
    { value: 'scanner', label: 'Scanner' },
    { value: 'other_device', label: 'Other Device' },
  ];

  const assetStatusOptions = [
    { value: 'ready_stock', label: 'Ready Stock' },
    { value: 'deployed', label: 'Deployed' },
    { value: 'on_technician', label: 'On Technician' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'in_qc', label: 'In QC' },
    { value: 'in_repair', label: 'In Repair' },
    { value: 'scrap', label: 'Scrap' },
    { value: 'lost', label: 'Lost' },
    { value: 'returned', label: 'Returned' },
  ];

  const assetConditionOptions = [
    { value: 'good', label: 'Good' },
    { value: 'minor_damage', label: 'Minor Damage' },
    { value: 'major_damage', label: 'Major Damage' },
    { value: 'broken', label: 'Broken' },
    { value: 'repair_required', label: 'Repair Required' },
    { value: 'scrap', label: 'Scrap' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assets</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage EDC assets and devices</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} />
          Add Asset
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={assets}
        totalCount={assets.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No assets found"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAsset ? 'Edit Asset' : 'Create Asset'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Asset ID" {...register('asset_id')} error={errors.asset_id?.message} required />
            <FormSelect label="Asset Type" options={assetTypeOptions} {...register('asset_type')} error={errors.asset_type?.message} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Brand" {...register('brand')} error={errors.brand?.message} required />
            <FormField label="Model" {...register('model')} error={errors.model?.message} required />
          </div>
          <FormField label="Serial Number" {...register('serial_number')} error={errors.serial_number?.message} required />
          <FormField label="Barcode" {...register('barcode')} />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Status" options={assetStatusOptions} {...register('status')} />
            <FormSelect label="Condition" options={assetConditionOptions} {...register('condition')} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingAsset ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}