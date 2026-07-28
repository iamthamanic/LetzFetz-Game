/**
 * Unit tests for engine part asset registry lookup.
 * Location: src/services/engineAssets/partRegistry.test.ts
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  listEnginePartAssets,
  lookupEnginePartAsset,
} from './partRegistry';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const MVP_IDS = [
  'v3-part-water-traeger-01',
  'v3-part-shadow-antrieb-01',
  'v3-part-light-aufsatz-01',
] as const;

describe('lookupEnginePartAsset', () => {
  it('returns null for unknown id', () => {
    expect(lookupEnginePartAsset('v3-part-does-not-exist')).toBeNull();
    expect(lookupEnginePartAsset('')).toBeNull();
  });

  it('maps MVP×3 ids to modelUrl, previewUrl, slot, sockets, version', () => {
    const water = lookupEnginePartAsset('v3-part-water-traeger-01');
    expect(water).not.toBeNull();
    expect(water!.slot).toBe('traeger');
    expect(water!.modelUrl).toBe('/engine-parts/mvp/v3-part-water-traeger-01.glb');
    expect(water!.previewUrl).toBe('/cards/engine/v3-part-water-traeger-01.png');
    expect(water!.sockets).toEqual(['SOCKET_DRIVE', 'SOCKET_VFX_REAR']);
    expect(water!.version).toBe(1);

    const drive = lookupEnginePartAsset('v3-part-shadow-antrieb-01');
    expect(drive!.slot).toBe('antrieb');
    expect(drive!.sockets).toEqual(['SOCKET_OUTPUT', 'SOCKET_VFX_CORE']);

    const tip = lookupEnginePartAsset('v3-part-light-aufsatz-01');
    expect(tip!.slot).toBe('aufsatz');
    expect(tip!.sockets).toEqual(['SOCKET_ATTACK_ORIGIN']);
  });

  it('lists exactly the three MVP entries', () => {
    const list = listEnginePartAssets();
    expect(list).toHaveLength(3);
    expect(list.map((e) => e.id).sort()).toEqual([...MVP_IDS].sort());
  });

  it('has committed GLB files for each registry modelUrl', () => {
    for (const id of MVP_IDS) {
      const entry = lookupEnginePartAsset(id);
      expect(entry).not.toBeNull();
      const rel = entry!.modelUrl.replace(/^\//, '');
      const abs = join(REPO_ROOT, 'public', rel);
      expect(existsSync(abs), `missing GLB at ${abs}`).toBe(true);
    }
  });
});
