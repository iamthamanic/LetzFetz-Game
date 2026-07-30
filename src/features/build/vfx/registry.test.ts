/**
 * Unit tests for VFX Studio technique registry.
 * Location: src/features/build/vfx/registry.test.ts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { VFX_REGISTRY_STORAGE_KEY } from '../../../services/storage/vfxRegistryBridge';
import {
  listTechniqueAssets,
  loadVfxRegistry,
  parseVfxRegistry,
  saveTechniqueAsset,
  removeTechniqueAsset,
} from './registry';
import type { TechniqueAsset } from './types/assets';

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

const TS = '2026-07-30T12:00:00.000Z';

const sampleTechnique: TechniqueAsset = {
  kind: 'technique',
  role: 'technik',
  badges: ['Formel', 'Technik'],
  id: 'vfx-technik-demo',
  name: 'Demo-Bohrer',
  status: 'READY',
  version: 1,
  createdAt: TS,
  updatedAt: TS,
  imageId: null,
  modelId: '/vfx/mock/demo-technique.glb',
  effectId: null,
};

describe('vfx registry', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', new MockStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parseVfxRegistry validates version and techniques', () => {
    const parsed = parseVfxRegistry({
      version: 1,
      techniques: [sampleTechnique],
      updatedAt: TS,
    });
    expect(parsed.techniques).toHaveLength(1);
    expect(parsed.techniques[0].id).toBe('vfx-technik-demo');
  });

  it('rejects wrong registry version', () => {
    expect(() => parseVfxRegistry({ version: 2, techniques: [], updatedAt: TS })).toThrow(
      /version must be 1/,
    );
  });

  it('saveTechniqueAsset persists and listTechniqueAssets reads back', () => {
    saveTechniqueAsset(sampleTechnique);
    const listed = listTechniqueAssets();
    expect(listed).toHaveLength(1);
    expect(listed[0].name).toBe('Demo-Bohrer');
    expect(localStorage.getItem(VFX_REGISTRY_STORAGE_KEY)).toContain('vfx-technik-demo');
  });

  it('upserts by id', () => {
    saveTechniqueAsset(sampleTechnique);
    saveTechniqueAsset({ ...sampleTechnique, name: 'Updated', version: 2 });
    expect(listTechniqueAssets()).toHaveLength(1);
    expect(listTechniqueAssets()[0].name).toBe('Updated');
    expect(listTechniqueAssets()[0].version).toBe(2);
  });

  it('removeTechniqueAsset deletes entry', () => {
    saveTechniqueAsset(sampleTechnique);
    removeTechniqueAsset('vfx-technik-demo');
    expect(listTechniqueAssets()).toHaveLength(0);
  });

  it('loadVfxRegistry drops corrupt technique entries', () => {
    localStorage.setItem(
      VFX_REGISTRY_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        techniques: [sampleTechnique, { kind: 'technique', role: 'essenz' }],
        updatedAt: TS,
      }),
    );
    expect(loadVfxRegistry().techniques).toHaveLength(1);
  });
});
