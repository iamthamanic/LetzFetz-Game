/**
 * VFX Asset Pipeline — Meshy text-to-3d node (prompt + local worker).
 * Location: src/features/build/vfx/nodes/VfxMeshyNode.tsx
 */
import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Box } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { VfxNodeShell } from './VfxNodeShell';
import { VfxNodeStatusBadge } from './VfxNodeStatusBadge';
import type { VfxMeshyNodeData } from './vfxNodeTypes';

export interface VfxMeshyNodeActions {
  onGenerate?: () => void;
  onPromptChange?: (prompt: string) => void;
}

export function VfxMeshyNode({ data, selected }: NodeProps) {
  const nodeData = data as VfxMeshyNodeData & VfxMeshyNodeActions;
  const busy = nodeData.status === 'QUEUED' || nodeData.status === 'GENERATING';

  return (
    <VfxNodeShell
      selected={selected}
      status={nodeData.status}
      testId="vfx-node-meshy"
      className="w-full min-w-0"
    >
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-sky-500" />
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-100">
          <Box className="h-3.5 w-3.5" />
          Meshy 3D
        </div>
        <VfxNodeStatusBadge status={nodeData.status} />
      </div>
      <label className="block">
        <span className="text-[9px] uppercase tracking-wide text-stone-500">Prompt</span>
        <textarea
          className="nodrag nopan mt-1 w-full resize-none rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-[11px] text-stone-200 focus:border-sky-500 focus:outline-none"
          rows={2}
          value={nodeData.prompt}
          disabled={busy}
          placeholder="Beschreibe die Technik für Meshy…"
          onChange={(e) => nodeData.onPromptChange?.(e.target.value)}
          data-testid="vfx-meshy-prompt"
        />
      </label>
      <p className="mt-1 text-[10px] text-stone-500">
        Text-to-3D via lokalem VFX-Worker (~5 Credits)
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
        disabled={busy || !nodeData.onGenerate || !nodeData.prompt.trim()}
        onClick={() => nodeData.onGenerate?.()}
        data-testid="vfx-meshy-generate-btn"
      >
        {busy ? 'Läuft…' : 'Generieren'}
      </Button>
    </VfxNodeShell>
  );
}
