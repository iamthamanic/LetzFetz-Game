/**
 * Unit tests for default Asset Pipeline graph seed + fit-to-canvas grid.
 * Location: src/features/build/vfx/createDefaultAssetPipeline.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PIPELINE_NODE_IDS,
  PIPELINE_GRID,
  applyPipelineGridLayout,
  computePipelineGridMetrics,
  createDefaultAssetPipeline,
  pipelineGridPosition,
} from './createDefaultAssetPipeline';
import { VFX_PIPELINE_NODE_TYPES } from './nodes/vfxNodeTypes';

describe('createDefaultAssetPipeline', () => {
  it('seeds four connected nodes without a Prompt node', () => {
    const { nodes, edges } = createDefaultAssetPipeline();
    expect(nodes).toHaveLength(4);
    expect(nodes.map((n) => n.type)).toEqual([
      VFX_PIPELINE_NODE_TYPES.vfxMeshy,
      VFX_PIPELINE_NODE_TYPES.vfxNormalize,
      VFX_PIPELINE_NODE_TYPES.vfxSocket,
      VFX_PIPELINE_NODE_TYPES.vfxSaveTechnique,
    ]);
    expect(edges).toHaveLength(3);
    expect(edges.map((e) => `${e.source}->${e.target}`)).toEqual([
      `${DEFAULT_PIPELINE_NODE_IDS.meshy}->${DEFAULT_PIPELINE_NODE_IDS.normalize}`,
      `${DEFAULT_PIPELINE_NODE_IDS.normalize}->${DEFAULT_PIPELINE_NODE_IDS.socket}`,
      `${DEFAULT_PIPELINE_NODE_IDS.socket}->${DEFAULT_PIPELINE_NODE_IDS.save}`,
    ]);
  });

  it('lays out nodes 3-per-row then wraps', () => {
    const { nodes } = createDefaultAssetPipeline();
    expect(nodes.map((n) => n.position)).toEqual([
      pipelineGridPosition(0),
      pipelineGridPosition(1),
      pipelineGridPosition(2),
      pipelineGridPosition(3),
    ]);
    expect(pipelineGridPosition(3)).toEqual({
      x: PIPELINE_GRID.originX,
      y: PIPELINE_GRID.originY + PIPELINE_GRID.rowStride,
    });
    expect(nodes.every((n) => n.draggable === true)).toBe(true);
    expect(nodes.every((n) => n.deletable === false)).toBe(true);
  });

  it('fits content bounds into a narrow canvas via locked zoom', () => {
    const metrics = computePipelineGridMetrics(748, 610);
    expect(metrics.viewport.zoom).toBeLessThanOrEqual(1);
    expect(metrics.contentWidth * metrics.viewport.zoom).toBeLessThanOrEqual(748);
    expect(metrics.contentHeight * metrics.viewport.zoom).toBeLessThanOrEqual(610);
    expect(metrics.wrapGutter).toBeGreaterThan(40);
  });

  it('reflows existing nodes when metrics change', () => {
    const seeded = createDefaultAssetPipeline();
    const wide = computePipelineGridMetrics(1200, 800);
    const reflowed = applyPipelineGridLayout(seeded.nodes, wide);
    expect(reflowed[0]?.position).toEqual(pipelineGridPosition(0, wide));
    expect(reflowed[3]?.position).toEqual(pipelineGridPosition(3, wide));
  });

  it('includes prompt field on Meshy default data', () => {
    const { nodes } = createDefaultAssetPipeline();
    const meshy = nodes.find((n) => n.id === DEFAULT_PIPELINE_NODE_IDS.meshy);
    expect(meshy?.data).toMatchObject({ prompt: '', status: 'DRAFT' });
  });
});
