/**
 * React Flow custom node registry for VFX Asset Pipeline.
 * Location: src/features/build/vfx/nodes/index.ts
 */
import type { NodeTypes } from '@xyflow/react';
import { VfxMeshyNode } from './VfxMeshyNode';
import { VfxNormalizeNode } from './VfxNormalizeNode';
import { VfxPromptNode } from './VfxPromptNode';
import { VfxSaveTechniqueNode } from './VfxSaveTechniqueNode';
import { VfxSocketNode } from './VfxSocketNode';
import { VFX_PIPELINE_NODE_TYPES } from './vfxNodeTypes';

export const vfxPipelineNodeTypes: NodeTypes = {
  [VFX_PIPELINE_NODE_TYPES.vfxPrompt]: VfxPromptNode,
  [VFX_PIPELINE_NODE_TYPES.vfxMeshy]: VfxMeshyNode,
  [VFX_PIPELINE_NODE_TYPES.vfxNormalize]: VfxNormalizeNode,
  [VFX_PIPELINE_NODE_TYPES.vfxSocket]: VfxSocketNode,
  [VFX_PIPELINE_NODE_TYPES.vfxSaveTechnique]: VfxSaveTechniqueNode,
};

export * from './vfxNodeTypes';
