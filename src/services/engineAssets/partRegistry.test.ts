/**
 * Unit tests for engine part asset registry lookup (all 36 V3 parts).
 * Location: src/services/engineAssets/partRegistry.test.ts
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  V3_ENGINE_PARTS_36,
  listV3EnginePartIds,
} from '../../game/packs/v3/engineParts36';
import {
  listEnginePartAssets,
  lookupEnginePartAsset,
  SOCKETS_BY_SLOT,
} from './partRegistry';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');

describe('lookupEnginePartAsset', () => {
  it('returns null for unknown id', () => {
    expect(lookupEnginePartAsset('v3-part-does-not-exist')).toBeNull();
    expect(lookupEnginePartAsset('')).toBeNull();
  });

  it('resolves every V3_ENGINE_PARTS_36 id', () => {
    for (const id of listV3EnginePartIds()) {
      const entry = lookupEnginePartAsset(id);
      expect(entry, `missing registry entry for ${id}`).not.toBeNull();
      expect(entry!.id).toBe(id);
      expect(entry!.modelUrl).toBe(`/engine-parts/mvp/${id}.glb`);
      expect(entry!.previewUrl).toBe(`/cards/engine/${id}.png`);
      expect(entry!.version).toBe(3);
    }
  });

  it('uses the canonical socket set for each slot', () => {
    for (const part of V3_ENGINE_PARTS_36) {
      const entry = lookupEnginePartAsset(part.id);
      expect(entry).not.toBeNull();
      expect(entry!.slot).toBe(part.slot);
      expect(entry!.sockets).toEqual(SOCKETS_BY_SLOT[part.slot]);
    }
  });

  it('lists exactly 36 entries matching the catalog', () => {
    const list = listEnginePartAssets();
    expect(list).toHaveLength(36);
    expect(list.map((e) => e.id)).toEqual(listV3EnginePartIds());
  });

  it('has committed GLB files for each registry modelUrl', () => {
    for (const id of listV3EnginePartIds()) {
      const entry = lookupEnginePartAsset(id);
      expect(entry).not.toBeNull();
      const rel = entry!.modelUrl.replace(/^\//, '');
      const abs = join(REPO_ROOT, 'public', rel);
      expect(existsSync(abs), `missing GLB at ${abs}`).toBe(true);
    }
  });
});
