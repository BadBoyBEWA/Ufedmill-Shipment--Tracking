import React from 'react';
import { cn } from './Button';

export function StatusChip({ status, className, ...props }) {
  const statusStyles = {
    'In Transit': 'bg-[var(--color-secondary)] text-white',
    'Delivered': 'bg-[var(--color-tertiary-container)] text-[var(--color-on-primary-container)]',
    'Pending': 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)]',
    'Exception': 'bg-red-600 text-white',
  };

  const style = statusStyles[status] || statusStyles['Pending'];

  return (
    <span className={cn("px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider line-clamp-1 truncate w-[80px] max-w-[100px] text-center", style, className)} {...props}>
      {status}
    </span>
  );
}
