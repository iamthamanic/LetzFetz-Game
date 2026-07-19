/**
 * Single bound-engine slot — card tray with tape label, not debug dropzone.
 * Location: src/components/game/BoundCardSlot.tsx
 */
import React from 'react';
import { BoardCard, type BoardCardSize } from './BoardCard';
import type { BoundSlotView } from './buildGameViewModel';
import { Button } from '../ui/Button';
import { resolveCardArtPath } from '../../services/cardArt/manifest';

const SLOT_DIM: Record<BoardCardSize, string> = {
  hand: 'w-24 h-36 sm:w-28 sm:h-40',
  bound: 'w-24 h-36 sm:w-28 sm:h-40',
  opponentBound: 'w-20 h-28 sm:w-24 sm:h-36',
  combat: 'w-64 h-96',
  showcase: 'w-64 h-96',
};

interface BoundCardSlotProps {
  slot: BoundSlotView;
  cardSize: BoardCardSize;
  snap?: boolean;
  /** Hide card face while the fly overlay is in the air. */
  flyingIn?: boolean;
  buildPending?: boolean;
  buildHasFreeSlot?: boolean;
  /** Character art faintly visible in empty slots. */
  ghostCharacterId?: string;
  onActivate?: (boundInstanceId: string) => void;
  onSlotClick?: () => void;
}

export function BoundCardSlot({
  slot,
  cardSize,
  snap = false,
  flyingIn = false,
  buildPending = false,
  buildHasFreeSlot = false,
  ghostCharacterId,
  onActivate,
  onSlotClick,
}: BoundCardSlotProps) {
  const dim = SLOT_DIM[cardSize];
  const showBuildPulse = buildPending && buildHasFreeSlot && !slot.instanceId;
  const showReplacePulse = buildPending && slot.isReplaceTarget;
  const ghostSrc = ghostCharacterId ? resolveCardArtPath(ghostCharacterId) : null;

  if (!slot.def || !slot.instanceId) {
    return (
      <div
        data-testid={showBuildPulse ? 'build-empty-slot' : undefined}
        title={showBuildPulse ? 'Freien Engine-Slot zum Bauen wählen' : undefined}
        onClick={showBuildPulse ? onSlotClick : undefined}
        className={`${dim} relative flex flex-col items-center justify-end overflow-hidden rounded-xl border bg-black/45 shadow-[inset_0_2px_12px_rgba(0,0,0,0.65)] ${
          showBuildPulse
            ? 'build-slot-pulse cursor-pointer border-purple-400/70 ring-2 ring-purple-400/50'
            : 'border-stone-700/80'
        }`}
      >
        {ghostSrc && (
          <img
            src={ghostSrc}
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-[0.14] saturate-50 contrast-110"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,120,60,0.07)_0%,transparent_65%)]" />
        <span className="absolute left-1.5 top-1 z-[1] rounded bg-stone-950/80 px-1 py-px text-[7px] font-bold uppercase tracking-[0.2em] text-amber-700/70">
          Slot {slot.slotIndex + 1}
        </span>
        {showBuildPulse ? (
          <span className="relative z-[1] mb-3 animate-pulse text-[10px] font-bold uppercase tracking-wider text-purple-300">
            Bauen
          </span>
        ) : (
          <span className="relative z-[1] mb-3 text-[9px] uppercase tracking-wider text-stone-600/80">
            leer
          </span>
        )}
      </div>
    );
  }

  const highlight =
    slot.isTargetable || slot.isReplaceTarget || showReplacePulse || slot.isChallengeSelected;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        data-bound-instance-id={slot.instanceId}
        data-targetable={slot.isTargetable ? 'true' : undefined}
        data-slot-index={slot.slotIndex}
        data-snap={snap ? 'true' : undefined}
        data-snap-glow={snap ? 'true' : undefined}
        data-flying-in={flyingIn ? 'true' : undefined}
        title={
          slot.isTargetable
            ? 'Herausforderung: Diese Engine-Karte als Ziel wählen'
            : showReplacePulse
              ? 'Diese Karte durch die gewählte Handkarte ersetzen'
              : undefined
        }
        className={`relative rounded-xl p-0.5 ${snap && !flyingIn ? 'card-build-snap slot-build-glow' : ''} ${
          flyingIn ? 'opacity-0' : ''
        } ${
          slot.isChallengeSelected
            ? 'ring-2 ring-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.45)]'
            : highlight
              ? 'ring-2 ring-amber-400/80 shadow-[0_0_14px_rgba(251,191,36,0.25)]'
              : 'ring-1 ring-stone-700/60'
        } ${showReplacePulse ? 'build-slot-pulse ring-purple-400/70' : ''}`}
      >
        <BoardCard
          def={slot.def}
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
          {slot.isChallengeSelected ? 'Ziel gewählt' : 'Als Ziel tippen'}
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
