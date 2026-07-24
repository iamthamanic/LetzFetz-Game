/**
 * Phase indicator + round badge — coach text lives on PhaseBar tooltips.
 * Location: src/features/play/board/PhaseCoachBanner.tsx
 */
import React from 'react';
import type { PlayerId, TurnPhase } from '../../../game/types';
import { PhaseBar } from './PhaseBar';
import { Badge } from '../../../components/ui/Badge';

interface PhaseCoachBannerProps {
  currentPhase: TurnPhase;
  phaseLabel: string;
  hint: string;
  turnNumber: number;
  activePlayerId: PlayerId;
  humanPlayerId: PlayerId;
}

export function PhaseCoachBanner({
  currentPhase,
  phaseLabel,
  hint,
  turnNumber,
  activePlayerId,
  humanPlayerId,
}: PhaseCoachBannerProps) {
  return (
    <div
      data-testid="phase-coach-banner"
      className="flex min-w-0 flex-wrap items-center justify-center gap-3 sm:justify-start sm:gap-4"
    >
      <PhaseBar
        current={currentPhase}
        activePlayerId={activePlayerId}
        humanPlayerId={humanPlayerId}
        currentHint={hint}
        tooltipSide="above"
      />
      <Badge variant="accent" className="shrink-0">
        Runde {turnNumber}
      </Badge>
      <span className="sr-only">{phaseLabel}</span>
    </div>
  );
}
