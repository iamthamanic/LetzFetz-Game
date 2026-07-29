/**
 * Maps V3 Fetzgerät part defIds to placeholder GLB URLs + socket metadata.
 * Location: src/services/engineAssets/partRegistry.ts
 *
 * Derived from `V3_ENGINE_PARTS_36` + `SOCKETS_BY_SLOT` — no parallel ID list.
 * No Three.js — lookup only. Assembler consumes these entries.
 */
import { V3_ENGINE_PARTS_36 } from '../../game/packs/v3/engineParts36';
import { SOCKETS_BY_SLOT } from './slotSockets';
import type { EnginePartAssetEntry, EnginePartSocketName } from './types';

export type { EnginePartAssetEntry, EnginePartSocketName };
export { SOCKETS_BY_SLOT } from './slotSockets';

/** Public root for modular engine GLBs (Vite `public/`). */
export const ENGINE_PARTS_PUBLIC_ROOT = '/engine-parts';

/** Card-art fallback convention until GLB previews exist. */
export const ENGINE_CARD_ART_PUBLIC_ROOT = '/cards/engine';

/** Bumped when pilot / batch meshes change enough to invalidate lookups. */
const ASSET_VERSION = 5;

function buildRegistry(): ReadonlyMap<string, EnginePartAssetEntry> {
  const entries: Array<[string, EnginePartAssetEntry]> = V3_ENGINE_PARTS_36.map(
    (part) => {
      const entry: EnginePartAssetEntry = {
        id: part.id,
        modelUrl: `${ENGINE_PARTS_PUBLIC_ROOT}/mvp/${part.id}.glb`,
        previewUrl: `${ENGINE_CARD_ART_PUBLIC_ROOT}/${part.id}.png`,
        slot: part.slot,
        sockets: SOCKETS_BY_SLOT[part.slot],
        version: ASSET_VERSION,
      };
      return [part.id, entry];
    },
  );
  return new Map(entries);
}

/** All 36 V3 part assets (order matches `V3_ENGINE_PARTS_36`). */
const REGISTRY: ReadonlyMap<string, EnginePartAssetEntry> = buildRegistry();

/** All registered part assets (stable catalog order). */
export function listEnginePartAssets(): readonly EnginePartAssetEntry[] {
  return [...REGISTRY.values()];
}

/**
 * Resolve a pack part defId to its 3D asset entry.
 * Unknown id → `null` (caller may log / show German fallback).
 */
export function lookupEnginePartAsset(id: string): EnginePartAssetEntry | null {
  return REGISTRY.get(id) ?? null;
}
