/**
 * V6 Slice-1 plan/execute engine tests (#319).
 * Location: src/game/engine/v6/v6FormulaActivate.test.ts
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGame } from '../createGame';
import { applyAction, getLegalActions } from '../actions';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import { planFormulaActivation } from './planFormulaActivation';
import { applyV6FormulaActivate } from './executeFormulaActivation';
import { v6DefenseStagesFromRoll } from './formulaDefense';
import type { FormulaComponentInstance, GameState } from '../../types';

const here = dirname(fileURLToPath(import.meta.url));

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

describe('V6 formula defense bands', () => {
  it('maps 1–2 / 3–4 / 5–6 to stages 0 / 1 / 2', () => {
    expect(v6DefenseStagesFromRoll(1)).toBe(0);
    expect(v6DefenseStagesFromRoll(2)).toBe(0);
    expect(v6DefenseStagesFromRoll(3)).toBe(1);
    expect(v6DefenseStagesFromRoll(4)).toBe(1);
    expect(v6DefenseStagesFromRoll(5)).toBe(2);
    expect(v6DefenseStagesFromRoll(6)).toBe(2);
  });
});

describe('V6 planFormulaActivation / execute', () => {
  it('TEK damages, discards catalyst, grants fetz once, locks attack', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 7,
    });
    state = place(state, 'p1', 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'p1', 'katalysator', 'v6-katalysator-verdichtung', 'k1');

    const plan = planFormulaActivation({
      state,
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
      rng: () => 0.01,
      defenseRoll: 1,
      asOverformula: false,
    });
    expect(plan.kind).toBe('tek');
    expect(plan.catalystConsumed).toBe(true);
    expect(plan.grantsFetz).toBe(true);
    expect(plan.fetzDelta).toBe(1);
    expect(plan.postFormulaActionLock).toBe('attack_and_challenge');

    const beforeHp = state.players.p2.hp;
    const next = applyV6FormulaActivate(state, V6_CORE_PACK, 'p1', V6_PACK_RULESET, () => 0.01, {
      defenseRoll: 1,
      asOverformula: false,
    });
    expect(next.players.p1.formula.katalysator).toBeNull();
    expect(next.piles.discard.some((c) => c.instanceId === 'k1')).toBe(true);
    expect(next.players.p1.fetzCharge).toBe(1);
    expect(next.meta.v6FetzGainedThisTurn?.p1).toBe(true);
    expect(next.meta.v6PostFormulaActionLock?.p1).toBe('attack_and_challenge');
    expect(next.players.p2.hp).toBeLessThan(beforeHp);
    expect(next.lastEvent).toMatch(/Katalysator verbraucht/);
  });

  it('defense 5–6 reduces primary by 2 and marks suppressible rider', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 3,
    });
    state = place(state, 'p1', 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'p1', 'katalysator', 'v6-katalysator-verdichtung', 'k1');

    const planLow = planFormulaActivation({
      state,
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
      rng: () => 0,
      defenseRoll: 1,
      asOverformula: false,
    });
    const planHigh = planFormulaActivation({
      state,
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
      rng: () => 0,
      defenseRoll: 6,
      asOverformula: false,
    });
    expect(planHigh.primary.value).toBe(planLow.primary.value - 2);
    expect(planHigh.formulaDefense?.stages).toBe(2);
    expect(planHigh.rider?.suppressed).toBe(true);
  });

  it('FORMULA_ACTIVATE via applyAction works under v6Formula', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 9,
    });
    state = place(state, 'p1', 'technik', 'v6-technik-magiepanzer', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-luft', 'e1');
    const beforeShield = state.players.p1.shield;
    const ctx = { pack: V6_CORE_PACK, ruleset: V6_PACK_RULESET, rng: () => 0.2, playerId: 'p1' as const };
    const legal = getLegalActions(state, ctx);
    expect(legal.some((a) => a.type === 'FORMULA_ACTIVATE')).toBe(true);
    state = applyAction(state, { type: 'FORMULA_ACTIVATE' }, 'p1', ctx);
    expect(state.players.p1.shield).toBeGreaterThan(beforeShield);
    expect(state.players.p1.fetzCharge).toBe(0);
  });

  it('does not import V5 formulaCombinations from v6 engine modules', () => {
    const sources = [
      join(here, 'planFormulaActivation.ts'),
      join(here, 'executeFormulaActivation.ts'),
      join(here, 'recipeLookup.ts'),
      join(here, 'index.ts'),
    ];
    for (const path of sources) {
      const text = readFileSync(path, 'utf8');
      expect(text, path).not.toMatch(/formulaCombinations/);
      expect(text, path).not.toMatch(/packs\/v5\/formulaCombinations/);
    }
  });
});
