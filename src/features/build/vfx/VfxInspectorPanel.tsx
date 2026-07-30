/**
 * VFX Studio — right inspector for selected pipeline node properties.
 * Location: src/features/build/vfx/VfxInspectorPanel.tsx
 */
import React from 'react';
import type { Node } from '@xyflow/react';
import {
  VFX_PIPELINE_NODE_TYPES,
  VFX_STATUS_LABEL_DE,
  type VfxPromptNodeData,
  type VfxSaveTechniqueNodeData,
  type VfxSocketNodeData,
} from './nodes/vfxNodeTypes';
import { isVfxAssetStatus, type VfxAssetStatus } from './types/status';
import {
  VFX_TECHNIQUE_SOCKET_LABEL_DE,
  VFX_TECHNIQUE_SOCKET_NAMES,
  type VfxTechniqueSocketName,
} from './sockets/vfxSocketRoles';
import type { Vec3 } from './types/wireTypes';

interface VfxInspectorPanelProps {
  selectedNode: Node | null;
  onPromptChange: (prompt: string) => void;
  onTechniqueNameChange: (name: string) => void;
  onActiveSocketChange: (name: VfxTechniqueSocketName) => void;
  onSocketAxisChange: (name: VfxTechniqueSocketName, axis: keyof Vec3, value: number) => void;
}

function readStatus(data: Record<string, unknown>): VfxAssetStatus {
  const status = data.status;
  if (isVfxAssetStatus(status)) return status;
  return 'DRAFT';
}

function parseAxisValue(raw: string): number {
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function VfxInspectorPanel({
  selectedNode,
  onPromptChange,
  onTechniqueNameChange,
  onActiveSocketChange,
  onSocketAxisChange,
}: VfxInspectorPanelProps) {
  if (!selectedNode) {
    return (
      <aside
        className="flex w-52 shrink-0 flex-col overflow-hidden border-l border-stone-800 bg-stone-900/60 sm:w-56"
        data-testid="vfx-studio-inspector"
      >
        <header className="flex-none border-b border-stone-800 px-3 py-2.5">
          <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100">Inspektor</h2>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <p className="text-xs text-stone-500">Kein Node ausgewählt</p>
        </div>
      </aside>
    );
  }

  const data = selectedNode.data as Record<string, unknown>;
  const status = readStatus(data);
  const statusMessage =
    typeof data.statusMessage === 'string' ? data.statusMessage : undefined;

  return (
    <aside
      className="flex w-52 shrink-0 flex-col overflow-hidden border-l border-stone-800 bg-stone-900/60 sm:w-56"
      data-testid="vfx-studio-inspector"
    >
      <header className="flex-none border-b border-stone-800 px-3 py-2.5">
        <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100">Inspektor</h2>
        <p className="mt-0.5 truncate text-[10px] text-stone-500">{selectedNode.type}</p>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-3">
        <dl className="space-y-2 text-xs">
          <div>
            <dt className="text-[10px] uppercase text-stone-500">Status</dt>
            <dd className="font-medium text-stone-200">{VFX_STATUS_LABEL_DE[status]}</dd>
          </div>
          {statusMessage ? (
            <div>
              <dt className="text-[10px] uppercase text-stone-500">Meldung</dt>
              <dd className="text-stone-400">{statusMessage}</dd>
            </div>
          ) : null}
        </dl>

        {selectedNode.type === VFX_PIPELINE_NODE_TYPES.vfxPrompt ? (
          <label className="mt-4 block">
            <span className="text-[10px] uppercase text-stone-500">Prompt</span>
            <textarea
              className="mt-1 w-full resize-none rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-xs text-stone-200 focus:border-amber-600 focus:outline-none"
              rows={5}
              value={(data as VfxPromptNodeData).prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Beschreibe die Technik…"
              data-testid="vfx-inspector-prompt"
            />
          </label>
        ) : null}

        {selectedNode.type === VFX_PIPELINE_NODE_TYPES.vfxSaveTechnique ? (
          <label className="mt-4 block">
            <span className="text-[10px] uppercase text-stone-500">Technik-Name</span>
            <input
              type="text"
              className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-xs text-stone-200 focus:border-amber-600 focus:outline-none"
              value={(data as VfxSaveTechniqueNodeData).techniqueName}
              onChange={(e) => onTechniqueNameChange(e.target.value)}
              placeholder="Name für Material Formeln"
              data-testid="vfx-inspector-technique-name"
            />
          </label>
        ) : null}

        {selectedNode.type === VFX_PIPELINE_NODE_TYPES.vfxSocket ? (
          <SocketInspectorFields
            data={data as VfxSocketNodeData}
            onActiveSocketChange={onActiveSocketChange}
            onSocketAxisChange={onSocketAxisChange}
          />
        ) : null}
      </div>
    </aside>
  );
}

function SocketInspectorFields({
  data,
  onActiveSocketChange,
  onSocketAxisChange,
}: {
  data: VfxSocketNodeData;
  onActiveSocketChange: (name: VfxTechniqueSocketName) => void;
  onSocketAxisChange: (name: VfxTechniqueSocketName, axis: keyof Vec3, value: number) => void;
}) {
  const active = data.activeSocket;
  const position = data.sockets[active];

  return (
    <div className="mt-4 space-y-3">
      <label className="block">
        <span className="text-[10px] uppercase text-stone-500">Aktiver Socket</span>
        <select
          className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-xs text-stone-200 focus:border-violet-600 focus:outline-none"
          value={active}
          onChange={(e) => onActiveSocketChange(e.target.value as VfxTechniqueSocketName)}
          data-testid="vfx-inspector-socket-role"
        >
          {VFX_TECHNIQUE_SOCKET_NAMES.map((name) => (
            <option key={name} value={name}>
              {VFX_TECHNIQUE_SOCKET_LABEL_DE[name]}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="text-[10px] uppercase text-stone-500">Position (XYZ)</legend>
        <div className="mt-1 grid grid-cols-3 gap-1.5">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <label key={axis} className="block">
              <span className="text-[9px] uppercase text-stone-600">{axis}</span>
              <input
                type="number"
                step="0.01"
                className="mt-0.5 w-full rounded border border-stone-700 bg-stone-950 px-1.5 py-1 text-xs text-stone-200 focus:border-violet-600 focus:outline-none"
                value={position[axis]}
                onChange={(e) =>
                  onSocketAxisChange(active, axis, parseAxisValue(e.target.value))
                }
                data-testid={`vfx-inspector-socket-${axis}`}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <p className="text-[10px] leading-snug text-stone-500">
        Marker und Gizmo erscheinen in der Socket-Vorschau unter dem Graph.
      </p>
    </div>
  );
}
