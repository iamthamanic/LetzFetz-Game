/**
 * Effekseer WebGL adapter boundary for VFX preview.
 * Location: src/features/build/vfx/preview/effekseerAdapter.ts
 *
 * Real runtime: `@zaniar/effekseer-webgl-wasm` (MIT) via classic script + WASM
 * under `public/vfx/effekseer/`. UI must not import Effekseer directly.
 */
import {
  EFFEKSEER_JS_PATH,
  EFFEKSEER_WASM_PATH,
  type EffekseerApi,
  type EffekseerContextLike,
  type EffekseerEffectLike,
  type EffekseerGlobalWindow,
  type EffekseerHandleLike,
} from './effekseerApi';

export type EffekseerLoadState = 'idle' | 'loading' | 'ready' | 'missing' | 'error';

export interface EffekseerEffectInstance {
  /** Seek playback to timeline position (ms). */
  setPlayheadMs(ms: number): void;
  /** Advance simulation + draw (call from rAF / R3F frame). */
  renderFrame(deltaMs: number): void;
  /** Release GPU resources. */
  dispose(): void;
  /** True while the Effekseer handle is live. */
  readonly isLive: boolean;
}

export interface EffekseerAdapter {
  /** Probe + warm runtime for a preset path. */
  loadEffect(path: string): Promise<EffekseerLoadState>;
  /**
   * Instantiate effect in the shared WebGL context.
   * Returns null when the file is missing or runtime is not ready.
   */
  createEffect(
    path: string,
    gl: WebGLRenderingContext,
  ): EffekseerEffectInstance | null;
}

export interface EffekseerRuntimeLoader {
  loadApi(): Promise<EffekseerApi>;
}

function isBrowserWindow(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function loadClassicScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isBrowserWindow()) {
      reject(new Error('Effekseer script requires a browser document'));
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-effekseer-runtime="1"]`,
    );
    if (existing) {
      if (existing.dataset.loaded === '1') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error(`Failed to load Effekseer script: ${src}`)),
        { once: true },
      );
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.effekseerRuntime = '1';
    script.addEventListener('load', () => {
      script.dataset.loaded = '1';
      resolve();
    });
    script.addEventListener('error', () => {
      reject(new Error(`Failed to load Effekseer script: ${src}`));
    });
    document.head.appendChild(script);
  });
}

function initRuntime(api: EffekseerApi, wasmPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      api.initRuntime(wasmPath, () => resolve(), () => reject(new Error('Effekseer WASM init failed')));
    } catch (err) {
      reject(err instanceof Error ? err : new Error('Effekseer WASM init threw'));
    }
  });
}

/** Default loader: classic script from public/ + WASM initRuntime. */
export class BrowserEffekseerRuntimeLoader implements EffekseerRuntimeLoader {
  private apiPromise: Promise<EffekseerApi> | null = null;

  loadApi(): Promise<EffekseerApi> {
    if (!this.apiPromise) {
      this.apiPromise = (async () => {
        await loadClassicScript(EFFEKSEER_JS_PATH);
        const win = window as EffekseerGlobalWindow;
        const api = win.effekseer;
        if (!api) {
          throw new Error('Effekseer global missing after script load');
        }
        await initRuntime(api, EFFEKSEER_WASM_PATH);
        return api;
      })().catch((err: unknown) => {
        this.apiPromise = null;
        throw err;
      });
    }
    return this.apiPromise;
  }
}

class LiveEffekseerEffectInstance implements EffekseerEffectInstance {
  private disposed = false;
  private playheadMs = 0;
  private handle: EffekseerHandleLike | null = null;
  private effectReady = false;

  constructor(
    private readonly context: EffekseerContextLike,
    private readonly effect: EffekseerEffectLike,
  ) {}

  /** Called when Effekseer finishes loading textures/resources. */
  markEffectReady(): void {
    if (this.disposed || this.effectReady) return;
    this.effectReady = true;
    this.restartHandleAt(this.playheadMs);
  }

  get isLive(): boolean {
    return !this.disposed && this.effectReady && this.handle !== null;
  }

  setPlayheadMs(ms: number): void {
    if (this.disposed) return;
    this.playheadMs = Math.max(0, ms);
    if (this.effectReady) {
      this.restartHandleAt(this.playheadMs);
    }
  }

  renderFrame(deltaMs: number): void {
    if (this.disposed || !this.handle) return;
    this.handle.setPaused(false);
    const frames = Math.max(0, deltaMs) / (1000 / 60);
    this.context.update(frames > 0 ? frames : 1 / 60);
    this.context.draw();
    this.playheadMs += Math.max(0, deltaMs);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    if (this.handle) {
      this.handle.stop();
      this.handle = null;
    }
    try {
      this.context.releaseEffect(this.effect);
    } catch {
      // ignore double-release
    }
  }

  private restartHandleAt(ms: number): void {
    if (this.handle) {
      this.handle.stop();
      this.handle = null;
    }
    try {
      this.handle = this.context.play(this.effect, 0, 0, 0);
      this.handle.setPaused(true);
      const frames = ms / (1000 / 60);
      if (frames > 0) {
        this.context.update(frames);
      }
    } catch {
      this.handle = null;
    }
  }
}

/**
 * Production adapter: warms WASM, probes `.efkefc`, creates live instances.
 * Injectable loader for unit tests without GPU/WASM.
 */
export class WasmEffekseerAdapter implements EffekseerAdapter {
  private readonly cache = new Map<string, EffekseerLoadState>();
  private readonly loader: EffekseerRuntimeLoader;
  private readonly contexts = new WeakMap<WebGLRenderingContext, EffekseerContextLike>();
  private api: EffekseerApi | null = null;

  constructor(loader: EffekseerRuntimeLoader = new BrowserEffekseerRuntimeLoader()) {
    this.loader = loader;
  }

  async loadEffect(path: string): Promise<EffekseerLoadState> {
    const cached = this.cache.get(path);
    if (cached && cached !== 'loading') return cached;

    this.cache.set(path, 'loading');
    try {
      const res = await fetch(path);
      if (!res.ok) {
        this.cache.set(path, 'missing');
        return 'missing';
      }
      const buffer = await res.arrayBuffer();
      if (buffer.byteLength < 4) {
        this.cache.set(path, 'error');
        return 'error';
      }
      const magic = new Uint8Array(buffer, 0, 4);
      const isEfke =
        magic[0] === 0x45 &&
        magic[1] === 0x46 &&
        magic[2] === 0x4b &&
        magic[3] === 0x45;
      if (!isEfke) {
        this.cache.set(path, 'error');
        return 'error';
      }

      try {
        this.api = await this.loader.loadApi();
      } catch {
        this.cache.set(path, 'error');
        return 'error';
      }

      this.cache.set(path, 'ready');
      return 'ready';
    } catch {
      this.cache.set(path, 'error');
      return 'error';
    }
  }

  createEffect(
    path: string,
    gl: WebGLRenderingContext,
  ): EffekseerEffectInstance | null {
    if (this.cache.get(path) !== 'ready' || !this.api) {
      return null;
    }

    let context = this.contexts.get(gl);
    if (!context) {
      try {
        context = this.api.createContext();
        context.init(gl, { enableExtensionsByDefault: true });
        this.contexts.set(gl, context);
      } catch {
        return null;
      }
    }

    let onLoad: (() => void) | null = null;
    let effect: EffekseerEffectLike;
    try {
      effect = context.loadEffect(
        path,
        1.0,
        () => {
          onLoad?.();
        },
        undefined,
        (resourcePath) => resolveEffectResourceUrl(path, resourcePath),
      );
    } catch {
      return null;
    }

    const instance = new LiveEffekseerEffectInstance(context, effect);
    onLoad = () => instance.markEffectReady();

    // Mock runtimes (and already-cached resources) may be playable immediately.
    try {
      const probe = context.play(effect, 0, 0, 0);
      probe.stop();
      instance.markEffectReady();
    } catch {
      // Real runtime: wait for async onload.
    }

    return instance;
  }
}

/** Resolve texture/model paths relative to the `.efkefc` URL directory. */
export function resolveEffectResourceUrl(effectPath: string, resourcePath: string): string {
  if (/^https?:\/\//i.test(resourcePath) || resourcePath.startsWith('/')) {
    return resourcePath;
  }
  const slash = effectPath.lastIndexOf('/');
  const base = slash >= 0 ? effectPath.slice(0, slash + 1) : '/';
  return `${base}${resourcePath}`;
}

let sharedAdapter: EffekseerAdapter | null = null;

export function getEffekseerAdapter(): EffekseerAdapter {
  if (!sharedAdapter) {
    sharedAdapter = new WasmEffekseerAdapter();
  }
  return sharedAdapter;
}

/** Test-only hook to inject a custom adapter. */
export function setEffekseerAdapterForTests(adapter: EffekseerAdapter | null): void {
  sharedAdapter = adapter;
}
