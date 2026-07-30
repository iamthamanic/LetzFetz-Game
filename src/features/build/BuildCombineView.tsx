/**
 * Build → Combinate: V5 Formel-Bausteine library, slots, preview, combination card.
 * Location: src/features/build/BuildCombineView.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { FormulaLibraryPanel } from './FormulaLibraryPanel';
import { BuildSlotsPanel } from './BuildSlotsPanel';
import { BuildPreviewPane } from './BuildPreviewPane';
import { BuildResultCard } from './BuildResultCard';
import { loadFormulaCardCatalog } from './data/formulaCardCatalog';
import {
  buildCombinationLabel,
  countFilledSlots,
  findFormulaCard,
  type FormulaCatalogCard,
} from './model/combinateFormula';
import {
  type BuildSession,
  type BuildSlotRole,
} from './model/buildTypes';
import { loadBuildSession, saveBuildSession } from './storage/buildSessionStorage';

interface BuildCombineViewProps {
  /** True while Build → Combinate is visible. */
  active: boolean;
}

function assignCardToSession(
  session: BuildSession,
  catalog: FormulaCatalogCard[],
  cardId: string,
): BuildSession {
  const card = findFormulaCard(catalog, cardId);
  if (!card) return session;
  return {
    ...session,
    slots: {
      ...session.slots,
      [card.role]: cardId,
    },
    lastDroppedPartId: cardId,
  };
}

function clearSlot(session: BuildSession, role: BuildSlotRole): BuildSession {
  return {
    ...session,
    slots: {
      ...session.slots,
      [role]: null,
    },
  };
}

export function BuildCombineView({ active }: BuildCombineViewProps) {
  const catalogRef = useRef(loadFormulaCardCatalog());
  const catalog = catalogRef.current;
  const [session, setSession] = useState<BuildSession>(() => loadBuildSession().session);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveBuildSession(session);
    }, 200);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [session]);

  const combinationLabel = buildCombinationLabel(session.slots);
  const filledSlotCount = countFilledSlots(session.slots);

  const lastDropped = findFormulaCard(catalog, session.lastDroppedPartId);
  const anySlotted =
    findFormulaCard(catalog, session.slots.technik) ??
    findFormulaCard(catalog, session.slots.essenz) ??
    findFormulaCard(catalog, session.slots.katalysator);
  const focusCard = lastDropped ?? anySlotted;

  return (
    <div
      className="flex h-full min-h-0 flex-row overflow-hidden"
      data-testid="build-combine"
    >
      <FormulaLibraryPanel cards={catalog} />

      <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden p-2 sm:gap-2.5 sm:p-3">
        <header className="flex-none">
          <h1 className="font-brand text-base uppercase tracking-wide text-amber-100 sm:text-lg">
            Combinate
          </h1>
          <p className="text-[10px] text-stone-500 sm:text-[11px]">
            Formel-Bausteine kombinieren · Live-Vorschau mit Aura-Preset
          </p>
        </header>

        <div className="flex min-h-0 flex-col" style={{ flex: '0.75 1 0%' }}>
          <BuildPreviewPane
            active={active}
            focusImageUrl={focusCard?.imageUrl ?? null}
            focusLabel={focusCard?.name ?? 'Vorschau'}
            combinationLabel={combinationLabel}
            hasSlottedCards={filledSlotCount > 0}
          />
        </div>

        <div className="flex min-h-0 flex-col" style={{ flex: '1.35 1 0%' }}>
          <BuildSlotsPanel
            slots={session.slots}
            catalog={catalog}
            onAssign={(cardId) =>
              setSession((prev) => assignCardToSession(prev, catalog, cardId))
            }
            onClear={(role) => setSession((prev) => clearSlot(prev, role))}
          />
        </div>
      </section>

      <BuildResultCard
        name={session.name}
        onNameChange={(name) => setSession((prev) => ({ ...prev, name }))}
        slots={session.slots}
        catalog={catalog}
      />
    </div>
  );
}
