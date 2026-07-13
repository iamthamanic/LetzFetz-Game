/**
 * Human hand row with playable / dimmed card states and multi-step intents.
 * Location: src/components/game/HandFan.tsx
 */
import React from 'react';
import { BoardCard } from './BoardCard';
import { DraggableHandCard } from './DndPlaymat';
import type { HandCardView } from './buildGameViewModel';
import type { PendingIntent } from './gameActionHelpers';

interface HandFanProps {
  cards: HandCardView[];
  pending: PendingIntent | null;
  /** When set, only the first N cards are shown (opening deal reveal). */
  visibleCount?: number;
  /** Instance ids hidden until draw animation completes. */
  hiddenInstanceIds?: string[];
  hasChallengeTargets?: boolean;
  onSelectAttack: (instanceId: string) => void;
  onPlayBoost: (instanceId: string) => void;
  onBindDirect: (instanceId: string) => void;
  onStartBindReplace: (instanceId: string) => void;
  onPlayBlock: (instanceId: string) => void;
  onDiscardDraw: (instanceId: string) => void;
  onActivateDiscard: (instanceId: string) => void;
}

export function HandFan({
  cards,
  pending,
  visibleCount,
  hiddenInstanceIds,
  hasChallengeTargets = false,
  onSelectAttack,
  onPlayBoost,
  onBindDirect,
  onStartBindReplace,
  onPlayBlock,
  onDiscardDraw,
  onActivateDiscard,
}: HandFanProps) {
  const shown = (visibleCount !== undefined ? cards.slice(0, visibleCount) : cards).filter(
    (card) => !hiddenInstanceIds?.includes(card.instanceId),
  );

  if (shown.length === 0) {
    return (
      <p className="py-2 text-center text-sm text-stone-500" data-testid="player-hand-empty">
        {visibleCount === 0 ? 'Karten werden verteilt…' : 'Keine Karten auf der Hand.'}
      </p>
    );
  }

  return (
    <div
      data-testid="player-hand"
      className="rounded-xl border border-stone-600/50 bg-stone-900/50 px-2 py-2 shadow-inner sm:px-3"
    >
      <div className="flex items-end gap-2 overflow-x-auto pb-1 pt-1 sm:gap-3">
      {shown.map((card) => {
        const selected =
          (pending?.type === 'attack' && pending.attackInstanceId === card.instanceId) ||
          (pending?.type === 'bind' && pending.handInstanceId === card.instanceId);

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
            case 'bind':
              if (card.bindNeedsReplace) {
                onStartBindReplace(card.instanceId);
              } else {
                onBindDirect(card.instanceId);
              }
              break;
            case 'block':
              onPlayBlock(card.instanceId);
              break;
            case 'discard-draw':
              onDiscardDraw(card.instanceId);
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

        const cardEl = (
          <div
            key={card.instanceId}
            data-selected-attack={selected && card.interaction === 'attack' ? 'true' : undefined}
            title={attackTitle}
          >
            <BoardCard
              def={card.def ?? undefined}
              name={card.glitchName ?? undefined}
              size="hand"
              selected={selected}
              playable={clickable && !selected}
              dimmed={!clickable && !selected}
              disabled={!clickable}
              onClick={handleClick}
              dataInteraction={card.interaction ?? undefined}
            />
          </div>
        );

        if (card.interaction === 'bind' && clickable) {
          return (
            <DraggableHandCard key={card.instanceId} card={card}>
              {cardEl}
            </DraggableHandCard>
          );
        }
        return cardEl;
      })}
      </div>
    </div>
  );
}
