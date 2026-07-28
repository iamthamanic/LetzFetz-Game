/**
 * In-memory engine snapshot cache keyed by createRenderKey.
 * Location: src/features/play/engine3d/rendering/engine-snapshot-cache.ts
 * ADR: docs/engine-system/architecture.md (#134)
 */

export interface EngineSnapshotEntry {
  /** data: URL or absolute/relative image URL */
  dataUrl: string;
  storedAt: number;
}

const store = new Map<string, EngineSnapshotEntry>();

function isValidEntry(entry: unknown): entry is EngineSnapshotEntry {
  if (entry === null || typeof entry !== 'object') return false;
  if (!('dataUrl' in entry) || !('storedAt' in entry)) return false;
  return (
    typeof entry.dataUrl === 'string' &&
    entry.dataUrl.length > 0 &&
    typeof entry.storedAt === 'number' &&
    Number.isFinite(entry.storedAt)
  );
}

/** Read a cached snapshot. Corrupt entries are dropped (miss). */
export function getEngineSnapshot(renderKey: string): EngineSnapshotEntry | null {
  const raw = store.get(renderKey);
  if (raw === undefined) return null;
  if (!isValidEntry(raw)) {
    store.delete(renderKey);
    return null;
  }
  return raw;
}

/** Store or replace a snapshot for the given renderKey. */
export function setEngineSnapshot(renderKey: string, dataUrl: string): EngineSnapshotEntry {
  const entry: EngineSnapshotEntry = {
    dataUrl,
    storedAt: Date.now(),
  };
  store.set(renderKey, entry);
  return entry;
}

/** Remove one key, or clear the entire cache when omit key. */
export function invalidateEngineSnapshot(renderKey?: string): void {
  if (renderKey === undefined) {
    store.clear();
    return;
  }
  store.delete(renderKey);
}

/** Test / debug helper — current entry count. */
export function engineSnapshotCacheSize(): number {
  return store.size;
}
