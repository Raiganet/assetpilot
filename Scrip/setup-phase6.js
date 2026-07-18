// setup-phase6.js - AssetPilot Phase 6 Setup Script
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

console.log('🚀 Starting AssetPilot Phase 6 Setup...\n');

// ============================================
// WORK ORDERS PAGE
// ============================================
const woPage = `import { Metadata } from 'next';
import { WorkOrdersClient } from './work-orders-client';

export const metadata: Metadata = {
  title: 'Work Orders - AssetPilot',
};

export default function WorkOrdersPage() {
  return <WorkOrdersClient />;
}`;

writeFile('src/app/(dashboard)/work-orders/page.tsx', woPage);

const woClient = `'use client';

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

const woSchema = z.object({
  wo_number: z.string().min(2, 'WO Number is required'),
  reference_number: z.string().optional(),
  merchant_id: z.string().min(2, 'Merchant is required'),
  technician_id: z.string().optional(),
  service_point: z.string().optional(),
  target_date: z.string().min(1, 'Target date is required'),
  response_date: z.string().optional(),
  description: z.string().min(5, 'Description is required'),
  activity: z.string().optional(),
  case_type: z.enum(['installation', 'replacement', 'maintenance', 'repair', 'withdrawal', 'inspection']),
  product: z.string().optional(),
  serial_number: z.string().optional(),
  sim_number: z.string().optional(),
  status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'on_hold']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  notes: z.string().optional(),
});

type WOFormData = z.infer<typeof woSchema>;

export const WorkOrdersClient = () => {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWO, setEditingWO] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<WOFormData>({
    resolver: zodResolver(woSchema),
  });

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/work-orders');
      if (response.ok) {
        const data = await response.json();
        setWorkOrders(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingWO(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (wo: any) => {
    setEditingWO(wo);
    reset(wo);
    setIsModalOpen(true);
  };

  const handleDelete = async (wo: any) => {
    if (!confirm('Delete this work order?')) return;
    
    try {
      const response = await fetch('/api/work-orders/' + wo.id, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Work order deleted');
        fetchWorkOrders();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: WOFormData) => {
    try {
      const url = editingWO ? '/api/work-orders/' + editingWO.id : '/api/work-orders';
      const method = editingWO ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingWO ? 'Work order updated' : 'Work order created');
        setIsModalOpen(false);
        fetchWorkOrders();
      }
    } catch {
      toast.error('Failed to save');
    }
  };

  const columns = [
    { id: 'wo_number', label: 'WO Number', sortable: true },
    { id: 'merchant_name', label: 'Merchant', sortable: true },
    { id: 'case_type', label: 'Case Type', sortable: true },
    { id: 'target_date', label: 'Target Date', sortable: true, render: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
    { 
      id: 'status', 
      label: 'Status', 
      render: (value: string) => (
        <Badge variant={value === 'completed' ? 'success' : value === 'in_progress' ? 'info' : value === 'pending' ? 'warning' : value === 'cancelled' ? 'error' : 'default'}>
          {value?.replace('_', ' ')}
        </Badge>
      )
    },
    { 
      id: 'priority', 
      label: 'Priority', 
      render: (value: string) => (
        <Badge variant={value === 'urgent' ? 'error' : value === 'high' ? 'warning' : value === 'normal' ? 'info' : 'default'}>
          {value}
        </Badge>
      )
    },
  ];

  const caseTypeOptions = [
    { value: 'installation', label: 'Installation' },
    { value: 'replacement', label: 'Replacement' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'repair', label: 'Repair' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'inspection', label: 'Inspection' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'on_hold', label: 'On Hold' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Work Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage service requests and assignments</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} />
          Create Work Order
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search work orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={workOrders}
        totalCount={workOrders.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No work orders found"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingWO ? 'Edit Work Order' : 'Create Work Order'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="WO Number" {...register('wo_number')} error={errors.wo_number?.message} required />
            <FormField label="Reference Number" {...register('reference_number')} />
          </div>
          <FormField label="Merchant ID" {...register('merchant_id')} error={errors.merchant_id?.message} required />
          <FormField label="Technician ID" {...register('technician_id')} />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Case Type" options={caseTypeOptions} {...register('case_type')} required />
            <FormSelect label="Priority" options={priorityOptions} {...register('priority')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Target Date" type="date" {...register('target_date')} error={errors.target_date?.message} required />
            <FormField label="Response Date" type="date" {...register('response_date')} />
          </div>
          <FormField label="Service Point" {...register('service_point')} />
          <FormField label="Description" {...register('description')} error={errors.description?.message} required />
          <FormField label="Activity" {...register('activity')} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Product" {...register('product')} />
            <FormField label="Serial Number" {...register('serial_number')} />
          </div>
          <FormField label="SIM Number" {...register('sim_number')} />
          <FormSelect label="Status" options={statusOptions} {...register('status')} />
          <FormField label="Notes" {...register('notes')} />
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingWO ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};`;

writeFile('src/app/(dashboard)/work-orders/work-orders-client.tsx', woClient);

// ============================================
// WITHDRAWALS PAGE
// ============================================
const wdPage = `import { Metadata } from 'next';
import { WithdrawalsClient } from './withdrawals-client';

export const metadata: Metadata = {
  title: 'Withdrawals - AssetPilot',
};

export default function WithdrawalsPage() {
  return <WithdrawalsClient />;
}`;

writeFile('src/app/(dashboard)/withdrawals/page.tsx', wdPage);

const wdClient = `'use client';

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
};`;

writeFile('src/app/(dashboard)/withdrawals/withdrawals-client.tsx', wdClient);

// ============================================
// RECEIVES PAGE
// ============================================
const rcvPage = `import { Metadata } from 'next';
import { ReceivesClient } from './receives-client';

export const metadata: Metadata = {
  title: 'Receives - AssetPilot',
};

export default function ReceivesPage() {
  return <ReceivesClient />;
}`;

writeFile('src/app/(dashboard)/receives/page.tsx', rcvPage);

const rcvClient = `'use client';

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
};`;

writeFile('src/app/(dashboard)/receives/receives-client.tsx', rcvClient);

console.log('\n');
console.log('═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║   ✅  PHASE 6 PAGES COMPLETE!                            ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('\n');
console.log('📦 Pages created:');
console.log('  ✅ Work Orders - Full CRUD with case types & priority');
console.log('  ✅ Withdrawals - Full CRUD with GPS tracking');
console.log('  ✅ Receives - Full CRUD with condition validation');
console.log('\n');
console.log('🎯 All core workflow pages are now complete!');
console.log('\n');
console.log('Next Steps:');
console.log('  1. Commit and push to GitHub');
console.log('  2. Wait for Vercel deployment');
console.log('  3. Test all workflow pages');
console.log('\n');
console.log('📋 Remaining pages to duplicate:');
console.log('  - Reports (from Dashboard)');
console.log('  - Logs (from Recent Activities)');
console.log('  - Settings (basic form)');
console.log('');