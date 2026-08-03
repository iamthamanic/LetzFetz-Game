/**
 * Fixed default Asset Pipeline graph: Meshy → Normalize → Socket → Save.
 * Layout: 3-per-row wrap in design units, then auto-fit zoom into the canvas.
 * Location: src/features/build/vfx/createDefaultAssetPipeline.ts
 */
import type { Edge, Node, Viewport } from '@xyflow/react';
import {
  VFX_PIPELINE_NODE_TYPES,
  defaultMeshyNodeData,
  defaultNormalizeNodeData,
  defaultSaveTechniqueNodeData,
  defaultSocketNodeData,
  defaultEffekseerPresetNodeData,
} from './nodes/vfxNodeTypes';

export const DEFAULT_PIPELINE_NODE_IDS = {
  meshy: 'pipeline-meshy',
  normalize: 'pipeline-normalize',
  socket: 'pipeline-socket',
  preset: 'pipeline-effekseer-preset',
  save: 'pipeline-save',
} as const;

export const PIPELINE_NODE_ORDER = [
  DEFAULT_PIPELINE_NODE_IDS.meshy,
  DEFAULT_PIPELINE_NODE_IDS.normalize,
  DEFAULT_PIPELINE_NODE_IDS.socket,
  DEFAULT_PIPELINE_NODE_IDS.preset,
  DEFAULT_PIPELINE_NODE_IDS.save,
] as const;

export interface PipelineGridMetrics {
  cols: number;
  originX: number;
  originY: number;
  colStride: number;
  rowStride: number;
  nodeWidth: number;
  gap: number;
  /** Extra space right of column 3 for the wrap edge. */
  wrapGutter: number;
  /** Content bounding box in flow coordinates (before viewport zoom). */
  contentWidth: number;
  contentHeight: number;
  /** Default viewport that fits the graph into the canvas (applied once). */
  viewport: Viewport;
}

/** Comfortable design-size layout (scaled via viewport.zoom to fit). */
const DESIGN = {
  cols: 3,
  originX: 28,
  originY: 24,
  nodeWidth: 210,
  gap: 18,
  wrapGutter: 72,
  /** Approximate Meshy card height + gap before row 2. */
  rowStride: 236,
  /** Approximate Save card height for content bounds. */
  row2Height: 128,
  bottomPad: 28,
} as const;

/** Fallback metrics used before the canvas has been measured. */
export const PIPELINE_GRID: PipelineGridMetrics = computePipelineGridMetrics(900, 640);

export function pipelineGridPosition(
  index: number,
  metrics: PipelineGridMetrics = PIPELINE_GRID,
): { x: number; y: number } {
  const col = index % metrics.cols;
  const row = Math.floor(index / metrics.cols);
  return {
    x: metrics.originX + col * metrics.colStride,
    y: metrics.originY + row * metrics.rowStride,
  };
}

/**
 * Build a fixed 3-col wrap grid in design units, then compute a
 * viewport zoom so the whole graph (incl. wrap gutter) fits the canvas.
 */
export function computePipelineGridMetrics(
  canvasWidth: number,
  canvasHeight: number,
): PipelineGridMetrics {
  const cols = DESIGN.cols;
  const gap = DESIGN.gap;
  const wrapGutter = DESIGN.wrapGutter;
  const originX = DESIGN.originX;
  const originY = DESIGN.originY;
  const nodeWidth = DESIGN.nodeWidth;
  const colStride = nodeWidth + gap;
  const rowStride = DESIGN.rowStride;

  const contentWidth = originX + colStride * (cols - 1) + nodeWidth + wrapGutter;
  const contentHeight = originY + rowStride + DESIGN.row2Height + DESIGN.bottomPad;

  const pad = 12;
  const zoomX = (Math.max(280, canvasWidth) - pad * 2) / contentWidth;
  const zoomY = (Math.max(240, canvasHeight) - pad * 2) / contentHeight;
  const zoom = Math.min(1, Math.max(0.42, Math.min(zoomX, zoomY)));

  const viewport: Viewport = {
    x: pad + (canvasWidth - pad * 2 - contentWidth * zoom) / 2,
    y: pad + Math.max(0, (canvasHeight - pad * 2 - contentHeight * zoom) / 2),
    zoom,
  };

  return {
    cols,
    originX,
    originY,
    colStride,
    rowStride,
    nodeWidth,
    gap,
    wrapGutter,
    contentWidth,
    contentHeight,
    viewport,
  };
}

/** Pipeline topology is fixed; nodes may be repositioned by the user. */
const PIPELINE_NODE_FLAGS = {
  deletable: false,
  draggable: true,
  selectable: true,
} as const;

function nodeShellStyle(width: number): { width: number; maxWidth: number } {
  return { width, maxWidth: width };
}

/** Apply responsive positions + widths to an existing pipeline graph. */
export function applyPipelineGridLayout(
  nodes: Node[],
  metrics: PipelineGridMetrics,
): Node[] {
  return nodes.map((node) => {
    const index = PIPELINE_NODE_ORDER.indexOf(
      node.id as (typeof PIPELINE_NODE_ORDER)[number],
    );
    if (index < 0) return node;
    return {
      ...node,
      position: pipelineGridPosition(index, metrics),
      style: { ...node.style, ...nodeShellStyle(metrics.nodeWidth) },
      width: metrics.nodeWidth,
    };
  });
}

/** Pre-wired Asset Pipeline — prompt on Meshy; 3-per-row wrap layout. */
export function createDefaultAssetPipeline(
  metrics: PipelineGridMetrics = PIPELINE_GRID,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = applyPipelineGridLayout(
    [
      {
        id: DEFAULT_PIPELINE_NODE_IDS.meshy,
        type: VFX_PIPELINE_NODE_TYPES.vfxMeshy,
        position: { x: 0, y: 0 },
        data: defaultMeshyNodeData(),
        ...PIPELINE_NODE_FLAGS,
      },
      {
        id: DEFAULT_PIPELINE_NODE_IDS.normalize,
        type: VFX_PIPELINE_NODE_TYPES.vfxNormalize,
        position: { x: 0, y: 0 },
        data: defaultNormalizeNodeData(),
        ...PIPELINE_NODE_FLAGS,
      },
      {
        id: DEFAULT_PIPELINE_NODE_IDS.socket,
        type: VFX_PIPELINE_NODE_TYPES.vfxSocket,
        position: { x: 0, y: 0 },
        data: defaultSocketNodeData(),
        ...PIPELINE_NODE_FLAGS,
      },
      {
        id: DEFAULT_PIPELINE_NODE_IDS.preset,
        type: VFX_PIPELINE_NODE_TYPES.vfxEffekseerPreset,
        position: { x: 0, y: 0 },
        data: defaultEffekseerPresetNodeData(),
        ...PIPELINE_NODE_FLAGS,
      },
      {
        id: DEFAULT_PIPELINE_NODE_IDS.save,
        type: VFX_PIPELINE_NODE_TYPES.vfxSaveTechnique,
        position: { x: 0, y: 0 },
        data: defaultSaveTechniqueNodeData(),
        ...PIPELINE_NODE_FLAGS,
      },
    ],
    metrics,
  );

  const wrapOffset = Math.max(24, Math.round(metrics.wrapGutter * 0.55));

  const edges: Edge[] = [
    {
      id: 'e-meshy-normalize',
      source: DEFAULT_PIPELINE_NODE_IDS.meshy,
      target: DEFAULT_PIPELINE_NODE_IDS.normalize,
      type: 'smoothstep',
      deletable: false,
      selectable: false,
    },
    {
      id: 'e-normalize-socket',
      source: DEFAULT_PIPELINE_NODE_IDS.normalize,
      target: DEFAULT_PIPELINE_NODE_IDS.socket,
      type: 'smoothstep',
      deletable: false,
      selectable: false,
    },
    {
      id: 'e-socket-preset',
      source: DEFAULT_PIPELINE_NODE_IDS.socket,
      target: DEFAULT_PIPELINE_NODE_IDS.preset,
      type: 'smoothstep',
      // XYFlow edge path tweak — not on the base Edge type in this package version.
      ...({ pathOptions: { offset: wrapOffset, borderRadius: 16 } } as object),
      deletable: false,
      selectable: false,
    },
    {
      id: 'e-preset-save',
      source: DEFAULT_PIPELINE_NODE_IDS.preset,
      target: DEFAULT_PIPELINE_NODE_IDS.save,
      type: 'smoothstep',
      deletable: false,
      selectable: false,
    },
  ];

  return { nodes, edges };
}
