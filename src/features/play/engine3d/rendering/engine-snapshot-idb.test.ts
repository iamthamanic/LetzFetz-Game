/**
 * Unit tests for engine snapshot IndexedDB L2 (Map-backed mock store).
 * Location: src/features/play/engine3d/rendering/engine-snapshot-idb.test.ts
 */
import { afterEach, describe, expect, it } from 'vitest';
import { createRenderKey } from '../../../../game/engine/engineRecipe';
import { ENGINE_RENDER_VERSION } from '../../../../game/types/engineVisual';
import type { EngineRecipe } from '../../../../game/types/engineVisual';
import {
  engineSnapshotCacheSize,
  getEngineSnapshot,
  invalidateEngineSnapshot,
  setEngineSnapshot,
} from './engine-snapshot-cache';
import { hydrateEngineSnapshotCache } from './hydrateEngineSnapshots';
import {
  ENGINE_SNAPSHOT_IDB_SCHEMA,
  createMemoryEngineSnapshotPersistStore,
  isEngineSnapshotIdbRecord,
  isStaleEngineSnapshotRenderKey,
  setEngineSnapshotPersistStoreForTests,
  type EngineSnapshotPersistStore,
} from './engine-snapshot-idb';

const baseRecipe: EngineRecipe = {
  carrierId: 'v3-part-water-traeger-01',
  driveId: 'v3-part-shadow-antrieb-01',
  attachmentId: 'v3-part-light-aufsatz-01',
  cosmeticSeed: 0,
  renderVersion: ENGINE_RENDER_VERSION,
};

afterEach(async () => {
  setEngineSnapshotPersistStoreForTests(null);
  invalidateEngineSnapshot();
});

describe('isEngineSnapshotIdbRecord / stale key', () => {
  it('validates record shape', () => {
    expect(
      isEngineSnapshotIdbRecord({
        renderKey: 'rv3|cs0|a|b|c',
        dataUrl: 'data:image/png;base64,x',
        storedAt: 1,
        schemaVersion: ENGINE_SNAPSHOT_IDB_SCHEMA,
      }),
    ).toBe(true);
    expect(isEngineSnapshotIdbRecord({ renderKey: 'x' })).toBe(false);
    expect(isEngineSnapshotIdbRecord(null)).toBe(false);
  });

  it('detects stale renderVersion prefix', () => {
    expect(isStaleEngineSnapshotRenderKey(`rv${ENGINE_RENDER_VERSION}|cs0|a||`)).toBe(
      false,
    );
    expect(
      isStaleEngineSnapshotRenderKey(`rv${ENGINE_RENDER_VERSION + 9}|cs0|a||`),
    ).toBe(true);
  });
});

describe('IDB persist + hydrate', () => {
  it('survives L1 clear via hydrate from L2 (reload simulation)', async () => {
    const memory = createMemoryEngineSnapshotPersistStore();
    setEngineSnapshotPersistStoreForTests(memory);

    const key = createRenderKey(baseRecipe);
    setEngineSnapshot(key, 'data:image/png;base64,PERSISTED', { storedAt: 42 });
    const { putEngineSnapshotIdb } = await import('./engine-snapshot-idb');
    await putEngineSnapshotIdb(key, {
      dataUrl: 'data:image/png;base64,PERSISTED',
      storedAt: 42,
    });

    // Wipe L1 without clearing L2
    setEngineSnapshotPersistStoreForTests(null);
    invalidateEngineSnapshot();
    expect(engineSnapshotCacheSize()).toBe(0);
    expect(getEngineSnapshot(key)).toBeNull();

    setEngineSnapshotPersistStoreForTests(memory);
    const count = await hydrateEngineSnapshotCache();
    expect(count).toBe(1);
    expect(getEngineSnapshot(key)?.dataUrl).toBe('data:image/png;base64,PERSISTED');
    expect(getEngineSnapshot(key)?.storedAt).toBe(42);
  });

  it('drops corrupt and stale records on hydrate', async () => {
    const bag: unknown[] = [
      { renderKey: 'corrupt-key', dataUrl: 123, storedAt: 1, schemaVersion: 1 },
      {
        renderKey: `rv${ENGINE_RENDER_VERSION + 1}|cs0|x||`,
        dataUrl: 'data:image/png;base64,STALE',
        storedAt: 1,
        schemaVersion: ENGINE_SNAPSHOT_IDB_SCHEMA,
      },
      {
        renderKey: createRenderKey(baseRecipe),
        dataUrl: 'data:image/png;base64,OK',
        storedAt: 9,
        schemaVersion: ENGINE_SNAPSHOT_IDB_SCHEMA,
      },
    ];
    const corruptStore: EngineSnapshotPersistStore = {
      async get() {
        return null;
      },
      async put() {},
      async delete(key: string) {
        const idx = bag.findIndex(
          (r) =>
            r &&
            typeof r === 'object' &&
            'renderKey' in r &&
            (r as { renderKey: string }).renderKey === key,
        );
        if (idx >= 0) bag.splice(idx, 1);
      },
      async clear() {
        bag.length = 0;
      },
      async getAll() {
        return [...bag];
      },
    };
    setEngineSnapshotPersistStoreForTests(corruptStore);

    const count = await hydrateEngineSnapshotCache();
    expect(count).toBe(1);
    expect(getEngineSnapshot(createRenderKey(baseRecipe))?.dataUrl).toBe(
      'data:image/png;base64,OK',
    );
    expect(await corruptStore.getAll()).toHaveLength(1);
  });

  it('missing persist store hydrates zero (memory-only)', async () => {
    setEngineSnapshotPersistStoreForTests(null);
    expect(await hydrateEngineSnapshotCache()).toBe(0);
  });
});
