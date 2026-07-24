/**
 * Opening deal: card backs fly in parallel to hand and bot dock.
 * Location: src/features/play/presentation/OpeningDealFly.tsx
 */
import React, { useEffect, useState } from 'react';
import type { PlayerId } from '../../../game/types';
import { CardBackFace } from '../../../components/cards/CardBackFace';
import { prefersReducedMotion } from './prefersReducedMotion';
import type { PresentationStep } from './types';
import {
  isOpeningDealStep,
  openingDealBeats,
  OPENING_DEAL_CARD_MS,
} from './buildOpeningDealSteps';

interface OpeningDealFlyProps {
  activeStep: PresentationStep | null;
  humanPlayerId: PlayerId;
}

function clearDealLanding(hand: Element | null) {
  hand?.removeAttribute('data-deal-landing');
}

/** Open end slot + FLIP-slide existing hand cards; return fly delta into the slot. */
function prepareHandLanding(cardEl: HTMLElement | null): { x: number; y: number } {
  const hand = document.querySelector('[data-testid="player-hand"]');
  const row = document.querySelector('[data-testid="hand-fan-row"]');
  if (!cardEl || !hand || !row) {
    return { x: 80, y: 160 };
  }

  const cardNodes = Array.from(row.querySelectorAll<HTMLElement>('[data-hand-card-id]'));
  const before = new Map(
    cardNodes.map((el) => [el.getAttribute('data-hand-card-id') ?? '', el.getBoundingClientRect()]),
  );

  hand.setAttribute('data-deal-landing', 'true');
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
        duration: OPENING_DEAL_CARD_MS,
        easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
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

function prepareBotLanding(cardEl: HTMLElement | null): { x: number; y: number } {
  if (!cardEl) return { x: 220, y: -180 };
  const dock =
    (document.querySelector(
      '[data-testid="opponent-plate"][data-dock-variant="full"]',
    ) as HTMLElement | null) ??
    (document.querySelector('[data-testid="opponent-plate"]') as HTMLElement | null);
  if (!dock) return { x: 220, y: -180 };
  const target = dock.getBoundingClientRect();
  const card = cardEl.getBoundingClientRect();
  return {
    x: target.left + target.width / 2 - (card.left + card.width / 2),
    y: target.top + target.height * 0.55 - (card.top + card.height / 2),
  };
}

export function OpeningDealFly({ activeStep, humanPlayerId }: OpeningDealFlyProps) {
  const [deltas, setDeltas] = useState<Record<number, { x: number; y: number }>>({});
  const [flying, setFlying] = useState(false);

  const isActive = Boolean(activeStep) && isOpeningDealStep(activeStep!);
  const beats = isActive && activeStep ? openingDealBeats(activeStep) : [];
  const stepId = activeStep?.id;
  const beatKey = beats.map((b) => `${b.playerId}:${b.cardInstanceId}`).join('|');

  useEffect(() => {
    if (!isActive || !stepId || beats.length === 0) {
      setFlying(false);
      setDeltas({});
      clearDealLanding(document.querySelector('[data-testid="player-hand"]'));
      return;
    }

    if (prefersReducedMotion()) {
      setDeltas({});
      setFlying(true);
      return;
    }

    setFlying(false);
    clearDealLanding(document.querySelector('[data-testid="player-hand"]'));

    let cancelled = false;
    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (cancelled) return;
        const next: Record<number, { x: number; y: number }> = {};
        beats.forEach((beat, index) => {
          const el = document.querySelector(
            `[data-deal-fly-idx="${index}"]`,
          ) as HTMLElement | null;
          next[index] =
            beat.playerId === humanPlayerId
              ? prepareHandLanding(el)
              : prepareBotLanding(el);
        });
        setDeltas(next);
        setFlying(true);
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      clearDealLanding(document.querySelector('[data-testid="player-hand"]'));
    };
  }, [isActive, stepId, beatKey, humanPlayerId]);

  if (!isActive || beats.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[55]" aria-hidden data-testid="opening-deal-fly">
      {beats.map((beat, index) => {
        const toHuman = beat.playerId === humanPlayerId;
        const delta = deltas[index] ?? { x: 0, y: 0 };
        return (
          <div
            key={`${beat.playerId}-${beat.cardInstanceId}`}
            data-deal-fly-idx={index}
            data-deal-to={toHuman ? 'human' : 'bot'}
            className={`opening-deal-fly-card absolute ${
              flying ? 'opening-deal-fly-card--fly' : 'opening-deal-fly-card--ready'
            }`}
            style={
              {
                left: toHuman ? '8%' : '14%',
                top: toHuman ? '42%' : '36%',
                '--fly-x': `${delta.x}px`,
                '--fly-y': `${delta.y}px`,
              } as React.CSSProperties
            }
          >
            <CardBackFace className="h-20 w-14 shadow-2xl shadow-black/50 sm:h-24 sm:w-[4.25rem]" />
          </div>
        );
      })}
    </div>
  );
}
