import { describe, expect, it } from 'vitest';
import { createGame, BASE_PACK, applyAction } from '../../../game';
import {
  buildBuildSnapStep,
  BUILD_SNAP_MS,
  BUILD_FLY_MS,
  findNewlyBuiltCardIds,
  isBuildSnapStep,
} from './buildBuildSnapStep';

describe('buildBuildSnapStep', () => {
  it('creates a build-snap step with fly + impact metadata', () => {
    const step = buildBuildSnapStep('p1', 'card-xyz', 'fire-bolt', 2);
    expect(step.kind).toBe('build-snap');
    expect(step.durationMs).toBe(BUILD_SNAP_MS);
    expect(BUILD_FLY_MS).toBeLessThan(BUILD_SNAP_MS);
    expect(step.locksInput).toBe(true);
    expect(step.payload).toEqual({
      playerId: 'p1',
      cardInstanceId: 'card-xyz',
      cardDefId: 'fire-bolt',
      slotIndex: 2,
    });
    expect(isBuildSnapStep(step)).toBe(true);
  });

  it('findNewlyBuiltCardIds detects newly bound cards', () => {
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
      { type: 'BUILD_CARD', cardInstanceId: bindable.instanceId },
      'p1',
      { pack: BASE_PACK, playerId: 'p1' },
    );

    const newIds = findNewlyBuiltCardIds(before, state, 'p1');
    expect(newIds).toHaveLength(1);
    expect(state.players.p1.bound.some((b) => b.instanceId === newIds[0])).toBe(true);
  });
});
