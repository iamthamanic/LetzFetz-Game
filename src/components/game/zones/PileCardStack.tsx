/**
 * Shared stacked card-back visual for deck/discard piles.
 * Location: src/components/game/zones/PileCardStack.tsx
 */
import React from 'react';
import { resolveCardBackPath } from '../../../services/cardArt/manifest';

export function pileStackDepth(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count < 10) return 2;
  return 3;
}

interface PileCardStackProps {
  count: number;
  className?: string;
}

export function PileCardStack({ count, className = '' }: PileCardStackProps) {
  const layers = pileStackDepth(count);
  const back = resolveCardBackPath();

  return (
    <div className={`relative mx-auto aspect-[5/7] w-full max-w-[5.5rem] ${className}`}>
      {Array.from({ length: layers }, (_, i) => (
        <img
          key={i}
          src={back}
          alt=""
          aria-hidden
          data-testid="card-back"
          className="absolute inset-0 h-full w-full rounded-sm border border-stone-700/80 bg-stone-950 object-cover shadow-md"
          style={{
            transform: `translate(${i * 3}px, ${-i * 3}px)`,
            zIndex: i,
          }}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}
