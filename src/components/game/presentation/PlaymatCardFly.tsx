/**
 * Flying card-back overlay for deal and draw presentation steps.
 * Location: src/components/game/presentation/PlaymatCardFly.tsx
 */
import React from 'react';
import { resolveCardBackPath } from '../../../services/cardArt/manifest';
import type { PlayerId } from '../../../game/types';
import type { PresentationStep } from './types';
import { isOpeningDealStep } from './buildOpeningDealSteps';
import { isDrawCardStep } from './buildDrawCardStep';

interface PlaymatCardFlyProps {
  activeStep: PresentationStep | null;
  humanPlayerId: PlayerId;
}

function flyClassForStep(step: PresentationStep, humanPlayerId: PlayerId): string | null {
  const playerId = step.payload?.playerId as PlayerId | undefined;
  if (!playerId) return null;
  const toHuman = playerId === humanPlayerId;
  const prefix = isDrawCardStep(step) ? 'draw-card-fly' : 'opening-deal-fly';
  return `${prefix}--${toHuman ? 'human' : 'bot'}`;
}

export function PlaymatCardFly({ activeStep, humanPlayerId }: PlaymatCardFlyProps) {
  if (!activeStep) return null;
  if (!isOpeningDealStep(activeStep) && !isDrawCardStep(activeStep)) return null;

  const flyClass = flyClassForStep(activeStep, humanPlayerId);
  if (!flyClass) return null;

  const testId = isDrawCardStep(activeStep) ? 'draw-card-fly' : 'opening-deal-fly';

  return (
    <div
      data-testid={testId}
      className={`pointer-events-none absolute z-30 ${flyClass}`}
      aria-hidden
    >
      <img
        src={resolveCardBackPath()}
        alt=""
        className="h-16 w-11 rounded-sm border border-stone-700 bg-stone-950 object-cover shadow-lg sm:h-20 sm:w-14"
      />
    </div>
  );
}
