/**
 * Prefer in-memory engine snapshot for board/card thumbs; PNG fallback otherwise.
 * Location: src/features/play/engine3d/rendering/resolveEnginePartThumb.ts
 * Issue #166 — cutover from registry previewUrl-only thumbs.
 */
import { createRenderKey } from '../../../../game/engine/engineRecipe';
import type { EngineRecipe } from '../../../../game/types/engineVisual';
import { recipeFromPartId } from '../../../../components/engine3d/recipeFromPart';
import {
  lookupEnginePartAsset,
} from '../../../../services/engineAssets/partRegistry';
import {
  resolveCardArtPath,
  resolveEnginePartArtPath,
} from '../../../../services/cardArt/manifest';
import { getEngineSnapshot } from './engine-snapshot-cache';
import { ENGINE_SNAPSHOT_PLACEHOLDER_DATA_URL } from './requestEngineSnapshot';

/** True when cached URL is the 1×1 CI stub (not usable as a thumb). */
export function isEngineSnapshotPlaceholder(dataUrl: string): boolean {
  return dataUrl === ENGINE_SNAPSHOT_PLACEHOLDER_DATA_URL;
}

/**
 * Look up a usable snapshot data URL for an engine part (or full recipe).
 * Does not write placeholders into the cache.
 */
export function lookupEngineSnapshotThumb(
  cardId: string,
  recipe?: EngineRecipe | null,
): string | null {
  if (!lookupEnginePartAsset(cardId)) return null;

  const candidates: EngineRecipe[] = [];
  if (recipe) candidates.push(recipe);
  const solo = recipeFromPartId(cardId);
  if (solo) candidates.push(solo);

  for (const candidate of candidates) {
    const hit = getEngineSnapshot(createRenderKey(candidate));
    if (!hit) continue;
    if (isEngineSnapshotPlaceholder(hit.dataUrl)) continue;
    return hit.dataUrl;
  }
  return null;
}

/**
 * Board thumb for a registered engine part: snapshot cache hit → data URL,
 * else registry / card-art PNG via `resolveEnginePartArtPath`.
 */
export function resolveEnginePartThumb(
  cardId: string,
  recipe?: EngineRecipe | null,
): string {
  const fromCache = lookupEngineSnapshotThumb(cardId, recipe);
  if (fromCache) return fromCache;
  return resolveEnginePartArtPath(cardId);
}

/**
 * Resolve art for any board card id — engine parts prefer snapshot cache.
 */
export function resolveBoardCardArtPath(
  cardId: string,
  recipe?: EngineRecipe | null,
): string {
  if (lookupEnginePartAsset(cardId)) {
    return resolveEnginePartThumb(cardId, recipe);
  }
  return resolveCardArtPath(cardId);
}
