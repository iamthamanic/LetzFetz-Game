/**
 * Hydrate L1 engine snapshot cache from IndexedDB (L2).
 * Location: src/features/play/engine3d/rendering/hydrateEngineSnapshots.ts
 */
import { setEngineSnapshot } from './engine-snapshot-cache';
import { hydrateEngineSnapshotsFromIdb } from './engine-snapshot-idb';

/** Load durable snapshots into memory. Returns hydrated entry count. */
export async function hydrateEngineSnapshotCache(): Promise<number> {
  return hydrateEngineSnapshotsFromIdb((renderKey, dataUrl, storedAt) => {
    setEngineSnapshot(renderKey, dataUrl, { storedAt, persist: false });
  });
}
