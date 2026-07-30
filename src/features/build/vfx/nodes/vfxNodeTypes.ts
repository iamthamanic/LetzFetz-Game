/**
 * React Flow node type ids and shared node data shapes for VFX Asset Pipeline.
 * Location: src/features/build/vfx/nodes/vfxNodeTypes.ts
 */
import type { VfxAssetStatus } from '../types/status';
import type { ModelAsset } from '../types/wireTypes';

export const VFX_PIPELINE_NODE_TYPES = {
  vfxPrompt: 'vfxPrompt',
  vfxMeshy: 'vfxMeshy',
  vfxNormalize: 'vfxNormalize',
  vfxSocket: 'vfxSocket',
  vfxSaveTechnique: 'vfxSaveTechnique',
} as const;

export type VfxPipelineNodeType =
  (typeof VFX_PIPELINE_NODE_TYPES)[keyof typeof VFX_PIPELINE_NODE_TYPES];

export interface VfxNodeBaseData {
  status: VfxAssetStatus;
  statusMessage?: string;
  [key: string]: unknown;
}

export interface VfxPromptNodeData extends VfxNodeBaseData {
  prompt: string;
}

export interface VfxMeshyNodeData extends VfxNodeBaseData {
  taskId: string | null;
  glbUrl: string | null;
}

export interface VfxNormalizeNodeData extends VfxNodeBaseData {
  glbUrl: string | null;
  modelAsset: ModelAsset | null;
}

export interface VfxSocketNodeData extends VfxNodeBaseData {
  glbUrl: string | null;
  socketName: string;
}

export interface VfxSaveTechniqueNodeData extends VfxNodeBaseData {
  techniqueName: string;
  glbUrl: string | null;
  savedAssetId: string | null;
}

export type VfxPipelineNodeData =
  | VfxPromptNodeData
  | VfxMeshyNodeData
  | VfxNormalizeNodeData
  | VfxSocketNodeData
  | VfxSaveTechniqueNodeData;

export const VFX_STATUS_LABEL_DE: Record<VfxAssetStatus, string> = {
  DRAFT: 'Entwurf',
  QUEUED: 'Warteschlange',
  GENERATING: 'Generiert…',
  REVIEW_REQUIRED: 'Review nötig',
  READY: 'Bereit',
  FAILED: 'Fehlgeschlagen',
  OUTDATED: 'Veraltet',
};

export const VFX_STATUS_CLASS: Record<VfxAssetStatus, string> = {
  DRAFT: 'bg-stone-700 text-stone-200',
  QUEUED: 'bg-sky-900/80 text-sky-100',
  GENERATING: 'bg-amber-900/80 text-amber-100 animate-pulse',
  REVIEW_REQUIRED: 'bg-purple-900/80 text-purple-100',
  READY: 'bg-emerald-900/80 text-emerald-100',
  FAILED: 'bg-red-900/80 text-red-100',
  OUTDATED: 'bg-orange-900/80 text-orange-100',
};

export function defaultPromptNodeData(): VfxPromptNodeData {
  return { prompt: '', status: 'DRAFT' };
}

export function defaultMeshyNodeData(): VfxMeshyNodeData {
  return { taskId: null, glbUrl: null, status: 'DRAFT' };
}

export function defaultNormalizeNodeData(): VfxNormalizeNodeData {
  return { glbUrl: null, modelAsset: null, status: 'DRAFT' };
}

export function defaultSocketNodeData(): VfxSocketNodeData {
  return { glbUrl: null, socketName: 'SOCKET_VFX_CORE', status: 'DRAFT' };
}

export function defaultSaveTechniqueNodeData(): VfxSaveTechniqueNodeData {
  return {
    techniqueName: '',
    glbUrl: null,
    savedAssetId: null,
    status: 'DRAFT',
  };
}
