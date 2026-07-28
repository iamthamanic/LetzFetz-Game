/**
 * Unit tests for MVP demo recipe helpers (no WebGL).
 * Location: src/features/play/engine3d/mvpDemoRecipe.test.ts
 */
import { describe, expect, it } from 'vitest';
import { ENGINE_RENDER_VERSION } from '../../../game/types/engineVisual';
import { MVP_DEMO_RECIPE, recipeHasRegistryAsset } from './mvpDemoRecipe';

describe('MVP_DEMO_RECIPE', () => {
  it('maps the three MVP registry part ids', () => {
    expect(MVP_DEMO_RECIPE.carrierId).toBe('v3-part-water-traeger-01');
    expect(MVP_DEMO_RECIPE.driveId).toBe('v3-part-shadow-antrieb-01');
    expect(MVP_DEMO_RECIPE.attachmentId).toBe('v3-part-light-aufsatz-01');
    expect(MVP_DEMO_RECIPE.renderVersion).toBe(ENGINE_RENDER_VERSION);
  });

  it('is fully covered by the part registry', () => {
    expect(recipeHasRegistryAsset(MVP_DEMO_RECIPE)).toBe(true);
  });
});

describe('recipeHasRegistryAsset', () => {
  it('returns false for empty / unknown recipes', () => {
    expect(
      recipeHasRegistryAsset({
        cosmeticSeed: 0,
        renderVersion: ENGINE_RENDER_VERSION,
      }),
    ).toBe(false);
    expect(
      recipeHasRegistryAsset({
        carrierId: 'unknown-part',
        cosmeticSeed: 0,
        renderVersion: ENGINE_RENDER_VERSION,
      }),
    ).toBe(false);
  });
});
