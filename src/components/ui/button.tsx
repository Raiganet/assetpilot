'use client';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { cn } from '@/lib/utils/cn';
import { forwardRef } from 'react';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text' | 'glass';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'contained', children, ...props }, ref) => {
    const variantStyles = {
      contained: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md',
      outlined: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
      text: 'text-primary-600 hover:bg-primary-50',
      glass: 'bg-white/70 backdrop-blur-md border border-white/20 text-gray-900',
    };
    return (
      <MuiButton ref={ref} className={cn('font-medium rounded-lg transition-all', variantStyles[variant], className)} disableElevation {...props}>
        {children}
      </MuiButton>
    );
  }
);
Button.displayName = 'Button';