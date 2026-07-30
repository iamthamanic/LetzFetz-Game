/**
 * Unit tests for Effekseer WASM adapter (#300).
 * Location: src/features/build/vfx/preview/effekseerAdapter.test.ts
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  resolveEffectResourceUrl,
  setEffekseerAdapterForTests,
  WasmEffekseerAdapter,
  type EffekseerRuntimeLoader,
} from './effekseerAdapter';
import type {
  EffekseerApi,
  EffekseerContextLike,
  EffekseerEffectLike,
  EffekseerHandleLike,
} from './effekseerApi';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const AURA_PATH = '/vfx/effects/aura.efkefc';
const AURA_FILE = resolve(process.cwd(), 'public/vfx/effects/aura.efkefc');

function readAuraBytes(): Buffer {
  return readFileSync(AURA_FILE);
}

function makeMockLoader(opts?: { failInit?: boolean }): EffekseerRuntimeLoader {
  const handle: EffekseerHandleLike = {
    exists: true,
    stop() {},
    setPaused() {},
    setShown() {},
    setSpeed() {},
  };
  const effect: EffekseerEffectLike = {};
  const context: EffekseerContextLike = {
    init() {},
    update() {},
    draw() {},
    setProjectionMatrix() {},
    setCameraMatrix() {},
    loadEffect(_path, _scale, onload) {
      onload?.();
      return effect;
    },
    releaseEffect() {},
    play() {
      return handle;
    },
    stopAll() {},
  };
  const api: EffekseerApi = {
    initRuntime(_path, onload, onerror) {
      if (opts?.failInit) onerror();
      else onload();
    },
    createContext() {
      return context;
    },
    releaseContext() {},
  };
  return {
    async loadApi() {
      if (opts?.failInit) throw new Error('init failed');
      return api;
    },
  };
}

afterEach(() => {
  setEffekseerAdapterForTests(null);
  vi.unstubAllGlobals();
});

describe('resolveEffectResourceUrl', () => {
  it('resolves relative Parts paths against effect directory', () => {
    expect(resolveEffectResourceUrl('/vfx/effects/aura.efkefc', 'Parts/Aura.png')).toBe(
      '/vfx/effects/Parts/Aura.png',
    );
  });

  it('keeps absolute paths', () => {
    expect(resolveEffectResourceUrl('/vfx/effects/aura.efkefc', '/abs.png')).toBe('/abs.png');
  });
});

describe('WasmEffekseerAdapter', () => {
  it('returns missing when fetch is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 404 }) as Response),
    );
    const adapter = new WasmEffekseerAdapter(makeMockLoader());
    await expect(adapter.loadEffect('/vfx/effects/nope.efkefc')).resolves.toBe('missing');
    expect(adapter.createEffect('/vfx/effects/nope.efkefc', {} as WebGLRenderingContext)).toBeNull();
  });

  it('returns error when magic is not EFKE', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        arrayBuffer: async () => new TextEncoder().encode('NOT_EFKE').buffer,
      }) as Response),
    );
    const adapter = new WasmEffekseerAdapter(makeMockLoader());
    await expect(adapter.loadEffect(AURA_PATH)).resolves.toBe('error');
  });

  it('loads real aura.efkefc magic and createEffect returns live instance with mock runtime', async () => {
    const bytes = readAuraBytes();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        arrayBuffer: async () =>
          bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      }) as Response),
    );
    const adapter = new WasmEffekseerAdapter(makeMockLoader());
    await expect(adapter.loadEffect(AURA_PATH)).resolves.toBe('ready');
    const instance = adapter.createEffect(AURA_PATH, {} as WebGLRenderingContext);
    expect(instance).not.toBeNull();
    expect(instance?.isLive).toBe(true);
    instance?.setPlayheadMs(500);
    instance?.renderFrame(16);
    instance?.dispose();
  });

  it('returns error when runtime loader fails (stand-in path)', async () => {
    const bytes = readAuraBytes();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        arrayBuffer: async () =>
          bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      }) as Response),
    );
    const adapter = new WasmEffekseerAdapter(makeMockLoader({ failInit: true }));
    await expect(adapter.loadEffect(AURA_PATH)).resolves.toBe('error');
    expect(adapter.createEffect(AURA_PATH, {} as WebGLRenderingContext)).toBeNull();
  });

  it('ships aura.efkefc with EFKE header on disk', () => {
    const bytes = readAuraBytes();
    expect(String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3])).toBe('EFKE');
  });
});
