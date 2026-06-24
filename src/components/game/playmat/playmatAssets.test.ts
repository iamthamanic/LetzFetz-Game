import { describe, expect, it } from 'vitest';
import { BASE_PACK } from '../../../game';
import {
  BASE_PACK_PLAYMAT_ARENA_IDS,
  listBasePackPlaymatArenaIds,
  playmatCardArtFallbackPath,
  playmatTopdownPath,
  resolvePlaymatBackground,
  SHIPPED_TOPDOWN_ARENA_IDS,
} from './playmatAssets';

describe('playmatAssets', () => {
  it('covers all six base-pack arenas', () => {
    expect(BASE_PACK_PLAYMAT_ARENA_IDS).toHaveLength(6);
    expect(listBasePackPlaymatArenaIds()).toEqual(BASE_PACK.arenas.map((a) => a.id));
  });

  it('resolves topdown and fallback paths per arena id', () => {
    for (const arena of BASE_PACK.arenas) {
      expect(playmatTopdownPath(arena.id)).toBe(
        `/textures/playmat/${arena.id}-topdown.png`,
      );
      expect(playmatCardArtFallbackPath(arena.id)).toBe(
        `/cards/arena/${arena.id}.png`,
      );
    }
  });

  it('uses shipped topdown for Späti and card-art primary for others', () => {
    const spaeti = resolvePlaymatBackground('arena-spaeti');
    expect(spaeti.hasShippedTopdown).toBe(true);
    expect(spaeti.primary).toBe('/textures/playmat/arena-spaeti-topdown.png');
    expect(spaeti.fallback).toBe('/cards/arena/arena-spaeti.png');

    const kristall = resolvePlaymatBackground('arena-kristall');
    expect(kristall.hasShippedTopdown).toBe(false);
    expect(kristall.primary).toBe('/cards/arena/arena-kristall.png');
    expect(SHIPPED_TOPDOWN_ARENA_IDS.has('arena-spaeti')).toBe(true);
  });
});
