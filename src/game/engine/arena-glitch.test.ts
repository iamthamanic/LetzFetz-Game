/**
 * Focused tests for V1 arena hooks + playable glitches.
 */
import { describe, it, expect } from 'vitest';
import { createGame } from './createGame';
import { applyAction, getLegalActions } from './actions';
import { BASE_PACK } from '../packs/base-pack';
import { createEmptyMeta } from '../types';

const pack = BASE_PACK;

function toAction(state: ReturnType<typeof createGame>, pid: 'p1' | 'p2' = 'p1') {
  while (state.phase !== 'action' && !state.winner && !state.pendingChoice) {
    const p = state.activePlayer;
    const act =
      state.phase === 'build' ? ({ type: 'SKIP_BUILD' } as const) : ({ type: 'ADVANCE_PHASE' } as const);
    state = applyAction(state, act, p, { pack, playerId: p });
  }
  return state;
}

describe('arena spaeti', () => {
  it('caps fire boost damage at 3 and auto-draws then requires discard', () => {
    let state = createGame({
      pack,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      arenaId: 'arena-spaeti',
      startingPlayer: 'p1',
      seed: 11,
    });
    state = toAction(state);
    state.players.p1.hand = [{ instanceId: 'b1', defId: 'fire-boost-1' }];
    state.players.p2.hp = 20;

    state = applyAction(state, { type: 'PLAY_BOOST', cardInstanceId: 'b1' }, 'p1', {
      pack,
      playerId: 'p1',
    });

    expect(state.players.p2.hp).toBe(18);
    expect(state.pendingChoice?.type).toBe('must-discard');
    if (state.pendingChoice?.type === 'must-discard') {
      expect(state.pendingChoice.source).toBe('spaeti');
    }
    const legal = getLegalActions(state, { pack, playerId: 'p1' });
    expect(legal.some((a) => a.type === 'PASS_PENDING')).toBe(false);
    expect(legal.every((a) => a.type === 'RESOLVE_DRAW_DISCARD')).toBe(true);
  });
});

describe('playable glitch kurzschluss', () => {
  it('exhausts an opponent bound card as main action', () => {
    let state = createGame({
      pack,
      p1CharacterId: 'dripministerin',
      p2CharacterId: 'knuspergnom',
      arenaId: 'arena-spaeti',
      startingPlayer: 'p1',
      seed: 22,
    });
    state = toAction(state);
    state.players.p1.hand = [{ instanceId: 'g1', defId: 'glitch-kurzschluss' }];
    state.players.p2.bound = [
      { instanceId: 'ob1', defId: 'fire-attack-4', exhausted: false, resistanceBonus: 0 },
    ];

    state = applyAction(
      state,
      { type: 'PLAY_GLITCH', glitchInstanceId: 'g1', targetBoundInstanceId: 'ob1' },
      'p1',
      { pack, playerId: 'p1' },
    );

    expect(state.players.p2.bound[0].exhausted).toBe(true);
    expect(state.phase).toBe('end');
  });
});

describe('sumpf challenge margin', () => {
  it('exposes getLegalActions without throwing when meta present', () => {
    const state = createGame({
      pack,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      arenaId: 'arena-sumpf',
      startingPlayer: 'p1',
      seed: 33,
    });
    expect(state.meta).toEqual(expect.objectContaining({ boostsPlayed: { p1: 0, p2: 0 } }));
    expect(getLegalActions(state, { pack, playerId: 'p1' }).some((a) => a.type === 'ADVANCE_PHASE')).toBe(
      true,
    );
    expect(state.meta).not.toBe(createEmptyMeta()); // distinct instance ok
  });
});
