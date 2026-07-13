/**
 * Four-slot bound engine row — always visible for human or opponent.
 * Location: src/components/game/BoundCardRow.tsx
 */
import React from 'react';
import { BoundCardSlot } from './BoundCardSlot';
import { DroppableSlot } from './DndPlaymat';
import type { BoundSlotView } from './buildGameViewModel';
import type { BoardCardSize } from './BoardCard';

interface BoundCardRowProps {
  label: string;
  slots: BoundSlotView[];
  cardSize: BoardCardSize;
  snapBoundCardIds?: string[];
  bindPending?: boolean;
  bindHasFreeSlot?: boolean;
  onActivateBound?: (boundInstanceId: string) => void;
  onSlotClick?: (slot: BoundSlotView) => void;
}

export function BoundCardRow({
  label,
  slots,
  cardSize,
  snapBoundCardIds,
  bindPending = false,
  bindHasFreeSlot = false,
  onActivateBound,
  onSlotClick,
}: BoundCardRowProps) {
  const testId = label === 'Deine Engine' ? 'human-engine' : 'opponent-engine';
  const side = label === 'Deine Engine' ? 'human' : 'opponent';

  return (
    <div className="flex flex-col items-center gap-2" data-testid={testId}>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500">{label}</span>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {slots.map((slot) => {
          const isTarget = side === 'human'
            ? slot.isReplaceTarget || !slot.instanceId
            : slot.isTargetable;
          return (
            <DroppableSlot
              key={slot.slotIndex}
              slotId={`${side}-slot-${slot.slotIndex}`}
              side={side}
              slotIndex={slot.slotIndex}
              isTarget={isTarget}
            >
              <BoundCardSlot
                slot={slot}
                cardSize={cardSize}
                snap={slot.instanceId ? snapBoundCardIds?.includes(slot.instanceId) ?? false : false}
                bindPending={side === 'human' ? bindPending : false}
                bindHasFreeSlot={side === 'human' ? bindHasFreeSlot : false}
                onActivate={onActivateBound}
                onSlotClick={onSlotClick ? () => onSlotClick(slot) : undefined}
              />
            </DroppableSlot>
          );
        })}
      </div>
    </div>
  );
}