/**
 * Shared types for Fetzgerät 3D part asset registry.
 * Location: src/services/engineAssets/types.ts
 */
import type { FetzgeraetSlot } from '../../game/types/cards';

/** Named EMPTY nodes inside GLB — authoritative for assembler (ADR §5). */
export type EnginePartSocketName =
  | 'SOCKET_DRIVE'
  | 'SOCKET_ATTACHMENT_FALLBACK'
  | 'SOCKET_VFX_REAR'
  | 'SOCKET_OUTPUT'
  | 'SOCKET_VFX_CORE'
  | 'SOCKET_EXHAUST'
  | 'SOCKET_ATTACK_ORIGIN'
  | 'SOCKET_VFX_FRONT';

/** Registry row: V3 part defId → model + preview + socket metadata. */
export interface EnginePartAssetEntry {
  /** Pack / content def id (e.g. v3-part-water-traeger-01). */
  id: string;
  /** Public URL to GLB under /engine-parts/. */
  modelUrl: string;
  /** Static preview (legacy PNG path until GLB snapshot exists). */
  previewUrl: string;
  slot: FetzgeraetSlot;
  sockets: readonly EnginePartSocketName[];
  /** Bump when GLB or socket layout changes (cache invalidation). */
  version: number;
}
