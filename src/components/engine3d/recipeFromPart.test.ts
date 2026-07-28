/**
 * Tests for recipeFromPart helpers (no WebGL).
 * Location: src/components/engine3d/recipeFromPart.test.ts
 */
import { describe, expect, it } from 'vitest';
import { ENGINE_RENDER_VERSION } from '../../game/types/engineVisual';
import { recipeFromPartId, recipeHasRegistryAsset } from './recipeFromPart';

describe('recipeFromPartId', () => {
  it('returns carrier-only recipe for registered part', () => {
    const recipe = recipeFromPartId('v3-part-shadow-antrieb-01');
    expect(recipe).toEqual({
      carrierId: 'v3-part-shadow-antrieb-01',
      cosmeticSeed: 0,
      renderVersion: ENGINE_RENDER_VERSION,
    });
  });

  it('returns null for unknown id', () => {
    expect(recipeFromPartId('not-a-part')).toBeNull();
    expect(recipeFromPartId('')).toBeNull();
  });
});

describe('recipeHasRegistryAsset', () => {
  it('is true when any slot id is registered', () => {
    expect(
      recipeHasRegistryAsset({
        carrierId: 'v3-part-water-traeger-01',
        cosmeticSeed: 0,
        renderVersion: ENGINE_RENDER_VERSION,
      }),
    ).toBe(true);
  });

  it('is false when no ids resolve', () => {
    expect(
      recipeHasRegistryAsset({
        carrierId: 'missing',
        cosmeticSeed: 0,
        renderVersion: ENGINE_RENDER_VERSION,
      }),
    ).toBe(false);
  });
});
