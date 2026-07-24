import { describe, expect, it } from 'vitest';
import { pileStackDepth } from './PileCardStack';

describe('pileStackDepth', () => {
  it('returns 0 for empty pile', () => {
    expect(pileStackDepth(0)).toBe(0);
  });

  it('returns 1–3 layers based on count', () => {
    expect(pileStackDepth(1)).toBe(1);
    expect(pileStackDepth(5)).toBe(2);
    expect(pileStackDepth(42)).toBe(3);
  });
});
