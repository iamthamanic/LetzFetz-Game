/**
 * Location: src/game/types/formulaVisual.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  V5_MAX_FETZ_CHARGE,
  V5_RULESET,
  isV5FormulaEnabled,
  maxFetzChargeFor,
  DEFAULT_RULESET,
} from './ruleset';
import type {
  CatalystVisual,
  EssenceVisual,
  TechniqueVisual,
  VisualRecipe,
} from './formulaVisual';
import type { FormulaBoard } from './game';
import type { TechniqueCardDef, EssenceCardDef, CatalystCardDef, ItemCardDef } from './cards';

describe('V5 formula types', () => {
  it('exposes V5_RULESET with formula + charge cap 3', () => {
    expect(isV5FormulaEnabled(V5_RULESET)).toBe(true);
    expect(V5_RULESET.v3Combat).toBe(true);
    expect(maxFetzChargeFor(V5_RULESET)).toBe(3);
    expect(V5_MAX_FETZ_CHARGE).toBe(3);
  });

  it('keeps default ruleset without v5Formula', () => {
    expect(isV5FormulaEnabled(DEFAULT_RULESET)).toBe(false);
    expect(maxFetzChargeFor(DEFAULT_RULESET)).toBe(6);
  });

  it('accepts TechniqueVisual / EssenceVisual / CatalystVisual shapes', () => {
    const tech: TechniqueVisual = {
      id: 'durchschuss',
      delivery: 'beam',
      shape: 'drill',
      castOrigin: 'hand',
      forwardAxis: 'z',
      scaleClass: 'medium',
    };
    const ess: EssenceVisual = {
      id: 'glut',
      element: 'fire',
      materialProfile: 'ember',
      particleProfile: 'sparks',
      trailProfile: 'heat',
      impactProfile: 'burn',
    };
    const cat: CatalystVisual = {
      id: 'echo',
      timing: 'delayed',
      transformation: 'duplicate',
      animationProfile: 'echo-ring',
    };
    const recipe: VisualRecipe = {
      delivery: tech.delivery,
      shape: tech.shape,
      primaryElement: 'water',
      secondaryElement: ess.element,
      material: ess.materialProfile,
      timing: cat.timing,
      transformation: cat.transformation,
    };
    expect(recipe.secondaryElement).toBe('fire');
  });

  it('types formula card kinds and empty FormulaBoard', () => {
    const board: FormulaBoard = { technik: null, essenz: null, katalysator: null };
    const t: TechniqueCardDef = {
      kind: 'technique',
      id: 't1',
      name: 'Durchschuss',
      stability: 3,
      activationMode: 'prep_attack',
      effectText: 'Ignoriert 1 Schild',
    };
    const e: EssenceCardDef = {
      kind: 'essence',
      id: 'e1',
      name: 'Glut',
      element: 'fire',
      stability: 2,
      effectText: 'Brennen',
    };
    const c: CatalystCardDef = {
      kind: 'catalyst',
      id: 'c1',
      name: 'Echo',
      stability: 2,
      effectText: 'Echo',
    };
    const item: ItemCardDef = {
      kind: 'item',
      id: 'i1',
      name: 'Nagel',
      timing: 'action',
      effectText: 'Ignoriert 2 Schild',
    };
    expect(board.technik).toBeNull();
    expect([t, e, c, item].map((x) => x.kind)).toEqual([
      'technique',
      'essence',
      'catalyst',
      'item',
    ]);
  });
});
