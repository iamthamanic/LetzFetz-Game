/**
 * VFX Asset Pipeline — Prompt input node.
 * Location: src/features/build/vfx/nodes/VfxPromptNode.tsx
 */
import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { MessageSquareText } from 'lucide-react';
import { VfxNodeStatusBadge } from './VfxNodeStatusBadge';
import type { VfxPromptNodeData } from './vfxNodeTypes';

export function VfxPromptNode({ data, selected }: NodeProps) {
  const nodeData = data as VfxPromptNodeData;

  return (
    <div
      className={`min-w-[200px] rounded-lg border bg-stone-900/95 px-3 py-2 shadow-lg ${
        selected ? 'border-amber-500/80' : 'border-stone-700'
      }`}
      data-testid="vfx-node-prompt"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-100">
          <MessageSquareText className="h-3.5 w-3.5" />
          Prompt
        </div>
        <VfxNodeStatusBadge status={nodeData.status} />
      </div>
      <textarea
        className="nodrag nopan w-full resize-none rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-[11px] text-stone-200 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none"
        rows={3}
        placeholder="Beschreibe die Technik…"
        value={nodeData.prompt}
        readOnly
        aria-readonly
      />
      {nodeData.statusMessage ? (
        <p className="mt-1.5 text-[10px] text-stone-500">{nodeData.statusMessage}</p>
      ) : null}
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-amber-500" />
    </div>
  );
}
