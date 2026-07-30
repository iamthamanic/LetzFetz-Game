/**
 * Tests for Formelgestell compose layers (#287).
 * Location: src/features/play/board/formulaCompose.test.ts
 */
import { describe, expect, it } from 'vitest';
import { composeFormulaGestellLayers } from './formulaCompose';
import type { VisualRecipe } from '../../../game/types';

describe('composeFormulaGestellLayers', () => {
  it('returns idle layers when recipe is null', () => {
    const layers = composeFormulaGestellLayers(null);
    expect(layers).toHaveLength(3);
    expect(layers.every((l) => !l.active)).toBe(true);
    expect(layers.map((l) => l.role)).toEqual(['vessel', 'core', 'ring']);
  });

  it('activates vessel/core/ring from VisualRecipe properties', () => {
    const recipe: VisualRecipe = {
      delivery: 'beam',
      shape: 'drill',
      primaryElement: 'water',
      secondaryElement: 'fire',
      material: 'ember',
      timing: 'delayed',
      transformation: 'duplicate',
    };
    const layers = composeFormulaGestellLayers(recipe);
    expect(layers[0]?.active).toBe(true);
    expect(layers[0]?.hintDe).toMatch(/Feuer/);
    expect(layers[1]?.active).toBe(true);
    expect(layers[1]?.hintDe).toMatch(/Bohrer/);
    expect(layers[2]?.active).toBe(true);
    expect(layers[2]?.hintDe).toMatch(/Echo/);
  });

  it('keeps core active for technik-only recipes', () => {
    const recipe: VisualRecipe = {
      delivery: 'melee',
      shape: 'slash',
    };
    const layers = composeFormulaGestellLayers(recipe);
    expect(layers[0]?.active).toBe(false);
    expect(layers[1]?.active).toBe(true);
    expect(layers[2]?.active).toBe(false);
  });
});
