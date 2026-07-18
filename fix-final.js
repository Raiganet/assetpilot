const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Created: ' + filePath);
}

console.log('🚀 Creating fixed Warehouses and Assets pages...\n');

// ============================================
// WAREHOUSES PAGE
// ============================================
writeFile('src/app/(dashboard)/warehouses/page.tsx', `import { Metadata } from 'next';
import WarehousesClient from './warehouses-client';

export const metadata: Metadata = {
  title: 'Warehouses - AssetPilot',
};

export default function WarehousesPage() {
  return <WarehousesClient />;
}`);

writeFile('src/app/(dashboard)/warehouses/warehouses-client.tsx', `'use client';

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
}`);

// ============================================
// ASSETS PAGE
// ============================================
writeFile('src/app/(dashboard)/assets/page.tsx', `import { Metadata } from 'next';
import AssetsClient from './assets-client';

export const metadata: Metadata = {
  title: 'Assets - AssetPilot',
};

export default function AssetsPage() {
  return <AssetsClient />;
}`);

writeFile('src/app/(dashboard)/assets/assets-client.tsx', `'use client';

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
            <FormField label="Asset Type" {...register('asset_type')} error={errors.asset_type?.message} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Brand" {...register('brand')} error={errors.brand?.message} required />
            <FormField label="Model" {...register('model')} error={errors.model?.message} required />
          </div>
          <FormField label="Serial Number" {...register('serial_number')} error={errors.serial_number?.message} required />
          <FormField label="Barcode" {...register('barcode')} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Status" {...register('status')} />
            <FormField label="Condition" {...register('condition')} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingAsset ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}`);

console.log('\n✅ Warehouses and Assets pages created with fixed syntax!');
console.log('Next steps:');
console.log('1. git add .');
console.log('2. git commit -m "fix: create working warehouses and assets pages"');
console.log('3. git push');