/**
 * Tests for V5 status Wirkungscopy / labels.
 * Location: src/features/play/board/statusEffectCopy.test.ts
 */
import { describe, it, expect } from 'vitest';
import { primaryMarkLabelDe } from '../../../game/types';
import { shieldEffectCopyDe, statusEffectCopyDe, statusLabelDe } from './statusEffectCopy';

describe('statusEffectCopyDe', () => {
  it('covers primary marks with non-empty DE copy', () => {
    for (const id of ['brennen', 'durchnaesst', 'high', 'aufgewirbelt', 'erleuchtet', 'verflucht']) {
      expect(statusEffectCopyDe(id).length).toBeGreaterThan(10);
    }
  });

  it('uses V5 labels Verwirbelt / Verstrahlt', () => {
    expect(primaryMarkLabelDe('aufgewirbelt')).toBe('Verwirbelt');
    expect(primaryMarkLabelDe('erleuchtet')).toBe('Verstrahlt');
    expect(statusLabelDe('aufgewirbelt')).toBe('Verwirbelt');
    expect(statusLabelDe('erleuchtet')).toBe('Verstrahlt');
  });

  it('covers common buffs/debuffs including V5 side effects', () => {
    for (const id of ['nebel', 'nebelbank', 'toxisch', 'katalysatorausfall', 'gift', 'verpeilt', 'fokus']) {
      expect(statusEffectCopyDe(id).length).toBeGreaterThan(8);
    }
    expect(shieldEffectCopyDe()).toMatch(/Schild/);
  });

  it('falls back for unknown ids', () => {
    expect(statusEffectCopyDe('totally-unknown-status')).toMatch(/Status|SPIELANLEITUNG/);
  });
});
