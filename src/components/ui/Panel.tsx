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
  /** `game` = brand blood border + dark grunge surface; `editor` = default stone */
  tone?: 'editor' | 'game';
}

export function Panel({
  children,
  className = '',
  title,
  dense = false,
  tone = 'editor',
}: PanelProps) {
  const toneClass =
    tone === 'game'
      ? 'game-panel-grunge rounded-[2px] border bg-stone-950/95'
      : 'rounded-lg border border-stone-800 bg-stone-900/95';

  return (
    <div
      className={`${toneClass} shadow-xl ${dense ? 'p-3' : 'p-4'} ${className}`}
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
