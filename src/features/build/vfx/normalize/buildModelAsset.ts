/**
 * Build typed ModelAsset from GLB URL and measured bounds.
 * Location: src/features/build/vfx/normalize/buildModelAsset.ts
 */
import type { AabbBounds, ModelAsset } from '../types/wireTypes';
import {
  computeNormalizeTransform,
  uniformScaleVec3,
  formatNormalizedBoundsDe,
} from './computeNormalizeTransform';

export function buildModelAsset(params: {
  glbUrl: string;
  bounds: AabbBounds;
  sourceImageId?: string | null;
  id?: string;
}): ModelAsset {
  const transform = computeNormalizeTransform(params.bounds);
  const id = params.id ?? `mdl-${Date.now()}`;

  return {
    kind: 'model',
    id,
    glbUrl: params.glbUrl,
    sourceImageId: params.sourceImageId ?? null,
    scale: uniformScaleVec3(transform.scale),
    pivot: transform.pivot,
    bounds: transform.bounds,
  };
}

export function formatModelAssetStatusDe(asset: ModelAsset): string {
  const transform = computeNormalizeTransform(asset.bounds);
  return formatNormalizedBoundsDe(transform.normalizedBounds);
}
