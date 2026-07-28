/**
 * Maps V3 Fetzgerät part defIds to placeholder GLB URLs + socket metadata.
 * Location: src/services/engineAssets/partRegistry.ts
 *
 * No Three.js — lookup only. Assembler (#133) consumes these entries.
 */
import type { EnginePartAssetEntry, EnginePartSocketName } from './types';

export type { EnginePartAssetEntry, EnginePartSocketName };

/** Public root for modular engine GLBs (Vite `public/`). */
export const ENGINE_PARTS_PUBLIC_ROOT = '/engine-parts';

/** Card-art fallback convention until GLB previews exist. */
export const ENGINE_CARD_ART_PUBLIC_ROOT = '/cards/engine';

const MVP_ASSET_VERSION = 1;

/**
 * MVP×3 — ADR-suggested IDs (engineParts36 not yet authored; keep stable for #133).
 * Wasser Träger / Schatten Antrieb / Licht Aufsatz.
 */
const REGISTRY: ReadonlyMap<string, EnginePartAssetEntry> = new Map([
  [
    'v3-part-water-traeger-01',
    {
      id: 'v3-part-water-traeger-01',
      modelUrl: `${ENGINE_PARTS_PUBLIC_ROOT}/mvp/v3-part-water-traeger-01.glb`,
      previewUrl: `${ENGINE_CARD_ART_PUBLIC_ROOT}/v3-part-water-traeger-01.png`,
      slot: 'traeger',
      sockets: ['SOCKET_DRIVE', 'SOCKET_VFX_REAR'] as const satisfies readonly EnginePartSocketName[],
      version: MVP_ASSET_VERSION,
    },
  ],
  [
    'v3-part-shadow-antrieb-01',
    {
      id: 'v3-part-shadow-antrieb-01',
      modelUrl: `${ENGINE_PARTS_PUBLIC_ROOT}/mvp/v3-part-shadow-antrieb-01.glb`,
      previewUrl: `${ENGINE_CARD_ART_PUBLIC_ROOT}/v3-part-shadow-antrieb-01.png`,
      slot: 'antrieb',
      sockets: ['SOCKET_OUTPUT', 'SOCKET_VFX_CORE'] as const satisfies readonly EnginePartSocketName[],
      version: MVP_ASSET_VERSION,
    },
  ],
  [
    'v3-part-light-aufsatz-01',
    {
      id: 'v3-part-light-aufsatz-01',
      modelUrl: `${ENGINE_PARTS_PUBLIC_ROOT}/mvp/v3-part-light-aufsatz-01.glb`,
      previewUrl: `${ENGINE_CARD_ART_PUBLIC_ROOT}/v3-part-light-aufsatz-01.png`,
      slot: 'aufsatz',
      sockets: ['SOCKET_ATTACK_ORIGIN'] as const satisfies readonly EnginePartSocketName[],
      version: MVP_ASSET_VERSION,
    },
  ],
]);

/** All registered MVP part assets (stable order). */
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
