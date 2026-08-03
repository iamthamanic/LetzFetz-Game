/**
 * Unit tests for Play setup pack → ruleset mapping.
 * Location: src/features/play/setup/resolveGamePackChoice.test.ts
 */
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  BASE_PACK,
  V2_P100_PACK,
  P100_RULESET,
  V3_RULESET,
  V5_PACK,
  V5_PACK_RULESET,
} from '../../../game';
import { mergeFormulaPlayOverlay } from '../../../game/packs/mergeFormulaPlayOverlay';
import { FORMULA_PLAY_OPTIN_STORAGE_KEY } from '../../../services/storage/formulaPlayOptIn';
import { resolveGamePackChoice } from './resolveGamePackChoice';

class MockStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  clear(): void {
    this.map.clear();
  }
}

describe('resolveGamePackChoice', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', new MockStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps v5 to merged V5 pack + V5_PACK_RULESET as playtest default', () => {
    const resolved = resolveGamePackChoice('v5');
    expect(resolved.pack).toEqual(mergeFormulaPlayOverlay(V5_PACK, []));
    expect(resolved.ruleset).toBe(V5_PACK_RULESET);
    expect(resolved.ruleset?.v5Formula).toBe(true);
    expect(resolved.ruleset?.startingHp).toBe(30);
    expect(resolved.playtestHpCap).toBe(30);
  });

  it('merges deck opt-ins from localStorage for v5', () => {
    localStorage.setItem(
      FORMULA_PLAY_OPTIN_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        deckOptIns: [
          {
            cardId: 'studio-t1',
            role: 'technik',
            name: 'Studio',
            pinnedVersion: 1,
            addedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
        activatedRecipes: [],
        updatedAt: '2026-01-01T00:00:00.000Z',
      }),
    );
    const resolved = resolveGamePackChoice('v5');
    expect(resolved.pack.techniques?.some((t) => t.id === 'studio-t1')).toBe(true);
  });

  it('maps base to BASE_PACK without custom ruleset', () => {
    expect(resolveGamePackChoice('base')).toEqual({
      pack: BASE_PACK,
      ruleset: undefined,
      playtestHpCap: undefined,
    });
  });

  it('maps p100 to V2_P100_PACK + P100_RULESET', () => {
    expect(resolveGamePackChoice('p100')).toEqual({
      pack: V2_P100_PACK,
      ruleset: P100_RULESET,
      playtestHpCap: 30,
    });
  });

  it('maps v3 to BASE_PACK + V3_RULESET (rules-on-base)', () => {
    const resolved = resolveGamePackChoice('v3');
    expect(resolved.pack).toBe(BASE_PACK);
    expect(resolved.ruleset).toBe(V3_RULESET);
    expect(resolved.ruleset?.v3Combat).toBe(true);
    expect(resolved.ruleset?.startingHp).toBe(20);
    expect(resolved.playtestHpCap).toBeUndefined();
  });
});
