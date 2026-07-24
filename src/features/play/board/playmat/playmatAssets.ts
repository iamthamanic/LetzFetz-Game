/**
 * Playmat background asset manifest — top-down PNG paths and card-art fallbacks.
 * Location: src/features/play/board/playmat/playmatAssets.ts
 *
 * Asset pipeline: see docs/PLAYMAT_ASSETS.md
 */
import { BASE_PACK } from '../../../../game';

/** Base-pack arena ids that participate in playmat resolution. */
export const BASE_PACK_PLAYMAT_ARENA_IDS = BASE_PACK.arenas.map((a) => a.id);

export type PlaymatBackgroundSource = 'topdown' | 'fallback';

export type ResolvedPlaymatBackground = {
  arenaId: string;
  /** Preferred top-down playmat PNG (may 404 until authored). */
  topdown: string;
  /** Portrait arena card art used when top-down is missing or fails to load. */
  fallback: string;
  /** Primary URL to try first — topdown only when shipped in repo. */
  primary: string;
  /** Whether dedicated top-down art is committed under public/textures/playmat/. */
  hasShippedTopdown: boolean;
};

/** Arenas with a committed `arena-{id}-topdown.png` in the repo. */
export const SHIPPED_TOPDOWN_ARENA_IDS = new Set<string>(['arena-spaeti']);

export function playmatTopdownPath(arenaId: string): string {
  return `/textures/playmat/${arenaId}-topdown.png`;
}

export function playmatCardArtFallbackPath(arenaId: string): string {
  return `/cards/arena/${arenaId}.png`;
}

export function resolvePlaymatBackground(arenaId: string): ResolvedPlaymatBackground {
  const hasShippedTopdown = SHIPPED_TOPDOWN_ARENA_IDS.has(arenaId);
  const topdown = playmatTopdownPath(arenaId);
  const fallback = playmatCardArtFallbackPath(arenaId);

  return {
    arenaId,
    topdown,
    fallback,
    primary: hasShippedTopdown ? topdown : fallback,
    hasShippedTopdown,
  };
}

export function listBasePackPlaymatArenaIds(): string[] {
  return [...BASE_PACK_PLAYMAT_ARENA_IDS];
}
