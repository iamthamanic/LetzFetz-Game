/**
 * VFX Studio — React Flow canvas; nodes are draggable and keep their positions.
 * Location: src/features/build/vfx/VfxFlowCanvas.tsx
 */
import React, { useCallback, useEffect, useRef } from 'react';
import {
  Background,
  ReactFlow,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  type Viewport,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { vfxPipelineNodeTypes } from './nodes';

interface VfxFlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  /** True after the first canvas measure / default layout. */
  viewportReady?: boolean;
  onNodesChange: (changes: NodeChange<Node>[]) => void;
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
  onConnect: (connection: Connection) => void;
  onSelectNode: (nodeId: string | null) => void;
  /** Pause heavy siblings (e.g. WebGL preview) while a node is dragged. */
  onNodeDragActiveChange?: (dragging: boolean) => void;
  /** Called when the canvas size changes so an empty pipeline can seed. */
  onCanvasSize?: (width: number, height: number) => void;
}

/** Apply the fitted default viewport once after the canvas has been measured. */
function InitialViewportSync({
  viewport,
  ready,
}: {
  viewport: Viewport;
  ready: boolean;
}) {
  const { setViewport } = useReactFlow();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!ready || appliedRef.current) return;
    appliedRef.current = true;
    setViewport(viewport, { duration: 0 });
  }, [ready, setViewport, viewport]);

  return null;
}

export function VfxFlowCanvas({
  nodes,
  edges,
  viewport,
  viewportReady = false,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectNode,
  onNodeDragActiveChange,
  onCanvasSize,
}: VfxFlowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  /** Keep pipeline nodes; allow drag/position updates to persist. */
  const handleNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      onNodesChange(changes.filter((change) => change.type !== 'remove'));
    },
    [onNodesChange],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !onCanvasSize) return;

    const report = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        onCanvasSize(rect.width, rect.height);
      }
    };

    report();
    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => observer.disconnect();
  }, [onCanvasSize]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg border border-stone-800 bg-stone-950"
      data-testid="vfx-studio-canvas"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={vfxPipelineNodeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={() => onNodeDragActiveChange?.(true)}
        onNodeDragStop={() => onNodeDragActiveChange?.(false)}
        onSelectionChange={({ nodes: selected }) => {
          onSelectNode(selected.length === 1 ? selected[0].id : null);
        }}
        defaultViewport={viewport}
        minZoom={0.35}
        maxZoom={1.5}
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick={false}
        panOnScroll={false}
        panOnDrag
        preventScrolling
        nodesDraggable
        nodesConnectable={false}
        nodesFocusable
        edgesFocusable={false}
        edgesReconnectable={false}
        elementsSelectable
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
        className="[&_.react-flow__pane]:cursor-grab [&_.react-flow__pane]:active:cursor-grabbing"
      >
        <InitialViewportSync viewport={viewport} ready={viewportReady} />
        <Background gap={16} color="#44403c" />
      </ReactFlow>
    </div>
  );
}
