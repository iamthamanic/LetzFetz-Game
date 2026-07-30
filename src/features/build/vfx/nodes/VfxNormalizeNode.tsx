/**
 * VFX Asset Pipeline — Normalize node (bounds, scale, pivot metadata).
 * Location: src/features/build/vfx/nodes/VfxNormalizeNode.tsx
 */
import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Scaling } from 'lucide-react';
import { formatModelAssetStatusDe } from '../normalize/buildModelAsset';
import { VfxNodeStatusBadge } from './VfxNodeStatusBadge';
import type { VfxNormalizeNodeData } from './vfxNodeTypes';

export function VfxNormalizeNode({ data, selected }: NodeProps) {
  const nodeData = data as VfxNormalizeNodeData;
  const boundsSummary =
    nodeData.modelAsset && nodeData.status === 'READY'
      ? formatModelAssetStatusDe(nodeData.modelAsset)
      : null;

  return (
    <div
      className={`min-w-[180px] rounded-lg border bg-stone-900/95 px-3 py-2 shadow-lg ${
        selected ? 'border-amber-500/80' : 'border-stone-700'
      }`}
      data-testid="vfx-node-normalize"
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-stone-400" />
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-200">
          <Scaling className="h-3.5 w-3.5" />
          Normalisieren
        </div>
        <VfxNodeStatusBadge status={nodeData.status} />
      </div>
      {boundsSummary ? (
        <p className="text-[10px] text-stone-400">{boundsSummary}</p>
      ) : (
        <p className="text-[10px] text-stone-500">
          Skalierung vereinheitlichen · Boden zentrieren
        </p>
      )}
      {nodeData.statusMessage ? (
        <p className="mt-1 text-[10px] text-stone-400">{nodeData.statusMessage}</p>
      ) : null}
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-stone-400" />
    </div>
  );
}
