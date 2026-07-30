/**
 * Shared status badge for VFX pipeline React Flow nodes.
 * Location: src/features/build/vfx/nodes/VfxNodeStatusBadge.tsx
 */
import React from 'react';
import type { VfxAssetStatus } from '../types/status';
import { VFX_STATUS_CLASS, VFX_STATUS_LABEL_DE } from './vfxNodeTypes';

interface VfxNodeStatusBadgeProps {
  status: VfxAssetStatus;
}

export function VfxNodeStatusBadge({ status }: VfxNodeStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${VFX_STATUS_CLASS[status]}`}
      data-testid={`vfx-node-status-${status}`}
    >
      {VFX_STATUS_LABEL_DE[status]}
    </span>
  );
}
