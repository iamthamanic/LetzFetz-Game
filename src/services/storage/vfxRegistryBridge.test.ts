/**
 * Unit tests for cross-feature VFX registry bridge.
 * Location: src/services/storage/vfxRegistryBridge.test.ts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  VFX_REGISTRY_STORAGE_KEY,
  readVfxRegistryFormulaRecipeSummaries,
  readVfxRegistryTechniqueSummaries,
} from './vfxRegistryBridge';

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

describe('vfxRegistryBridge', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', new MockStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns empty list when storage missing', () => {
    expect(readVfxRegistryTechniqueSummaries()).toEqual([]);
  });

  it('reads valid technique summaries', () => {
    localStorage.setItem(
      VFX_REGISTRY_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        techniques: [
          {
            kind: 'technique',
            role: 'technik',
            id: 'vfx-technik-test',
            name: 'Test',
            status: 'READY',
            modelId: '/vfx/mock/demo-technique.glb',
            createdAt: TS,
            updatedAt: TS,
          },
        ],
        updatedAt: TS,
      }),
    );
    const summaries = readVfxRegistryTechniqueSummaries();
    expect(summaries).toHaveLength(1);
    expect(summaries[0].name).toBe('Test');
    expect(summaries[0].modelId).toBe('/vfx/mock/demo-technique.glb');
  });

  it('skips non-technique entries', () => {
    localStorage.setItem(
      VFX_REGISTRY_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        techniques: [{ kind: 'essence', role: 'essenz', id: 'x', name: 'Bad' }],
        updatedAt: TS,
      }),
    );
    expect(readVfxRegistryTechniqueSummaries()).toEqual([]);
  });

  it('reads valid formula recipe summaries', () => {
    localStorage.setItem(
      VFX_REGISTRY_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        techniques: [],
        formulaRecipes: [
          {
            kind: 'formulaRecipe',
            id: 'kombi-1',
            name: 'Feuer-Duo',
            status: 'READY',
            version: 1,
            techniqueId: 't1',
            essenceId: 'e1',
            catalystId: null,
            techniqueVersion: 1,
            essenceVersion: 1,
            catalystVersion: null,
            heroFrame: {
              kind: 'renderOutput',
              id: 'r1',
              url: 'data:image/png;base64,xyz',
              format: 'png',
              width: 64,
              height: 48,
              capturedAt: TS,
            },
            createdAt: TS,
            updatedAt: TS,
          },
        ],
        updatedAt: TS,
      }),
    );
    const summaries = readVfxRegistryFormulaRecipeSummaries();
    expect(summaries).toHaveLength(1);
    expect(summaries[0].name).toBe('Feuer-Duo');
    expect(summaries[0].heroFrameUrl).toBe('data:image/png;base64,xyz');
  });
});
