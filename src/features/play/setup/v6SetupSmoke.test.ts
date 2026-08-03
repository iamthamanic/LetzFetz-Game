/**
 * V6 Setup INTERNAL smoke (#322).
 * Location: src/features/play/setup/v6SetupSmoke.test.ts
 */
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { applyAction, createGame, getLegalActions } from '../../../game';
import { formatV6FormulaPlanPreview, assertPreviewMatchesPlan } from '../presentation/v6FormulaPlanPreview';
import { planFormulaActivation } from '../../../game/engine/v6';
import type { FormulaComponentInstance, GameState } from '../../../game/types';
import { resolveGamePackChoice } from './resolveGamePackChoice';
import { setV6PlayableTestOverride } from './v6PlayableFlag';

describe('V6 Setup INTERNAL smoke', () => {
  beforeEach(() => {
    setV6PlayableTestOverride(true);
  });
  afterEach(() => {
    setV6PlayableTestOverride(null);
  });

  it('rejects v6 choice when test override forces flag off', () => {
    setV6PlayableTestOverride(false);
    expect(() => resolveGamePackChoice('v6')).toThrow(/V6_PLAYABLE/);
  });

  it('resolves v6 pack by default after cutover and activates TEK with plan preview hard-gate', () => {
    setV6PlayableTestOverride(null);
    const resolved = resolveGamePackChoice('v6');
    expect(resolved.ruleset?.v6Formula).toBe(true);
    expect(resolved.pack.id).toBe('v6-core');
    expect(resolved.playtestHpCap).toBe(30);

    let state = createGame({
      pack: resolved.pack,
      p1CharacterId: resolved.pack.characters[0].id,
      p2CharacterId: resolved.pack.characters[1]?.id ?? resolved.pack.characters[0].id,
      ruleset: resolved.ruleset,
      seed: 2,
    });
    expect(state.players[state.activePlayer].hand).toHaveLength(5);
    const second = state.activePlayer === 'p1' ? 'p2' : 'p1';
    expect(state.players[second].hand).toHaveLength(6);
    expect(state.meta.v6FormulaEnabled).toBe(true);

    const place = (
      s: GameState,
      slot: 'technik' | 'essenz' | 'katalysator',
      defId: string,
      id: string,
    ): GameState => {
      const next = structuredClone(s);
      const comp: FormulaComponentInstance = {
        instanceId: id,
        defId,
        slot,
        exhausted: false,
        disturbed: false,
        stabilityBonus: 0,
      };
      next.players.p1.formula[slot] = comp;
      next.phase = 'build';
      next.activePlayer = 'p1';
      return next;
    };
    state = place(state, 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'katalysator', 'v6-katalysator-verdichtung', 'k1');

    const plan = planFormulaActivation({
      state,
      pack: resolved.pack,
      playerId: 'p1',
      ruleset: resolved.ruleset!,
      rng: () => 0.01,
      defenseRoll: 1,
      asOverformula: false,
    });
    assertPreviewMatchesPlan(plan, formatV6FormulaPlanPreview(plan));

    state = applyAction(
      state,
      { type: 'FORMULA_ACTIVATE' },
      'p1',
      { pack: resolved.pack, ruleset: resolved.ruleset, rng: () => 0.01, playerId: 'p1' },
    );
    if (state.pendingChoice?.type === 'v6-affinity') {
      state = applyAction(
        state,
        { type: 'PICK_V6_AFFINITY', mode: 'none' },
        'p1',
        { pack: resolved.pack, ruleset: resolved.ruleset, rng: () => 0.01, playerId: 'p1' },
      );
    }
    if (state.pendingChoice?.type === 'v6-fessel-target') {
      const legal = getLegalActions(state, {
        pack: resolved.pack,
        ruleset: resolved.ruleset,
        rng: () => 0.01,
        playerId: 'p1',
      });
      const pick = legal.find(
        (a): a is Extract<(typeof legal)[number], { type: 'PICK_V6_FESSEL_TARGET' }> =>
          a.type === 'PICK_V6_FESSEL_TARGET',
      );
      if (pick) {
        state = applyAction(state, pick, 'p1', {
          pack: resolved.pack,
          ruleset: resolved.ruleset,
          rng: () => 0.01,
          playerId: 'p1',
        });
      }
    }
    expect(state.players.p1.formula.katalysator).toBeNull();
    expect(state.players.p1.fetzCharge).toBe(1);
  });
});
