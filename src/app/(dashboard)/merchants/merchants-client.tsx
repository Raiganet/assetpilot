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

const merchantSchema = z.object({
  merchant_name: z.string().min(2, 'Name must be at least 2 characters'),
  merchant_code: z.string().min(2, 'Code must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  contact_person: z.string().min(2, 'Contact person is required'),
  contact_phone: z.string().min(10, 'Phone must be at least 10 digits'),
  contact_email: z.string().email('Invalid email').optional().or(z.literal('')),
  mid: z.string().optional(),
  tid: z.string().optional(),
  notes: z.string().optional(),
});

type MerchantFormData = z.infer<typeof merchantSchema>;

export const MerchantsClient = () => {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MerchantFormData>({
    resolver: zodResolver(merchantSchema),
  });

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/merchants');
      if (response.ok) {
        const data = await response.json();
        setMerchants(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMerchant(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (merchant: any) => {
    setEditingMerchant(merchant);
    reset(merchant);
    setIsModalOpen(true);
  };

  const handleDelete = async (merchant: any) => {
    if (!confirm(`Delete merchant ${merchant.merchant_name}?`)) return;
    
    try {
      const response = await fetch(`/api/merchants/${merchant.id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Merchant deleted');
        fetchMerchants();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const onSubmit = async (data: MerchantFormData) => {
    try {
      const url = editingMerchant ? `/api/merchants/${editingMerchant.id}` : '/api/merchants';
      const method = editingMerchant ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingMerchant ? 'Merchant updated' : 'Merchant created');
        setIsModalOpen(false);
        fetchMerchants();
      }
    } catch {
      toast.error('Failed to save');
    }
  };

  const columns = [
    { id: 'merchant_name', label: 'Name', sortable: true },
    { id: 'merchant_code', label: 'Code', sortable: true },
    { id: 'city', label: 'City', sortable: true },
    { id: 'contact_person', label: 'Contact', sortable: false },
    { id: 'contact_phone', label: 'Phone', sortable: false },
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Merchants</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage merchants and retailers</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} />
          Add Merchant
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search merchants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={merchants}
        totalCount={merchants.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No merchants found"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMerchant ? 'Edit Merchant' : 'Create Merchant'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Merchant Name" {...register('merchant_name')} error={errors.merchant_name?.message} required />
            <FormField label="Merchant Code" {...register('merchant_code')} error={errors.merchant_code?.message} required />
          </div>
          <FormField label="Address" {...register('address')} error={errors.address?.message} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="City" {...register('city')} error={errors.city?.message} required />
            <FormField label="Province" {...register('province')} error={errors.province?.message} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Contact Person" {...register('contact_person')} error={errors.contact_person?.message} required />
            <FormField label="Phone" {...register('contact_phone')} error={errors.contact_phone?.message} required />
          </div>
          <FormField label="Email" type="email" {...register('contact_email')} error={errors.contact_email?.message} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="MID" {...register('mid')} />
            <FormField label="TID" {...register('tid')} />
          </div>
          <FormField label="Notes" {...register('notes')} />
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingMerchant ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
