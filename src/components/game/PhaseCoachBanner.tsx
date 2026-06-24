/**
 * Phase indicator + actionable German coach hint for the active turn.
 * Location: src/components/game/PhaseCoachBanner.tsx
 */
import React from 'react';
import type { TurnPhase } from '../../game/types';
import { PhaseBar } from './PhaseBar';
import { Badge } from '../ui/Badge';

interface PhaseCoachBannerProps {
  currentPhase: TurnPhase;
  phaseLabel: string;
  hint: string;
  turnNumber: number;
}

export function PhaseCoachBanner({
  currentPhase,
  phaseLabel,
  hint,
  turnNumber,
}: PhaseCoachBannerProps) {
  return (
    <div
      data-testid="phase-coach-banner"
      className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <PhaseBar current={currentPhase} />
        <Badge variant="accent" className="shrink-0">
          Runde {turnNumber}
        </Badge>
        <span className="sr-only">{phaseLabel}</span>
      </div>
      <p
        data-testid="phase-coach-hint"
        className="min-w-0 flex-1 text-sm font-medium leading-snug text-amber-100/95"
      >
        {hint}
      </p>
    </div>
  );
}
