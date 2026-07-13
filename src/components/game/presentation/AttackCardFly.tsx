/**
 * Attack/challenge card face flying from hand to the combat stage.
 * Location: src/components/game/presentation/AttackCardFly.tsx
 */
import React from 'react';
import { resolveCardArtPath } from '../../../services/cardArt/manifest';
import type { PlayerId } from '../../../game/types';
import type { PresentationStep } from './types';
import { isAttackCardFlyStep } from './buildAttackCardFlyStep';

interface AttackCardFlyProps {
  activeStep: PresentationStep | null;
  humanPlayerId: PlayerId;
}

export function AttackCardFly({ activeStep, humanPlayerId }: AttackCardFlyProps) {
  if (!activeStep || !isAttackCardFlyStep(activeStep)) return null;

  const playerId = activeStep.payload?.playerId as PlayerId | undefined;
  const cardDefId = activeStep.payload?.cardDefId as string | undefined;
  if (!playerId || !cardDefId) return null;

  const toHuman = playerId === humanPlayerId;
  const flyClass = `attack-card-fly--${toHuman ? 'human' : 'bot'}`;

  return (
    <div
      data-testid="attack-card-fly"
      className={`pointer-events-none absolute z-[35] ${flyClass}`}
      aria-hidden
    >
      <img
        src={resolveCardArtPath(cardDefId)}
        alt=""
        className="h-28 w-20 rounded-md border-2 border-amber-500/60 bg-stone-950 object-cover shadow-2xl shadow-amber-950/50 sm:h-36 sm:w-24"
      />
    </div>
  );
}
