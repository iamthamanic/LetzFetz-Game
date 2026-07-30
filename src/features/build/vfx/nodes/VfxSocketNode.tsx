/**
 * VFX Asset Pipeline — Socket editor node (named attachment points).
 * Location: src/features/build/vfx/nodes/VfxSocketNode.tsx
 */
import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Crosshair } from 'lucide-react';
import { VfxNodeShell } from './VfxNodeShell';
import { VfxNodeStatusBadge } from './VfxNodeStatusBadge';
import type { VfxSocketNodeData } from './vfxNodeTypes';
import { formatSocketPositionDe } from '../sockets/socketMapHelpers';
import { VFX_TECHNIQUE_SOCKET_LABEL_DE } from '../sockets/vfxSocketRoles';

export function VfxSocketNode({ data, selected }: NodeProps) {
  const nodeData = data as VfxSocketNodeData;
  const activeLabel = VFX_TECHNIQUE_SOCKET_LABEL_DE[nodeData.activeSocket];
  const activePos = nodeData.sockets[nodeData.activeSocket];

  return (
    <VfxNodeShell selected={selected} status={nodeData.status} testId="vfx-node-socket">
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-violet-400" />
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-100">
          <Crosshair className="h-3.5 w-3.5" />
          Socket
        </div>
        <VfxNodeStatusBadge status={nodeData.status} />
      </div>
      <p className="text-[10px] text-stone-400">
        {activeLabel} · {formatSocketPositionDe(activePos)}
      </p>
      {!nodeData.glbUrl ? (
        <p className="mt-1 text-[10px] text-amber-600/90">
          Kein Modell — Sockets als Entwurf bearbeitbar.
        </p>
      ) : null}
      {nodeData.statusMessage ? (
        <p className="mt-1 text-[10px] text-stone-500">{nodeData.statusMessage}</p>
      ) : null}
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-violet-400" />
    </VfxNodeShell>
  );
}
