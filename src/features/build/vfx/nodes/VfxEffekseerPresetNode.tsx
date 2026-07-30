/**
 * VFX Asset Pipeline — Effekseer preset picker node.
 * Location: src/features/build/vfx/nodes/VfxEffekseerPresetNode.tsx
 */
import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Sparkles } from 'lucide-react';
import { VfxNodeShell } from './VfxNodeShell';
import { VfxNodeStatusBadge } from './VfxNodeStatusBadge';
import type { VfxEffekseerPresetNodeData } from './vfxNodeTypes';
import { VFX_EFFECT_PRESETS } from '../preview/effectPresets';

export interface VfxEffekseerPresetNodeActions {
  onPresetChange?: (presetId: string) => void;
}

export function VfxEffekseerPresetNode({ data, selected }: NodeProps) {
  const nodeData = data as VfxEffekseerPresetNodeData & VfxEffekseerPresetNodeActions;
  const selectedId = nodeData.presetId ?? '';

  return (
    <VfxNodeShell
      selected={selected}
      status={nodeData.status}
      testId="vfx-node-effekseer-preset"
      className="w-full min-w-0"
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-violet-500" />
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-violet-500" />
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-100">
          <Sparkles className="h-3.5 w-3.5" />
          Effekseer-Preset
        </div>
        <VfxNodeStatusBadge status={nodeData.status} />
      </div>
      <label className="block">
        <span className="sr-only">Preset wählen</span>
        <select
          className="nodrag nopan w-full rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-xs text-stone-200 focus:border-violet-600 focus:outline-none"
          value={selectedId}
          onChange={(e) => nodeData.onPresetChange?.(e.target.value)}
          data-testid="vfx-effekseer-preset-select"
        >
          {VFX_EFFECT_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.labelDe}
            </option>
          ))}
        </select>
      </label>
      {nodeData.statusMessage ? (
        <p className="mt-1 text-[10px] text-stone-400">{nodeData.statusMessage}</p>
      ) : null}
    </VfxNodeShell>
  );
}
