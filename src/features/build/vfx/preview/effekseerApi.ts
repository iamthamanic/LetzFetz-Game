/**
 * Minimal Effekseer runtime surface used by the VFX adapter.
 * Location: src/features/build/vfx/preview/effekseerApi.ts
 *
 * Loaded as a classic script from `public/vfx/effekseer/` (vendored from
 * `@zaniar/effekseer-webgl-wasm`). UI must not import Effekseer elsewhere.
 */

export interface EffekseerHandleLike {
  stop(): void;
  setPaused(paused: boolean): void;
  setShown(shown: boolean): void;
  setSpeed(speed: number): void;
  readonly exists: boolean;
}

export interface EffekseerEffectLike {
  // Opaque loaded effect resource.
}

export interface EffekseerContextLike {
  init(webglContext: WebGLRenderingContext, settings?: object): void;
  update(deltaFrames?: number): void;
  draw(): void;
  setProjectionMatrix(matrixArray: Float32Array): void;
  setCameraMatrix(matrixArray: Float32Array): void;
  loadEffect(
    path: string,
    scale?: number,
    onload?: () => void,
    onerror?: (reason: string, path: string) => void,
    redirect?: (path: string) => string,
  ): EffekseerEffectLike;
  releaseEffect(effect: EffekseerEffectLike): void;
  play(effect: EffekseerEffectLike, x: number, y: number, z: number): EffekseerHandleLike;
  stopAll(): void;
}

export interface EffekseerApi {
  initRuntime(path: string, onload: () => void, onerror: () => void): void;
  createContext(): EffekseerContextLike;
  releaseContext(context: EffekseerContextLike): void;
}

export type EffekseerGlobalWindow = Window & {
  effekseer?: EffekseerApi;
};

/** Classic-script entry (copied from npm package into public/). */
export const EFFEKSEER_JS_PATH = '/vfx/effekseer/effekseer.min.js';
/** WASM binary for initRuntime. */
export const EFFEKSEER_WASM_PATH = '/vfx/effekseer/effekseer.wasm';
