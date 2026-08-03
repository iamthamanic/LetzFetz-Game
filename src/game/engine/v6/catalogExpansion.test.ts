/**
 * V6 catalog expansion 10T×6E×10K (#383).
 * Location: src/game/engine/v6/catalogExpansion.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import { V6_FORMULA_AUTHORING_SLICE1 } from '../../../content/v6/formulaAuthoring.slice1';
import {
  V6_GENERATED_FORMULA_RECIPES,
  V6_GENERATED_RECIPE_COUNT,
  V6_SLICE1_RECIPE_CATALOG,
} from '../../../generated/v6/formulaRecipes.generated';
import { planFormulaActivation } from './planFormulaActivation';
import type { FormulaComponentInstance, GameState } from '../../types';

const UNSUPPORTED = [
  'v6-katalysator-ausbreitung',
  'v6-katalysator-kettenkopplung',
  'v6-katalysator-spiegelung',
  'v6-katalysator-umkehrung',
] as const;

function place(
  state: GameState,
  playerId: 'p1' | 'p2',
  slot: 'technik' | 'essenz' | 'katalysator',
  defId: string,
  instanceId: string,
): GameState {
  const next = structuredClone(state);
  const comp: FormulaComponentInstance = {
    instanceId,
    defId,
    slot,
    exhausted: false,
    disturbed: false,
    stabilityBonus: 0,
  };
  next.players[playerId].formula[slot] = comp;
  next.phase = 'build';
  next.activePlayer = playerId;
  return next;
}

describe('V6 catalog expansion 10T×6E×10K (#383)', () => {
  it('ships 1420 recipes with explicit supported/unsupported split', () => {
    expect(V6_GENERATED_RECIPE_COUNT).toBe(1420);
    expect(V6_SLICE1_RECIPE_CATALOG.recipeCount).toBe(1420);
    expect(V6_SLICE1_RECIPE_CATALOG.label).toMatch(/10T×6E×10K/);
    expect(V6_SLICE1_RECIPE_CATALOG.breakdown).toEqual({
      te: 60,
      tk: 100,
      ek: 60,
      tek: 600,
      overformula: 600,
    });
    expect(V6_FORMULA_AUTHORING_SLICE1.tkBases).toHaveLength(100);
    expect(V6_FORMULA_AUTHORING_SLICE1.ekBases).toHaveLength(60);
    expect(V6_FORMULA_AUTHORING_SLICE1.catalystTransforms).toHaveLength(10);

    const unsupported = V6_GENERATED_FORMULA_RECIPES.filter((r) => r.availability === 'unsupported');
    const supported = V6_GENERATED_FORMULA_RECIPES.filter((r) => r.availability === 'supported');
    // 4 catalysts × (10 TK + 6 EK + 60 TEK + 60 over) = 4×136 = 544
    expect(unsupported).toHaveLength(544);
    expect(supported).toHaveLength(1420 - 544);
    for (const id of UNSUPPORTED) {
      expect(unsupported.every((r) => r.catalystId !== null)).toBe(true);
      expect(unsupported.some((r) => r.catalystId === id)).toBe(true);
      expect(supported.some((r) => r.catalystId === id)).toBe(false);
    }
    for (const r of unsupported) {
      expect(r.effectSummary.trim().length).toBeGreaterThan(10);
      expect(r.effectSummary).not.toMatch(/stub/i);
      expect(r.name).not.toMatch(/stub/i);
    }
  });

  it('rejects unsupported catalyst combinations at plan time (fail-closed)', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 383,
    });
    state = place(state, 'p1', 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'p1', 'katalysator', 'v6-katalysator-umkehrung', 'k1');
    expect(() =>
      planFormulaActivation({
        state,
        pack: V6_CORE_PACK,
        playerId: 'p1',
        ruleset: V6_PACK_RULESET,
        rng: () => 0.01,
        asOverformula: false,
      }),
    ).toThrow(/nicht freigeschaltet|§50\.3|Authoring fehlt/);
  });

  it('keeps prior supported recipe ids stable', () => {
    expect(
      V6_GENERATED_FORMULA_RECIPES.some((r) => r.recipeId === 'v6-tek-impulsgeschoss-feuer-ueberladung'),
    ).toBe(true);
    expect(
      V6_GENERATED_FORMULA_RECIPES.some((r) => r.recipeId === 'v6-tek-impulsgeschoss-feuer-echo'),
    ).toBe(true);
  });
});
