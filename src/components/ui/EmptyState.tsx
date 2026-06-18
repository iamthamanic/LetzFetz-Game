/**
 * Empty / loading state placeholder primitive.
 * Location: src/components/ui/EmptyState.tsx
 */
import React from 'react';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title = 'Nichts gefunden', subtitle, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-700 bg-stone-900/50 p-8 text-center">
      {icon && <div className="mb-3 text-2xl text-stone-500">{icon}</div>}
      <p className="text-sm font-semibold text-stone-300">{title}</p>
      {subtitle && <p className="mt-1 text-xs text-stone-500">{subtitle}</p>}
    </div>
  );
}
