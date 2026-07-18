'use client';

import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export const Skeleton = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) => {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
  };

  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{ width, height }}
    />
  );
};

export const CardSkeleton = () => (
  <div className="rounded-2xl bg-white p-6 shadow-md">
    <Skeleton variant="text" className="mb-4 h-6 w-1/3" />
    <Skeleton variant="text" className="mb-2 h-4 w-full" />
    <Skeleton variant="text" className="mb-2 h-4 w-5/6" />
    <Skeleton variant="text" className="h-4 w-4/6" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="rounded-2xl bg-white p-6 shadow-md">
    <Skeleton variant="text" className="mb-6 h-6 w-1/4" />
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton variant="text" className="h-10 flex-1" />
          <Skeleton variant="text" className="h-10 flex-1" />
          <Skeleton variant="text" className="h-10 flex-1" />
          <Skeleton variant="text" className="h-10 w-24" />
        </div>
      ))}
    </div>
  </div>
);