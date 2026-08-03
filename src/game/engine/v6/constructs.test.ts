/**
 * V6 Constructs engine tests (#346).
 * Location: src/game/engine/v6/constructs.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { applyAction, getLegalActions } from '../actions';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import { applyV6FormulaActivate } from './executeFormulaActivation';
import { planFormulaActivation } from './planFormulaActivation';
import {
  applyConstructChallengeOutcome,
  constructChallengeOutcome,
  placeConstruct,
  tickV6ConstructAtStart,
} from './constructs';
import {
  V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID,
  V6_PLAYTEST_CONSTRUCT_DEF_ID,
} from './playtestConstructRecipes';
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
    seed: 46,
  });
}

describe('V6 Constructs (#346)', () => {
  it('EK Beschwörung places construct without Fetz; catalyst consumed', () => {
    let state = freshV6();
    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'p1', 'katalysator', V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID, 'k-besch');

    const plan = planFormulaActivation({
      state,
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
      rng: () => 0.01,
      asOverformula: false,
    });
    expect(plan.primary.kind).toBe('summon_construct');
    expect(plan.primary.value).toBe(3);
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
    expect(after.players.p1.construct?.disturbed).toBe(false);
    expect(after.players.p1.fetzCharge).toBe(0);
    expect(after.players.p1.formula.katalysator).toBeNull();
    expect(after.piles.discard.some((c) => c.instanceId === 'k-besch')).toBe(true);
    expect(after.lastEvent).toMatch(/Konstrukt beschworen/);
  });

  it('new construct replaces old immediately (old discarded)', () => {
    let state = freshV6();
    state = placeConstruct(state, 'p1', V6_PLAYTEST_CONSTRUCT_DEF_ID, 2);
    const oldId = state.players.p1.construct!.instanceId;

    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'p1', 'katalysator', V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID, 'k2');

    const after = applyV6FormulaActivate(
      state,
      V6_CORE_PACK,
      'p1',
      V6_PACK_RULESET,
      () => 0.01,
      { asOverformula: false },
    );

    expect(after.players.p1.construct?.instanceId).not.toBe(oldId);
    expect(after.players.p1.construct?.haltbarkeit).toBe(3);
    expect(after.piles.discard.some((c) => c.instanceId === oldId)).toBe(true);
    expect(after.lastEvent).toMatch(/vorheriges abgelegt/);
  });

  it('Startphase Haltbarkeit −1; discard at 0', () => {
    let state = freshV6();
    state = placeConstruct(state, 'p1', V6_PLAYTEST_CONSTRUCT_DEF_ID, 1);
    const id = state.players.p1.construct!.instanceId;

    const afterTick = tickV6ConstructAtStart(state, 'p1');
    expect(afterTick.players.p1.construct).toBeNull();
    expect(afterTick.piles.discard.some((c) => c.instanceId === id)).toBe(true);
    expect(afterTick.lastEvent).toMatch(/zerfällt/);

    state = placeConstruct(freshV6(), 'p1', V6_PLAYTEST_CONSTRUCT_DEF_ID, 3);
    const mid = tickV6ConstructAtStart(state, 'p1');
    expect(mid.players.p1.construct?.haltbarkeit).toBe(2);
    expect(mid.lastEvent).toMatch(/Haltbarkeit −1/);
  });

  it('challenge vs construct: disturb then destroy; no LP damage', () => {
    expect(constructChallengeOutcome(4, 3, 0, false)).toBe('disturb');
    expect(constructChallengeOutcome(6, 3, 0, false)).toBe('destroy');
    expect(constructChallengeOutcome(4, 3, 0, true)).toBe('destroy');
    expect(constructChallengeOutcome(3, 3, 0, false)).toBe('none');

    let state = freshV6();
    state = placeConstruct(state, 'p2', V6_PLAYTEST_CONSTRUCT_DEF_ID, 3);
    const hpBefore = state.players.p2.hp;

    state = applyConstructChallengeOutcome(state, 'p2', 4, 3, 'disturb');
    expect(state.players.p2.construct?.disturbed).toBe(true);
    expect(state.players.p2.hp).toBe(hpBefore);
    expect(state.lastEvent).toMatch(/gestört/);

    state = applyConstructChallengeOutcome(state, 'p2', 4, 3, 'destroy');
    expect(state.players.p2.construct).toBeNull();
    expect(state.players.p2.hp).toBe(hpBefore);
    expect(state.lastEvent).toMatch(/zerstört/);
  });

  it('getLegalActions offers CHALLENGE targeting opponent construct', () => {
    let state = freshV6();
    state = placeConstruct(state, 'p2', V6_PLAYTEST_CONSTRUCT_DEF_ID, 3);
    state.phase = 'action';
    state.activePlayer = 'p1';
    const attack = V6_CORE_PACK.elementCards.find((c) => c.cardType === 'attack');
    expect(attack).toBeTruthy();
    state.players.p1.hand = [{ instanceId: 'atk1', defId: attack!.id }];

    const legal = getLegalActions(state, { pack: V6_CORE_PACK, playerId: 'p1' });
    const challenges = legal.filter((a) => a.type === 'CHALLENGE');
    expect(
      challenges.some(
        (a) =>
          a.type === 'CHALLENGE' &&
          a.targetBoundInstanceId === state.players.p2.construct?.instanceId,
      ),
    ).toBe(true);
  });

  it('CHALLENGE applyAction resolves construct destroy on high margin', () => {
    let state = freshV6();
    state = placeConstruct(state, 'p2', V6_PLAYTEST_CONSTRUCT_DEF_ID, 1);
    const constructId = state.players.p2.construct!.instanceId;
    state.phase = 'action';
    state.activePlayer = 'p1';
    // Skip Affinity popup so CHALLENGE goes straight to combat.
    state.meta = {
      ...state.meta,
      v6AffinityAvailable: { p1: false, p2: false },
    };
    const attack = V6_CORE_PACK.elementCards.find((c) => c.cardType === 'attack' && c.value >= 3);
    expect(attack).toBeTruthy();
    state.players.p1.hand = [{ instanceId: 'atk1', defId: attack!.id }];
    state.players.p2.hand = [];

    state = applyAction(
      state,
      {
        type: 'CHALLENGE',
        attackCardInstanceId: 'atk1',
        targetBoundInstanceId: constructId,
        diceRoll: 6,
      },
      'p1',
      { pack: V6_CORE_PACK, playerId: 'p1', ruleset: V6_PACK_RULESET, rng: () => 0.99 },
    );

    expect(state.pendingChoice).toBeNull();
    expect(state.combat?.mode).toBe('challenge');
    expect(state.combat?.targetBoundInstanceId).toBe(constructId);

    state = applyAction(state, { type: 'PASS_BLOCK' }, 'p2', {
      pack: V6_CORE_PACK,
      playerId: 'p2',
      ruleset: V6_PACK_RULESET,
      rng: () => 0.5,
    });

    expect(state.players.p2.construct).toBeNull();
    expect(state.lastEvent).toMatch(/zerstört|gestört/);
  });

  it('does not expand locked Slice-1 105 recipe count', async () => {
    const mod = await import('../../../generated/v6/formulaRecipes.generated');
    expect(mod.V6_GENERATED_FORMULA_RECIPES).toHaveLength(105);
    expect(mod.V6_SLICE1_RECIPE_CATALOG.recipeCount).toBe(105);
  });
});
