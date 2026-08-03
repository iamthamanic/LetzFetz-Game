/**
 * Tests for shared V5 primary-mark Wirkungscopy.
 * Location: src/components/cards/primaryMarkEffectCopy.test.ts
 */
import { describe, it, expect } from 'vitest';
import { PRIMARY_MARK_IDS, primaryMarkLabelDe } from '../../game/types';
import {
  primaryMarkEffectCopyDe,
  primaryMarkTooltipDe,
} from './primaryMarkEffectCopy';

describe('primaryMarkEffectCopyDe', () => {
  it('covers all primary marks with non-empty DE copy', () => {
    for (const id of PRIMARY_MARK_IDS) {
      expect(primaryMarkEffectCopyDe(id).length).toBeGreaterThan(10);
    }
  });

  it('tooltip includes V5 label and Wirkung', () => {
    const tip = primaryMarkTooltipDe('aufgewirbelt');
    expect(tip).toContain(primaryMarkLabelDe('aufgewirbelt'));
    expect(tip).toContain(primaryMarkEffectCopyDe('aufgewirbelt'));
  });

  it('tooltip includes stack count when > 1', () => {
    expect(primaryMarkTooltipDe('brennen', 2)).toMatch(/Brennen ×2/);
  });
});
