/**
 * Center-screen damage VFX: character portrait, red shimmer/hit, LP countdown.
 * Location: src/features/play/presentation/DamageHitReveal.tsx
 */
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import type { ContentPack, PlayerId } from '../../../game/types';
import { CardIllustrationLoop } from '../../../components/ui/CardIllustrationLoop';
import { prefersReducedMotion } from './prefersReducedMotion';
import type { PresentationStep } from './types';
import { isDamageHitStep } from './buildDamageHitStep';

interface DamageHitRevealProps {
  activeStep: PresentationStep | null;
  pack: ContentPack;
  humanPlayerId: PlayerId;
}

function characterName(pack: ContentPack, id: string): string {
  return pack.characters.find((c) => c.id === id)?.name ?? id;
}

export function DamageHitReveal({ activeStep, pack, humanPlayerId }: DamageHitRevealProps) {
  const [displayHp, setDisplayHp] = useState<number | null>(null);
  const [phase, setPhase] = useState<'enter' | 'hit' | 'count'>('enter');

  const isActive = Boolean(activeStep && isDamageHitStep(activeStep));
  const playerId = activeStep?.payload?.playerId as PlayerId | undefined;
  const characterId = activeStep?.payload?.characterId as string | undefined;
  const fromHp = activeStep?.payload?.fromHp as number | undefined;
  const toHp = activeStep?.payload?.toHp as number | undefined;
  const amount = activeStep?.payload?.amount as number | undefined;
  const stepId = activeStep?.id;

  useEffect(() => {
    if (!isActive || fromHp == null || toHp == null || !stepId) {
      setDisplayHp(null);
      setPhase('enter');
      return;
    }

    setDisplayHp(fromHp);
    setPhase('enter');

    if (prefersReducedMotion()) {
      setPhase('count');
      setDisplayHp(toHp);
      return;
    }

    const hitTimer = window.setTimeout(() => setPhase('hit'), 380);
    const countTimer = window.setTimeout(() => setPhase('count'), 720);

    const delta = fromHp - toHp;
    const countStart = 780;
    const countSpan = Math.min(1400, 320 + delta * 180);
    const tickMs = Math.max(55, Math.floor(countSpan / Math.max(1, delta)));

    let current = fromHp;
    let tickTimer = 0;
    const startCount = window.setTimeout(() => {
      tickTimer = window.setInterval(() => {
        current -= 1;
        if (current <= toHp) {
          setDisplayHp(toHp);
          window.clearInterval(tickTimer);
          return;
        }
        setDisplayHp(current);
      }, tickMs);
    }, countStart);

    return () => {
      window.clearTimeout(hitTimer);
      window.clearTimeout(countTimer);
      window.clearTimeout(startCount);
      window.clearInterval(tickTimer);
    };
  }, [isActive, stepId, fromHp, toHp]);

  if (!isActive || !playerId || !characterId || fromHp == null || toHp == null) return null;

  const whose = playerId === humanPlayerId ? 'Du' : 'Gegner';
  const name = characterName(pack, characterId);
  const shown = displayHp ?? fromHp;

  return (
    <div
      data-testid="damage-hit-reveal"
      className="pointer-events-none absolute inset-0 z-[42] flex items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-label={`${whose} erleidet ${amount ?? fromHp - toHp} Schaden`}
    >
      <div className="damage-hit-veil absolute inset-0 bg-black/60" aria-hidden />
      <div
        className={`damage-hit-stage relative flex max-w-lg flex-col items-center gap-4 ${
          phase === 'hit' ? 'damage-hit-stage--impact' : ''
        }`}
      >
        <p className="relative z-[1] text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
          Treffer · {whose}
        </p>

        <div
          className={`damage-hit-portrait relative overflow-hidden rounded-2xl border-2 border-red-500/70 shadow-2xl shadow-red-950/60 ${
            phase === 'hit' ? 'damage-hit-portrait--flash' : ''
          } ${phase !== 'enter' ? 'damage-hit-portrait--shimmer' : ''}`}
        >
          <CardIllustrationLoop
            cardId={characterId}
            variant="idle"
            className="h-56 w-40 object-cover object-top sm:h-72 sm:w-52"
            testId={`damage-hit-portrait-${characterId}`}
          />
          <div className="damage-hit-red-wash pointer-events-none absolute inset-0" aria-hidden />
          {phase === 'hit' && (
            <div className="damage-hit-slash pointer-events-none absolute inset-0" aria-hidden />
          )}
        </div>

        <div className="relative z-[1] text-center">
          <p className="text-lg font-bold text-stone-50 sm:text-xl">{name}</p>
          <p
            className={`mt-2 inline-flex items-center gap-2 font-black tabular-nums text-red-300 ${
              phase === 'count' ? 'damage-hit-lp--tick' : ''
            }`}
          >
            <Heart className="h-6 w-6 shrink-0 fill-red-500/40 text-red-400" />
            <span className="text-4xl sm:text-5xl">{shown}</span>
            <span className="text-base font-bold text-red-200/80">LP</span>
          </p>
          {amount != null && amount > 0 && (
            <p className="mt-1 text-sm font-bold uppercase tracking-wide text-red-400">
              −{amount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
