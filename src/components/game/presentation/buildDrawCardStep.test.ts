import { describe, expect, it } from 'vitest';
import { createGame, BASE_PACK, applyAction } from '../../../game';
import {
  buildDrawCardStep,
  DRAW_CARD_MS,
  findNewlyDrawnCard,
  isDrawCardStep,
} from './buildDrawCardStep';

describe('buildDrawCardStep', () => {
  it('creates a draw-card step with duration and payload', () => {
    const step = buildDrawCardStep('p1', 'card-abc');
    expect(step.kind).toBe('draw-card');
    expect(step.durationMs).toBe(DRAW_CARD_MS);
    expect(step.payload).toEqual({ playerId: 'p1', cardInstanceId: 'card-abc' });
    expect(isDrawCardStep(step)).toBe(true);
  });

  it('defaults locksInput to true and allows opt-out for bot draws', () => {
    expect(buildDrawCardStep('p2', 'x').locksInput).toBe(true);
    expect(buildDrawCardStep('p2', 'x', { locksInput: false }).locksInput).toBe(false);
  });

  it('findNewlyDrawnCard detects one card added in draw phase', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'kokabell',
      startingPlayer: 'p1',
      seed: 42,
      arenaId: 'arena-spaeti',
    });
    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', {
      pack: BASE_PACK,
      playerId: 'p1',
    });
    const beforeDraw = state;
    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', {
      pack: BASE_PACK,
      playerId: 'p1',
    });
    const drawnId = findNewlyDrawnCard(beforeDraw, state, 'p1');
    expect(drawnId).toBeTruthy();
    expect(state.players.p1.hand.some((c) => c.instanceId === drawnId)).toBe(true);
  });
});
