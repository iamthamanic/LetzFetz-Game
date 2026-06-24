/**
 * Human hand row with playable / dimmed card states and multi-step intents.
 * Location: src/components/game/HandFan.tsx
 */
import React from 'react';
import { BoardCard } from './BoardCard';
import type { HandCardView } from './buildGameViewModel';
import type { PendingIntent } from './gameActionHelpers';

interface HandFanProps {
  cards: HandCardView[];
  pending: PendingIntent | null;
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
  onSelectAttack,
  onPlayBoost,
  onBindDirect,
  onStartBindReplace,
  onPlayBlock,
  onDiscardDraw,
  onActivateDiscard,
}: HandFanProps) {
  if (cards.length === 0) {
    return (
      <p className="py-2 text-center text-sm text-stone-500">Keine Karten auf der Hand.</p>
    );
  }

  return (
    <div
      data-testid="player-hand"
      className="rounded-xl border border-stone-600/50 bg-stone-900/50 px-3 py-2 shadow-inner"
    >
      <div className="flex items-end gap-3 overflow-x-auto pb-1 pt-1">
      {cards.map((card) => {
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

        return (
          <BoardCard
            key={card.instanceId}
            def={card.def ?? undefined}
            name={card.glitchName ?? undefined}
            size="hand"
            selected={selected}
            playable={clickable && !selected}
            dimmed={!clickable && !selected}
            disabled={!clickable}
            onClick={handleClick}
          />
        );
      })}
      </div>
    </div>
  );
}
