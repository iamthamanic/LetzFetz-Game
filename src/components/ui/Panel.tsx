/**
 * Panel primitive — floating HUDs and game panels.
 * Location: src/components/ui/Panel.tsx
 */
import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Panel({ children, className = '', title }: PanelProps) {
  return (
    <div
      className={`bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-purple-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-sm ${className}`}
    >
      {title && <h3 className="text-white text-sm mb-2">{title}</h3>}
      {children}
    </div>
  );
}
