import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({ variant = 'primary', className, children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-all duration-200";
  
  const variants = {
    primary: "gradient-primary text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2",
    secondary: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] hover:bg-[var(--color-secondary)] hover:text-white",
    tertiary: "bg-transparent text-[var(--color-primary)] font-bold hover:bg-[var(--color-surface-container-low)] hover:translate-x-1"
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
