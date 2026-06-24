/**
 * Per-arena playmat design specs and layout registry.
 * Location: src/components/game/playmat/arenaPlaymatLayouts.ts
 */
import {
  resolvePlaymatLayout,
  type PlaymatDesignSpec,
  type ResolvedPlaymatLayout,
} from './playmatLayout';

const DEFAULT_THEME = {
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
} as const;

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

/** Späti — reference top-down playmat (design 1920×1080, asset 1448×1086). */
export const SPAETI_PLAYMAT_SPEC: PlaymatDesignSpec = {
  arenaId: 'arena-spaeti',
  designViewBox: { width: 1920, height: 1080 },
  bgSize: { width: 1448, height: 1086 },
  zones: [
    { id: 'opponent-character', label: 'Gegner', x: 1628, y: 48, width: 220, height: 300 },
    { id: 'deck', label: 'Nachziehstapel', x: 48, y: 420, width: 120, height: 168 },
    { id: 'discard', label: 'Ablage', x: 1752, y: 420, width: 120, height: 168 },
    { id: 'combat', label: 'Kampf', x: 760, y: 380, width: 400, height: 280 },
    { id: 'player-character', label: 'Du', x: 72, y: 720, width: 220, height: 300 },
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
  theme: { ...DEFAULT_THEME },
  assets: {
    topdown: '/textures/playmat/arena-spaeti-topdown.png',
    zonesSvg: '/textures/playmat/arena-spaeti-topdown-zones.svg',
    fallback: '/cards/arena/arena-spaeti.png',
  },
};

/** Shared layout for arenas without bespoke top-down art yet — uses design coords only. */
export const DEFAULT_PLAYMAT_SPEC: PlaymatDesignSpec = {
  ...SPAETI_PLAYMAT_SPEC,
  arenaId: 'default',
  assets: {
    fallback: '/cards/arena/arena-spaeti.png',
  },
};

const LAYOUT_BY_ARENA: Record<string, PlaymatDesignSpec> = {
  'arena-spaeti': SPAETI_PLAYMAT_SPEC,
};

export function getPlaymatLayoutForArena(arenaId: string): ResolvedPlaymatLayout {
  const spec = LAYOUT_BY_ARENA[arenaId] ?? { ...DEFAULT_PLAYMAT_SPEC, arenaId };
  return resolvePlaymatLayout(spec);
}

export function listPlaymatArenaIds(): string[] {
  return Object.keys(LAYOUT_BY_ARENA);
}
