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
  /** Card currently mid-flight into the engine (hidden in slot until land). */
  flyingBuildCardIds?: string[];
  buildPending?: boolean;
  buildHasFreeSlot?: boolean;
  align?: 'center' | 'start';
  /** Character id whose art ghosts through empty engine slots. */
  ghostCharacterId?: string;
  onActivateBound?: (boundInstanceId: string) => void;
  onSlotClick?: (slot: BoundSlotView) => void;
}

export function BoundCardRow({
  label,
  slots,
  cardSize,
  snapBoundCardIds,
  flyingBuildCardIds,
  buildPending = false,
  buildHasFreeSlot = false,
  align = 'center',
  ghostCharacterId,
  onActivateBound,
  onSlotClick,
}: BoundCardRowProps) {
  const testId = label === 'Deine Engine' ? 'human-engine' : 'opponent-engine';
  const side = label === 'Deine Engine' ? 'human' : 'opponent';
  const rowAlign = align === 'start' ? 'items-start' : 'items-center';
  const slotsAlign = align === 'start' ? 'justify-start' : 'justify-center';

  return (
    <div className={`flex flex-col gap-2 ${rowAlign}`} data-testid={testId}>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500">{label}</span>
      <div className={`flex flex-wrap gap-2 sm:gap-3 ${slotsAlign}`}>
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
                flyingIn={
                  slot.instanceId
                    ? flyingBuildCardIds?.includes(slot.instanceId) ?? false
                    : false
                }
                buildPending={side === 'human' ? buildPending : false}
                buildHasFreeSlot={side === 'human' ? buildHasFreeSlot : false}
                ghostCharacterId={ghostCharacterId}
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