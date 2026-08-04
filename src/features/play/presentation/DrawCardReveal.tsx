/**
 * Human draw: large face-up center reveal, then fly into the HandFan end slot.
 * Bot / hidden draws still use PlaymatCardFly (card back).
 * Location: src/features/play/presentation/DrawCardReveal.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import type { ContentPack, PlayerId } from '../../../game/types';
import { BoardCard } from '../board/BoardCard';
import { prefersReducedMotion } from './prefersReducedMotion';
import type { PresentationStep } from './types';
import { DRAW_CARD_FLY_MS, DRAW_CARD_REVEAL_MS, isDrawCardStep } from './buildDrawCardStep';
import { resolveHandCardDefs } from '../board/resolveHandCardDefs';

interface DrawCardRevealProps {
  activeStep: PresentationStep | null;
  pack: ContentPack;
  humanPlayerId: PlayerId;
}

function clearDrawLanding(hand: Element | null) {
  hand?.removeAttribute('data-draw-landing');
}

/** Open end slot + FLIP-slide existing hand cards, return fly delta into the slot. */
function prepareHandLanding(cardEl: HTMLElement | null): { x: number; y: number } {
  const hand = document.querySelector('[data-testid="player-hand"]');
  const row = document.querySelector('[data-testid="hand-fan-row"]');
  if (!cardEl || !hand || !row) {
    return { x: 0, y: 120 };
  }

  const cardNodes = Array.from(row.querySelectorAll<HTMLElement>('[data-hand-card-id]'));
  const before = new Map(
    cardNodes.map((el) => [el.getAttribute('data-hand-card-id') ?? '', el.getBoundingClientRect()]),
  );

  hand.setAttribute('data-draw-landing', 'true');
  // Force layout so the end slot is open before we measure / FLIP.
  void (hand as HTMLElement).offsetWidth;

  cardNodes.forEach((el) => {
    const id = el.getAttribute('data-hand-card-id') ?? '';
    const prev = before.get(id);
    if (!prev) return;
    const next = el.getBoundingClientRect();
    const dx = prev.left - next.left;
    const dy = prev.top - next.top;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    el.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
      {
        duration: DRAW_CARD_FLY_MS,
        easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
        fill: 'none',
      },
    );
  });

  const slot = document.querySelector('[data-testid="hand-draw-slot"]') as HTMLElement | null;
  const target = slot?.getBoundingClientRect() ?? hand.getBoundingClientRect();
  const card = cardEl.getBoundingClientRect();
  return {
    x: target.left + target.width / 2 - (card.left + card.width / 2),
    y: target.top + target.height / 2 - (card.top + card.height / 2),
  };
}

export function DrawCardReveal({ activeStep, pack, humanPlayerId }: DrawCardRevealProps) {
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'reveal' | 'fly'>('reveal');
  const [flyDelta, setFlyDelta] = useState({ x: 0, y: 0 });

  const isActive =
    Boolean(activeStep) &&
    isDrawCardStep(activeStep!) &&
    activeStep!.payload?.faceUp === true &&
    activeStep!.payload?.playerId === humanPlayerId;

  const stepId = activeStep?.id;
  const cardDefId = activeStep?.payload?.cardDefId as string | undefined;

  useEffect(() => {
    if (!isActive || !stepId) {
      setPhase('reveal');
      setFlyDelta({ x: 0, y: 0 });
      clearDrawLanding(document.querySelector('[data-testid="player-hand"]'));
      return;
    }
    if (prefersReducedMotion()) {
      setPhase('fly');
      return;
    }
    setPhase('reveal');
    clearDrawLanding(document.querySelector('[data-testid="player-hand"]'));
    const timer = window.setTimeout(() => {
      setFlyDelta(prepareHandLanding(cardWrapRef.current));
      setPhase('fly');
    }, DRAW_CARD_REVEAL_MS);
    return () => {
      window.clearTimeout(timer);
      clearDrawLanding(document.querySelector('[data-testid="player-hand"]'));
    };
  }, [isActive, stepId]);

  if (!isActive || !cardDefId) return null;

  const resolved = resolveHandCardDefs(pack, cardDefId);

  return (
    <div
      data-testid="draw-card-reveal"
      data-phase={phase}
      className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center p-4"
      aria-hidden
    >
      <div
        className={`draw-card-reveal-veil absolute inset-0 bg-black/65 transition-opacity duration-300 ${
          phase === 'fly' ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div
        ref={cardWrapRef}
        className={`relative z-[1] flex flex-col items-center ${
          phase === 'reveal' ? 'draw-card-reveal--hold' : 'draw-card-reveal--fly-hand'
        }`}
        style={
          {
            '--fly-x': `${flyDelta.x}px`,
            '--fly-y': `${flyDelta.y}px`,
          } as React.CSSProperties
        }
      >
        <p
          className={`mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-amber-300 transition-opacity ${
            phase === 'fly' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Gezogen
        </p>
        <BoardCard
          def={resolved.elementDef ?? undefined}
          glitchDef={resolved.glitchDef}
          itemDef={resolved.itemDef}
          formulaDef={resolved.formulaDef}
          defId={cardDefId}
          name={resolved.displayName ?? undefined}
          size="showcase"
          showEffectTooltip={false}
        />
      </div>
    </div>
  );
}
