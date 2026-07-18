'use client';

import { ReactNode } from 'react';
import { useAuthContext } from './auth-provider';
import { hasPermission } from '@/lib/utils/permissions';
import type { ModulePermissions } from '@/lib/types/user.types';

interface PermissionGuardProps {
  module: keyof ModulePermissions;
  action?: keyof typeof hasPermission extends (role: any, module: any, action: infer A) => any ? A : never;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard = ({
  module,
  action = 'canView',
  children,
  fallback = null,
}: PermissionGuardProps) => {
  const { profile } = useAuthContext();

  if (!profile) return <>{fallback}</>;

  const permitted = hasPermission(profile.role, module, action as any);

  return permitted ? <>{children}</> : <>{fallback}</>;
};