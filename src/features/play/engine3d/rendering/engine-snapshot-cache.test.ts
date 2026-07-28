/**
 * Vitest: engine snapshot cache roundtrip + renderVersion miss.
 * Location: src/features/play/engine3d/rendering/engine-snapshot-cache.test.ts
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
import {
  ENGINE_SNAPSHOT_PLACEHOLDER_DATA_URL,
  requestEngineSnapshot,
} from './requestEngineSnapshot';

const baseRecipe: EngineRecipe = {
  carrierId: 'v3-part-water-traeger-01',
  driveId: 'v3-part-shadow-antrieb-01',
  attachmentId: 'v3-part-light-aufsatz-01',
  cosmeticSeed: 0,
  renderVersion: ENGINE_RENDER_VERSION,
};

afterEach(() => {
  invalidateEngineSnapshot();
});

describe('engine-snapshot-cache', () => {
  it('roundtrips get/set by renderKey', () => {
    const key = createRenderKey(baseRecipe);
    expect(getEngineSnapshot(key)).toBeNull();

    setEngineSnapshot(key, 'data:image/png;base64,abc');
    const hit = getEngineSnapshot(key);
    expect(hit).not.toBeNull();
    expect(hit?.dataUrl).toBe('data:image/png;base64,abc');
    expect(typeof hit?.storedAt).toBe('number');
    expect(engineSnapshotCacheSize()).toBe(1);
  });

  it('invalidate removes one key or clears all', () => {
    const key = createRenderKey(baseRecipe);
    setEngineSnapshot(key, 'data:image/png;base64,x');
    setEngineSnapshot('other|key', 'data:image/png;base64,y');
    invalidateEngineSnapshot(key);
    expect(getEngineSnapshot(key)).toBeNull();
    expect(getEngineSnapshot('other|key')).not.toBeNull();
    invalidateEngineSnapshot();
    expect(engineSnapshotCacheSize()).toBe(0);
  });

  it('drops corrupt entries on get', () => {
    const key = createRenderKey(baseRecipe);
    // Force a bad shape via set then mutate Map is not exported —
    // simulate by setting empty dataUrl which validation rejects on read path:
    // setEngineSnapshot requires string; inject via invalidate + internal:
    // Use set with valid then overwrite by re-importing isn't possible.
    // Instead: set empty string — set allows it but get should drop.
    setEngineSnapshot(key, '');
    expect(getEngineSnapshot(key)).toBeNull();
    expect(engineSnapshotCacheSize()).toBe(0);
  });
});

describe('requestEngineSnapshot', () => {
  it('stores placeholder on miss and returns cache hit on second call', () => {
    const first = requestEngineSnapshot(baseRecipe);
    expect(first.source).toBe('placeholder');
    expect(first.dataUrl).toBe(ENGINE_SNAPSHOT_PLACEHOLDER_DATA_URL);
    expect(first.renderKey).toBe(createRenderKey(baseRecipe));

    const second = requestEngineSnapshot(baseRecipe);
    expect(second.source).toBe('cache');
    expect(second.dataUrl).toBe(ENGINE_SNAPSHOT_PLACEHOLDER_DATA_URL);
  });

  it('renderVersion bump yields a different key (cache miss)', () => {
    requestEngineSnapshot(baseRecipe);
    const bumped: EngineRecipe = {
      ...baseRecipe,
      renderVersion: ENGINE_RENDER_VERSION + 1,
    };
    const result = requestEngineSnapshot(bumped, { allowPlaceholder: false });
    expect(result.renderKey).not.toBe(createRenderKey(baseRecipe));
    expect(result.source).toBe('miss');
    expect(result.dataUrl).toBeNull();
    // Original still cached
    expect(requestEngineSnapshot(baseRecipe).source).toBe('cache');
  });

  it('allowPlaceholder false does not cache a miss', () => {
    const miss = requestEngineSnapshot(baseRecipe, { allowPlaceholder: false });
    expect(miss.source).toBe('miss');
    expect(getEngineSnapshot(miss.renderKey)).toBeNull();
  });
});
