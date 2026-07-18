'use client';
import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface Option { value: string; label: string; }
interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string; options: Option[]; error?: string; placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, placeholder, className, ...props }, ref) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}{props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select ref={ref} className={cn('w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500', error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600', className)} {...props}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
);
FormSelect.displayName = 'FormSelect';
