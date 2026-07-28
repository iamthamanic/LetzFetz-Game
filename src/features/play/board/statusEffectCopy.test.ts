/**
 * Tests for V3 status Wirkungscopy.
 * Location: src/features/play/board/statusEffectCopy.test.ts
 */
import { describe, it, expect } from 'vitest';
import { shieldEffectCopyDe, statusEffectCopyDe } from './statusEffectCopy';

describe('statusEffectCopyDe', () => {
  it('covers primary marks with non-empty DE copy', () => {
    for (const id of ['brennen', 'durchnaesst', 'high', 'aufgewirbelt', 'erleuchtet', 'verflucht']) {
      expect(statusEffectCopyDe(id).length).toBeGreaterThan(10);
    }
  });

  it('covers common buffs/debuffs', () => {
    for (const id of ['nebel', 'gift', 'verpeilt', 'fokus', 'schild']) {
      if (id === 'schild') continue;
      expect(statusEffectCopyDe(id).length).toBeGreaterThan(8);
    }
    expect(shieldEffectCopyDe()).toMatch(/Schild/);
  });

  it('falls back for unknown ids', () => {
    expect(statusEffectCopyDe('totally-unknown-status')).toMatch(/Status/);
  });
});
