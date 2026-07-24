/**
 * Phase-coach footer — after opening deal, glitch materialize then fly to dock (fast).
 * Unified bottom toolbar: phases | actions; second row tools + status.
 * Location: src/components/game/PhaseCoachFooter.tsx
 */
import React, { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../features/play/presentation/prefersReducedMotion';

export const FOOTER_GLITCH_DELAY_MS = 40;
export const FOOTER_GLITCH_MS = 520;
export const FOOTER_FLY_MS = 400;
/** Full glitch → fly → dock sequence after reveal becomes true. */
export const FOOTER_REVEAL_TOTAL_MS =
  FOOTER_GLITCH_DELAY_MS + FOOTER_GLITCH_MS + FOOTER_FLY_MS;

type FooterReveal = 'hidden' | 'glitch' | 'fly' | 'docked';

interface PhaseCoachFooterProps {
  /** True once opening deal finished — starts the footer spectacle. */
  reveal: boolean;
  /** Left zone: phase pills + round badge. */
  phases: React.ReactNode;
  /** Center zone: build / action / main action bars. */
  actions: React.ReactNode;
  /** Second row: bot mode, log, etc. */
  tools?: React.ReactNode;
  /** Second row: truncated bot reason (beside tools). */
  status?: React.ReactNode;
}

export function PhaseCoachFooter({
  reveal,
  phases,
  actions,
  tools,
  status,
}: PhaseCoachFooterProps) {
  const [phase, setPhase] = useState<FooterReveal>('hidden');

  useEffect(() => {
    if (!reveal) {
      setPhase('hidden');
    }
  }, [reveal]);

  useEffect(() => {
    if (!reveal || phase !== 'hidden') return;

    if (prefersReducedMotion()) {
      setPhase('docked');
      return;
    }

    const id = window.setTimeout(() => setPhase('glitch'), FOOTER_GLITCH_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [reveal, phase]);

  useEffect(() => {
    if (phase !== 'glitch') return;
    const id = window.setTimeout(() => setPhase('fly'), FOOTER_GLITCH_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'fly') return;
    const id = window.setTimeout(() => setPhase('docked'), FOOTER_FLY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  if (phase === 'hidden') return null;

  const isFloating = phase === 'glitch' || phase === 'fly';
  const shellClass =
    phase === 'glitch'
      ? 'phase-coach-footer phase-coach-footer--glitch'
      : phase === 'fly'
        ? 'phase-coach-footer phase-coach-footer--fly'
        : 'phase-coach-footer phase-coach-footer--docked flex-none border-t border-stone-700 bg-stone-900/95';

  return (
    <footer
      data-testid="phase-coach-footer"
      data-footer-reveal={phase}
      className={`${shellClass} px-4 py-3 sm:px-5 sm:py-3.5 ${isFloating ? 'pointer-events-none' : ''}`}
      aria-hidden={isFloating}
    >
      {phase === 'glitch' && (
        <>
          <div className="phase-coach-footer__glitch-layer phase-coach-footer__glitch-layer--cyan" aria-hidden />
          <div
            className="phase-coach-footer__glitch-layer phase-coach-footer__glitch-layer--magenta"
            aria-hidden
          />
          <div className="phase-coach-footer__scan" aria-hidden />
          <div className="phase-coach-footer__noise" aria-hidden />
        </>
      )}
      <div className="phase-coach-footer__content relative z-[1] mx-auto flex w-full max-w-6xl flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:flex-nowrap sm:gap-x-6 lg:gap-x-8">
          <div className="min-w-0 shrink-0 basis-full sm:basis-auto">{phases}</div>

          <div
            data-testid="footer-action-bar"
            className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2.5 border-stone-700/80 sm:border-x sm:px-5 lg:px-6"
          >
            {actions}
          </div>
        </div>
        {(tools != null || status != null) && (
          <div
            data-testid="game-toolbar-status"
            className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 border-t border-stone-700/70 pt-2"
          >
            {tools != null && (
              <div
                data-testid="game-toolbar-tools"
                className="flex shrink-0 flex-wrap items-center gap-2.5"
              >
                {tools}
              </div>
            )}
            {status != null && (
              <div className="min-w-0 flex-1 truncate text-xs leading-relaxed text-stone-400">
                {status}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
