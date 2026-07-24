/**
 * Unit tests for clash gong timing helpers.
 * Location: src/features/play/services/audio/clashSound.test.ts
 */
import { describe, expect, it } from 'vitest';
import { CLASH_GONG_ATTACK_LEAD_SEC, CLASH_IMPACT_FRACTION } from './clashSound';

describe('clashSound', () => {
  it('locks impact to the CSS collision keyframe (85%, linear)', () => {
    expect(CLASH_IMPACT_FRACTION).toBe(0.85);
    // 800ms crash → visual hit at 680ms
    expect(Math.round(800 * CLASH_IMPACT_FRACTION)).toBe(680);
  });

  it('starts the gong slightly before impact so the strike peak lands on the hit', () => {
    expect(CLASH_GONG_ATTACK_LEAD_SEC).toBeGreaterThan(0);
    expect(CLASH_GONG_ATTACK_LEAD_SEC).toBeLessThan(0.08);
    const scheduleAt = 0.68 - CLASH_GONG_ATTACK_LEAD_SEC;
    expect(scheduleAt).toBeCloseTo(0.65, 2);
  });
});
