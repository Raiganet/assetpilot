// setup-phase3.js - AssetPilot Phase 3 Setup Script
const fs = require('fs');
const path = require('path');

function mkdirp(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created: ${dirPath}`);
  }
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  mkdirp(dir);
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`✅ Created: ${filePath}`);
}

console.log('🚀 Starting AssetPilot Phase 3 Setup...\n');

// ============================================
// MERCHANTS API (Complete)
// ============================================
writeFile('src/app/api/merchants/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('merchants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch merchants' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('merchants')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create merchant' }, { status: 400 });
  }
}`);

writeFile('src/app/api/merchants/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('merchants')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update merchant' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('merchants')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Merchant deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete merchant' }, { status: 400 });
  }
}`);

// ============================================
// TECHNICIANS PAGE & API
// ============================================
writeFile('src/app/(dashboard)/technicians/page.tsx', `import { Metadata } from 'next';
import { TechniciansClient } from './technicians-client';

export const metadata: Metadata = {
  title: 'Technicians - AssetPilot',
};

export default function TechniciansPage() {
  return <TechniciansClient />;
}`);

writeFile('src/app/(dashboard)/technicians/technicians-client.tsx`, `'use client';

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

const technicianSchema = z.object({
  employee_id: z.string().min(2, 'Employee ID is required'),
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  specialization: z.string().optional(),
  service_area: z.string().optional(),
  emergency_contact: z.string().optional(),
  join_date: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).optional(),
});

type TechnicianFormData = z.infer<typeof technicianSchema>;

export const TechniciansClient = () => {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TechnicianFormData>({
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
    if (!confirm(\`Delete technician \${technician.full_name}?\`)) return;
    
    try {
      const response = await fetch(\`/api/technicians/\${technician.id}\`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Technician deleted');
        fetchTechnicians();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: TechnicianFormData) => {
    try {
      const url = editingTechnician ? \`/api/technicians/\${editingTechnician.id}\` : '/api/technicians';
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
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : value === 'inactive' ? 'warning' : 'error'}>
          {value}
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

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search technicians..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
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
          <FormField label="Emergency Contact" {...register('emergency_contact')} />
          <FormField label="Join Date" type="date" {...register('join_date')} />
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingTechnician ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};`);

writeFile('src/app/api/technicians/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('technicians')
      .select('*, profiles:profiles (full_name, email, phone)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch technicians' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('technicians')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create technician' }, { status: 400 });
  }
}`);

writeFile('src/app/api/technicians/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('technicians')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update technician' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('technicians')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Technician deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete technician' }, { status: 400 });
  }
}`);

// ============================================
// ASSETS PAGE & API
// ============================================
writeFile('src/app/(dashboard)/assets/page.tsx', `import { Metadata } from 'next';
import { AssetsClient } from './assets-client';

export const metadata: Metadata = {
  title: 'Assets - AssetPilot',
};

export default function AssetsPage() {
  return <AssetsClient />;
}`);

writeFile('src/app/(dashboard)/assets/assets-client.tsx`, `'use client';

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

const assetSchema = z.object({
  asset_id: z.string().min(2, 'Asset ID is required'),
  asset_type: z.enum(['edc', 'sim_card', 'sam_card', 'battery', 'adapter', 'printer', 'scanner', 'other_device']),
  brand: z.string().min(2, 'Brand is required'),
  model: z.string().min(2, 'Model is required'),
  serial_number: z.string().min(2, 'Serial number is required'),
  barcode: z.string().optional(),
  qr_code: z.string().optional(),
  status: z.enum(['ready_stock', 'deployed', 'on_technician', 'in_transit', 'in_qc', 'in_repair', 'scrap', 'lost', 'returned']).optional(),
  condition: z.enum(['good', 'minor_damage', 'major_damage', 'broken', 'repair_required', 'scrap']).optional(),
  purchase_date: z.string().optional(),
  purchase_cost: z.string().optional(),
  warranty_expiry: z.string().optional(),
  notes: z.string().optional(),
});

type AssetFormData = z.infer<typeof assetSchema>;

export const AssetsClient = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AssetFormData>({
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
    if (!confirm(\`Delete asset \${asset.asset_id}?\`)) return;
    
    try {
      const response = await fetch(\`/api/assets/\${asset.id}\`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Asset deleted');
        fetchAssets();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: AssetFormData) => {
    try {
      const url = editingAsset ? \`/api/assets/\${editingAsset.id}\` : '/api/assets';
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
      render: (value: string) => (
        <Badge variant={value === 'ready_stock' ? 'success' : value === 'deployed' ? 'info' : value === 'in_repair' ? 'warning' : 'error'}>
          {value?.replace('_', ' ')}
        </Badge>
      )
    },
    { 
      id: 'condition', 
      label: 'Condition', 
      render: (value: string) => (
        <Badge variant={value === 'good' ? 'success' : value === 'minor_damage' ? 'warning' : 'error'}>
          {value?.replace('_', ' ')}
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

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
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
            <FormSelect label="Asset Type" options={assetTypeOptions} {...register('asset_type')} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Brand" {...register('brand')} error={errors.brand?.message} required />
            <FormField label="Model" {...register('model')} error={errors.model?.message} required />
          </div>
          <FormField label="Serial Number" {...register('serial_number')} error={errors.serial_number?.message} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Barcode" {...register('barcode')} />
            <FormField label="QR Code" {...register('qr_code')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Status" options={assetStatusOptions} {...register('status')} />
            <FormSelect label="Condition" options={assetConditionOptions} {...register('condition')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Purchase Date" type="date" {...register('purchase_date')} />
            <FormField label="Purchase Cost" type="number" {...register('purchase_cost')} />
          </div>
          <FormField label="Warranty Expiry" type="date" {...register('warranty_expiry')} />
          <FormField label="Notes" {...register('notes')} />
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingAsset ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};`);

writeFile('src/app/api/assets/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('assets')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 400 });
  }
}`);

writeFile('src/app/api/assets/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('assets')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Asset deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 400 });
  }
}`);

// ============================================
// WAREHOUSES PAGE & API
// ============================================
writeFile('src/app/(dashboard)/warehouses/page.tsx', `import { Metadata } from 'next';
import { WarehousesClient } from './warehouses-client';

export const metadata: Metadata = {
  title: 'Warehouses - AssetPilot',
};

export default function WarehousesPage() {
  return <WarehousesClient />;
}`);

writeFile('src/app/(dashboard)/warehouses/warehouses-client.tsx`, `'use client';

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

const warehouseSchema = z.object({
  warehouse_name: z.string().min(2, 'Name is required'),
  warehouse_code: z.string().min(2, 'Code is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  capacity: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

type WarehouseFormData = z.infer<typeof warehouseSchema>;

export const WarehousesClient = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<WarehouseFormData>({
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
    if (!confirm(\`Delete warehouse \${warehouse.warehouse_name}?\`)) return;
    
    try {
      const response = await fetch(\`/api/warehouses/\${warehouse.id}\`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Warehouse deleted');
        fetchWarehouses();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: WarehouseFormData) => {
    try {
      const url = editingWarehouse ? \`/api/warehouses/\${editingWarehouse.id}\` : '/api/warehouses';
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
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'warning'}>
          {value}
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

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search warehouses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
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
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Postal Code" {...register('postal_code')} />
            <FormField label="Country" {...register('country')} />
            <FormField label="Capacity" type="number" {...register('capacity')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Phone" {...register('phone')} />
            <FormField label="Email" type="email" {...register('email')} error={errors.email?.message} />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingWarehouse ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};`);

writeFile('src/app/api/warehouses/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch warehouses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('warehouses')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create warehouse' }, { status: 400 });
  }
}`);

writeFile('src/app/api/warehouses/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('warehouses')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update warehouse' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('warehouses')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Warehouse deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete warehouse' }, { status: 400 });
  }
}`);

console.log('\\n');
console.log('═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║   ✅  PHASE 3 SETUP COMPLETE!                            ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('\\n');
console.log('📦 Pages created:');
console.log('  ✅ Merchants (CRUD + API)');
console.log('  ✅ Technicians (CRUD + API)');
console.log('  ✅ Assets (CRUD + API)');
console.log('  ✅ Warehouses (CRUD + API)');
console.log('\\n');
console.log(' Next Steps:');
console.log('  1. Commit and push to GitHub');
console.log('  2. Wait for Vercel deployment');
console.log('  3. Test all pages');
console.log('');