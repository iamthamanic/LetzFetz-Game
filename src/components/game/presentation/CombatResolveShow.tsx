/**
 * Fullscreen combat resolve: cards → simultaneous dice → receipt → remainder.
 * Location: src/components/game/presentation/CombatResolveShow.tsx
 */
import React, { useEffect, useState } from 'react';
import type { ContentPack, PlayerId } from '../../../game/types';
import { findElementDef } from '../../../game/engine/lookup';
import { BoardCard } from '../BoardCard';
import { W6Die3D, W6_DIE_ROLL_MS } from '../W6Die3D';
import { prefersReducedMotion } from './prefersReducedMotion';
import type { PresentationStep } from './types';
import {
  isCombatResolveStep,
  type CombatResolveSnapshot,
} from './buildCombatResolveStep';

type Phase = 'reveal' | 'dice' | 'receipt' | 'result';

interface CombatResolveShowProps {
  activeStep: PresentationStep | null;
  pack: ContentPack;
  humanPlayerId: PlayerId;
}

function snapshotFromStep(step: PresentationStep): CombatResolveSnapshot | null {
  if (!isCombatResolveStep(step) || !step.payload) return null;
  return step.payload as unknown as CombatResolveSnapshot;
}

function outcomeCopy(snap: CombatResolveSnapshot): string {
  if (snap.outcome === 'challenge-destroy') {
    return `${snap.destroyedCardName ?? 'Karte'} zerstört`;
  }
  if (snap.outcome === 'challenge-fail') return 'Herausforderung fehlgeschlagen';
  if (snap.outcome === 'blocked' || snap.damage <= 0) return 'Komplett geblockt';
  return `${snap.damage} Schaden`;
}

function ReceiptLine({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 border-b border-dashed border-stone-600/60 py-1 font-mono text-sm ${
        emphasize ? 'border-b-2 border-solid border-stone-400 pt-1.5 text-base font-bold' : ''
      }`}
    >
      <span className="text-stone-400">{label}</span>
      <span className="tabular-nums text-stone-100">{value}</span>
    </div>
  );
}

export function CombatResolveShow({
  activeStep,
  pack,
  humanPlayerId,
}: CombatResolveShowProps) {
  const [phase, setPhase] = useState<Phase>('reveal');
  const [diceRolling, setDiceRolling] = useState(false);

  const snap = activeStep ? snapshotFromStep(activeStep) : null;
  const stepId = activeStep?.id;

  useEffect(() => {
    if (!snap || !stepId) {
      setPhase('reveal');
      setDiceRolling(false);
      return;
    }

    if (prefersReducedMotion()) {
      setDiceRolling(false);
      setPhase('result');
      return;
    }

    setPhase('reveal');
    setDiceRolling(false);

    const timers: number[] = [];
    // Both cards visible, then dice together.
    timers.push(
      window.setTimeout(() => {
        setPhase('dice');
        setDiceRolling(true);
      }, 700),
    );
    timers.push(
      window.setTimeout(() => {
        setDiceRolling(false);
        setPhase('receipt');
      }, 700 + Math.min(W6_DIE_ROLL_MS, 900)),
    );
    timers.push(window.setTimeout(() => setPhase('result'), 700 + Math.min(W6_DIE_ROLL_MS, 900) + 1400));

    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional per stepId
  }, [stepId]);

  if (!snap) return null;

  const attackDef = findElementDef(pack, snap.attackCardDefId);
  const blockDef = snap.blockCardDefId ? findElementDef(pack, snap.blockCardDefId) : null;
  const hasBlock = Boolean(blockDef);
  const whoseAttack = snap.attackerId === humanPlayerId ? 'Dein Angriff' : 'Gegner-Angriff';
  const whoseBlock = snap.defenderId === humanPlayerId ? 'Deine Verteidigung' : 'Gegner-Block';
  const showDice = phase === 'dice' || phase === 'receipt' || phase === 'result';
  const showReceipt = phase === 'receipt' || phase === 'result';

  return (
    <div
      data-testid="combat-resolve-show"
      data-phase={phase}
      className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
      role="status"
      aria-live="polite"
      aria-label={outcomeCopy(snap)}
    >
      <div className="combat-resolve-veil absolute inset-0 bg-black/75" aria-hidden />
      <div
        className={`combat-resolve-stage relative flex max-h-[min(94vh,58rem)] w-[min(96vw,72rem)] flex-col items-center gap-4 overflow-y-auto overflow-x-visible rounded-2xl border-2 border-amber-500/50 bg-stone-950 px-5 py-6 shadow-2xl sm:gap-5 sm:px-10 sm:py-8 md:px-14 ${
          phase === 'result' ? 'combat-resolve-stage--clash' : ''
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 sm:text-sm">
          Kampfauflösung
        </p>

        <div className="flex w-full items-end justify-center gap-4 px-2 sm:gap-10 sm:px-6">
          <div className="flex flex-1 flex-col items-center gap-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-red-300/90 sm:text-xs">
              {whoseAttack}
            </p>
            {attackDef && <BoardCard def={attackDef} size="combat" showEffectTooltip={false} />}
            {showDice && snap.attackRoll > 0 && (
              <W6Die3D
                value={snap.attackRoll}
                label="Angriff"
                rolling={diceRolling && phase === 'dice'}
                rollKey={stepId?.length ?? 0}
              />
            )}
          </div>

          <div className="flex shrink-0 flex-col items-center justify-center pb-16" aria-hidden>
            <div className="match-intro-vs">
              <span className="match-intro-vs-text uppercase leading-none tracking-[0.2em]">
                VS
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center gap-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-300/90 sm:text-xs">
              {whoseBlock}
            </p>
            {hasBlock ? (
              <BoardCard def={blockDef!} size="combat" showEffectTooltip={false} />
            ) : (
              <div
                data-testid="combat-resolve-no-defense"
                className="flex h-44 w-28 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-cyan-600/60 bg-stone-900/90 px-2 text-center sm:h-56 sm:w-36"
              >
                <span className="font-brand text-sm uppercase tracking-wide text-brand-cream sm:text-base">
                  No Defense
                </span>
                <span className="text-[10px] uppercase tracking-wider text-cyan-500/80">
                  Keine Verteidigung
                </span>
              </div>
            )}
            {showDice && snap.blockRoll != null && hasBlock && (
              <W6Die3D
                value={snap.blockRoll}
                label="Block"
                rolling={diceRolling && phase === 'dice'}
                rollKey={(stepId?.length ?? 0) + 1}
              />
            )}
          </div>
        </div>

        {showReceipt && (
          <div
            data-testid="combat-resolve-receipt"
            className="w-full max-w-md rounded-lg border border-stone-600 bg-stone-900/90 px-4 py-3 shadow-inner"
          >
            <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">
              Abrechnung
            </p>

            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-red-300/90">
              Angriff
            </p>
            <ReceiptLine label="Kartenwert" value={`${snap.attackBase}`} />
            <ReceiptLine
              label={`W6 (${snap.attackRoll})`}
              value={snap.attackBonus > 0 ? `+${snap.attackBonus}` : '+0'}
            />
            <ReceiptLine
              label="Summe"
              value={`${snap.attackValue}`}
              emphasize
            />

            <p className="mb-1 mt-3 text-[10px] font-bold uppercase tracking-wider text-cyan-300/90">
              Verteidigung
            </p>
            {hasBlock ? (
              <>
                <ReceiptLine label="Kartenwert" value={`${snap.blockBase}`} />
                <ReceiptLine
                  label={snap.blockRoll != null ? `W6 (${snap.blockRoll})` : 'W6'}
                  value={snap.blockBonus > 0 ? `+${snap.blockBonus}` : '+0'}
                />
              </>
            ) : (
              <ReceiptLine label="No Defense" value="0" />
            )}
            <ReceiptLine label="Summe" value={`${snap.blockValue}`} emphasize />

            <div className="mt-3 border-t-2 border-stone-500 pt-2">
              <ReceiptLine
                label={`${snap.attackValue} − ${snap.blockValue}`}
                value={snap.damage > 0 ? `−${snap.damage}` : '0'}
                emphasize
              />
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div
            data-testid="combat-resolve-remainder"
            className={`combat-resolve-remainder mt-1 rounded-xl border px-5 py-3 text-center ${
              snap.damage > 0
                ? 'border-red-500/60 bg-red-950/70 text-red-200'
                : 'border-emerald-500/50 bg-emerald-950/50 text-emerald-200'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Ergebnis</p>
            <p
              data-testid="combat-resolve-attack-total"
              className="sr-only"
            >
              {snap.attackValue}
            </p>
            <p data-testid="combat-resolve-block-total" className="sr-only">
              {snap.blockValue}
            </p>
            <p className="text-4xl font-black tabular-nums sm:text-5xl">
              {snap.damage > 0 ? `−${snap.damage}` : '0'}
            </p>
            <p className="mt-1 text-sm font-bold">{outcomeCopy(snap)}</p>
            {snap.outcome === 'challenge-destroy' && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-200">
                Gebaute Karte zerstört
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
