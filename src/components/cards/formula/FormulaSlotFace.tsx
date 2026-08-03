/**
 * Single Formelplatz face — card art + role badge (Build/Play shared).
 * Location: src/components/cards/formula/FormulaSlotFace.tsx
 */
import React from 'react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import {
  FORMULA_SLOT_LABEL_DE,
  FORMULA_SLOT_THEME,
  type FormulaSlotRole,
} from './formulaSlotMeta';
import type { FormulaSlotOccupant } from './formulaDisplayCard';

interface FormulaSlotFaceProps {
  role: FormulaSlotRole;
  occupant: FormulaSlotOccupant | null;
  testIdPrefix: string;
  /** Top connection-port anchor. */
  onPortRef?: (el: HTMLElement | null) => void;
  /** Challenge / select target. */
  targetable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  /** Open Material-style detail. */
  onOpenDetail?: () => void;
  compact?: boolean;
}

export function FormulaSlotFace({
  role,
  occupant,
  testIdPrefix,
  onPortRef,
  targetable = false,
  selected = false,
  onSelect,
  onOpenDetail,
  compact = false,
}: FormulaSlotFaceProps) {
  const theme = FORMULA_SLOT_THEME[role];
  const filled = Boolean(occupant);
  const card = occupant?.card ?? null;
  const stateNote = occupant?.fesselIntensity
    ? `Fessel ${occupant.fesselIntensity}`
    : occupant?.disturbed
      ? 'gestört'
      : occupant?.elementalCharge
        ? 'GELADEN'
        : occupant?.exhausted
          ? 'erschöpft'
          : null;

  const handleOpenDetail = () => {
    onOpenDetail?.();
  };

  const interactiveDetail = Boolean(card && onOpenDetail);

  return (
    <div
      data-testid={`${testIdPrefix}-slot-${role}`}
      data-formula-slot={role}
      data-targetable={targetable ? 'true' : undefined}
      data-challenge-selected={selected ? 'true' : undefined}
      className={`relative flex min-h-0 min-w-0 flex-col overflow-visible rounded-lg border-2 ${
        filled ? theme.filled : `${theme.empty} border-dashed`
      } ${selected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-950' : ''} ${
        targetable && !selected ? 'hover:ring-2 hover:ring-amber-500/60' : ''
      }`}
    >
      <span
        ref={onPortRef}
        className={`pointer-events-none absolute left-1/2 top-0 z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-stone-950 sm:h-3 sm:w-3 ${
          filled ? theme.port : 'bg-stone-600 opacity-40'
        }`}
        aria-hidden
        data-testid={`${testIdPrefix}-port-${role}`}
      />

      <div
        className={`flex flex-none items-center justify-between gap-1 rounded-t-[6px] border-b px-1.5 py-1 sm:px-2 sm:py-1.5 ${
          filled ? theme.header : 'border-stone-800/80 bg-stone-950/50'
        }`}
      >
        <span className={`text-[9px] font-bold uppercase tracking-wider sm:text-[10px] ${theme.label}`}>
          {FORMULA_SLOT_LABEL_DE[role]}
        </span>
        {stateNote ? (
          <span
            className={`text-[8px] uppercase tracking-wide sm:text-[9px] ${
              occupant?.fesselIntensity
                ? 'font-bold text-violet-300'
                : occupant?.elementalCharge && !occupant?.disturbed
                  ? 'font-bold text-amber-300'
                  : 'text-rose-300'
            }`}
            data-testid={
              occupant?.fesselIntensity
                ? `${testIdPrefix}-fessel`
                : occupant?.elementalCharge
                  ? `${testIdPrefix}-elemental-charge`
                  : undefined
            }
            title={
              occupant?.fesselIntensity
                ? `Fesselstufe ${occupant.fesselIntensity} — Startphase aktualisiert`
                : occupant?.elementalCharge
                  ? 'Elementarladung — nur passende Aktionsangriffe'
                  : undefined
            }
          >
            {occupant?.fesselIntensity
              ? `⛓ Fessel ${occupant.fesselIntensity}`
              : occupant?.elementalCharge && !occupant?.disturbed
                ? '⚡ ELEMENTARLADUNG'
                : stateNote}
          </span>
        ) : null}
        {targetable && onSelect ? (
          <button
            type="button"
            className="rounded border border-amber-500/50 bg-amber-950/70 px-1 py-0.5 text-[8px] font-semibold text-amber-200 hover:bg-amber-900/80 sm:text-[9px]"
            data-testid={`${testIdPrefix}-challenge-${role}`}
            aria-label={`${card?.name ?? FORMULA_SLOT_LABEL_DE[role]} als Herausforderungsziel wählen`}
            onClick={(event) => {
              event.stopPropagation();
              onSelect();
            }}
          >
            Ziel
          </button>
        ) : null}
      </div>

      {card ? (
        <button
          type="button"
          className={`flex min-h-0 flex-1 flex-col overflow-hidden text-left ${
            interactiveDetail ? 'cursor-pointer' : 'cursor-default'
          }`}
          aria-label={`${card.name} Details öffnen`}
          data-testid={`${testIdPrefix}-card-${role}`}
          onClick={interactiveDetail ? handleOpenDetail : undefined}
          disabled={!interactiveDetail}
        >
          <div
            className={`min-h-0 flex-1 bg-stone-950/60 ${compact ? 'p-1' : 'p-1.5 sm:p-2'} ${
              occupant?.exhausted || occupant?.disturbed ? 'opacity-60 grayscale-[0.35]' : ''
            }`}
          >
            <ImageWithFallback
              src={card.imageUrl}
              alt={card.name}
              className="pointer-events-none h-full w-full object-contain drop-shadow-md"
            />
          </div>
          <div className="flex-none border-t border-stone-800/80 bg-stone-950/80 px-1 py-1 text-center sm:px-2 sm:py-1.5">
            <span className="block truncate text-[10px] font-semibold text-stone-100 sm:text-[11px]">
              {card.name}
            </span>
            {!compact ? (
              <span className="block truncate text-[8px] uppercase tracking-wide text-stone-500">
                Stabilität {card.stability}
              </span>
            ) : null}
          </div>
        </button>
      ) : (
        <div
          className={`flex min-h-0 flex-1 flex-col items-center justify-center gap-1 rounded-b-[6px] bg-stone-950/30 px-2 text-center ${
            compact ? 'min-h-[4.5rem]' : 'min-h-[5.5rem]'
          }`}
        >
          <span className="text-[9px] font-medium text-stone-500 sm:text-[10px]">leer</span>
        </div>
      )}
    </div>
  );
}
