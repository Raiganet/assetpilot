'use client';
import { useEffect, useState, useCallback } from 'react';
import { DataTable } from '@/components/data-display/data-table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/forms/form-field';
import { FormSelect } from '@/components/forms/form-select';
import { useToast } from '@/lib/hooks/use-toast';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { UserProfile } from '@/lib/types/user.types';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).optional(),
  full_name: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(['administrator', 'warehouse', 'technician', 'supervisor', 'management']),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

export const UsersClient = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(userSchema) });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
      if (debouncedSearch) params.append('search', debouncedSearch);
      const response = await fetch(`/api/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
        setTotalCount(data.total);
      }
    } finally { setLoading(false); }
  }, [page, pageSize, debouncedSearch]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreate = () => { setEditingUser(null); reset(); setIsModalOpen(true); };
  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    reset({ email: user.email, full_name: user.full_name, phone: user.phone, role: user.role, status: user.status });
    setIsModalOpen(true);
  };
  const handleDelete = async (user: UserProfile) => {
    if (!confirm(`Delete ${user.full_name}?`)) return;
    try {
      const response = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      if (response.ok) { toast.success('Deleted'); fetchUsers(); }
      else toast.error('Failed');
    } catch { toast.error('Failed'); }
  };

  const onSubmit = async (data: any) => {
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      const payload = editingUser ? { ...data, password: undefined } : data;
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (response.ok) { toast.success(editingUser ? 'Updated' : 'Created'); setIsModalOpen(false); fetchUsers(); }
      else toast.error('Failed');
    } catch { toast.error('Failed'); }
  };

  const columns = [
    { id: 'full_name', label: 'Name', sortable: true, render: (v: string, r: UserProfile) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">{v.charAt(0)}</div>
        <div><div className="font-medium">{v}</div><div className="text-sm text-gray-500">{r.email}</div></div>
      </div>
    )},
    { id: 'role', label: 'Role', sortable: true, render: (v: string) => <Badge variant={v === 'administrator' ? 'error' : v === 'supervisor' ? 'warning' : 'info'}>{v}</Badge> },
    { id: 'status', label: 'Status', sortable: true, render: (v: string) => <Badge variant={v === 'active' ? 'success' : v === 'inactive' ? 'warning' : 'error'}>{v}</Badge> },
    { id: 'phone', label: 'Phone' },
    { id: 'created_at', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
  ];

  const roleOptions = [
    { value: 'administrator', label: 'Administrator' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'technician', label: 'Technician' },
    { value: 'management', label: 'Management' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Users</h1><p className="text-gray-600 mt-1">Manage system users</p></div>
        <Button onClick={handleCreate} className="gap-2"><Plus size={20} />Add User</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
        </div>
      </div>
      <DataTable columns={columns} data={users} totalCount={totalCount} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'Create User'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Full Name" {...register('full_name')} error={errors.full_name?.message} required />
          <FormField label="Email" type="email" {...register('email')} error={errors.email?.message} required disabled={!!editingUser} />
          {!editingUser && <FormField label="Password" type="password" {...register('password')} error={errors.password?.message} required />}
          <FormField label="Phone" {...register('phone')} />
          <FormSelect label="Role" options={roleOptions} {...register('role')} required />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingUser ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outlined" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
