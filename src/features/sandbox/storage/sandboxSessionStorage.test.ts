/**
 * Unit tests for one-record Sandbox session storage.
 * Location: src/features/sandbox/storage/sandboxSessionStorage.test.ts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SANDBOX_SESSION_KEY,
  createFreshSandboxSession,
} from '../model/sandboxTypes';
import {
  clearSandboxSession,
  loadSandboxSession,
  saveSandboxSession,
} from './sandboxSessionStorage';

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

describe('sandboxSessionStorage', () => {
  beforeEach(() => {
    const storage = new MockStorage();
    vi.stubGlobal('localStorage', storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns fresh session when nothing stored', () => {
    const { session, restored } = loadSandboxSession();
    expect(restored).toBe(false);
    expect(session).toEqual(createFreshSandboxSession());
  });

  it('round-trips a valid session', () => {
    const fresh = createFreshSandboxSession();
    fresh.p1Hp = 12;
    fresh.placedCards = [
      {
        instanceId: 'inst-1',
        cardId: 'fire-attack-2',
        position: { x: 10, y: 20 },
        zIndex: 101,
      },
    ];
    fresh.arenaId = 'arena-1';
    fresh.arenaVariantIndex = 1;
    expect(saveSandboxSession(fresh)).toEqual({ ok: true });

    const { session, restored } = loadSandboxSession();
    expect(restored).toBe(true);
    expect(session.p1Hp).toBe(12);
    expect(session.placedCards).toEqual(fresh.placedCards);
    expect(session.arenaId).toBe('arena-1');
    expect(session.arenaVariantIndex).toBe(1);
  });

  it('falls back to fresh on wrong version', () => {
    const bad = { ...createFreshSandboxSession(), version: 99 };
    localStorage.setItem(SANDBOX_SESSION_KEY, JSON.stringify(bad));
    const { session, restored } = loadSandboxSession();
    expect(restored).toBe(false);
    expect(session.version).toBe(1);
    expect(session.p1Hp).toBe(20);
  });

  it('falls back to fresh on corrupt JSON', () => {
    localStorage.setItem(SANDBOX_SESSION_KEY, '{broken');
    expect(loadSandboxSession().restored).toBe(false);
  });

  it('falls back to fresh on NaN position', () => {
    const bad = createFreshSandboxSession();
    localStorage.setItem(
      SANDBOX_SESSION_KEY,
      JSON.stringify({
        ...bad,
        placedCards: [
          {
            instanceId: 'i',
            cardId: 'c',
            position: { x: Number.NaN, y: 1 },
            zIndex: 1,
          },
        ],
      }),
    );
    expect(loadSandboxSession().restored).toBe(false);
  });

  it('overwrites the same single record key', () => {
    const a = createFreshSandboxSession();
    a.p1Hp = 5;
    saveSandboxSession(a);
    const b = createFreshSandboxSession();
    b.p1Hp = 9;
    saveSandboxSession(b);
    expect(localStorage.getItem(SANDBOX_SESSION_KEY)).toContain('"p1Hp":9');
    expect(loadSandboxSession().session.p1Hp).toBe(9);
  });

  it('clear removes the record so load is fresh', () => {
    const session = createFreshSandboxSession();
    session.p1Notes = 'keep?';
    saveSandboxSession(session);
    expect(clearSandboxSession()).toEqual({ ok: true });
    expect(localStorage.getItem(SANDBOX_SESSION_KEY)).toBeNull();
    const loaded = loadSandboxSession();
    expect(loaded.restored).toBe(false);
    expect(loaded.session.p1Notes).toBe('');
  });

  it('save returns ok:false when storage throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => undefined,
      clear: () => undefined,
    });
    const result = saveSandboxSession(createFreshSandboxSession());
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('QuotaExceededError');
  });

  it('serialized session contains no credential-like keys', () => {
    const session = createFreshSandboxSession();
    saveSandboxSession(session);
    const raw = localStorage.getItem(SANDBOX_SESSION_KEY) ?? '';
    expect(raw.toLowerCase()).not.toMatch(/token|password|apikey|anon|secret|bearer/);
  });
});
