/**
 * Nachziehstapel on playmat — card backs + live count from engine piles.
 * Location: src/components/game/zones/DeckPile.tsx
 */
import React from 'react';
import type { CSSProperties } from 'react';
import { Badge } from '../../ui/Badge';
import { PileCardStack } from './PileCardStack';

interface DeckPileProps {
  count: number;
  className?: string;
  style?: CSSProperties;
}

export function DeckPile({ count, className = '', style }: DeckPileProps) {
  return (
    <div
      data-testid="deck-pile"
      data-pile-count={count}
      className={`pointer-events-none z-20 flex flex-col items-center justify-end gap-1 p-1 ${className}`}
      style={style}
      aria-label={`Nachziehstapel, ${count} Karten`}
    >
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-violet-300/90">
        Stapel
      </span>
      {count > 0 ? (
        <PileCardStack count={count} />
      ) : (
        <div
          data-testid="deck-pile-empty"
          className="flex aspect-[5/7] w-full max-w-[5.5rem] items-center justify-center rounded-sm border border-dashed border-stone-600/70 bg-stone-950/50 text-[10px] text-stone-500"
        >
          Leer
        </div>
      )}
      <Badge variant="info" className="text-[10px] tabular-nums">
        {count}
      </Badge>
    </div>
  );
}
