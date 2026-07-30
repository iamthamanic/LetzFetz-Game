/**
 * VFX Asset Pipeline — Meshy text-to-3d node (via local worker).
 * Location: src/features/build/vfx/nodes/VfxMeshyNode.tsx
 */
import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Box } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { VfxNodeStatusBadge } from './VfxNodeStatusBadge';
import type { VfxMeshyNodeData } from './vfxNodeTypes';

export interface VfxMeshyNodeActions {
  onGenerate?: () => void;
}

export function VfxMeshyNode({ data, selected }: NodeProps) {
  const nodeData = data as VfxMeshyNodeData & VfxMeshyNodeActions;
  const busy = nodeData.status === 'QUEUED' || nodeData.status === 'GENERATING';

  return (
    <div
      className={`min-w-[220px] rounded-lg border bg-stone-900/95 px-3 py-2 shadow-lg ${
        selected ? 'border-amber-500/80' : 'border-stone-700'
      }`}
      data-testid="vfx-node-meshy"
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-sky-500" />
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-100">
          <Box className="h-3.5 w-3.5" />
          Meshy 3D
        </div>
        <VfxNodeStatusBadge status={nodeData.status} />
      </div>
      <p className="text-[10px] text-stone-500">
        Preview via lokalem VFX-Worker (~5 Credits)
      </p>
      {nodeData.taskId ? (
        <p className="mt-1 truncate text-[10px] font-mono text-stone-400">
          Task: {nodeData.taskId}
        </p>
      ) : null}
      {nodeData.glbUrl ? (
        <p className="mt-1 truncate text-[10px] text-emerald-400/90">{nodeData.glbUrl}</p>
      ) : null}
      {nodeData.statusMessage ? (
        <p className="mt-1 text-[10px] text-stone-400">{nodeData.statusMessage}</p>
      ) : null}
      <Button
        variant="accent"
        size="sm"
        className="nodrag nopan mt-2 w-full"
        disabled={busy || !nodeData.onGenerate}
        onClick={() => nodeData.onGenerate?.()}
        data-testid="vfx-meshy-generate-btn"
      >
        {busy ? 'Läuft…' : 'Generieren'}
      </Button>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-sky-500" />
    </div>
  );
}
