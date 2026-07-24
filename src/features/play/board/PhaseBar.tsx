/**
 * Phase indicator bar — coach hints as hover tooltips on each phase badge.
 * Location: src/features/play/board/PhaseBar.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PlayerId, TurnPhase } from '../../../game/types';
import { PHASE_LABELS } from '../../../game/engine/helpers';

const PHASES: TurnPhase[] = ['start', 'draw', 'build', 'action', 'end'];

const PHASE_HOVER_HINTS: Record<TurnPhase, string> = {
  start: 'Startphase — Zug beginnen.',
  draw: 'Ziehphase — eine Karte vom Nachziehstapel ziehen.',
  build: 'Bau-Phase — optional eine Karte in die Engine bauen.',
  action: 'Aktionsphase — Angriff, Boost, Glitch oder Hauptaktion beenden.',
  end: 'Endphase — Zug abschließen.',
};

interface PhaseBarProps {
  current: TurnPhase;
  activePlayerId: PlayerId;
  humanPlayerId: PlayerId;
  /** Live coach hint for the current phase (shown on that badge’s tooltip). */
  currentHint?: string;
  /** When docked at the bottom of the screen, tooltips open upward. */
  tooltipSide?: 'above' | 'below';
}

interface TipPos {
  phase: TurnPhase;
  top: number;
  left: number;
  tip: string;
}

export function PhaseBar({
  current,
  activePlayerId,
  humanPlayerId,
  currentHint,
  tooltipSide = 'below',
}: PhaseBarProps) {
  const currentIdx = PHASES.indexOf(current);
  const isHumanTurn = activePlayerId === humanPlayerId;
  const actorLabel = isHumanTurn ? 'Du' : 'Gegner';
  const [tipPos, setTipPos] = useState<TipPos | null>(null);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current != null) window.clearTimeout(hideTimer.current);
    };
  }, []);

  const showTip = (phase: TurnPhase, el: HTMLElement, tip: string) => {
    if (hideTimer.current != null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    const rect = el.getBoundingClientRect();
    const top =
      tooltipSide === 'above' ? rect.top - 8 : rect.bottom + 8;
    setTipPos({
      phase,
      top,
      left: rect.left + rect.width / 2,
      tip,
    });
  };

  const hideTip = () => {
    hideTimer.current = window.setTimeout(() => setTipPos(null), 80);
  };

  return (
    <div className="flex min-w-0 flex-col items-start gap-1.5" data-testid="phase-bar">
      <div className="flex flex-wrap justify-start gap-1.5" role="list" aria-label="Zugphasen">
        {PHASES.map((phase, idx) => {
          const isCurrent = idx === currentIdx;
          const tip = isCurrent && currentHint?.trim() ? currentHint : PHASE_HOVER_HINTS[phase];

          return (
            <div
              key={phase}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              data-testid={isCurrent ? 'phase-bar-current' : undefined}
              className="relative"
              onMouseEnter={(e) => showTip(phase, e.currentTarget, tip)}
              onMouseLeave={hideTip}
              onFocus={(e) => showTip(phase, e.currentTarget, tip)}
              onBlur={hideTip}
            >
              <div
                tabIndex={0}
                className={`cursor-help rounded-full px-3 py-1 text-xs transition-all ${
                  isCurrent
                    ? 'phase-pill-current border border-purple-500 bg-purple-900 text-white'
                    : idx < currentIdx
                      ? 'border border-gray-700 bg-stone-900 text-gray-400'
                      : 'border border-gray-800 bg-stone-950 text-gray-500'
                }`}
              >
                {PHASE_LABELS[phase]}
              </div>
            </div>
          );
        })}
      </div>
      <p
        className={`text-[11px] font-semibold leading-none tracking-wide ${
          isHumanTurn ? 'text-emerald-400/90' : 'text-amber-400/90'
        }`}
        data-testid="phase-bar-actor"
      >
        {actorLabel} · {PHASE_LABELS[current]}
      </p>

      {tipPos &&
        createPortal(
          <div
            role="tooltip"
            data-testid={tipPos.phase === current ? 'phase-coach-hint' : 'phase-hover-hint'}
            className="pointer-events-none fixed z-[400] w-56 rounded-lg border border-stone-500 bg-stone-900 px-2.5 py-2 text-left text-[11px] font-medium leading-snug text-stone-100 shadow-[0_12px_40px_rgb(0_0_0)] sm:w-64 sm:text-xs"
            style={{
              top: tipPos.top,
              left: tipPos.left,
              transform:
                tooltipSide === 'above'
                  ? 'translate(-50%, -100%)'
                  : 'translate(-50%, 0)',
              backgroundColor: '#1c1917',
            }}
          >
            {tipPos.tip}
          </div>,
          document.body,
        )}
    </div>
  );
}
