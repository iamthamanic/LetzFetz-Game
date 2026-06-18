import { describe, it, expect } from 'vitest';
import { createGame } from './createGame';
import { applyAction } from './actions';
import { BASE_PACK } from '../packs/base-pack';

describe('PLAY_BOOST', () => {
  it('water boost heals 2 life', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'schluckspecht',
      p2CharacterId: 'knuspergnom',
      startingPlayer: 'p1',
      seed: 300,
    });
    state = { ...state, players: { ...state.players, p1: { ...state.players.p1, hp: 10 } } };

    while (state.phase !== 'action' && !state.winner) {
      const pid = state.activePlayer;
      const act = state.phase === 'bind' ? { type: 'SKIP_BIND' as const } : { type: 'ADVANCE_PHASE' as const };
      state = applyAction(state, act, pid, { pack: BASE_PACK, playerId: pid });
    }

    const waterBoost = state.players.p1.hand.find((c) => c.defId.startsWith('water') && c.defId.includes('boost'));
    if (!waterBoost) return;

    state = applyAction(
      state,
      { type: 'PLAY_BOOST', cardInstanceId: waterBoost.instanceId },
      'p1',
      { pack: BASE_PACK, playerId: 'p1' },
    );
    expect(state.players.p1.hp).toBe(12);
    expect(state.phase).toBe('end');
  });
});

describe('DISCARD_DRAW', () => {
  it('discards 1 and draws 2', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 400,
    });

    while (state.phase !== 'action' && !state.winner) {
      const pid = state.activePlayer;
      const act = state.phase === 'bind' ? { type: 'SKIP_BIND' as const } : { type: 'ADVANCE_PHASE' as const };
      state = applyAction(state, act, pid, { pack: BASE_PACK, playerId: pid });
    }

    const handBefore = state.players.p1.hand.length;
    const discardId = state.players.p1.hand[0].instanceId;
    state = applyAction(
      state,
      { type: 'DISCARD_DRAW', discardInstanceId: discardId },
      'p1',
      { pack: BASE_PACK, playerId: 'p1' },
    );
    expect(state.players.p1.hand.length).toBe(handBefore - 1 + 2);
    expect(state.phase).toBe('end');
  });
});
