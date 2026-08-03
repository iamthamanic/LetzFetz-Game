/**
 * Ablagestapel on playmat — top card face-up when non-empty.
 * Location: src/features/play/board/zones/DiscardPile.tsx
 */
import React from 'react';
import type { CSSProperties } from 'react';
import type { ElementCardDef } from '../../../../game/types';
import { Badge } from '../../../../components/ui/Badge';
import { BoardCard } from '../BoardCard';
import { PileCardStack } from './PileCardStack';

interface DiscardPileProps {
  count: number;
  topCard?: ElementCardDef;
  className?: string;
  style?: CSSProperties;
}

export function DiscardPile({ count, topCard, className = '', style }: DiscardPileProps) {
  return (
    <div
      data-testid="discard-pile"
      data-pile-count={count}
      className={`z-20 flex flex-col items-center justify-end gap-1 p-1 ${className}`}
      style={style}
      aria-label={`Ablage, ${count} Karten`}
    >
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
        Ablage
      </span>
      {count > 0 && topCard ? (
        <div className="w-full max-w-[5.5rem]">
          <BoardCard def={topCard} size="opponentBound" />
        </div>
      ) : count > 0 ? (
        <PileCardStack count={count} />
      ) : (
        <div
          data-testid="discard-pile-empty"
          className="flex aspect-[5/7] w-full max-w-[5.5rem] items-center justify-center rounded-sm border border-dashed border-stone-600/70 bg-stone-950/40 text-[10px] text-stone-500"
        >
          Leer
        </div>
      )}
      <Badge variant="default" className="text-[10px] tabular-nums">
        {count}
      </Badge>
    </div>
  );
}
