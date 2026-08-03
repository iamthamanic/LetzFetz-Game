/**
 * V6 Techniken auf 10 inkl. Beschwörungsritual (#381).
 * Location: src/game/engine/v6/techniquesTo10.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import { V6_SLICE1_TECHNIQUE_IDS } from '../../../content/v6/slice1Ids';
import { V6_FORMULA_AUTHORING_SLICE1 } from '../../../content/v6/formulaAuthoring.slice1';
import {
  V6_GENERATED_FORMULA_RECIPES,
  V6_GENERATED_RECIPE_COUNT,
  V6_SLICE1_RECIPE_CATALOG,
} from '../../../generated/v6/formulaRecipes.generated';
import { V6_PLAYTEST_CONSTRUCT_DEF_ID } from '../../../content/v6/cards/playtestConstructCards';
import { applyV6FormulaActivate } from './executeFormulaActivation';
import { planFormulaActivation } from './planFormulaActivation';
import { resolveCardArtPath } from '../../../services/cardArt/manifest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { FormulaComponentInstance, GameState } from '../../types';

const EXPECTED_TEN = [
  'v6-technik-impulsgeschoss',
  'v6-technik-adrenalinschrei',
  'v6-technik-fintenschnitt',
  'v6-technik-brechschlag',
  'v6-technik-kettenfessel',
  'v6-technik-bannkreis',
  'v6-technik-ueberraschungsangriff',
  'v6-technik-schicksalmanifestation',
  'v6-technik-magiepanzer',
  'v6-technik-beschwoerungsritual',
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
    seed: 381,
  });
}

describe('V6 Techniken auf 10 (#381)', () => {
  it('ships all ten techniques in pack + ids', () => {
    expect([...V6_SLICE1_TECHNIQUE_IDS]).toEqual([...EXPECTED_TEN]);
    expect(V6_CORE_PACK.techniques?.map((t) => t.id)).toEqual([...EXPECTED_TEN]);
    const ritual = V6_CORE_PACK.techniques?.find((t) => t.id === 'v6-technik-beschwoerungsritual');
    expect(ritual?.name).toBe('Beschwörungsritual');
    expect(ritual?.effectText).toMatch(/Konstrukt/);
  });

  it('authoring + generated catalog cover 10T×6E×4K (fail-closed size)', () => {
    expect(V6_FORMULA_AUTHORING_SLICE1.teBases).toHaveLength(60);
    expect(V6_FORMULA_AUTHORING_SLICE1.tkBases).toHaveLength(40);
    expect(V6_FORMULA_AUTHORING_SLICE1.ekBases).toHaveLength(24);
    expect(V6_GENERATED_RECIPE_COUNT).toBe(604);
    expect(V6_SLICE1_RECIPE_CATALOG.recipeCount).toBe(604);
    expect(V6_SLICE1_RECIPE_CATALOG.label).toMatch(/10T×6E×4K/);
    for (const id of EXPECTED_TEN) {
      expect(V6_FORMULA_AUTHORING_SLICE1.teBases.some((r) => r.techniqueId === id)).toBe(true);
      expect(V6_GENERATED_FORMULA_RECIPES.some((r) => r.techniqueId === id)).toBe(true);
    }
    // Prior recipe ids stay stable
    expect(
      V6_GENERATED_FORMULA_RECIPES.some((r) => r.recipeId === 'v6-te-impulsgeschoss-feuer'),
    ).toBe(true);
    expect(
      V6_GENERATED_FORMULA_RECIPES.some((r) => r.recipeId === 'v6-te-magiepanzer-wasser'),
    ).toBe(true);
  });

  it('Beschwörungsritual catalog TE summons construct without Fetz', () => {
    const te = V6_GENERATED_FORMULA_RECIPES.find(
      (r) => r.recipeId === 'v6-te-beschwoerungsritual-schatten',
    );
    expect(te?.primary.kind).toBe('summon_construct');
    expect(te?.summonConstructDefId).toBe(V6_PLAYTEST_CONSTRUCT_DEF_ID);
    expect(te?.grantsFetz).toBe(false);

    const tek = V6_GENERATED_FORMULA_RECIPES.find(
      (r) => r.recipeId === 'v6-tek-beschwoerungsritual-schatten-ueberladung',
    );
    expect(tek?.primary.kind).toBe('summon_construct');
    expect(tek?.grantsFetz).toBe(false);
    expect(tek?.summonConstructDefId).toBe(V6_PLAYTEST_CONSTRUCT_DEF_ID);

    let state = freshV6();
    state = place(state, 'p1', 'technik', 'v6-technik-beschwoerungsritual', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-schatten', 'e1');

    const plan = planFormulaActivation({
      state,
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
      rng: () => 0.01,
      asOverformula: false,
    });
    expect(plan.primary.kind).toBe('summon_construct');
    expect(plan.grantsFetz).toBe(false);
    expect(plan.summonConstructDefId).toBe(V6_PLAYTEST_CONSTRUCT_DEF_ID);

    const after = applyV6FormulaActivate(
      state,
      V6_CORE_PACK,
      'p1',
      V6_PACK_RULESET,
      () => 0.01,
      { asOverformula: false },
    );
    expect(after.players.p1.construct?.defId).toBe(V6_PLAYTEST_CONSTRUCT_DEF_ID);
    expect(after.players.p1.construct?.haltbarkeit).toBe(3);
    expect(after.players.p1.fetzCharge).toBe(0);
    expect(after.lastEvent).toMatch(/Konstrukt beschworen/);
  });

  it('reuses formula art for new techniques (Beschwörung alias)', () => {
    for (const id of EXPECTED_TEN) {
      const path = resolveCardArtPath(id);
      expect(path).toMatch(/^\/cards\/formula\/.+\.png$/);
      const relative = path.replace(/^\//, '');
      expect(existsSync(resolve(process.cwd(), 'public', relative)), `${id} → ${path}`).toBe(
        true,
      );
    }
    expect(resolveCardArtPath('v6-technik-beschwoerungsritual')).toBe(
      '/cards/formula/opfergabe.png',
    );
  });
});
