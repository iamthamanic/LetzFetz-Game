/**
 * Pure normalization math for VFX Studio ModelAsset metadata.
 * Location: src/features/build/vfx/normalize/computeNormalizeTransform.ts
 */

import type { AabbBounds, Vec3 } from '../types/wireTypes';

export interface NormalizeTransform {
  scale: number;
  pivot: Vec3;
  bounds: AabbBounds;
  normalizedBounds: AabbBounds;
}

export const DEFAULT_MOCK_BOUNDS: AabbBounds = {
  min: { x: -0.5, y: 0, z: -0.5 },
  max: { x: 0.5, y: 1, z: 0.5 },
};

function axisLength(min: number, max: number): number {
  const length = max - min;
  return Number.isFinite(length) && length > 0 ? length : 0;
}

/** Scale longest axis to targetSize; pivot at ground-center of the source AABB. */
export function computeNormalizeTransform(
  bounds: AabbBounds,
  options?: { targetSize?: number },
): NormalizeTransform {
  const targetSize = options?.targetSize ?? 1;
  const { min, max } = bounds;

  const sizeX = axisLength(min.x, max.x);
  const sizeY = axisLength(min.y, max.y);
  const sizeZ = axisLength(min.z, max.z);
  const longestAxis = Math.max(sizeX, sizeY, sizeZ, Number.EPSILON);
  const scale = targetSize / longestAxis;

  const pivot: Vec3 = {
    x: (min.x + max.x) / 2,
    y: min.y,
    z: (min.z + max.z) / 2,
  };

  const scaledSizeX = sizeX * scale;
  const scaledSizeY = sizeY * scale;
  const scaledSizeZ = sizeZ * scale;

  const normalizedBounds: AabbBounds = {
    min: {
      x: -scaledSizeX / 2,
      y: 0,
      z: -scaledSizeZ / 2,
    },
    max: {
      x: scaledSizeX / 2,
      y: scaledSizeY,
      z: scaledSizeZ / 2,
    },
  };

  return { scale, pivot, bounds, normalizedBounds };
}

export function uniformScaleVec3(scale: number): Vec3 {
  return { x: scale, y: scale, z: scale };
}

/** German one-line bounds summary for node UI. */
export function formatNormalizedBoundsDe(bounds: AabbBounds): string {
  const width = bounds.max.x - bounds.min.x;
  const height = bounds.max.y - bounds.min.y;
  const depth = bounds.max.z - bounds.min.z;
  const fmt = (value: number) => value.toFixed(2);
  return `Größe ${fmt(width)} × ${fmt(height)} × ${fmt(depth)} · Boden zentriert`;
}
