/**
 * Shared chrome for VFX pipeline nodes: busy green glow + spinner overlay.
 * Location: src/features/build/vfx/nodes/VfxNodeShell.tsx
 */
import React from 'react';
import { Loader2 } from 'lucide-react';
import type { VfxAssetStatus } from '../types/status';

interface VfxNodeShellProps {
  selected: boolean;
  status: VfxAssetStatus;
  testId: string;
  className?: string;
  children: React.ReactNode;
}

function isBusyStatus(status: VfxAssetStatus): boolean {
  return status === 'QUEUED' || status === 'GENERATING';
}

export function VfxNodeShell({
  selected,
  status,
  testId,
  className = '',
  children,
}: VfxNodeShellProps) {
  const busy = isBusyStatus(status);

  return (
    <div
      className={`relative min-w-0 w-full rounded-lg border bg-stone-900/95 px-3 py-2 shadow-lg transition-shadow ${
        busy
          ? 'border-emerald-400 ring-2 ring-emerald-400/80 shadow-[0_0_22px_rgba(52,211,153,0.55)]'
          : selected
            ? 'border-amber-500/80'
            : 'border-stone-700'
      } ${className}`}
      data-testid={testId}
      data-active={busy ? 'true' : 'false'}
    >
      {busy ? (
        <div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-emerald-950/35"
          data-testid={`${testId}-spinner`}
          aria-hidden
        >
          <Loader2 className="h-8 w-8 animate-spin text-emerald-300 drop-shadow" />
        </div>
      ) : null}
      {children}
    </div>
  );
}
