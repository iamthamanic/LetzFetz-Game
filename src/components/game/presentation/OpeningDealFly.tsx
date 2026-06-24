/**
 * Flying card-back overlay during opening deal steps.
 * Location: src/components/game/presentation/OpeningDealFly.tsx
 */
import React from 'react';
import { resolveCardBackPath } from '../../../services/cardArt/manifest';
import type { PresentationStep } from './types';
import type { PlayerId } from '../../../game/types';
import { isOpeningDealStep } from './buildOpeningDealSteps';

interface OpeningDealFlyProps {
  activeStep: PresentationStep | null;
  humanPlayerId: PlayerId;
}

export function OpeningDealFly({ activeStep, humanPlayerId }: OpeningDealFlyProps) {
  if (!activeStep || !isOpeningDealStep(activeStep)) return null;

  const toHuman = activeStep.payload?.playerId === humanPlayerId;

  return (
    <div
      data-testid="opening-deal-fly"
      className={`pointer-events-none absolute z-30 ${
        toHuman ? 'opening-deal-fly--human' : 'opening-deal-fly--bot'
      }`}
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
