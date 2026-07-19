/**
 * Light global grain + vignette for Play / Setup / Match views.
 * Location: src/components/ui/GrungeAppShell.tsx
 */
import React from 'react';

interface GrungeAppShellProps {
  children: React.ReactNode;
}

export function GrungeAppShell({ children }: GrungeAppShellProps) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="grunge-app-shell pointer-events-none absolute inset-0 z-0" aria-hidden />
      <div className="relative z-[1] flex h-full min-h-0 w-full flex-1 flex-col">{children}</div>
    </div>
  );
}
