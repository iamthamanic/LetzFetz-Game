/**
 * V5 deterministic win + rematch scenario (#289).
 * Location: src/game/engine/v5WinRematch.test.ts
 *
 * Prefer engine Vitest over brittle full-browser marathon (issue note).
 */
import { describe, expect, it } from 'vitest';
import { checkWinner, createGame } from './createGame';
import { applyAction, getLegalActions } from './actions';
import { V5_PACK, V5_PACK_RULESET } from '../packs/v5/v5-pack';
import { applyAndValidatePlaytestPatch } from '../playtest/patches';

const CREATE = {
  pack: V5_PACK,
  p1CharacterId: 'knuspergnom' as const,
  p2CharacterId: 'schluckspecht' as const,
  startingPlayer: 'p1' as const,
  seed: 99,
  ruleset: V5_PACK_RULESET,
};

describe('V5 win + rematch', () => {
  it('reaches win under V5 ruleset via lethal attack resolve', () => {
    let state = createGame(CREATE);
    expect(state.meta.v5FormulaEnabled).toBe(true);
    expect(state.winner).toBeNull();

    const seeded = applyAndValidatePlaytestPatch(state, { demoV5FormulaReady: true });
    expect(seeded.ok, seeded.error).toBe(true);
    state = seeded.state!;

    const actionReady = applyAndValidatePlaytestPatch(state, {
      phase: 'action',
      p2Hp: 1,
      clearCombat: true,
    });
    expect(actionReady.ok, actionReady.error).toBe(true);
    state = actionReady.state!;
    expect(state.phase).toBe('action');
    expect(state.players.p2.hp).toBe(1);

    const attackCard = state.players.p1.hand.find((c) => c.defId === 'fire-attack-6');
    expect(attackCard).toBeDefined();

    state = applyAction(
      state,
      {
        type: 'PLAY_ATTACK',
        cardInstanceId: attackCard!.instanceId,
        diceRoll: 6,
        target: 'player',
      },
      'p1',
      { pack: V5_PACK, playerId: 'p1', ruleset: V5_PACK_RULESET },
    );

    if (state.combat) {
      state = applyAction(state, { type: 'PASS_BLOCK' }, state.combat.defenderId, {
        pack: V5_PACK,
        playerId: state.combat.defenderId,
        ruleset: V5_PACK_RULESET,
      });
    }

    state = checkWinner(state);
    expect(state.winner).toBe('p1');
    expect(state.players.p2.hp).toBeLessThanOrEqual(0);
    expect(state.meta.v5FormulaEnabled).toBe(true);
  });

  it('rematch createGame resets to playable V5 state', () => {
    const finishedBase = createGame(CREATE);
    const finished = checkWinner({
      ...finishedBase,
      players: {
        ...finishedBase.players,
        p2: { ...finishedBase.players.p2, hp: 0 },
      },
    });
    expect(finished.winner).toBe('p1');

    const rematch = createGame({ ...CREATE, seed: 100 });
    expect(rematch.winner).toBeNull();
    expect(rematch.meta.v5FormulaEnabled).toBe(true);
    expect(rematch.players.p1.hp).toBe(20);
    expect(rematch.players.p2.hp).toBe(20);
    expect(rematch.phase).toBe('start');
    expect(rematch.combat).toBeNull();

    const legal = getLegalActions(rematch, {
      pack: V5_PACK,
      playerId: rematch.activePlayer,
      ruleset: V5_PACK_RULESET,
    });
    expect(legal.length).toBeGreaterThan(0);
  });
});
