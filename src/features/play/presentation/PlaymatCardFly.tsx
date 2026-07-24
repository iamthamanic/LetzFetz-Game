/**
 * Flying card-back overlay for hidden draw presentation steps.
 * Opening deal uses OpeningDealFly; face-up human draws use DrawCardReveal.
 * Location: src/features/play/presentation/PlaymatCardFly.tsx
 */
import React from 'react';
import type { PlayerId } from '../../../game/types';
import { CardBackFace } from '../../../components/cards/CardBackFace';
import type { PresentationStep } from './types';
import { isDrawCardStep } from './buildDrawCardStep';

interface PlaymatCardFlyProps {
  activeStep: PresentationStep | null;
  humanPlayerId: PlayerId;
}

export function PlaymatCardFly({ activeStep, humanPlayerId }: PlaymatCardFlyProps) {
  if (!activeStep || !isDrawCardStep(activeStep)) return null;

  // Face-up human draws use DrawCardReveal instead.
  if (activeStep.payload?.faceUp === true) return null;

  const playerId = activeStep.payload?.playerId as PlayerId | undefined;
  if (!playerId) return null;
  const toHuman = playerId === humanPlayerId;
  const flyClass = `draw-card-fly--${toHuman ? 'human' : 'bot'}`;

  return (
    <div
      data-testid="draw-card-fly"
      className={`pointer-events-none absolute z-30 ${flyClass}`}
      aria-hidden
    >
      <CardBackFace className="h-16 w-11 sm:h-20 sm:w-14" />
    </div>
  );
}
