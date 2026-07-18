'use client';

import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, options);
  };

  const error = (message: string, options?: ToastOptions) => {
    sonnerToast.error(message, options);
  };

  const info = (message: string, options?: ToastOptions) => {
    sonnerToast.info(message, options);
  };

  const warning = (message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, options);
  };

  return { success, error, info, warning };
};