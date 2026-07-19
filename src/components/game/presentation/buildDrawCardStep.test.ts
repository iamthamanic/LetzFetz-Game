/**
 * Unit tests for draw-card presentation steps.
 * Location: src/components/game/presentation/buildDrawCardStep.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame, BASE_PACK, applyAction } from '../../../game';
import {
  buildDrawCardStep,
  DRAW_CARD_MS,
  DRAW_CARD_HIDDEN_MS,
  findNewlyDrawnCard,
  isDrawCardStep,
} from './buildDrawCardStep';

describe('buildDrawCardStep', () => {
  it('creates a face-up human draw with reveal+fly duration', () => {
    const step = buildDrawCardStep('p1', 'card-abc', {
      cardDefId: 'fire-attack-4',
      faceUp: true,
    });
    expect(step.kind).toBe('draw-card');
    expect(step.durationMs).toBe(DRAW_CARD_MS);
    expect(step.payload).toMatchObject({
      playerId: 'p1',
      cardInstanceId: 'card-abc',
      cardDefId: 'fire-attack-4',
      faceUp: true,
    });
    expect(isDrawCardStep(step)).toBe(true);
  });

  it('uses short hidden duration for bot / face-down draws', () => {
    const step = buildDrawCardStep('p2', 'x', { locksInput: false, faceUp: false });
    expect(step.durationMs).toBe(DRAW_CARD_HIDDEN_MS);
    expect(step.locksInput).toBe(false);
    expect(step.payload?.faceUp).toBe(false);
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
