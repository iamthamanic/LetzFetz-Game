/**
 * Panel primitive — floating HUDs and game panels.
 * Location: src/components/ui/Panel.tsx
 */
import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  dense?: boolean;
}

export function Panel({ children, className = '', title, dense = false }: PanelProps) {
  return (
    <div
      className={`rounded-lg border border-stone-800 bg-stone-900/95 shadow-xl ${dense ? 'p-3' : 'p-4'} ${className}`}
    >
      {title && (
        <h3 className="mb-3 border-b border-stone-800 pb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
