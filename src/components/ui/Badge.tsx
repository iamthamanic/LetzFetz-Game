/**
 * Small label/tag primitive for card stats, phases, and states.
 * Location: src/components/ui/Badge.tsx
 */
import React from 'react';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-stone-800 text-stone-300 border-stone-700',
  accent: 'bg-purple-900/60 text-purple-200 border-purple-700',
  success: 'bg-emerald-900/60 text-emerald-200 border-emerald-700',
  warning: 'bg-amber-900/60 text-amber-200 border-amber-700',
  danger: 'bg-red-900/60 text-red-200 border-red-700',
  info: 'bg-sky-900/60 text-sky-200 border-sky-700',
};

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
