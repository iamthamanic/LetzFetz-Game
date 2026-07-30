/**
 * Unit tests for VFX Studio status machine.
 * Location: src/features/build/vfx/types/status.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  VFX_ASSET_STATUSES,
  isVfxAssetStatus,
  parseVfxAssetStatus,
} from './status';

describe('VfxAssetStatus', () => {
  it('exports all lifecycle statuses', () => {
    expect(VFX_ASSET_STATUSES).toEqual([
      'DRAFT',
      'QUEUED',
      'GENERATING',
      'REVIEW_REQUIRED',
      'READY',
      'FAILED',
      'OUTDATED',
    ]);
  });

  it('narrows valid status strings', () => {
    for (const status of VFX_ASSET_STATUSES) {
      expect(isVfxAssetStatus(status)).toBe(true);
      expect(parseVfxAssetStatus(status)).toBe(status);
    }
  });

  it('rejects invalid status values', () => {
    expect(isVfxAssetStatus('PENDING')).toBe(false);
    expect(isVfxAssetStatus(null)).toBe(false);
    expect(() => parseVfxAssetStatus('PENDING')).toThrow(/status must be one of/);
    expect(() => parseVfxAssetStatus(42)).toThrow(/status must be one of/);
  });
});
