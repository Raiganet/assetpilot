'use client';
import { cn } from '@/lib/utils/cn';
export const Skeleton = ({ className }: any) => <div className={cn('bg-gray-200 dark:bg-gray-700 animate-pulse h-4 rounded', className)} />;