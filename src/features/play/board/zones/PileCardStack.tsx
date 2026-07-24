/**
 * Shared stacked card-back visual for deck/discard piles.
 * Location: src/features/play/board/zones/PileCardStack.tsx
 */
import React from 'react';
import { CardBackFace } from '../../../../components/cards/CardBackFace';

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

  return (
    <div className={`relative mx-auto aspect-[5/7] w-full max-w-[5.5rem] ${className}`}>
      {Array.from({ length: layers }, (_, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            transform: `translate(${i * 3}px, ${-i * 3}px)`,
            zIndex: i,
          }}
        >
          <CardBackFace className="h-full w-full" />
        </div>
      ))}
    </div>
  );
}
