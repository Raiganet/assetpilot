'use client';
import { cn } from '@/lib/utils/cn';

export const Skeleton = ({ className, variant = 'text', width, height }: any) => {
  const variants = { text: 'h-4 rounded', circular: 'rounded-full', rectangular: 'rounded-lg' };
  return <div className={cn('bg-gray-200 dark:bg-gray-700 animate-pulse', variants[variant], className)} style={{ width, height }} />;
};
