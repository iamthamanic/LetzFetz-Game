/**
 * Unit tests for loop-point search math.
 * Location: src/services/cardArt/loopPointSearch.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  buildEndTrimCandidates,
  buildLoopCandidates,
  effectiveTargetLoopSec,
  frameDifferenceRgb,
  pickBestLoopCandidate,
  scoreLoopWindowRgb,
} from './loopPointSearch';

describe('loopPointSearch', () => {
  it('frameDifferenceRgb returns 0 for identical buffers', () => {
    const buf = new Uint8Array([10, 20, 30, 40]);
    expect(frameDifferenceRgb(buf, buf)).toBe(0);
  });

  it('frameDifferenceRgb increases with divergence', () => {
    const a = new Uint8Array([0, 0, 0]);
    const b = new Uint8Array([10, 0, 0]);
    expect(frameDifferenceRgb(a, b)).toBeGreaterThan(0);
  });

  it('buildLoopCandidates steps through search window', () => {
    const list = buildLoopCandidates({
      searchStart: 1,
      searchEnd: 11,
      targetLoopSec: 6,
      sampleStepSec: 2,
    });
    expect(list[0]).toEqual({ start: 1, end: 7 });
    expect(list[list.length - 1]).toEqual({ start: 5, end: 11 });
  });

  it('pickBestLoopCandidate chooses lowest score', () => {
    const best = pickBestLoopCandidate([
      { start: 1, end: 7, score: 12 },
      { start: 2, end: 8, score: 4 },
      { start: 3, end: 9, score: 9 },
    ]);
    expect(best).toEqual({ start: 2, end: 8, score: 4 });
  });

  it('scoreLoopWindowRgb averages multi-frame diff', () => {
    const a = new Uint8Array([0, 0, 0]);
    const b = new Uint8Array([10, 0, 0]);
    expect(scoreLoopWindowRgb([a, a], [a, a])).toBe(0);
    expect(scoreLoopWindowRgb([a], [b])).toBe(10 / 3);
  });

  it('buildEndTrimCandidates slides end with fixed start', () => {
    const list = buildEndTrimCandidates(0.35, 10, 11.65, 0.5, 8);
    expect(list[0]).toEqual({ start: 0.35, end: 10 });
    expect(list[list.length - 1]).toEqual({ start: 0.35, end: 11.5 });
  });

  it('effectiveTargetLoopSec caps to available region', () => {
    expect(effectiveTargetLoopSec(0.5, 3.8, 6, 1, 2)).toBeCloseTo(2.1, 1);
    expect(effectiveTargetLoopSec(1, 11, 6, 1, 3)).toBe(6);
  });
});
