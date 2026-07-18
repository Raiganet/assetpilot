import type { UserRole, ModulePermissions } from '@/lib/types/user.types';

const FULL_ACCESS = {
  canView: true,
  canCreate: true,
  canUpdate: true,
  canDelete: true,
  canExport: true,
};

const READ_ONLY = {
  canView: true,
  canCreate: false,
  canUpdate: false,
  canDelete: false,
  canExport: true,
};

const NO_ACCESS = {
  canView: false,
  canCreate: false,
  canUpdate: false,
  canDelete: false,
  canExport: false,
};

export const ROLE_PERMISSIONS: Record<UserRole, ModulePermissions> = {
  administrator: {
    dashboard: FULL_ACCESS,
    users: FULL_ACCESS,
    merchants: FULL_ACCESS,
    technicians: FULL_ACCESS,
    assets: FULL_ACCESS,
    warehouses: FULL_ACCESS,
    workOrders: FULL_ACCESS,
    withdrawals: FULL_ACCESS,
    receives: FULL_ACCESS,
    qc: FULL_ACCESS,
    repairs: FULL_ACCESS,
    stock: FULL_ACCESS,
    reports: FULL_ACCESS,
    logs: FULL_ACCESS,
    settings: FULL_ACCESS,
  },
  supervisor: {
    dashboard: FULL_ACCESS,
    users: READ_ONLY,
    merchants: FULL_ACCESS,
    technicians: FULL_ACCESS,
    assets: FULL_ACCESS,
    warehouses: FULL_ACCESS,
    workOrders: FULL_ACCESS,
    withdrawals: FULL_ACCESS,
    receives: FULL_ACCESS,
    qc: FULL_ACCESS,
    repairs: FULL_ACCESS,
    stock: FULL_ACCESS,
    reports: FULL_ACCESS,
    logs: READ_ONLY,
    settings: READ_ONLY,
  },
  warehouse: {
    dashboard: READ_ONLY,
    users: NO_ACCESS,
    merchants: READ_ONLY,
    technicians: READ_ONLY,
    assets: FULL_ACCESS,
    warehouses: FULL_ACCESS,
    workOrders: READ_ONLY,
    withdrawals: READ_ONLY,
    receives: FULL_ACCESS,
    qc: FULL_ACCESS,
    repairs: READ_ONLY,
    stock: FULL_ACCESS,
    reports: READ_ONLY,
    logs: NO_ACCESS,
    settings: NO_ACCESS,
  },
  technician: {
    dashboard: READ_ONLY,
    users: NO_ACCESS,
    merchants: READ_ONLY,
    technicians: READ_ONLY,
    assets: READ_ONLY,
    warehouses: READ_ONLY,
    workOrders: {
      canView: true,
      canCreate: false,
      canUpdate: true,
      canDelete: false,
      canExport: false,
    },
    withdrawals: {
      canView: true,
      canCreate: true,
      canUpdate: true,
      canDelete: false,
      canExport: false,
    },
    receives: READ_ONLY,
    qc: READ_ONLY,
    repairs: {
      canView: true,
      canCreate: true,
      canUpdate: true,
      canDelete: false,
      canExport: false,
    },
    stock: READ_ONLY,
    reports: NO_ACCESS,
    logs: NO_ACCESS,
    settings: NO_ACCESS,
  },
  management: {
    dashboard: FULL_ACCESS,
    users: READ_ONLY,
    merchants: READ_ONLY,
    technicians: READ_ONLY,
    assets: READ_ONLY,
    warehouses: READ_ONLY,
    workOrders: READ_ONLY,
    withdrawals: READ_ONLY,
    receives: READ_ONLY,
    qc: READ_ONLY,
    repairs: READ_ONLY,
    stock: READ_ONLY,
    reports: FULL_ACCESS,
    logs: READ_ONLY,
    settings: READ_ONLY,
  },
};

export const hasPermission = (
  role: UserRole,
  module: keyof ModulePermissions,
  action: keyof typeof FULL_ACCESS
): boolean => {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions[module][action];
};

export const getAccessibleModules = (role: UserRole): string[] => {
  const permissions = ROLE_PERMISSIONS[role];
  return Object.entries(permissions)
    .filter(([, perms]) => perms.canView)
    .map(([module]) => module);
};