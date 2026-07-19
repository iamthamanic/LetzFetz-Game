/**
 * Per-arena playmat design specs and layout registry.
 * Location: src/components/game/playmat/arenaPlaymatLayouts.ts
 */
import {
  resolvePlaymatLayout,
  type PlaymatDesignSpec,
  type PlaymatTheme,
  type ResolvedPlaymatLayout,
} from './playmatLayout';
import {
  listBasePackPlaymatArenaIds,
  playmatCardArtFallbackPath,
  playmatTopdownPath,
  SHIPPED_TOPDOWN_ARENA_IDS,
} from './playmatAssets';

const DEFAULT_THEME: PlaymatTheme = {
  opponentStroke: '#f87171',
  opponentFill: '#7f1d1d',
  playerStroke: '#34d399',
  playerFill: '#064e3b',
  combatStroke: '#fbbf24',
  combatFill: '#fbbf24',
  handStroke: '#a855f7',
  handFill: '#a855f7',
  deckStroke: '#a78bfa',
  deckFill: '#a78bfa',
  neutralStroke: '#94a3b8',
  neutralFill: '#94a3b8',
};

const ENGINE_OPPONENT = [
  { x: 520, y: 120, width: 170, height: 230 },
  { x: 710, y: 120, width: 170, height: 230 },
  { x: 1040, y: 120, width: 170, height: 230 },
  { x: 1230, y: 120, width: 170, height: 230 },
] as const;

const ENGINE_PLAYER = [
  { x: 520, y: 620, width: 170, height: 230 },
  { x: 710, y: 620, width: 170, height: 230 },
  { x: 1040, y: 620, width: 170, height: 230 },
  { x: 1230, y: 620, width: 170, height: 230 },
] as const;

const SHARED_LAYOUT = {
  designViewBox: { width: 1920, height: 1080 },
  bgSize: { width: 1448, height: 1086 },
  zones: [
    { id: 'opponent-character' as const, label: 'Gegner', x: 1628, y: 48, width: 220, height: 300 },
    { id: 'deck' as const, label: 'Nachziehstapel', x: 48, y: 300, width: 140, height: 200 },
    // Directly under the draw pile (left column).
    { id: 'discard' as const, label: 'Ablage', x: 48, y: 520, width: 140, height: 220 },
    { id: 'combat' as const, label: 'Kampf', x: 760, y: 380, width: 400, height: 280 },
    { id: 'player-character' as const, label: 'Du', x: 72, y: 720, width: 220, height: 300 },
  ],
  engineSlots: {
    opponent: [...ENGINE_OPPONENT],
    player: [...ENGINE_PLAYER],
  },
  handPathDesign:
    'M 340 1000 Q 1020 910 1640 1000 L 1640 1060 L 340 1060 Z',
  opponentEngineLabel: { x: 960, y: 108 },
  playerEngineLabel: { x: 960, y: 608 },
  handLabel: { x: 960, y: 1030 },
};

const ARENA_THEME_OVERRIDES: Record<string, Partial<PlaymatTheme>> = {
  'arena-spaeti': {
    handStroke: '#e879f9',
    handFill: '#86198f',
    deckStroke: '#c084fc',
    deckFill: '#6b21a8',
  },
  'arena-kristall': {
    combatStroke: '#fcd34d',
    combatFill: '#78350f',
    deckStroke: '#fbbf24',
    deckFill: '#92400e',
    handStroke: '#fde68a',
    handFill: '#451a03',
  },
  'arena-vulkan': {
    combatStroke: '#fca5a5',
    combatFill: '#991b1b',
    deckStroke: '#f87171',
    deckFill: '#7f1d1d',
    opponentStroke: '#fb7185',
    opponentFill: '#881337',
  },
  'arena-sumpf': {
    combatStroke: '#67e8f9',
    combatFill: '#155e75',
    deckStroke: '#22d3ee',
    deckFill: '#164e63',
    playerStroke: '#2dd4bf',
    playerFill: '#134e4a',
  },
  'arena-club': {
    handStroke: '#38bdf8',
    handFill: '#0c4a6e',
    deckStroke: '#60a5fa',
    deckFill: '#1e3a8a',
    combatStroke: '#7dd3fc',
    combatFill: '#0c4a6e',
  },
  'arena-schattenbasar': {
    handStroke: '#c084fc',
    handFill: '#581c87',
    deckStroke: '#a855f7',
    deckFill: '#4c1d95',
    neutralStroke: '#a78bfa',
    neutralFill: '#4c1d95',
  },
};

function createArenaPlaymatSpec(arenaId: string): PlaymatDesignSpec {
  const themeOverride = ARENA_THEME_OVERRIDES[arenaId] ?? {};
  const hasTopdown = SHIPPED_TOPDOWN_ARENA_IDS.has(arenaId);

  return {
    arenaId,
    ...SHARED_LAYOUT,
    theme: { ...DEFAULT_THEME, ...themeOverride },
    assets: {
      ...(hasTopdown
        ? {
            topdown: playmatTopdownPath(arenaId),
            zonesSvg: '/textures/playmat/arena-spaeti-topdown-zones.svg',
          }
        : {}),
      fallback: playmatCardArtFallbackPath(arenaId),
    },
  };
}

/** Späti — reference top-down playmat (design 1920×1080, asset 1448×1086). */
export const SPAETI_PLAYMAT_SPEC = createArenaPlaymatSpec('arena-spaeti');

/** Shared layout for unknown arenas — uses Späti coords + card-art fallback. */
export const DEFAULT_PLAYMAT_SPEC: PlaymatDesignSpec = {
  ...createArenaPlaymatSpec('arena-spaeti'),
  arenaId: 'default',
  assets: {
    fallback: playmatCardArtFallbackPath('arena-spaeti'),
  },
};

const LAYOUT_BY_ARENA: Record<string, PlaymatDesignSpec> = Object.fromEntries(
  listBasePackPlaymatArenaIds().map((arenaId) => [arenaId, createArenaPlaymatSpec(arenaId)]),
);

export function getPlaymatLayoutForArena(arenaId: string): ResolvedPlaymatLayout {
  const spec = LAYOUT_BY_ARENA[arenaId] ?? { ...DEFAULT_PLAYMAT_SPEC, arenaId };
  return resolvePlaymatLayout(spec);
}

export function listPlaymatArenaIds(): string[] {
  return listBasePackPlaymatArenaIds();
}
