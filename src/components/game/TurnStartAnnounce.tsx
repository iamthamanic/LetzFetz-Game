/**
 * Center-stage banner after opening deal: who starts the match.
 * Location: src/components/game/TurnStartAnnounce.tsx
 */
import React, { useEffect, useRef } from 'react';
import { BrandLogoText } from '../ui/BrandLogoText';
import { Panel } from '../ui/Panel';
import { prefersReducedMotion } from '../../features/play/presentation/prefersReducedMotion';

/** Visible hold time before the phase-coach footer materializes. */
export const TURN_START_ANNOUNCE_MS = 2000;

interface TurnStartAnnounceProps {
  active: boolean;
  humanStarts: boolean;
  onComplete: () => void;
}

export function TurnStartAnnounce({
  active,
  humanStarts,
  onComplete,
}: TurnStartAnnounceProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) return;

    if (prefersReducedMotion()) {
      onCompleteRef.current();
      return;
    }

    const id = window.setTimeout(() => onCompleteRef.current(), TURN_START_ANNOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [active]);

  if (!active) return null;

  const label = humanStarts ? 'Du beginnst' : 'Gegner beginnt';
  const toneClass = humanStarts
    ? 'turn-start-announce__box--human'
    : 'turn-start-announce__box--bot';

  return (
    <div
      data-testid="turn-start-announce"
      className="turn-start-announce pointer-events-none absolute inset-0 z-[60] flex items-center justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div className="turn-start-announce__veil absolute inset-0 bg-stone-950/60 backdrop-blur-[2px]" aria-hidden />
      <Panel
        tone="game"
        dense
        className={`turn-start-announce__box relative z-[1] max-w-lg border-2 px-6 py-5 text-center sm:px-10 sm:py-6 ${toneClass}`}
      >
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-400">
          Initiative
        </p>
        <BrandLogoText
          as="p"
          glitch
          surface="dark"
          className="turn-start-announce__label text-[clamp(1.75rem,5vw,2.85rem)] leading-none tracking-wide"
        >
          {label}
        </BrandLogoText>
      </Panel>
    </div>
  );
}
