import React from 'react';
import { cn } from './Button';

export function Input({ className, label, id, ...props }) {
  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-on-surface-variant)]">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] px-4 py-3 border-b border-[var(--color-outline-variant)] border-opacity-50",
          "focus:outline-none focus:bg-[var(--color-surface-container-highest)] focus:border-[var(--color-primary)] transition-colors",
          "placeholder-[var(--color-on-surface-variant)] opacity-80",
          className
        )}
        {...props}
      />
    </div>
  );
}
