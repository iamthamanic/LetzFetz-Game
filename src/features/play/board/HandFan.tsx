/**
 * Human hand row with playable / dimmed card states and multi-step intents.
 * Location: src/features/play/board/HandFan.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BoardCard } from './BoardCard';
import { DraggableHandCard } from './DndPlaymat';
import type { HandCardView } from './buildGameViewModel';
import type { PendingIntent } from './gameActionHelpers';
import {
  HAND_SCROLL_STEP_RATIO,
  measureHandScrollHints,
  pickHandScrollHint,
} from './handScrollHints';

interface HandFanProps {
  cards: HandCardView[];
  pending: PendingIntent | null;
  /** When set, only the first N cards are shown (opening deal reveal). */
  visibleCount?: number;
  /** Opening deal: keep tray + landing slot mounted for fly-in. */
  dealRevealActive?: boolean;
  /** Instance ids hidden until draw animation completes. */
  hiddenInstanceIds?: string[];
  hasChallengeTargets?: boolean;
  onSelectAttack: (instanceId: string) => void;
  onPlayBoost: (instanceId: string) => void;
  onBuildDirect: (instanceId: string) => void;
  onStartBuildReplace: (instanceId: string) => void;
  onPlayBlock: (instanceId: string) => void;
  onDiscardDraw: (instanceId: string) => void;
  onActivateDiscard: (instanceId: string) => void;
  onPlayGlitch: (instanceId: string) => void;
  onPlayItem?: (instanceId: string) => void;
}

export function HandFan({
  cards,
  pending,
  visibleCount,
  dealRevealActive = false,
  hiddenInstanceIds,
  hasChallengeTargets = false,
  onSelectAttack,
  onPlayBoost,
  onBuildDirect,
  onStartBuildReplace,
  onPlayBlock,
  onDiscardDraw,
  onActivateDiscard,
  onPlayGlitch,
  onPlayItem,
}: HandFanProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const shown = (visibleCount !== undefined ? cards.slice(0, visibleCount) : cards).filter(
    (card) => !hiddenInstanceIds?.includes(card.instanceId),
  );
  const reserveEndSlot = Boolean(hiddenInstanceIds?.length) || dealRevealActive;
  const hintDirection = pickHandScrollHint(canScrollLeft, canScrollRight);

  // Keep the newest (rightmost) cards in view when the hand overflows; track scroll hints.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateHint = () => {
      const next = measureHandScrollHints({
        scrollLeft: el.scrollLeft,
        clientWidth: el.clientWidth,
        scrollWidth: el.scrollWidth,
      });
      setCanScrollLeft(next.canScrollLeft);
      setCanScrollRight(next.canScrollRight);
    };

    el.scrollLeft = el.scrollWidth;
    updateHint();

    el.addEventListener('scroll', updateHint, { passive: true });
    const ro = new ResizeObserver(updateHint);
    ro.observe(el);
    const inner = el.firstElementChild;
    if (inner instanceof HTMLElement) ro.observe(inner);

    return () => {
      el.removeEventListener('scroll', updateHint);
      ro.disconnect();
    };
  }, [shown.length, reserveEndSlot, dealRevealActive]);

  const scrollByDirection = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(1, Math.round(el.clientWidth * HAND_SCROLL_STEP_RATIO));
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({
      left: direction === 'right' ? step : -step,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  };

  if (shown.length === 0 && !reserveEndSlot) {
    return (
      <p className="py-2 text-center text-sm text-stone-500" data-testid="player-hand-empty">
        Keine Karten auf der Hand.
      </p>
    );
  }

  return (
    <div
      data-testid="player-hand"
      className="relative min-w-0 max-w-full rounded-xl border border-stone-600/50 bg-stone-900/50 px-2 py-2 shadow-inner sm:px-3"
    >
      {hintDirection === 'right' && (
        <button
          type="button"
          data-testid="player-hand-scroll-hint-right"
          aria-label="Nach rechts scrollen"
          className="absolute right-2 top-1 z-10 border-0 bg-transparent p-0 text-red-500"
          onClick={() => scrollByDirection('right')}
        >
          <ChevronRight className="hand-scroll-hint-arrow hand-scroll-hint-arrow--right h-5 w-5 stroke-[2.5]" />
        </button>
      )}
      {hintDirection === 'left' && (
        <button
          type="button"
          data-testid="player-hand-scroll-hint-left"
          aria-label="Nach links scrollen"
          className="absolute left-2 top-1 z-10 border-0 bg-transparent p-0 text-red-500"
          onClick={() => scrollByDirection('left')}
        >
          <ChevronLeft className="hand-scroll-hint-arrow hand-scroll-hint-arrow--left h-5 w-5 stroke-[2.5]" />
        </button>
      )}

      {shown.length === 0 && dealRevealActive && (
        <p className="mb-1 text-center text-xs font-medium uppercase tracking-wider text-stone-500">
          Karten werden verteilt…
        </p>
      )}
      <div
        ref={scrollRef}
        data-testid="hand-fan-row"
        className="hand-fan-row min-w-0 max-w-full overflow-x-auto overscroll-x-contain pb-1 pt-1"
      >
        <div className="flex w-max min-w-full items-end justify-end gap-2 sm:gap-3">
          {shown.map((card, index) => {
            const selected =
              (pending?.type === 'attack' && pending.attackInstanceId === card.instanceId) ||
              (pending?.type === 'build' && pending.handInstanceId === card.instanceId);

            const handleClick = () => {
              if (card.interaction === 'activate-discard') {
                onActivateDiscard(card.instanceId);
                return;
              }
              if (!card.isPlayable && !card.isActivateDiscardOption) return;

              switch (card.interaction) {
                case 'attack':
                  onSelectAttack(card.instanceId);
                  break;
                case 'boost':
                  onPlayBoost(card.instanceId);
                  break;
                case 'build':
                  if (card.buildNeedsReplace) {
                    onStartBuildReplace(card.instanceId);
                  } else {
                    onBuildDirect(card.instanceId);
                  }
                  break;
                case 'block':
                  onPlayBlock(card.instanceId);
                  break;
                case 'discard-draw':
                  onDiscardDraw(card.instanceId);
                  break;
                case 'play-glitch':
                  onPlayGlitch(card.instanceId);
                  break;
                case 'play-item':
                  onPlayItem?.(card.instanceId);
                  break;
                default:
                  break;
              }
            };

            const clickable =
              card.isPlayable ||
              card.interaction === 'activate-discard' ||
              card.isActivateDiscardOption;

            const attackTitle =
              card.interaction === 'attack'
                ? hasChallengeTargets
                  ? 'Angriffskarte — Herausfordern oder Direktangriff'
                  : 'Angriffskarte — nur Direktangriff möglich'
                : undefined;

            const isNewestDeal =
              dealRevealActive && visibleCount !== undefined && index === shown.length - 1;

            const board = (
              <BoardCard
                def={card.def ?? undefined}
                glitchDef={card.glitchDef}
                itemDef={card.itemDef}
                formulaDef={card.formulaDef}
                defId={card.defId}
                name={card.glitchName ?? undefined}
                size="hand"
                selected={selected}
                playable={clickable && !selected}
                dimmed={!clickable && !selected}
                disabled={!clickable}
                onClick={handleClick}
                dataInteraction={card.interaction ?? undefined}
                tooltipHint={attackTitle}
              />
            );

            return (
              <div
                key={card.instanceId}
                data-hand-card-id={card.instanceId}
                data-selected-attack={selected && card.interaction === 'attack' ? 'true' : undefined}
                className={`hand-fan-card shrink-0 ${isNewestDeal ? 'hand-deal-enter' : ''}`}
              >
                {card.interaction === 'build' && clickable ? (
                  <DraggableHandCard card={card}>{board}</DraggableHandCard>
                ) : (
                  board
                )}
              </div>
            );
          })}

          {reserveEndSlot && (
            <div
              data-testid="hand-draw-slot"
              className="hand-draw-slot shrink-0"
              aria-hidden
            />
          )}
        </div>
      </div>
    </div>
  );
}
