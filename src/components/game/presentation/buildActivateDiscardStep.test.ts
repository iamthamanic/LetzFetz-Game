import { describe, expect, it } from 'vitest';
import { createGame, BASE_PACK, applyAction } from '../../../game';
import {
  buildActivateDiscardStep,
  ACTIVATE_DISCARD_MS,
  isActivateDiscardStep,
  findActivatedDiscardCardId,
} from './buildActivateDiscardStep';

describe('buildActivateDiscardStep', () => {
  it('creates an activate-discard step with correct metadata', () => {
    const step = buildActivateDiscardStep('p1', 'card-abc');
    expect(step.kind).toBe('activate-discard');
    expect(step.durationMs).toBe(ACTIVATE_DISCARD_MS);
    expect(step.locksInput).toBe(false);
    expect(step.payload).toEqual({ playerId: 'p1', cardInstanceId: 'card-abc' });
    expect(isActivateDiscardStep(step)).toBe(true);
  });

  it('findActivatedDiscardCardId returns null when no card was discarded', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'kokabell',
      startingPlayer: 'p1',
      seed: 5,
      arenaId: 'arena-spaeti',
    });
    // Just advance phases without discarding
    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', {
      pack: BASE_PACK,
      playerId: 'p1',
    });
    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', {
      pack: BASE_PACK,
      playerId: 'p1',
    });
    const result = findActivatedDiscardCardId(state, state, 'p1');
    expect(result).toBeNull();
  });
});