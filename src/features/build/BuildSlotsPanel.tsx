/**
 * Center slot row: three Formelplatz nodes with drop targets.
 * Location: src/features/build/BuildSlotsPanel.tsx
 */
import React, { useRef, useState } from 'react';
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
import { FormulaCardDetailModal } from './FormulaCardDetailModal';

const SLOT_DRAG_MIME = 'application/x-letz-fetz-build-slot';

const SLOT_THEME: Record<
  BuildSlotRole,
  {
    empty: string;
    filled: string;
    label: string;
    port: string;
    header: string;
  }
> = {
  technik: {
    empty: 'border-emerald-700/50 bg-stone-900/70',
    filled:
      'border-emerald-400/90 bg-gradient-to-b from-emerald-950/80 to-stone-950 shadow-[0_0_24px_rgba(52,211,153,0.22)]',
    label: 'text-emerald-300',
    port: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]',
    header: 'border-emerald-800/60 bg-emerald-950/40',
  },
  essenz: {
    empty: 'border-sky-700/50 bg-stone-900/70',
    filled:
      'border-sky-400/90 bg-gradient-to-b from-sky-950/80 to-stone-950 shadow-[0_0_24px_rgba(56,189,248,0.22)]',
    label: 'text-sky-300',
    port: 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]',
    header: 'border-sky-800/60 bg-sky-950/40',
  },
  katalysator: {
    empty: 'border-amber-700/50 bg-stone-900/70',
    filled:
      'border-amber-400/90 bg-gradient-to-b from-amber-950/70 to-stone-950 shadow-[0_0_24px_rgba(251,191,36,0.2)]',
    label: 'text-amber-300',
    port: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.65)]',
    header: 'border-amber-800/60 bg-amber-950/35',
  },
};

interface BuildSlotsPanelProps {
  slots: BuildSlots;
  catalog: FormulaCatalogCard[];
  onAssign: (cardId: string) => void;
  onClear: (role: BuildSlotRole) => void;
  /** Top connection-port anchors for the Combinate overlay. */
  onSlotAnchorRef?: (role: BuildSlotRole, el: HTMLElement | null) => void;
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
  onSlotAnchorRef,
}: BuildSlotsPanelProps) {
  const droppedOnSlotRef = useRef(false);
  const [detailCard, setDetailCard] = useState<FormulaCatalogCard | null>(null);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-visible" data-testid="build-slots">
      <div className="mb-2 flex flex-none px-0.5">
        <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100">Formelplätze</h2>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-3 gap-3 sm:gap-4">
        {BUILD_SLOT_ORDER.map((role) => {
          const cardId = slots[role];
          const card = findFormulaCard(catalog, cardId);
          const theme = SLOT_THEME[role];
          const filled = Boolean(card);

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
              className={`relative flex min-h-0 min-w-0 flex-col overflow-visible rounded-lg border-2 ${
                filled ? theme.filled : `${theme.empty} border-dashed`
              }`}
            >
              <span
                ref={(el) => onSlotAnchorRef?.(role, el)}
                className={`pointer-events-none absolute left-1/2 top-0 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-stone-950 ${
                  filled ? theme.port : 'bg-stone-600 opacity-40'
                }`}
                aria-hidden
                data-testid={`build-slot-port-${role}`}
              />

              <div
                className={`flex flex-none items-center justify-between rounded-t-[6px] border-b px-2.5 py-1.5 ${
                  filled ? theme.header : 'border-stone-800/80 bg-stone-950/50'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.label}`}>
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
                <>
                  <button
                    type="button"
                    draggable
                    className="flex min-h-0 flex-1 cursor-grab flex-col overflow-hidden active:cursor-grabbing"
                    aria-label={`${card.name} verschieben`}
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
                    <div className="min-h-0 flex-1 bg-stone-950/60 p-2">
                      <ImageWithFallback
                        src={card.imageUrl}
                        alt={card.name}
                        className="h-full w-full object-contain drop-shadow-md"
                      />
                    </div>
                  </button>
                  <div className="flex-none border-t border-stone-800/80 bg-stone-950/80 px-2 py-1.5 text-center">
                    <button
                      type="button"
                      className="w-full truncate text-[11px] font-semibold text-stone-100 underline-offset-2 hover:text-amber-100 hover:underline"
                      data-testid={`build-slot-open-${role}`}
                      aria-label={`${card.name} Details öffnen`}
                      onClick={() => setDetailCard(card)}
                    >
                      {card.name}
                    </button>
                    <p className="truncate text-[8px] uppercase tracking-wide text-stone-500">
                      Stabilität {card.stability}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-b-[6px] bg-stone-950/30 px-3 text-center">
                  <span className="text-[10px] font-medium text-stone-500">Karte ablegen</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {detailCard ? (
        <FormulaCardDetailModal card={detailCard} onClose={() => setDetailCard(null)} />
      ) : null}
    </div>
  );
}
