/**
 * SVG targeting arrow overlay — shows from the selected hand card to the chosen
 * target using real DOM coordinates instead of abstract playmat zones.
 * Location: src/features/play/board/zones/TargetingArrow.tsx
 */
import React from 'react';
import type { BoundSlotView } from '../buildGameViewModel';

export interface TargetingArrowCoords {
  source: { x: number; y: number };
  target: { x: number; y: number };
}

interface TargetingArrowProps {
  /** Playmat root client rect used to size the SVG overlay. */
  rootRect: { width: number; height: number };
  /** Source and target coordinates relative to the playmat root. */
  coords: TargetingArrowCoords;
  hasChallengeTargets: boolean;
  opponentSlots: BoundSlotView[];
}

export function TargetingArrow({
  rootRect,
  coords,
  hasChallengeTargets,
  opponentSlots,
}: TargetingArrowProps) {
  const { source, target } = coords;
  const controlY = (source.y + target.y) / 2 - Math.min(rootRect.height * 0.08, 60);

  const targetableCount = opponentSlots.filter((s) => s.isTargetable).length;

  return (
    <svg
      data-testid="targeting-arrow"
      data-target-type={hasChallengeTargets ? 'challenge' : 'direct'}
      data-targetable-count={targetableCount}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      viewBox={`0 0 ${rootRect.width} ${rootRect.height}`}
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
        d={`M ${source.x} ${source.y} Q ${(source.x + target.x) / 2} ${controlY} ${target.x} ${target.y}`}
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
