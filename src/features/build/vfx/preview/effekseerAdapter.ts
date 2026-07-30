/**
 * Effekseer WebGL adapter boundary for VFX preview.
 * Location: src/features/build/vfx/preview/effekseerAdapter.ts
 *
 * Real runtime: wire `@zaniar/effekseer-webgl-wasm` (MIT, EffekseerForWebGL) here.
 * UI must not import Effekseer directly — only through this adapter.
 */
export type EffekseerLoadState = 'idle' | 'loading' | 'ready' | 'missing' | 'error';

export interface EffekseerEffectInstance {
  /** Seek playback to timeline position (ms). */
  setPlayheadMs(ms: number): void;
  /** Release GPU resources. */
  dispose(): void;
}

export interface EffekseerAdapter {
  /** Probe + warm runtime for a preset path. */
  loadEffect(path: string): Promise<EffekseerLoadState>;
  /**
   * Instantiate effect in the shared WebGL context.
   * Returns null when the file is missing or runtime is not wired yet.
   */
  createEffect(
    path: string,
    gl: WebGLRenderingContext,
  ): EffekseerEffectInstance | null;
}

class StubEffekseerAdapter implements EffekseerAdapter {
  private readonly cache = new Map<string, EffekseerLoadState>();

  async loadEffect(path: string): Promise<EffekseerLoadState> {
    const cached = this.cache.get(path);
    if (cached && cached !== 'loading') return cached;

    this.cache.set(path, 'loading');
    try {
      const res = await fetch(path, { method: 'HEAD' });
      const state: EffekseerLoadState = res.ok ? 'ready' : 'missing';
      // Even when efkefc exists, full Effekseer WASM wiring is a follow-up —
      // stand-in particles render until createEffect is implemented.
      this.cache.set(path, state);
      return state;
    } catch {
      this.cache.set(path, 'error');
      return 'error';
    }
  }

  createEffect(_path: string, _gl: WebGLRenderingContext): EffekseerEffectInstance | null {
    return null;
  }
}

let sharedAdapter: EffekseerAdapter | null = null;

export function getEffekseerAdapter(): EffekseerAdapter {
  if (!sharedAdapter) {
    sharedAdapter = new StubEffekseerAdapter();
  }
  return sharedAdapter;
}

/** Test-only hook to inject a custom adapter. */
export function setEffekseerAdapterForTests(adapter: EffekseerAdapter | null): void {
  sharedAdapter = adapter;
}
