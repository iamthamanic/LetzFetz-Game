/**
 * Unit tests for validated card overlay localStorage.
 * Location: src/services/storage/cardOverlays.test.ts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CARD_OVERLAYS_STORAGE_KEY,
  loadCardOverlays,
  saveCardOverlay,
} from './cardOverlays';

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

describe('cardOverlays', () => {
  beforeEach(() => {
    const storage = new MockStorage();
    vi.stubGlobal('localStorage', storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns empty list when storage is missing', () => {
    expect(loadCardOverlays()).toEqual([]);
  });

  it('loads valid overlays and drops unknown fields', () => {
    localStorage.setItem(
      CARD_OVERLAYS_STORAGE_KEY,
      JSON.stringify({
        'fire-attack-2': {
          image_asset: '/art/x.png',
          notes: 'note',
          secret: 'should-drop',
          updated_at: '2026-01-01T00:00:00.000Z',
        },
      }),
    );
    expect(loadCardOverlays()).toEqual([
      {
        id: 'fire-attack-2',
        image_asset: '/art/x.png',
        notes: 'note',
        updated_at: '2026-01-01T00:00:00.000Z',
      },
    ]);
  });

  it('returns empty list for corrupt JSON', () => {
    localStorage.setItem(CARD_OVERLAYS_STORAGE_KEY, '{not-json');
    expect(loadCardOverlays()).toEqual([]);
  });

  it('returns empty list for non-object JSON', () => {
    localStorage.setItem(CARD_OVERLAYS_STORAGE_KEY, JSON.stringify(['x']));
    expect(loadCardOverlays()).toEqual([]);
  });

  it('skips malformed overlay entries', () => {
    localStorage.setItem(
      CARD_OVERLAYS_STORAGE_KEY,
      JSON.stringify({
        good: { notes: 'ok' },
        bad: 42,
        empty: {},
      }),
    );
    expect(loadCardOverlays()).toEqual([{ id: 'good', notes: 'ok' }]);
  });

  it('saves and merges overlay fields', () => {
    expect(saveCardOverlay('char-1', { notes: 'a' })).toBe(true);
    expect(saveCardOverlay('char-1', { image_asset: '/i.png' })).toBe(true);
    const loaded = loadCardOverlays();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.id).toBe('char-1');
    expect(loaded[0]?.notes).toBe('a');
    expect(loaded[0]?.image_asset).toBe('/i.png');
    expect(loaded[0]?.updated_at).toMatch(/^\d{4}-/);
  });

  it('rejects empty id', () => {
    expect(saveCardOverlay('', { notes: 'x' })).toBe(false);
    expect(loadCardOverlays()).toEqual([]);
  });

  it('returns false when setItem throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => undefined,
      clear: () => undefined,
    });
    expect(saveCardOverlay('char-1', { notes: 'x' })).toBe(false);
  });
});
