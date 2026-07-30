/**
 * VFX Studio — React Flow graph canvas with Asset Pipeline nodes.
 * Location: src/features/build/vfx/VfxFlowCanvas.tsx
 */
import React from 'react';
import {
  Background,
  Controls,
  ReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { vfxPipelineNodeTypes } from './nodes';

interface VfxFlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange<Node>[]) => void;
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
  onConnect: (connection: Connection) => void;
  onSelectNode: (nodeId: string | null) => void;
}

export function VfxFlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectNode,
}: VfxFlowCanvasProps) {
  return (
    <div
      className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg border border-stone-800 bg-stone-950"
      data-testid="vfx-studio-canvas"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={vfxPipelineNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={({ nodes: selected }) => {
          onSelectNode(selected.length === 1 ? selected[0].id : null);
        }}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} color="#44403c" />
        <Controls className="!border-stone-700 !bg-stone-900/90 !shadow-none [&>button]:!border-stone-700 [&>button]:!bg-stone-800 [&>button]:!fill-stone-300 [&>button:hover]:!bg-stone-700" />
      </ReactFlow>
    </div>
  );
}
