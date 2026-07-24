/**
 * Center-stage reveal for Sofort-Glitches (both players see face + resolution).
 * Location: src/features/play/presentation/InstantGlitchReveal.tsx
 */
import React from 'react';
import { resolveCardArtPath } from '../../../services/cardArt/manifest';
import type { PlayerId } from '../../../game/types';
import type { PresentationStep } from './types';
import { isInstantGlitchRevealStep } from './buildInstantGlitchRevealStep';

interface InstantGlitchRevealProps {
  activeStep: PresentationStep | null;
  humanPlayerId: PlayerId;
}

export function InstantGlitchReveal({ activeStep, humanPlayerId }: InstantGlitchRevealProps) {
  if (!activeStep || !isInstantGlitchRevealStep(activeStep)) return null;

  const playerId = activeStep.payload?.playerId as PlayerId | undefined;
  const cardDefId = activeStep.payload?.cardDefId as string | undefined;
  const name = (activeStep.payload?.name as string | undefined) ?? 'Sofort-Glitch';
  const effectText = (activeStep.payload?.effectText as string | undefined) ?? '';
  const resolution = (activeStep.payload?.resolution as string | undefined) ?? '';
  if (!playerId || !cardDefId) return null;

  const whose = playerId === humanPlayerId ? 'Du hast gezogen' : 'Gegner hat gezogen';

  return (
    <div
      data-testid="instant-glitch-reveal"
      className="pointer-events-none absolute inset-0 z-[40] flex items-center justify-center bg-black/55 px-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex max-w-md flex-col items-center gap-3 rounded-lg border border-amber-500/60 bg-stone-950/95 p-4 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Sofort-Glitch · {whose}
        </p>
        <img
          src={resolveCardArtPath(cardDefId)}
          alt={name}
          className="h-40 w-28 rounded-md border border-stone-600 object-cover shadow-lg sm:h-52 sm:w-36"
        />
        <div className="text-center">
          <p className="text-base font-bold text-stone-50">{name}</p>
          <p className="mt-1 text-sm text-stone-300">{effectText}</p>
          <p className="mt-2 text-sm font-medium text-amber-200">{resolution}</p>
        </div>
      </div>
    </div>
  );
}
