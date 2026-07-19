/**
 * Single bound-engine slot — card tray with tape label, not debug dropzone.
 * Location: src/components/game/BoundCardSlot.tsx
 */
import React from 'react';
import { BoardCard, type BoardCardSize } from './BoardCard';
import type { BoundSlotView } from './buildGameViewModel';
import { Button } from '../ui/Button';

const SLOT_DIM: Record<BoardCardSize, string> = {
  hand: 'w-24 h-36 sm:w-28 sm:h-40',
  bound: 'w-24 h-36 sm:w-28 sm:h-40',
  opponentBound: 'w-20 h-28 sm:w-24 sm:h-36',
  combat: 'w-64 h-96',
};

interface BoundCardSlotProps {
  slot: BoundSlotView;
  cardSize: BoardCardSize;
  phraseLabel?: string;
  snap?: boolean;
  onActivate?: (boundInstanceId: string) => void;
  onSlotClick?: () => void;
}

export function BoundCardSlot({
  slot,
  cardSize,
  phraseLabel,
  snap = false,
  onActivate,
  onSlotClick,
}: BoundCardSlotProps) {
  const dim = SLOT_DIM[cardSize];
  const hasCard = Boolean(slot.instanceId && (slot.def || slot.cardName));

  if (!hasCard) {
    return (
      <div
        className={`${dim} relative flex flex-col items-center justify-end overflow-hidden rounded-xl border border-stone-700/80 bg-black/45 shadow-[inset_0_2px_12px_rgba(0,0,0,0.65)]`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,120,60,0.07)_0%,transparent_65%)]" />
        {phraseLabel ? (
          <span className="absolute left-1.5 top-1 max-w-[calc(100%-0.75rem)] truncate rounded bg-stone-950/80 px-1 py-px text-[7px] font-bold uppercase tracking-[0.15em] text-amber-700/80">
            {phraseLabel}
          </span>
        ) : (
          <span className="absolute left-1.5 top-1 rounded bg-stone-950/80 px-1 py-px text-[7px] font-bold uppercase tracking-[0.2em] text-amber-700/70">
            Slot {slot.slotIndex + 1}
          </span>
        )}
        <span className="mb-3 text-[9px] uppercase tracking-wider text-stone-600/80">leer</span>
      </div>
    );
  }

  const highlight = slot.isTargetable || slot.isReplaceTarget;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        data-snap={snap ? 'true' : undefined}
        data-snap-glow={snap ? 'true' : undefined}
        className={`relative rounded-xl p-0.5 ${snap ? 'card-bind-snap slot-bind-glow' : ''} ${highlight ? 'ring-2 ring-amber-400/80 shadow-[0_0_14px_rgba(251,191,36,0.25)]' : 'ring-1 ring-stone-700/60'}`}
      >
        <BoardCard
          def={slot.def ?? undefined}
          name={slot.def ? undefined : slot.cardName ?? undefined}
          size={cardSize}
          exhausted={slot.exhausted}
          targetable={highlight}
          playable={highlight}
          onClick={highlight ? onSlotClick : undefined}
        />
      </div>
      {slot.isActivatable && onActivate && !slot.isReplaceTarget && (
        <Button
          variant="secondary"
          size="sm"
          className="px-2 py-0.5 text-[10px]"
          onClick={() => onActivate(slot.instanceId!)}
        >
          Aktivieren
        </Button>
      )}
      {slot.isTargetable && (
        <span className="text-[9px] font-semibold uppercase tracking-wide text-amber-400">
          Herausfordern
        </span>
      )}
      {slot.isReplaceTarget && (
        <span className="text-[9px] font-semibold uppercase tracking-wide text-purple-400">
          Ersetzen
        </span>
      )}
    </div>
  );
}
