export type UserRole = 'administrator' | 'warehouse' | 'technician' | 'supervisor' | 'management';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
}

export interface UserUpdate {
  full_name?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface RolePermission {
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canExport: boolean;
}

export interface ModulePermissions {
  dashboard: RolePermission;
  users: RolePermission;
  merchants: RolePermission;
  technicians: RolePermission;
  assets: RolePermission;
  warehouses: RolePermission;
  workOrders: RolePermission;
  withdrawals: RolePermission;
  receives: RolePermission;
  qc: RolePermission;
  repairs: RolePermission;
  stock: RolePermission;
  reports: RolePermission;
  logs: RolePermission;
  settings: RolePermission;
}
