/**
 * Slot → required placeholder socket names (ADR §5).
 * Location: src/services/engineAssets/slotSockets.ts
 */
import type { FetzgeraetSlot } from '../../game/types/cards';
import type { EnginePartSocketName } from './types';

/**
 * Canonical socket set per Fetzgerät slot for placeholder GLBs + registry.
 * Optional ADR sockets are included so assemblers/VFX can find them later.
 */
export const SOCKETS_BY_SLOT: Record<
  FetzgeraetSlot,
  readonly EnginePartSocketName[]
> = {
  traeger: ['SOCKET_DRIVE', 'SOCKET_ATTACHMENT_FALLBACK', 'SOCKET_VFX_REAR'],
  antrieb: ['SOCKET_OUTPUT', 'SOCKET_VFX_CORE', 'SOCKET_EXHAUST'],
  aufsatz: ['SOCKET_ATTACK_ORIGIN', 'SOCKET_VFX_FRONT'],
};

/** Default EMPTY-node translations (world units) for box placeholders. */
export const SOCKET_TRANSLATIONS: Record<EnginePartSocketName, readonly [number, number, number]> =
  {
    SOCKET_DRIVE: [0, 0.2, 0],
    SOCKET_ATTACHMENT_FALLBACK: [0, 0.2, 0.15],
    SOCKET_VFX_REAR: [0, 0, -0.35],
    SOCKET_OUTPUT: [0, 0.3, 0],
    SOCKET_VFX_CORE: [0, 0, 0],
    SOCKET_EXHAUST: [0, -0.15, -0.2],
    SOCKET_ATTACK_ORIGIN: [0, 0.45, 0.1],
    SOCKET_VFX_FRONT: [0, 0.35, 0.25],
  };

/** Box half-extents per slot (distinct silhouette for MVP boxes). */
export const BOX_HALF_BY_SLOT: Record<FetzgeraetSlot, readonly [number, number, number]> = {
  traeger: [0.6, 0.15, 0.25],
  antrieb: [0.25, 0.25, 0.35],
  aufsatz: [0.2, 0.35, 0.2],
};
