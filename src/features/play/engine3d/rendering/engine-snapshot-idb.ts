/**
 * IndexedDB L2 persistence for engine snapshots (Brief §13).
 * Location: src/features/play/engine3d/rendering/engine-snapshot-idb.ts
 * In-memory cache remains L1; this module is write-through + hydrate.
 */
import { ENGINE_RENDER_VERSION } from '../../../../game/types/engineVisual';

export const ENGINE_SNAPSHOT_IDB_NAME = 'letzfetz-engine-snapshots';
export const ENGINE_SNAPSHOT_IDB_STORE = 'snapshots';
/** Bump when IDB record shape changes. */
export const ENGINE_SNAPSHOT_IDB_SCHEMA = 1;

export type EngineSnapshotIdbRecord = {
  renderKey: string;
  dataUrl: string;
  storedAt: number;
  schemaVersion: number;
};

/** Abstract persist backend — Map in tests, IndexedDB in browser. */
export interface EngineSnapshotPersistStore {
  get(renderKey: string): Promise<unknown>;
  put(record: EngineSnapshotIdbRecord): Promise<void>;
  delete(renderKey: string): Promise<void>;
  clear(): Promise<void>;
  getAll(): Promise<unknown[]>;
}

export function isEngineSnapshotIdbRecord(
  value: unknown,
): value is EngineSnapshotIdbRecord {
  if (value === null || typeof value !== 'object') return false;
  const rec = value as Record<string, unknown>;
  return (
    typeof rec.renderKey === 'string' &&
    rec.renderKey.length > 0 &&
    typeof rec.dataUrl === 'string' &&
    rec.dataUrl.length > 0 &&
    typeof rec.storedAt === 'number' &&
    Number.isFinite(rec.storedAt) &&
    typeof rec.schemaVersion === 'number'
  );
}

/** Stale when key renderVersion prefix mismatches current ENGINE_RENDER_VERSION. */
export function isStaleEngineSnapshotRenderKey(renderKey: string): boolean {
  const prefix = `rv${ENGINE_RENDER_VERSION}|`;
  return !renderKey.startsWith(prefix);
}

export function createMemoryEngineSnapshotPersistStore(): EngineSnapshotPersistStore {
  const map = new Map<string, EngineSnapshotIdbRecord>();
  return {
    async get(renderKey) {
      return map.get(renderKey) ?? null;
    },
    async put(record) {
      map.set(record.renderKey, record);
    },
    async delete(renderKey) {
      map.delete(renderKey);
    },
    async clear() {
      map.clear();
    },
    async getAll() {
      return [...map.values()];
    },
  };
}

function openIdb(factory: IDBFactory): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = factory.open(ENGINE_SNAPSHOT_IDB_NAME, ENGINE_SNAPSHOT_IDB_SCHEMA);
    req.onerror = () => reject(req.error ?? new Error('IDB open failed'));
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(ENGINE_SNAPSHOT_IDB_STORE)) {
        db.createObjectStore(ENGINE_SNAPSHOT_IDB_STORE, { keyPath: 'renderKey' });
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
}

export function createIndexedDbEngineSnapshotPersistStore(
  factory: IDBFactory,
): EngineSnapshotPersistStore {
  return {
    async get(renderKey) {
      const db = await openIdb(factory);
      try {
        return await new Promise<unknown>((resolve, reject) => {
          const tx = db.transaction(ENGINE_SNAPSHOT_IDB_STORE, 'readonly');
          const req = tx.objectStore(ENGINE_SNAPSHOT_IDB_STORE).get(renderKey);
          req.onsuccess = () => resolve(req.result ?? null);
          req.onerror = () => reject(req.error ?? new Error('IDB get failed'));
        });
      } finally {
        db.close();
      }
    },
    async put(record) {
      const db = await openIdb(factory);
      try {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(ENGINE_SNAPSHOT_IDB_STORE, 'readwrite');
          tx.objectStore(ENGINE_SNAPSHOT_IDB_STORE).put(record);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error ?? new Error('IDB put failed'));
        });
      } finally {
        db.close();
      }
    },
    async delete(renderKey) {
      const db = await openIdb(factory);
      try {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(ENGINE_SNAPSHOT_IDB_STORE, 'readwrite');
          tx.objectStore(ENGINE_SNAPSHOT_IDB_STORE).delete(renderKey);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error ?? new Error('IDB delete failed'));
        });
      } finally {
        db.close();
      }
    },
    async clear() {
      const db = await openIdb(factory);
      try {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(ENGINE_SNAPSHOT_IDB_STORE, 'readwrite');
          tx.objectStore(ENGINE_SNAPSHOT_IDB_STORE).clear();
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error ?? new Error('IDB clear failed'));
        });
      } finally {
        db.close();
      }
    },
    async getAll() {
      const db = await openIdb(factory);
      try {
        return await new Promise<unknown[]>((resolve, reject) => {
          const tx = db.transaction(ENGINE_SNAPSHOT_IDB_STORE, 'readonly');
          const req = tx.objectStore(ENGINE_SNAPSHOT_IDB_STORE).getAll();
          req.onsuccess = () =>
            resolve(Array.isArray(req.result) ? req.result : []);
          req.onerror = () => reject(req.error ?? new Error('IDB getAll failed'));
        });
      } finally {
        db.close();
      }
    },
  };
}

let activeStore: EngineSnapshotPersistStore | null | undefined;
let warnedUnavailable = false;

function warnDe(message: string): void {
  if (typeof console !== 'undefined') {
    console.warn(`[Engine-Snapshot] ${message}`);
  }
}

/**
 * Resolve L2 store: test override, real IndexedDB, or null (memory-only).
 * `undefined` activeStore means "not yet resolved"; `null` means explicitly disabled.
 */
export function getEngineSnapshotPersistStore(): EngineSnapshotPersistStore | null {
  if (activeStore !== undefined) return activeStore;
  if (typeof indexedDB === 'undefined') {
    if (!warnedUnavailable) {
      warnedUnavailable = true;
      warnDe('IndexedDB nicht verfügbar — Snapshots nur im Speicher.');
    }
    activeStore = null;
    return null;
  }
  try {
    activeStore = createIndexedDbEngineSnapshotPersistStore(indexedDB);
    return activeStore;
  } catch {
    if (!warnedUnavailable) {
      warnedUnavailable = true;
      warnDe('IndexedDB konnte nicht geöffnet werden — Snapshots nur im Speicher.');
    }
    activeStore = null;
    return null;
  }
}

/** Vitest: inject Map-backed store (or null to simulate missing IDB). */
export function setEngineSnapshotPersistStoreForTests(
  store: EngineSnapshotPersistStore | null,
): void {
  activeStore = store;
  warnedUnavailable = false;
}

export async function putEngineSnapshotIdb(
  renderKey: string,
  entry: { dataUrl: string; storedAt: number },
): Promise<void> {
  const store = getEngineSnapshotPersistStore();
  if (!store) return;
  const record: EngineSnapshotIdbRecord = {
    renderKey,
    dataUrl: entry.dataUrl,
    storedAt: entry.storedAt,
    schemaVersion: ENGINE_SNAPSHOT_IDB_SCHEMA,
  };
  try {
    await store.put(record);
  } catch (err) {
    const name =
      err && typeof err === 'object' && 'name' in err
        ? String((err as { name: unknown }).name)
        : '';
    if (name === 'QuotaExceededError') {
      warnDe('Speicher voll — Snapshot nicht in IndexedDB geschrieben.');
      return;
    }
    warnDe('IndexedDB-Schreiben fehlgeschlagen — Speicher-Cache bleibt aktiv.');
  }
}

export async function deleteEngineSnapshotIdb(renderKey?: string): Promise<void> {
  const store = getEngineSnapshotPersistStore();
  if (!store) return;
  try {
    if (renderKey === undefined) await store.clear();
    else await store.delete(renderKey);
  } catch {
    warnDe('IndexedDB-Löschen fehlgeschlagen.');
  }
}

/**
 * Load IDB entries into the provided L1 setter.
 * Drops corrupt / stale / wrong-schema records.
 * @returns number of entries hydrated into L1
 */
export async function hydrateEngineSnapshotsFromIdb(
  setL1: (renderKey: string, dataUrl: string, storedAt: number) => void,
): Promise<number> {
  const store = getEngineSnapshotPersistStore();
  if (!store) return 0;

  let rows: unknown[] = [];
  try {
    rows = await store.getAll();
  } catch {
    warnDe('IndexedDB-Lesen fehlgeschlagen.');
    return 0;
  }

  let hydrated = 0;
  for (const raw of rows) {
    if (!isEngineSnapshotIdbRecord(raw)) {
      if (raw && typeof raw === 'object' && 'renderKey' in raw) {
        const key = (raw as { renderKey: unknown }).renderKey;
        if (typeof key === 'string') {
          try {
            await store.delete(key);
          } catch {
            /* ignore */
          }
        }
      }
      continue;
    }
    if (
      raw.schemaVersion !== ENGINE_SNAPSHOT_IDB_SCHEMA ||
      isStaleEngineSnapshotRenderKey(raw.renderKey)
    ) {
      try {
        await store.delete(raw.renderKey);
      } catch {
        /* ignore */
      }
      continue;
    }
    setL1(raw.renderKey, raw.dataUrl, raw.storedAt);
    hydrated += 1;
  }
  return hydrated;
}
