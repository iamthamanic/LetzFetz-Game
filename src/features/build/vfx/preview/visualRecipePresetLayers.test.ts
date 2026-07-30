/**
 * Unit tests for VisualRecipe → Effekseer preset layer mapper (#303).
 * Location: src/features/build/vfx/preview/visualRecipePresetLayers.test.ts
 */
import { describe, expect, it } from 'vitest';
import type { VisualRecipe } from '../../../../game/types';
import type { FormulaCatalogCard } from '../../model/combinateFormula';
import type { BuildSlots } from '../../model/buildTypes';
import {
  listMvp9PresetCoverage,
  mapCombinateSlotsToPresetLayers,
  mapMvp9CardIdToPreset,
  mapVisualRecipeToPresetLayers,
  MVP9_CARD_PRESET_IDS,
} from './visualRecipePresetLayers';

describe('mapVisualRecipeToPresetLayers', () => {
  it('maps beam delivery to trail and fire essence to aura', () => {
    const recipe: VisualRecipe = {
      delivery: 'beam',
      shape: 'drill',
      secondaryElement: 'fire',
      transformation: 'overcharge',
    };
    const layers = mapVisualRecipeToPresetLayers(recipe);
    expect(layers.map((l) => l.presetId)).toEqual(['trail', 'aura', 'impact']);
  });
});

describe('MVP-9 preset table', () => {
  it('covers all nine MVP card ids with registered presets', () => {
    const coverage = listMvp9PresetCoverage();
    expect(coverage).toHaveLength(9);
    for (const { cardId, presetId } of coverage) {
      expect(mapMvp9CardIdToPreset(cardId)).toBe(presetId);
    }
    expect(Object.keys(MVP9_CARD_PRESET_IDS).sort()).toEqual(
      [
        'v5-essenz-eingekochte-glut',
        'v5-essenz-kraeuterstaub',
        'v5-essenz-ueberdrucktes-kondensat',
        'v5-katalysator-echo',
        'v5-katalysator-spiegelung',
        'v5-katalysator-ueberladung',
        'v5-technik-durchschuss',
        'v5-technik-notfallbarriere',
        'v5-technik-rueckhandtechnik',
      ].sort(),
    );
  });
});

describe('mapCombinateSlotsToPresetLayers', () => {
  const catalog: FormulaCatalogCard[] = [
    {
      id: 'v5-technik-durchschuss',
      name: 'Durchschuss',
      role: 'technik',
      imageUrl: '',
      element: null,
      stability: 1,
      effectText: '',
      activationMode: 'instant',
    },
    {
      id: 'v5-essenz-eingekochte-glut',
      name: 'Eingekochte Glut',
      role: 'essenz',
      imageUrl: '',
      element: 'fire',
      stability: 1,
      effectText: '',
      activationMode: null,
    },
  ];

  it('uses MVP-9 table for filled slots and picks primary preset', () => {
    const slots: BuildSlots = {
      technik: 'v5-technik-durchschuss',
      essenz: 'v5-essenz-eingekochte-glut',
      katalysator: null,
    };
    const result = mapCombinateSlotsToPresetLayers(slots, catalog);
    expect(result.layers.map((l) => l.presetId)).toEqual(['trail', 'aura']);
    expect(result.primaryPresetId).toBe('trail');
  });

  it('defaults to aura when no slots filled', () => {
    const slots: BuildSlots = { technik: null, essenz: null, katalysator: null };
    const result = mapCombinateSlotsToPresetLayers(slots, catalog);
    expect(result.layers).toEqual([]);
    expect(result.primaryPresetId).toBe('aura');
  });
});
