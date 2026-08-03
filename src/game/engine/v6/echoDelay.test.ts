/**
 * V6 Echo / Delay queue + Startphase resolve tests (#344).
 * Location: src/game/engine/v6/echoDelay.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { applyAction } from '../actions';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import { applyV6FormulaActivate } from './executeFormulaActivation';
import { planFormulaActivation } from './planFormulaActivation';
import {
  V6_DELAY_DEFAULT_BONUS,
  V6_ECHO_DEFAULT_AMOUNT,
  tickV6EchoAndDelayAtStart,
} from './echoDelay';
import {
  V6_PLAYTEST_DELAY_CATALYST_ID,
  V6_PLAYTEST_ECHO_CATALYST_ID,
} from './playtestEchoDelayRecipes';
import type { FormulaComponentInstance, GameState } from '../../types';

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
    seed: 44,
  });
}

describe('V6 Echo / Delay (#344)', () => {
  it('Echo: primary now, queue echoAmount, catalyst stays until Startphase then discard', () => {
    let state = freshV6();
    state = place(state, 'p1', 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'p1', 'katalysator', V6_PLAYTEST_ECHO_CATALYST_ID, 'k-echo');

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
    expect(plan.echoAmount).toBe(V6_ECHO_DEFAULT_AMOUNT);

    const beforeHp = state.players.p2.hp;
    const afterActivate = applyV6FormulaActivate(
      state,
      V6_CORE_PACK,
      'p1',
      V6_PACK_RULESET,
      () => 0.01,
      { defenseRoll: 1, asOverformula: false },
    );

    expect(afterActivate.players.p2.hp).toBe(beforeHp - 3);
    expect(afterActivate.players.p1.formula.katalysator?.instanceId).toBe('k-echo');
    expect(afterActivate.meta.v6EchoQueue?.p1).toHaveLength(1);
    expect(afterActivate.meta.v6EchoQueue?.p1[0]?.echoAmount).toBe(1);
    expect(afterActivate.players.p1.fetzCharge).toBe(1);
    expect(afterActivate.lastEvent).toMatch(/Echo in Warteschlange/);

    const hpAfterPrimary = afterActivate.players.p2.hp;
    const afterStart = tickV6EchoAndDelayAtStart(afterActivate, 'p1', V6_PACK_RULESET);

    expect(afterStart.players.p2.hp).toBe(hpAfterPrimary - 1);
    expect(afterStart.meta.v6EchoQueue?.p1).toEqual([]);
    expect(afterStart.players.p1.formula.katalysator).toBeNull();
    expect(afterStart.piles.discard.some((c) => c.instanceId === 'k-echo')).toBe(true);
    expect(afterStart.players.p1.fetzCharge).toBe(1);
    expect(afterStart.lastEvent).toMatch(/Echo:/);
  });

  it('Delay: no immediate primary; Startphase applies value+bonus then discards catalyst', () => {
    let state = freshV6();
    state = place(state, 'p1', 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'p1', 'katalysator', V6_PLAYTEST_DELAY_CATALYST_ID, 'k-delay');

    const plan = planFormulaActivation({
      state,
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
      rng: () => 0.01,
      defenseRoll: 1,
      asOverformula: false,
    });
    expect(plan.timingMode).toBe('delay');
    expect(plan.catalystConsumed).toBe(false);
    expect(plan.delayBonus).toBe(V6_DELAY_DEFAULT_BONUS);

    const beforeHp = state.players.p2.hp;
    const afterActivate = applyV6FormulaActivate(
      state,
      V6_CORE_PACK,
      'p1',
      V6_PACK_RULESET,
      () => 0.01,
      { defenseRoll: 1, asOverformula: false },
    );

    expect(afterActivate.players.p2.hp).toBe(beforeHp);
    expect(afterActivate.players.p1.formula.katalysator?.instanceId).toBe('k-delay');
    expect(afterActivate.meta.v6DelayQueue?.p1).toHaveLength(1);
    expect(afterActivate.meta.v6DelayQueue?.p1[0]?.value).toBe(3 + V6_DELAY_DEFAULT_BONUS);
    expect(afterActivate.players.p1.fetzCharge).toBe(1);
    expect(afterActivate.lastEvent).toMatch(/Verzögerung in Warteschlange/);

    const afterStart = tickV6EchoAndDelayAtStart(afterActivate, 'p1', V6_PACK_RULESET);
    expect(afterStart.players.p2.hp).toBe(beforeHp - (3 + V6_DELAY_DEFAULT_BONUS));
    expect(afterStart.meta.v6DelayQueue?.p1).toEqual([]);
    expect(afterStart.players.p1.formula.katalysator).toBeNull();
    expect(afterStart.piles.discard.some((c) => c.instanceId === 'k-delay')).toBe(true);
    expect(afterStart.lastEvent).toMatch(/Verzögerung:/);
  });

  it('Startphase ADVANCE_PHASE runs Echo before Fessel tick', () => {
    let state = freshV6();
    state = place(state, 'p1', 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'p1', 'katalysator', V6_PLAYTEST_ECHO_CATALYST_ID, 'k-echo');

    state = applyV6FormulaActivate(state, V6_CORE_PACK, 'p1', V6_PACK_RULESET, () => 0.01, {
      defenseRoll: 1,
      asOverformula: false,
    });

    const hpBeforeStart = state.players.p2.hp;
    state = { ...state, phase: 'start', activePlayer: 'p1' };
    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', {
      pack: V6_CORE_PACK,
      ruleset: V6_PACK_RULESET,
      rng: () => 0.5,
      playerId: 'p1',
    });

    expect(state.phase).toBe('draw');
    expect(state.players.p2.hp).toBe(hpBeforeStart - 1);
    expect(state.meta.v6EchoQueue?.p1 ?? []).toEqual([]);
    expect(state.players.p1.formula.katalysator).toBeNull();
  });

  it('does not put Echo/Delay into locked Slice-1 recipe catalog', async () => {
    const mod = await import('../../../generated/v6/formulaRecipes.generated');
    expect(mod.V6_GENERATED_FORMULA_RECIPES).toHaveLength(876);
    expect(mod.V6_SLICE1_RECIPE_CATALOG.recipeCount).toBe(876);
  });
});
