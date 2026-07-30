/**
 * Unit tests for ModelAsset builder from normalize bounds.
 * Location: src/features/build/vfx/normalize/buildModelAsset.test.ts
 */
import { describe, expect, it } from 'vitest';
import { parseModelAsset } from '../types/wireTypes';
import { buildModelAsset, formatModelAssetStatusDe } from './buildModelAsset';

describe('buildModelAsset', () => {
  it('produces typed ModelAsset with scale, pivot, bounds', () => {
    const asset = buildModelAsset({
      glbUrl: '/vfx/mock/demo-technique.glb',
      bounds: {
        min: { x: -1, y: 0, z: -1 },
        max: { x: 1, y: 2, z: 1 },
      },
      id: 'mdl-test',
    });

    expect(asset.kind).toBe('model');
    expect(asset.scale.x).toBeCloseTo(0.5);
    expect(asset.pivot).toEqual({ x: 0, y: 0, z: 0 });
    expect(asset.bounds.min.x).toBe(-1);
    expect(parseModelAsset(JSON.parse(JSON.stringify(asset)))).toEqual(asset);
  });

  it('formats German status from asset bounds', () => {
    const asset = buildModelAsset({
      glbUrl: '/x.glb',
      bounds: {
        min: { x: -0.5, y: 0, z: -0.5 },
        max: { x: 0.5, y: 1, z: 0.5 },
      },
    });
    expect(formatModelAssetStatusDe(asset)).toMatch(/Größe/);
  });
});
