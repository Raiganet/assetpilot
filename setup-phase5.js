// setup-phase5.js - AssetPilot Phase 5 Setup Script
const fs = require('fs');
const path = require('path');

function mkdirp(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log('📁 Created: ' + dirPath);
  }
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  mkdirp(dir);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Created: ' + filePath);
}

console.log('🚀 Starting AssetPilot Phase 5 Setup...\n');

// ============================================
// QC PAGE
// ============================================
const qcPage = `import { Metadata } from 'next';
import { QCClient } from './qc-client';

export const metadata: Metadata = {
  title: 'Quality Check - AssetPilot',
};

export default function QCPage() {
  return <QCClient />;
}`;

writeFile('src/app/(dashboard)/qc/page.tsx', qcPage);

const qcClient = `'use client';

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
};`;

writeFile('src/app/(dashboard)/qc/qc-client.tsx', qcClient);

// ============================================
// REPAIRS PAGE
// ============================================
const repairsPage = `import { Metadata } from 'next';
import { RepairsClient } from './repairs-client';

export const metadata: Metadata = {
  title: 'Repairs - AssetPilot',
};

export default function RepairsPage() {
  return <RepairsClient />;
}`;

writeFile('src/app/(dashboard)/repairs/page.tsx', repairsPage);

const repairsClient = `'use client';

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
};`;

writeFile('src/app/(dashboard)/repairs/repairs-client.tsx', repairsClient);

// ============================================
// STOCK PAGE
// ============================================
const stockPage = `import { Metadata } from 'next';
import { StockClient } from './stock-client';

export const metadata: Metadata = {
  title: 'Stock - AssetPilot',
};

export default function StockPage() {
  return <StockClient />;
}`;

writeFile('src/app/(dashboard)/stock/page.tsx', stockPage);

const stockClient = `'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-display/data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Boxes, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';

export const StockClient = () => {
  const [stock, setStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);

  const toast = useToast();

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stock');
      if (response.ok) {
        const data = await response.json();
        setStock(data);
        
        const total = data.reduce((sum: number, item: any) => {
          return sum + (parseFloat(item.purchase_cost) || 0);
        }, 0);
        setTotalValue(total);
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'asset_id', label: 'Asset ID', sortable: true },
    { id: 'asset_type', label: 'Type', sortable: true },
    { id: 'brand', label: 'Brand', sortable: true },
    { id: 'model', label: 'Model', sortable: true },
    { id: 'serial_number', label: 'Serial Number', sortable: true },
    { 
      id: 'condition', 
      label: 'Condition', 
      render: (value: string) => (
        <Badge variant={value === 'good' ? 'success' : value === 'minor_damage' ? 'warning' : 'error'}>
          {value?.replace('_', ' ')}
        </Badge>
      )
    },
    { id: 'warehouse_name', label: 'Warehouse', sortable: true },
    { id: 'purchase_cost', label: 'Value', sortable: true, render: (v: string) => v ? 'Rp ' + parseInt(v).toLocaleString() : '-' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage available assets in warehouse</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assets</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stock.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500">
              <Boxes className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">Rp {totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Warehouses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {new Set(stock.map((s: any) => s.warehouse_id)).size}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={stock}
        totalCount={stock.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        loading={loading}
        emptyMessage="No stock available"
        actions={false}
      />
    </div>
  );
};`;

writeFile('src/app/(dashboard)/stock/stock-client.tsx', stockClient);

console.log('\n');
console.log('═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║   ✅  PHASE 5 PAGES COMPLETE!                            ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('\n');
console.log(' Pages created:');
console.log('  ✅ Quality Check (QC) - Full CRUD with condition tracking');
console.log('  ✅ Repairs - Full CRUD with cost tracking');
console.log('  ✅ Stock Management - View only with statistics');
console.log('\n');
console.log('Next Steps:');
console.log('  1. Commit and push to GitHub');
console.log('  2. Wait for Vercel deployment');
console.log('  3. Test all pages');
console.log('\n');
console.log('Note: After this, you can duplicate these pages for:');
console.log('  - Work Orders');
console.log('  - Withdrawals');
console.log('  - Receives');
console.log('');