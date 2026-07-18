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
    const baseStyles = cn(
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      className
    );

    const variantStyles = {
      contained: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg',
      outlined: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
      text: 'text-primary-600 hover:bg-primary-50',
      glass: 'bg-glass-light backdrop-blur-md border border-white/20 text-gray-900 hover:bg-white/80',
    };

    const sizeStyles = {
      small: 'px-3 py-1.5 text-sm',
      medium: 'px-4 py-2 text-base',
      large: 'px-6 py-3 text-lg',
    };

    return (
      <MuiButton
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size])}
        disableElevation
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';