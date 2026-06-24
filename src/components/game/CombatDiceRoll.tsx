/**
 * Animated W6 die in combat — engine roll is authoritative, UI shows bonus tier.
 * Location: src/components/game/CombatDiceRoll.tsx
 */
import React, { useEffect, useState } from 'react';
import { buildDiceRollFeedback, COMBAT_DICE_ROLL_MS } from './diceRollFeedback';
import { prefersReducedMotion } from './presentation/prefersReducedMotion';

interface CombatDiceRollProps {
  roll: number;
}

export function CombatDiceRoll({ roll }: CombatDiceRollProps) {
  const feedback = buildDiceRollFeedback(roll);
  const [revealed, setRevealed] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    const timer = window.setTimeout(() => setRevealed(true), COMBAT_DICE_ROLL_MS);
    return () => window.clearTimeout(timer);
  }, [roll]);

  return (
    <div
      data-testid="combat-dice-roll"
      data-dice-revealed={revealed ? 'true' : 'false'}
      className="mt-1 flex flex-col items-center gap-0.5"
      aria-live="polite"
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-md border-2 border-amber-400/70 bg-gradient-to-br from-amber-200 to-amber-500 shadow-md shadow-amber-950/40 ${
          revealed ? '' : 'combat-dice-roll-animate'
        }`}
      >
        <span
          data-testid="combat-dice-value"
          className="text-lg font-black tabular-nums text-stone-950"
        >
          {revealed ? feedback.roll : '🎲'}
        </span>
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-wide text-amber-200/80">
        W6
      </span>
      {revealed && (
        <span
          data-testid="combat-dice-bonus"
          className="rounded bg-purple-900/60 px-1.5 py-0.5 text-[9px] font-bold text-purple-100"
        >
          {feedback.bonusLabel}
        </span>
      )}
    </div>
  );
}
