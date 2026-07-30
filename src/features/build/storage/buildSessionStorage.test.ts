/**
 * Unit tests for Build session storage parse / round-trip.
 * Location: src/features/build/storage/buildSessionStorage.test.ts
 */
import { afterEach, describe, expect, it } from 'vitest';
import {
  BUILD_SESSION_KEY,
  BUILD_SESSION_VERSION,
  createFreshBuildSession,
} from '../model/buildTypes';
import {
  clearBuildSession,
  loadBuildSession,
  saveBuildSession,
} from './buildSessionStorage';

const memory = new Map<string, string>();

const storageMock: Storage = {
  get length() {
    return memory.size;
  },
  clear() {
    memory.clear();
  },
  getItem(key: string): string | null {
    return memory.has(key) ? (memory.get(key) as string) : null;
  },
  key(): string | null {
    return null;
  },
  setItem(key: string, value: string): void {
    memory.set(key, value);
  },
  removeItem(key: string): void {
    memory.delete(key);
  },
};

function installStorage(): void {
  Object.defineProperty(globalThis, 'localStorage', {
    value: storageMock,
    configurable: true,
    writable: true,
  });
}

describe('buildSessionStorage', () => {
  afterEach(() => {
    memory.clear();
  });

  it('returns fresh session when empty', () => {
    installStorage();
    const { session, restored } = loadBuildSession();
    expect(restored).toBe(false);
    expect(session).toEqual(createFreshBuildSession());
  });

  it('round-trips a valid session including asset picks', () => {
    installStorage();
    const session = {
      ...createFreshBuildSession(),
      slots: { technik: null, essenz: 'v5-essenz-sogschatten', katalysator: null },
      name: 'Sog-Formel',
      lastDroppedPartId: 'v5-essenz-sogschatten',
      assetPicks: {},
    };
    expect(saveBuildSession(session).ok).toBe(true);
    const loaded = loadBuildSession();
    expect(loaded.restored).toBe(true);
    expect(loaded.session).toEqual(session);
  });

  it('rejects corrupt payload', () => {
    installStorage();
    memory.set(BUILD_SESSION_KEY, '{"version":999}');
    const { session, restored } = loadBuildSession();
    expect(restored).toBe(false);
    expect(session.version).toBe(BUILD_SESSION_VERSION);
  });

  it('clears the key', () => {
    installStorage();
    saveBuildSession(createFreshBuildSession());
    expect(clearBuildSession().ok).toBe(true);
    expect(memory.has(BUILD_SESSION_KEY)).toBe(false);
  });
});
