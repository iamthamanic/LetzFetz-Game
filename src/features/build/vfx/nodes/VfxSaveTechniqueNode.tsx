/**
 * VFX Asset Pipeline — Save TechniqueAsset to local registry.
 * Location: src/features/build/vfx/nodes/VfxSaveTechniqueNode.tsx
 */
import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Save } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { VfxNodeStatusBadge } from './VfxNodeStatusBadge';
import type { VfxSaveTechniqueNodeData } from './vfxNodeTypes';

export interface VfxSaveTechniqueNodeActions {
  onSave?: () => void;
}

export function VfxSaveTechniqueNode({ data, selected }: NodeProps) {
  const nodeData = data as VfxSaveTechniqueNodeData & VfxSaveTechniqueNodeActions;
  const saved = nodeData.status === 'READY' && nodeData.savedAssetId !== null;

  return (
    <div
      className={`min-w-[220px] rounded-lg border bg-stone-900/95 px-3 py-2 shadow-lg ${
        selected ? 'border-amber-500/80' : 'border-stone-700'
      }`}
      data-testid="vfx-node-save-technique"
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-emerald-500" />
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-100">
          <Save className="h-3.5 w-3.5" />
          Technik speichern
        </div>
        <VfxNodeStatusBadge status={nodeData.status} />
      </div>
      {nodeData.savedAssetId ? (
        <p className="text-[10px] font-mono text-emerald-400/90">{nodeData.savedAssetId}</p>
      ) : null}
      {nodeData.statusMessage ? (
        <p className="mt-1 text-[10px] text-stone-400">{nodeData.statusMessage}</p>
      ) : null}
      <Button
        variant="success"
        size="sm"
        className="nodrag nopan mt-2 w-full"
        disabled={saved || !nodeData.onSave || !nodeData.glbUrl}
        onClick={() => nodeData.onSave?.()}
        data-testid="vfx-save-technique-btn"
      >
        {saved ? 'Gespeichert' : 'Als Technik speichern'}
      </Button>
    </div>
  );
}
