'use client';
import { ReactNode } from 'react';
import { useAuthContext } from './auth-provider';
import { hasPermission } from '@/lib/utils/permissions';
import type { ModulePermissions } from '@/lib/types/user.types';

export const PermissionGuard = ({
  module, action = 'canView', children, fallback = null,
}: { module: keyof ModulePermissions; action?: any; children: ReactNode; fallback?: ReactNode }) => {
  const { profile } = useAuthContext();
  if (!profile) return <>{fallback}</>;
  return hasPermission(profile.role, module, action) ? <>{children}</> : <>{fallback}</>;
};
