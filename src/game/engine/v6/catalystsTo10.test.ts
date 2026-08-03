/**
 * V6 Katalysatoren auf 10 (#382).
 * Location: src/game/engine/v6/catalystsTo10.test.ts
 */
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createGame } from '../createGame';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import {
  V6_MATRIX_CATALYST_IDS,
  V6_SLICE1_CATALYST_IDS,
} from '../../../content/v6/slice1Ids';
import { V6_FORMULA_AUTHORING_SLICE1 } from '../../../content/v6/formulaAuthoring.slice1';
import {
  V6_GENERATED_FORMULA_RECIPES,
  V6_GENERATED_RECIPE_COUNT,
  V6_SLICE1_RECIPE_CATALOG,
} from '../../../generated/v6/formulaRecipes.generated';
import { applyV6FormulaActivate } from './executeFormulaActivation';
import { planFormulaActivation } from './planFormulaActivation';
import { resolveCardArtPath } from '../../../services/cardArt/manifest';
import type { FormulaComponentInstance, GameState } from '../../types';

const EXPECTED_TEN = [
  'v6-katalysator-echo',
  'v6-katalysator-ueberladung',
  'v6-katalysator-verdichtung',
  'v6-katalysator-ausbreitung',
  'v6-katalysator-kettenkopplung',
  'v6-katalysator-verzoegerung',
  'v6-katalysator-sofortzuender',
  'v6-katalysator-spiegelung',
  'v6-katalysator-umkehrung',
  'v6-katalysator-opfergabe',
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

function freshV6(): GameState {
  return createGame({
    pack: V6_CORE_PACK,
    p1CharacterId: V6_CORE_PACK.characters[0].id,
    p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
    ruleset: V6_PACK_RULESET,
    seed: 382,
  });
}

describe('V6 Katalysatoren auf 10 (#382)', () => {
  it('ships all ten catalysts in pack + ids', () => {
    expect([...V6_SLICE1_CATALYST_IDS]).toEqual([...EXPECTED_TEN]);
    expect(V6_CORE_PACK.catalysts?.slice(0, 10).map((c) => c.id)).toEqual([...EXPECTED_TEN]);
    expect(V6_MATRIX_CATALYST_IDS).toHaveLength(6);
  });

  it('authoring: 10 transforms, 6 supported / 4 unsupported — no invent', () => {
    expect(V6_FORMULA_AUTHORING_SLICE1.catalystTransforms).toHaveLength(10);
    const byAvail = {
      supported: V6_FORMULA_AUTHORING_SLICE1.catalystTransforms.filter(
        (t) => t.availability === 'supported',
      ),
      unsupported: V6_FORMULA_AUTHORING_SLICE1.catalystTransforms.filter(
        (t) => t.availability === 'unsupported',
      ),
    };
    expect(byAvail.supported.map((t) => t.catalystId).sort()).toEqual(
      [...V6_MATRIX_CATALYST_IDS].sort(),
    );
    expect(byAvail.unsupported.map((t) => t.catalystId).sort()).toEqual(
      [
        'v6-katalysator-ausbreitung',
        'v6-katalysator-kettenkopplung',
        'v6-katalysator-spiegelung',
        'v6-katalysator-umkehrung',
      ].sort(),
    );
    // Fail-closed: no TEK rows for unsupported catalysts
    for (const id of byAvail.unsupported.map((t) => t.catalystId)) {
      expect(V6_GENERATED_FORMULA_RECIPES.some((r) => r.catalystId === id)).toBe(false);
    }
  });

  it('catalog is 10T×6E×6K = 876; prior 4K recipe ids stable', () => {
    expect(V6_GENERATED_RECIPE_COUNT).toBe(876);
    expect(V6_SLICE1_RECIPE_CATALOG.recipeCount).toBe(876);
    expect(V6_SLICE1_RECIPE_CATALOG.label).toMatch(/10T×6E×6K/);
    expect(
      V6_GENERATED_FORMULA_RECIPES.some((r) => r.recipeId === 'v6-tek-impulsgeschoss-feuer-ueberladung'),
    ).toBe(true);
    expect(
      V6_GENERATED_FORMULA_RECIPES.some((r) => r.recipeId === 'v6-tek-impulsgeschoss-feuer-echo'),
    ).toBe(true);
    expect(
      V6_GENERATED_FORMULA_RECIPES.some(
        (r) => r.recipeId === 'v6-tek-impulsgeschoss-feuer-verzoegerung',
      ),
    ).toBe(true);
  });

  it('Echo/Delay catalog TEK carry timingMode and defer catalyst discard', () => {
    const echo = V6_GENERATED_FORMULA_RECIPES.find(
      (r) => r.recipeId === 'v6-tek-impulsgeschoss-feuer-echo',
    );
    expect(echo?.timingMode).toBe('echo');
    expect(echo?.echoAmount).toBe(1);
    expect(echo?.catalystConsumed).toBe(false);

    const delay = V6_GENERATED_FORMULA_RECIPES.find(
      (r) => r.recipeId === 'v6-tek-impulsgeschoss-feuer-verzoegerung',
    );
    expect(delay?.timingMode).toBe('delay');
    expect(delay?.delayBonus).toBe(2);
    expect(delay?.catalystConsumed).toBe(false);

    let state = freshV6();
    state = place(state, 'p1', 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'p1', 'katalysator', 'v6-katalysator-echo', 'k1');
    const plan = planFormulaActivation({
      state,
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
      rng: () => 0.01,
      defenseRoll: 1,
      asOverformula: false,
    });
    expect(plan.timingMode).toBe('echo');
    expect(plan.catalystConsumed).toBe(false);
    const after = applyV6FormulaActivate(
      state,
      V6_CORE_PACK,
      'p1',
      V6_PACK_RULESET,
      () => 0.01,
      { defenseRoll: 1, asOverformula: false },
    );
    expect(after.players.p1.formula.katalysator?.defId).toBe('v6-katalysator-echo');
    expect(after.meta.v6EchoQueue?.p1?.length).toBe(1);
  });

  it('resolves art for all ten catalyst ids', () => {
    for (const id of EXPECTED_TEN) {
      const path = resolveCardArtPath(id);
      expect(path, id).toMatch(/\/cards\/formula\/.+\.png$/);
      const file = resolve(process.cwd(), 'public', path.replace(/^\//, ''));
      expect(existsSync(file), file).toBe(true);
    }
  });
});
