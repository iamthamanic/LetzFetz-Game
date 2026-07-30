/**
 * Unit tests for VFX normalize transform helpers.
 * Location: src/features/build/vfx/normalize/computeNormalizeTransform.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  computeNormalizeTransform,
  DEFAULT_MOCK_BOUNDS,
  formatNormalizedBoundsDe,
  uniformScaleVec3,
} from './computeNormalizeTransform';

describe('computeNormalizeTransform', () => {
  it('scales longest axis to 1 and grounds bottom at y=0', () => {
    const result = computeNormalizeTransform({
      min: { x: -2, y: 1, z: -1 },
      max: { x: 2, y: 5, z: 1 },
    });

    expect(result.scale).toBeCloseTo(0.25);
    expect(result.pivot).toEqual({ x: 0, y: 1, z: 0 });
    expect(result.normalizedBounds.min.y).toBe(0);
    expect(result.normalizedBounds.max.y).toBeCloseTo(1);
    expect(result.normalizedBounds.max.x - result.normalizedBounds.min.x).toBeCloseTo(1);
  });

  it('handles cube bounds with uniform scale 1', () => {
    const result = computeNormalizeTransform({
      min: { x: -0.5, y: 0, z: -0.5 },
      max: { x: 0.5, y: 1, z: 0.5 },
    });

    expect(result.scale).toBeCloseTo(1);
    expect(result.normalizedBounds.max.y).toBeCloseTo(1);
  });

  it('falls back safely for degenerate bounds', () => {
    const result = computeNormalizeTransform({
      min: { x: 0, y: 0, z: 0 },
      max: { x: 0, y: 0, z: 0 },
    });

    expect(result.scale).toBeGreaterThan(0);
    expect(Number.isFinite(result.scale)).toBe(true);
  });

  it('uses DEFAULT_MOCK_BOUNDS as identity-ish unit metadata', () => {
    const result = computeNormalizeTransform(DEFAULT_MOCK_BOUNDS);
    expect(result.scale).toBeCloseTo(1);
    expect(result.normalizedBounds.min.y).toBe(0);
    expect(result.normalizedBounds.max.y).toBeCloseTo(1);
  });
});

describe('formatNormalizedBoundsDe', () => {
  it('formats German bounds summary', () => {
    const text = formatNormalizedBoundsDe({
      min: { x: -0.5, y: 0, z: -0.5 },
      max: { x: 0.5, y: 1, z: 0.5 },
    });
    expect(text).toMatch(/Größe/);
    expect(text).toMatch(/Boden zentriert/);
  });
});

describe('uniformScaleVec3', () => {
  it('returns equal components', () => {
    expect(uniformScaleVec3(0.5)).toEqual({ x: 0.5, y: 0.5, z: 0.5 });
  });
});
