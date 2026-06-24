import { describe, expect, it } from 'vitest';
import { createGame, BASE_PACK, applyAction } from '../../../game';
import {
  buildBindSnapStep,
  BIND_SNAP_MS,
  findNewlyBoundCardIds,
  isBindSnapStep,
} from './buildBindSnapStep';

describe('buildBindSnapStep', () => {
  it('creates a bind-snap step with correct metadata', () => {
    const step = buildBindSnapStep('p1', 'card-xyz');
    expect(step.kind).toBe('bind-snap');
    expect(step.durationMs).toBe(BIND_SNAP_MS);
    expect(step.locksInput).toBe(false);
    expect(step.payload).toEqual({ playerId: 'p1', cardInstanceId: 'card-xyz' });
    expect(isBindSnapStep(step)).toBe(true);
  });

  it('findNewlyBoundCardIds detects newly bound cards', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'kokabell',
      startingPlayer: 'p1',
      seed: 7,
      arenaId: 'arena-spaeti',
    });
    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', {
      pack: BASE_PACK,
      playerId: 'p1',
    });
    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', {
      pack: BASE_PACK,
      playerId: 'p1',
    });

    const bindable = state.players.p1.hand[0];
    const before = state;
    state = applyAction(
      state,
      { type: 'BIND_CARD', cardInstanceId: bindable.instanceId },
      'p1',
      { pack: BASE_PACK, playerId: 'p1' },
    );

    const newIds = findNewlyBoundCardIds(before, state, 'p1');
    expect(newIds).toHaveLength(1);
    expect(state.players.p1.bound.some((b) => b.instanceId === newIds[0])).toBe(true);
  });
});