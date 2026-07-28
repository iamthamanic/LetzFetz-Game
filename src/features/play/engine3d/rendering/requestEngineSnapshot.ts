/**
 * Best-effort engine snapshot request (cache + optional canvas / placeholder stub).
 * Location: src/features/play/engine3d/rendering/requestEngineSnapshot.ts
 *
 * WebGL capture is hard in CI — without a canvas, stores a 1×1 PNG placeholder
 * (or returns null when allowPlaceholder is false). Live toDataURL when canvas given.
 */
import type { EngineRecipe } from '../../../../game/types/engineVisual';
import { createRenderKey } from '../../../../game/engine/engineRecipe';
import {
  getEngineSnapshot,
  setEngineSnapshot,
} from './engine-snapshot-cache';

/** 1×1 transparent PNG — stub when headless / no canvas. */
export const ENGINE_SNAPSHOT_PLACEHOLDER_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

export type EngineSnapshotSource = 'cache' | 'canvas' | 'placeholder' | 'miss';

export interface RequestEngineSnapshotOptions {
  /** If provided, attempt HTMLCanvasElement.toDataURL (best-effort). */
  canvas?: HTMLCanvasElement | null;
  /**
   * When no canvas capture succeeds, store/return placeholder data URL.
   * Default true (CI-friendly stub). Set false to skip caching and return null.
   */
  allowPlaceholder?: boolean;
  /** MIME for toDataURL; default image/png. */
  mimeType?: string;
}

export interface EngineSnapshotResult {
  renderKey: string;
  dataUrl: string | null;
  source: EngineSnapshotSource;
}

function tryCanvasDataUrl(
  canvas: HTMLCanvasElement,
  mimeType: string,
): string | null {
  try {
    const url = canvas.toDataURL(mimeType);
    if (typeof url === 'string' && url.startsWith('data:')) return url;
    return null;
  } catch {
    return null;
  }
}

/**
 * Resolve a snapshot for `recipe`:
 * 1. Cache hit by createRenderKey
 * 2. Optional canvas toDataURL → cache
 * 3. Placeholder stub (default) → cache
 * 4. Or miss (null, not cached) when allowPlaceholder=false
 */
export function requestEngineSnapshot(
  recipe: EngineRecipe,
  options: RequestEngineSnapshotOptions = {},
): EngineSnapshotResult {
  const renderKey = createRenderKey(recipe);
  const cached = getEngineSnapshot(renderKey);
  if (cached) {
    return { renderKey, dataUrl: cached.dataUrl, source: 'cache' };
  }

  const mimeType = options.mimeType ?? 'image/png';
  if (options.canvas) {
    const fromCanvas = tryCanvasDataUrl(options.canvas, mimeType);
    if (fromCanvas) {
      setEngineSnapshot(renderKey, fromCanvas);
      return { renderKey, dataUrl: fromCanvas, source: 'canvas' };
    }
  }

  const allowPlaceholder = options.allowPlaceholder !== false;
  if (allowPlaceholder) {
    setEngineSnapshot(renderKey, ENGINE_SNAPSHOT_PLACEHOLDER_DATA_URL);
    return {
      renderKey,
      dataUrl: ENGINE_SNAPSHOT_PLACEHOLDER_DATA_URL,
      source: 'placeholder',
    };
  }

  return { renderKey, dataUrl: null, source: 'miss' };
}
