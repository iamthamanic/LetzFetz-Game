/**
 * Generic playmat zone overlay — arena layout via CSS theme vars.
 * Location: src/features/play/board/playmat/PlaymatZoneOverlay.tsx
 */
import React from 'react';
import type { PlaymatZoneRect, ResolvedPlaymatLayout } from './playmatLayout';
import { playmatThemeStyle } from './playmatLayout';

const LABEL_STYLE = {
  fontFamily: 'system-ui, sans-serif',
  fontWeight: 700,
  letterSpacing: '0.1em',
} as const;

function zoneStroke(zone: PlaymatZoneRect): string {
  if (zone.id === 'opponent-character') return 'var(--playmat-opponent-stroke)';
  if (zone.id === 'player-character') return 'var(--playmat-player-stroke)';
  if (zone.id === 'deck') return 'var(--playmat-deck-stroke)';
  return 'var(--playmat-neutral-stroke)';
}

function zoneFill(zone: PlaymatZoneRect): string {
  if (zone.id === 'opponent-character') return 'var(--playmat-opponent-fill)';
  if (zone.id === 'player-character') return 'var(--playmat-player-fill)';
  if (zone.id === 'deck') return 'var(--playmat-deck-fill)';
  return 'var(--playmat-neutral-fill)';
}

function CharacterZone({ zone }: { zone: PlaymatZoneRect }) {
  const stroke = zoneStroke(zone);
  const fill = zoneFill(zone);

  return (
    <g data-zone={zone.id}>
      <rect
        x={zone.x}
        y={zone.y}
        width={zone.width}
        height={zone.height}
        rx={12}
        stroke={stroke}
        strokeWidth={4}
        strokeDasharray="10 6"
        fill={fill}
        fillOpacity={0.35}
      />
      <text
        x={zone.x + zone.width / 2}
        y={zone.y - 10}
        textAnchor="middle"
        fill={stroke}
        fontSize={18}
        {...LABEL_STYLE}
      >
        {zone.label.toUpperCase()}
      </text>
    </g>
  );
}

function PileZone({ zone }: { zone: PlaymatZoneRect }) {
  const stroke = zoneStroke(zone);
  const fill = zoneFill(zone);

  return (
    <g data-zone={zone.id}>
      <rect
        x={zone.x}
        y={zone.y}
        width={zone.width}
        height={zone.height}
        rx={8}
        stroke={stroke}
        strokeWidth={4}
        fill={fill}
        fillOpacity={0.35}
      />
      <text
        x={zone.x + zone.width / 2}
        y={zone.y - 10}
        textAnchor="middle"
        fill={stroke}
        fontSize={12}
        {...LABEL_STYLE}
      >
        {zone.label.toUpperCase()}
      </text>
    </g>
  );
}

export function PlaymatZoneOverlay({
  layout,
  className,
}: {
  layout: ResolvedPlaymatLayout;
  className?: string;
}) {
  const combat = layout.zones.find((z) => z.id === 'combat');
  const opponentChar = layout.zones.find((z) => z.id === 'opponent-character');
  const playerChar = layout.zones.find((z) => z.id === 'player-character');
  const piles = layout.zones.filter((z) => z.id === 'deck' || z.id === 'discard');

  return (
    <svg
      className={className}
      style={playmatThemeStyle(layout.theme)}
      viewBox={`0 0 ${layout.viewBox.width} ${layout.viewBox.height}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden
    >
      {piles.map((zone) => (
        <PileZone key={zone.id} zone={zone} />
      ))}

      {combat && (
        <g data-zone="combat">
          <ellipse
            cx={combat.x + combat.width / 2}
            cy={combat.y + combat.height / 2}
            rx={combat.width / 2}
            ry={combat.height / 2}
            stroke="var(--playmat-combat-stroke)"
            strokeWidth={4}
            fill="var(--playmat-combat-fill)"
            fillOpacity={0.14}
          />
          <text
            x={combat.x + combat.width / 2}
            y={combat.y + combat.height / 2 + 6}
            textAnchor="middle"
            fill="#fef3c7"
            fontSize={16}
            {...LABEL_STYLE}
          >
            KAMPF
          </text>
        </g>
      )}

      <path
        data-zone="player-hand"
        d={layout.handPath}
        stroke="var(--playmat-hand-stroke)"
        strokeWidth={4}
        fill="var(--playmat-hand-fill)"
        fillOpacity={0.18}
      />
      <text
        x={layout.handLabel.x}
        y={layout.handLabel.y}
        textAnchor="middle"
        fill="#e9d5ff"
        fontSize={16}
        {...LABEL_STYLE}
      >
        HAND
      </text>

      <g data-zone="opponent-engine">
        {layout.engineSlots.opponent.map((slot, i) => (
          <rect
            key={`opp-${i}`}
            x={slot.x}
            y={slot.y}
            width={slot.width}
            height={slot.height}
            rx={8}
            stroke="var(--playmat-opponent-stroke)"
            strokeWidth={4}
            fill="var(--playmat-opponent-fill)"
            fillOpacity={0.22}
          />
        ))}
        <text
          x={layout.opponentEngineLabel.x}
          y={layout.opponentEngineLabel.y}
          textAnchor="middle"
          fill="#fca5a5"
          fontSize={14}
          {...LABEL_STYLE}
        >
          GEGNER-ENGINE
        </text>
      </g>

      <g data-zone="player-engine">
        {layout.engineSlots.player.map((slot, i) => (
          <rect
            key={`plr-${i}`}
            x={slot.x}
            y={slot.y}
            width={slot.width}
            height={slot.height}
            rx={8}
            stroke="var(--playmat-player-stroke)"
            strokeWidth={4}
            fill="var(--playmat-player-fill)"
            fillOpacity={0.12}
          />
        ))}
        <text
          x={layout.playerEngineLabel.x}
          y={layout.playerEngineLabel.y}
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize={14}
          {...LABEL_STYLE}
        >
          DEINE ENGINE
        </text>
      </g>

      {opponentChar && <CharacterZone zone={opponentChar} />}
      {playerChar && <CharacterZone zone={playerChar} />}
    </svg>
  );
}
