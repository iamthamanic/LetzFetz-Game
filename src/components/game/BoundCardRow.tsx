/**
 * Four-slot bound engine row — always visible for human or opponent.
 * Location: src/components/game/BoundCardRow.tsx
 */
import React from 'react';
import { BoundCardSlot } from './BoundCardSlot';
import { DroppableSlot } from './DndPlaymat';
import type { BoundSlotView } from './buildGameViewModel';
import type { BoardCardSize } from './BoardCard';
import { PHRASE_SLOT_UI_LABELS } from './phraseSlotLabels';

interface BoundCardRowProps {
  label: string;
  slots: BoundSlotView[];
  cardSize: BoardCardSize;
  snapBoundCardIds?: string[];
  /** V2 packs: show Kern / Modus / Werkzeug / Ladung column labels. */
  showPhraseLabels?: boolean;
  onActivateBound?: (boundInstanceId: string) => void;
  onSlotClick?: (slot: BoundSlotView) => void;
}

export function BoundCardRow({
  label,
  slots,
  cardSize,
  snapBoundCardIds,
  showPhraseLabels = false,
  onActivateBound,
  onSlotClick,
}: BoundCardRowProps) {
  const testId = label === 'Deine Engine' ? 'human-engine' : 'opponent-engine';
  const side = label === 'Deine Engine' ? 'human' : 'opponent';

  return (
    <div className="flex flex-col items-center gap-2" data-testid={testId}>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500">{label}</span>
      <div className="flex max-w-full flex-wrap justify-center gap-2 sm:gap-3">
        {slots.map((slot) => {
          const isTarget = side === 'human'
            ? slot.isReplaceTarget || !slot.instanceId
            : slot.isTargetable;
          const phraseLabel =
            showPhraseLabels && slot.phraseSlot
              ? PHRASE_SLOT_UI_LABELS[slot.phraseSlot]
              : undefined;

          const slotNode = (
            <DroppableSlot
              slotId={`${side}-slot-${slot.slotIndex}`}
              side={side}
              slotIndex={slot.slotIndex}
              isTarget={isTarget}
            >
              <BoundCardSlot
                slot={slot}
                cardSize={cardSize}
                phraseLabel={phraseLabel}
                snap={slot.instanceId ? snapBoundCardIds?.includes(slot.instanceId) ?? false : false}
                onActivate={onActivateBound}
                onSlotClick={onSlotClick ? () => onSlotClick(slot) : undefined}
              />
            </DroppableSlot>
          );

          if (!showPhraseLabels || !phraseLabel) {
            return <React.Fragment key={slot.slotIndex}>{slotNode}</React.Fragment>;
          }

          return (
            <div
              key={slot.slotIndex}
              className="flex min-w-0 max-w-[5.5rem] flex-col items-center gap-1 sm:max-w-none"
              data-phrase-slot={slot.phraseSlot}
            >
              <span className="w-full truncate text-center text-[9px] font-bold uppercase tracking-[0.12em] text-stone-500 sm:text-[10px] sm:tracking-[0.18em]">
                {phraseLabel}
              </span>
              {slotNode}
            </div>
          );
        })}
      </div>
    </div>
  );
}
