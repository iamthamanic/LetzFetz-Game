/**
 * VFX Asset Pipeline — Socket stub node (default coords).
 * Location: src/features/build/vfx/nodes/VfxSocketNode.tsx
 */
import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Crosshair } from 'lucide-react';
import { VfxNodeStatusBadge } from './VfxNodeStatusBadge';
import type { VfxSocketNodeData } from './vfxNodeTypes';

export function VfxSocketNode({ data, selected }: NodeProps) {
  const nodeData = data as VfxSocketNodeData;

  return (
    <div
      className={`min-w-[180px] rounded-lg border bg-stone-900/95 px-3 py-2 shadow-lg ${
        selected ? 'border-amber-500/80' : 'border-stone-700'
      }`}
      data-testid="vfx-node-socket"
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-violet-400" />
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-100">
          <Crosshair className="h-3.5 w-3.5" />
          Socket
        </div>
        <VfxNodeStatusBadge status={nodeData.status} />
      </div>
      <p className="text-[10px] text-stone-500">
        Stub — {nodeData.socketName} @ (0, 0, 0)
      </p>
      {nodeData.statusMessage ? (
        <p className="mt-1 text-[10px] text-stone-400">{nodeData.statusMessage}</p>
      ) : null}
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-violet-400" />
    </div>
  );
}
