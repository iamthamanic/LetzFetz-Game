/**
 * Soft-retire gate for Bound / Fetz-3D Live-Zone (#232).
 * Location: src/features/play/board/boardEngineLive.test.ts
 */
import { describe, expect, it } from 'vitest';
import { shouldShowBoardEngineLiveZone } from './boardEngineLive';

describe('shouldShowBoardEngineLiveZone', () => {
  it('hides Live-3D when V5 Formel is active', () => {
    expect(shouldShowBoardEngineLiveZone(true)).toBe(false);
  });

  it('allows Live-3D for Base / V3 legacy matches', () => {
    expect(shouldShowBoardEngineLiveZone(false)).toBe(true);
  });
});
