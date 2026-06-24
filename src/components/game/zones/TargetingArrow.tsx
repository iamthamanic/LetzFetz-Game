/**
 * SVG targeting arrow overlay — shows from human hand to opponent zone
 * when the player has selected an attack card and must pick a target.
 * Location: src/components/game/zones/TargetingArrow.tsx
 */
import React from 'react';
import type { ResolvedPlaymatLayout } from '../playmat/playmatLayout';
import type { BoundSlotView } from '../buildGameViewModel';

interface TargetingArrowProps {
  layout: ResolvedPlaymatLayout;
  hasChallengeTargets: boolean;
  opponentSlots: BoundSlotView[];
}

function zoneCenter(zone: { x: number; y: number; width: number; height: number }) {
  return { x: zone.x + zone.width / 2, y: zone.y + zone.height / 2 };
}

export function TargetingArrow({
  layout,
  hasChallengeTargets,
  opponentSlots,
}: TargetingArrowProps) {
  const handZone = layout.zones.find((z) => z.id === 'player-hand');
  const opponentCharZone = layout.zones.find((z) => z.id === 'opponent-character');
  const combatZone = layout.zones.find((z) => z.id === 'combat');

  const source = zoneCenter(handZone ?? combatZone ?? { x: 0, y: layout.viewBox.height * 0.8, width: 0, height: 0 });

  const target = hasChallengeTargets
    ? zoneCenter(combatZone ?? { x: 0, y: 0, width: 0, height: 0 })
    : zoneCenter(opponentCharZone ?? { x: 0, y: 0, width: 0, height: 0 });

  const targetableCount = opponentSlots.filter((s) => s.isTargetable).length;

  return (
    <svg
      data-testid="targeting-arrow"
      data-target-type={hasChallengeTargets ? 'challenge' : 'direct'}
      data-targetable-count={targetableCount}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      viewBox={`0 0 ${layout.viewBox.width} ${layout.viewBox.height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <marker
          id="targeting-arrow-head"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L8,3 L0,6 Z" fill="#fbbf24" />
        </marker>
        <filter id="targeting-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={`M ${source.x} ${source.y} Q ${(source.x + target.x) / 2} ${(source.y + target.y) / 2 - 60} ${target.x} ${target.y}`}
        stroke="#fbbf24"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        markerEnd="url(#targeting-arrow-head)"
        filter="url(#targeting-glow)"
        className="targeting-arrow-pulse"
      />
    </svg>
  );
}