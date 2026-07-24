/**
 * Arena-agnostic playmat zone layout — design coords scaled to background asset size.
 * Location: src/features/play/board/playmat/playmatLayout.ts
 */
import type { CSSProperties } from 'react';
export type PlaymatZoneId =
  | 'opponent-character'
  | 'opponent-engine'
  | 'deck'
  | 'discard'
  | 'combat'
  | 'player-engine'
  | 'player-character'
  | 'player-hand';

export type PlaymatSize = { width: number; height: number };

export type PlaymatRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PlaymatZoneRect = PlaymatRect & {
  id: PlaymatZoneId;
  label: string;
};

export type PlaymatEngineSlots = {
  opponent: PlaymatRect[];
  player: PlaymatRect[];
};

/** Optional per-arena tint tokens (CSS custom properties on overlay root). */
export type PlaymatTheme = {
  opponentStroke: string;
  opponentFill: string;
  playerStroke: string;
  playerFill: string;
  combatStroke: string;
  combatFill: string;
  handStroke: string;
  handFill: string;
  deckStroke: string;
  deckFill: string;
  neutralStroke: string;
  neutralFill: string;
};

export type PlaymatDesignSpec = {
  arenaId: string;
  designViewBox: PlaymatSize;
  bgSize: PlaymatSize;
  zones: Array<{ id: PlaymatZoneId; label: string } & PlaymatRect>;
  engineSlots: {
    opponent: PlaymatRect[];
    player: PlaymatRect[];
  };
  /** SVG path in design coordinates (M/Q/L …). */
  handPathDesign: string;
  opponentEngineLabel: { x: number; y: number };
  playerEngineLabel: { x: number; y: number };
  handLabel: { x: number; y: number };
  theme: PlaymatTheme;
  assets: {
    topdown?: string;
    zonesSvg?: string;
    fallback: string;
  };
};

export type ResolvedPlaymatLayout = {
  arenaId: string;
  viewBox: PlaymatSize;
  designViewBox: PlaymatSize;
  center: { x: number; y: number };
  zones: PlaymatZoneRect[];
  engineSlots: PlaymatEngineSlots;
  handPath: string;
  opponentEngineLabel: { x: number; y: number };
  playerEngineLabel: { x: number; y: number };
  handLabel: { x: number; y: number };
  theme: PlaymatTheme;
  assets: PlaymatDesignSpec['assets'];
};

export function scalePlaymatRect(
  designViewBox: PlaymatSize,
  bgSize: PlaymatSize,
  rect: PlaymatRect,
): PlaymatRect {
  const sx = bgSize.width / designViewBox.width;
  const sy = bgSize.height / designViewBox.height;
  return {
    x: Math.round(rect.x * sx),
    y: Math.round(rect.y * sy),
    width: Math.round(rect.width * sx),
    height: Math.round(rect.height * sy),
  };
}

export function scalePlaymatPoint(
  designViewBox: PlaymatSize,
  bgSize: PlaymatSize,
  point: { x: number; y: number },
): { x: number; y: number } {
  const sx = bgSize.width / designViewBox.width;
  const sy = bgSize.height / designViewBox.height;
  return { x: Math.round(point.x * sx), y: Math.round(point.y * sy) };
}

/** Scale hand-path coordinates embedded in an SVG path string. */
export function scalePlaymatHandPath(
  designViewBox: PlaymatSize,
  bgSize: PlaymatSize,
  pathDesign: string,
): string {
  const sx = bgSize.width / designViewBox.width;
  const sy = bgSize.height / designViewBox.height;
  return pathDesign.replace(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g, (_, xs, ys) => {
    const x = Math.round(Number(xs) * sx);
    const y = Math.round(Number(ys) * sy);
    return `${x} ${y}`;
  });
}

export function resolvePlaymatLayout(spec: PlaymatDesignSpec): ResolvedPlaymatLayout {
  const { designViewBox, bgSize } = spec;
  const scale = (rect: PlaymatRect) => scalePlaymatRect(designViewBox, bgSize, rect);
  const scalePt = (pt: { x: number; y: number }) =>
    scalePlaymatPoint(designViewBox, bgSize, pt);

  return {
    arenaId: spec.arenaId,
    viewBox: bgSize,
    designViewBox,
    center: scalePt({ x: designViewBox.width / 2, y: designViewBox.height / 2 }),
    zones: spec.zones.map((z) => ({
      id: z.id,
      label: z.label,
      ...scale(z),
    })),
    engineSlots: {
      opponent: spec.engineSlots.opponent.map(scale),
      player: spec.engineSlots.player.map(scale),
    },
    handPath: scalePlaymatHandPath(designViewBox, bgSize, spec.handPathDesign),
    opponentEngineLabel: scalePt(spec.opponentEngineLabel),
    playerEngineLabel: scalePt(spec.playerEngineLabel),
    handLabel: scalePt(spec.handLabel),
    theme: spec.theme,
    assets: spec.assets,
  };
}

export function playmatThemeStyle(theme: PlaymatTheme): CSSProperties {
  return {
    '--playmat-opponent-stroke': theme.opponentStroke,
    '--playmat-opponent-fill': theme.opponentFill,
    '--playmat-player-stroke': theme.playerStroke,
    '--playmat-player-fill': theme.playerFill,
    '--playmat-combat-stroke': theme.combatStroke,
    '--playmat-combat-fill': theme.combatFill,
    '--playmat-hand-stroke': theme.handStroke,
    '--playmat-hand-fill': theme.handFill,
    '--playmat-deck-stroke': theme.deckStroke,
    '--playmat-deck-fill': theme.deckFill,
    '--playmat-neutral-stroke': theme.neutralStroke,
    '--playmat-neutral-fill': theme.neutralFill,
  } as CSSProperties;
}

/** Absolute positioning helper — maps scaled zone rect to % of playmat viewBox. */
export function playmatZonePercentStyle(
  rect: PlaymatRect,
  viewBox: PlaymatSize,
): CSSProperties {
  return {
    position: 'absolute',
    left: `${(rect.x / viewBox.width) * 100}%`,
    top: `${(rect.y / viewBox.height) * 100}%`,
    width: `${(rect.width / viewBox.width) * 100}%`,
    height: `${(rect.height / viewBox.height) * 100}%`,
  };
}
