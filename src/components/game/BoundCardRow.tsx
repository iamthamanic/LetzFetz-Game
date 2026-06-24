/**
 * Four-slot bound engine row — always visible for human or opponent.
 * Location: src/components/game/BoundCardRow.tsx
 */
import React from 'react';
import { BoundCardSlot } from './BoundCardSlot';
import type { BoundSlotView } from './buildGameViewModel';
import type { BoardCardSize } from './BoardCard';

interface BoundCardRowProps {
  label: string;
  slots: BoundSlotView[];
  cardSize: BoardCardSize;
  onActivateBound?: (boundInstanceId: string) => void;
  onSlotClick?: (slot: BoundSlotView) => void;
}

export function BoundCardRow({
  label,
  slots,
  cardSize,
  onActivateBound,
  onSlotClick,
}: BoundCardRowProps) {
  const testId = label === 'Deine Engine' ? 'human-engine' : 'opponent-engine';

  return (
    <div className="flex flex-col items-center gap-2" data-testid={testId}>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500">{label}</span>
      <div className="flex flex-wrap justify-center gap-3">
        {slots.map((slot) => (
          <BoundCardSlot
            key={slot.slotIndex}
            slot={slot}
            cardSize={cardSize}
            onActivate={onActivateBound}
            onSlotClick={onSlotClick ? () => onSlotClick(slot) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
