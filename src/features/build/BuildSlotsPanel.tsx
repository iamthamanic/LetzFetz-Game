/**
 * Center slot row: three portrait card drop targets for Formel-Bausteine.
 * Location: src/features/build/BuildSlotsPanel.tsx
 */
import React, { useRef } from 'react';
import { X } from 'lucide-react';
import {
  BUILD_SLOT_LABEL_DE,
  BUILD_SLOT_ORDER,
  type BuildSlotRole,
  type BuildSlots,
} from './model/buildTypes';
import {
  FORMULA_CARD_DRAG_MIME,
  findFormulaCard,
  type FormulaCatalogCard,
} from './model/combinateFormula';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const SLOT_DRAG_MIME = 'application/x-letz-fetz-build-slot';

const SLOT_FRAME: Record<BuildSlotRole, { empty: string; filled: string; label: string }> = {
  technik: {
    empty: 'border-emerald-600/55 hover:border-emerald-400/70',
    filled: 'border-emerald-400/80 bg-emerald-950/30 shadow-[0_0_18px_rgba(52,211,153,0.18)]',
    label: 'text-emerald-300',
  },
  essenz: {
    empty: 'border-sky-600/55 hover:border-sky-400/70',
    filled: 'border-sky-400/80 bg-sky-950/30 shadow-[0_0_18px_rgba(56,189,248,0.18)]',
    label: 'text-sky-300',
  },
  katalysator: {
    empty: 'border-amber-500/55 hover:border-amber-400/70',
    filled: 'border-amber-400/80 bg-amber-950/30 shadow-[0_0_18px_rgba(251,191,36,0.16)]',
    label: 'text-amber-300',
  },
};

interface BuildSlotsPanelProps {
  slots: BuildSlots;
  catalog: FormulaCatalogCard[];
  onAssign: (cardId: string) => void;
  onClear: (role: BuildSlotRole) => void;
}

function readCardId(dataTransfer: DataTransfer): string | null {
  const typed = dataTransfer.getData(FORMULA_CARD_DRAG_MIME);
  if (typed) return typed;
  const plain = dataTransfer.getData('text/plain');
  return plain.length > 0 ? plain : null;
}

export function BuildSlotsPanel({
  slots,
  catalog,
  onAssign,
  onClear,
}: BuildSlotsPanelProps) {
  const droppedOnSlotRef = useRef(false);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden" data-testid="build-slots">
      <div className="mb-1 flex flex-none items-end justify-between gap-2 px-0.5">
        <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100">Formelplätze</h2>
        <p className="text-[9px] text-stone-500">Falscher Slot → Auto-Route</p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2 sm:gap-3">
        {BUILD_SLOT_ORDER.map((role) => {
          const cardId = slots[role];
          const card = findFormulaCard(catalog, cardId);
          const frame = SLOT_FRAME[role];
          return (
            <div
              key={role}
              data-testid={`build-slot-${role}`}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';
              }}
              onDrop={(event) => {
                event.preventDefault();
                droppedOnSlotRef.current = true;
                const fromSlot = event.dataTransfer.getData(SLOT_DRAG_MIME);
                if (fromSlot === role) return;
                const id = readCardId(event.dataTransfer);
                if (id) onAssign(id);
              }}
              className={`relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border-2 border-dashed bg-stone-900/80 ${
                card ? frame.filled : frame.empty
              }`}
            >
              <div className="flex flex-none items-center justify-between border-b border-stone-800/80 px-2 py-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${frame.label}`}>
                  {BUILD_SLOT_LABEL_DE[role]}
                </span>
                {card ? (
                  <button
                    type="button"
                    aria-label={`${BUILD_SLOT_LABEL_DE[role]} leeren`}
                    data-testid={`build-slot-clear-${role}`}
                    className="rounded p-0.5 text-stone-500 hover:bg-stone-800 hover:text-stone-200"
                    onClick={() => onClear(role)}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                ) : null}
              </div>

              {card ? (
                <button
                  type="button"
                  draggable
                  className="flex min-h-0 flex-1 cursor-grab flex-col active:cursor-grabbing"
                  onDragStart={(event) => {
                    droppedOnSlotRef.current = false;
                    event.dataTransfer.setData(FORMULA_CARD_DRAG_MIME, card.id);
                    event.dataTransfer.setData(SLOT_DRAG_MIME, role);
                    event.dataTransfer.setData('text/plain', card.id);
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragEnd={() => {
                    if (!droppedOnSlotRef.current) {
                      onClear(role);
                    }
                    droppedOnSlotRef.current = false;
                  }}
                >
                  <div className="min-h-0 flex-1 bg-stone-950/80 p-2">
                    <ImageWithFallback
                      src={card.imageUrl}
                      alt={card.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="flex-none truncate border-t border-stone-800 px-2 py-1.5 text-center text-[11px] font-semibold text-stone-100">
                    {card.name}
                  </span>
                  <span className="flex-none truncate border-t border-stone-800/80 px-1 py-0.5 text-center text-[8px] text-stone-500">
                    Stabilität {card.stability}
                  </span>
                </button>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1 bg-stone-950/40 px-2 text-center">
                  <span className="text-2xl leading-none text-stone-700" aria-hidden>
                    ▢
                  </span>
                  <span className="text-[11px] font-medium text-stone-500">Formelkarte ablegen</span>
                  <span className={`text-[9px] uppercase tracking-wide ${frame.label}`}>
                    {BUILD_SLOT_LABEL_DE[role]}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
