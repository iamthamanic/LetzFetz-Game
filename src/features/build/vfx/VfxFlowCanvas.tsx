/**
 * VFX Studio — empty React Flow graph canvas.
 * Location: src/features/build/vfx/VfxFlowCanvas.tsx
 */
import React from 'react';
import {
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export function VfxFlowCanvas() {
  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges, , onEdgesChange] = useEdgesState([]);

  return (
    <div
      className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg border border-stone-800 bg-stone-950"
      data-testid="vfx-studio-canvas"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} color="#44403c" />
        <Controls className="!border-stone-700 !bg-stone-900/90 !shadow-none [&>button]:!border-stone-700 [&>button]:!bg-stone-800 [&>button]:!fill-stone-300 [&>button:hover]:!bg-stone-700" />
      </ReactFlow>
    </div>
  );
}
