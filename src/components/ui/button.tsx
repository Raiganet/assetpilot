'use client';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { cn } from '@/lib/utils/cn';
import { forwardRef } from 'react';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text' | 'glass';
  size?: 'small' | 'medium' | 'large';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'contained', size = 'medium', children, ...props }, ref) => {
    const variantStyles = {
      contained: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md',
      outlined: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
      text: 'text-primary-600 hover:bg-primary-50',
      glass: 'bg-white/70 backdrop-blur-md border border-white/20 text-gray-900',
    };
    const sizeStyles = { small: 'px-3 py-1.5 text-sm', medium: 'px-4 py-2 text-base', large: 'px-6 py-3 text-lg' };
    return (
      <MuiButton ref={ref} className={cn('font-medium rounded-lg transition-all', variantStyles[variant], sizeStyles[size], className)} disableElevation {...props}>
        {children}
      </MuiButton>
    );
  }
);
Button.displayName = 'Button';
