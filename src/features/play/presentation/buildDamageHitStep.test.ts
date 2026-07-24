/**
 * Unit tests for damage-hit presentation steps.
 * Location: src/features/play/presentation/buildDamageHitStep.test.ts
 */
import { describe, expect, it } from 'vitest';
import type { GameState } from '../../../game/types';
import {
  buildDamageHitSteps,
  findHpLosses,
  isDamageHitStep,
  DAMAGE_HIT_MS,
} from './buildDamageHitStep';

function stubState(hp: { p1: number; p2: number }): GameState {
  return {
    players: {
      p1: { hp: hp.p1, characterId: 'knuspergnom' },
      p2: { hp: hp.p2, characterId: 'kokabell' },
    },
  } as unknown as GameState;
}

describe('buildDamageHitStep', () => {
  it('builds a step when a player loses life', () => {
    const steps = buildDamageHitSteps(stubState({ p1: 20, p2: 18 }), stubState({ p1: 17, p2: 18 }));
    expect(steps).toHaveLength(1);
    expect(isDamageHitStep(steps[0])).toBe(true);
    expect(steps[0].durationMs).toBe(DAMAGE_HIT_MS);
    expect(steps[0].payload).toMatchObject({
      playerId: 'p1',
      characterId: 'knuspergnom',
      fromHp: 20,
      toHp: 17,
      amount: 3,
    });
  });

  it('ignores heals and unchanged hp', () => {
    expect(buildDamageHitSteps(stubState({ p1: 10, p2: 10 }), stubState({ p1: 12, p2: 10 }))).toEqual(
      [],
    );
  });

  it('queues both players when both take damage', () => {
    const steps = buildDamageHitSteps(stubState({ p1: 20, p2: 15 }), stubState({ p1: 18, p2: 12 }));
    expect(steps.map((s) => s.payload?.playerId)).toEqual(['p1', 'p2']);
  });

  it('findHpLosses returns positive deltas only', () => {
    expect(findHpLosses(stubState({ p1: 20, p2: 10 }), stubState({ p1: 20, p2: 7 }))).toEqual([
      { playerId: 'p2', fromHp: 10, toHp: 7, amount: 3 },
    ]);
  });
});
