import React from 'react';
import { cn } from './Button';

export function Card({ className, children, level = 'low', ...props }) {
  const levels = {
    surface: "bg-[var(--color-surface)]",
    low: "bg-[var(--color-surface-container-low)]",
    high: "bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] border-opacity-15",
    lowest: "bg-white shadow-[var(--shadow-ambient)]",
  };

  return (
    <div className={cn("p-6 rounded-2xl transition-all duration-300", levels[level], className)} {...props}>
      {children}
    </div>
  );
}
