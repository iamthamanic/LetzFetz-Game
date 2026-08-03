/**
 * Build → Combinate: V5 Formel-Bausteine library, slots, preview, combination card.
 * Location: src/features/build/BuildCombineView.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { FormulaLibraryPanel } from './FormulaLibraryPanel';
import { BuildSlotsPanel } from './BuildSlotsPanel';
import { BuildPreviewPane } from './BuildPreviewPane';
import { BuildResultCard } from './BuildResultCard';
import { BuildSlotConnectionOverlay } from './BuildSlotConnectionOverlay';
import { loadFormulaCardCatalog } from './data/formulaCardCatalog';
import {
  buildCombinationLabel,
  countFilledSlots,
  findFormulaCard,
  getFilledSlotRoles,
  type FormulaCatalogCard,
} from './model/combinateFormula';
import { buildFormulaRecipeFromSlots } from './model/combinateSave';
import {
  BUILD_SLOT_ORDER,
  type BuildSession,
  type BuildSlotRole,
} from './model/buildTypes';
import { loadBuildSession, saveBuildSession } from './storage/buildSessionStorage';
import { saveFormulaRecipe } from './vfx/registry';
import { findFormulaCombinationBySlots } from '../../game/packs/v5/formulaCombinations';

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

export function BuildCombineView({ active: _active }: BuildCombineViewProps) {
  const catalogRef = useRef(loadFormulaCardCatalog());
  const catalog = catalogRef.current;
  const combineStageRef = useRef<HTMLDivElement>(null);
  const previewTargetRef = useRef<HTMLDivElement>(null);
  const slotAnchorRefs = useRef<Partial<Record<BuildSlotRole, HTMLElement | null>>>({});
  const [session, setSession] = useState<BuildSession>(() => loadBuildSession().session);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [suggestNameError, setSuggestNameError] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Combo id whose catalog name was last applied; resets when slots resolve a new entry. */
  const syncedComboIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveBuildSession(session);
    }, 200);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [session]);

  useEffect(() => {
    return () => {
      if (saveFeedbackTimerRef.current) clearTimeout(saveFeedbackTimerRef.current);
    };
  }, []);

  const combinationLabel = buildCombinationLabel(session.slots);
  const previewRoles = getFilledSlotRoles(session.slots);
  const filledSlotCount = countFilledSlots(session.slots);
  const previewCards = BUILD_SLOT_ORDER.map((role) =>
    findFormulaCard(catalog, session.slots[role]),
  ).filter((card): card is FormulaCatalogCard => card != null);

  const techCard = findFormulaCard(catalog, session.slots.technik);
  const essCard = findFormulaCard(catalog, session.slots.essenz);
  const katCard = findFormulaCard(catalog, session.slots.katalysator);
  const catalogCombination =
    filledSlotCount >= 2
      ? findFormulaCombinationBySlots({
          techniqueName: techCard?.name ?? null,
          essenceName: essCard?.name ?? null,
          catalystName: katCard?.name ?? null,
        })
      : null;

  // Catalog name is the default display/save name whenever the resolved combo changes.
  useEffect(() => {
    if (!catalogCombination) {
      syncedComboIdRef.current = null;
      return;
    }
    if (syncedComboIdRef.current === catalogCombination.id) return;
    syncedComboIdRef.current = catalogCombination.id;
    setSession((prev) =>
      prev.name === catalogCombination.name
        ? prev
        : { ...prev, name: catalogCombination.name },
    );
  }, [catalogCombination?.id, catalogCombination?.name]);

  const handleApplyCatalogName = () => {
    if (!catalogCombination) {
      setSuggestNameError('Keine Katalog-Kombination für diese Slots.');
      return;
    }
    setSuggestNameError(null);
    syncedComboIdRef.current = catalogCombination.id;
    setSession((prev) => ({ ...prev, name: catalogCombination.name }));
  };

  const handleSaveCombination = () => {
    if (filledSlotCount < 2) return;

    setSaving(true);
    setSaveMessage(null);

    const recipe = buildFormulaRecipeFromSlots({
      slots: session.slots,
      name: session.name,
      heroFrame: null,
    });
    if (!recipe) {
      setSaving(false);
      return;
    }

    saveFormulaRecipe(recipe);
    setSaving(false);
    setSaveMessage('Kombination gespeichert — sichtbar unter Material → Formeln.');

    if (saveFeedbackTimerRef.current) clearTimeout(saveFeedbackTimerRef.current);
    saveFeedbackTimerRef.current = setTimeout(() => {
      setSaveMessage(null);
    }, 4000);
  };

  return (
    <div
      className="flex h-full max-h-full min-h-0 flex-row overflow-hidden"
      data-testid="build-combine"
    >
      <FormulaLibraryPanel cards={catalog} />

      <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden p-2 sm:gap-2.5 sm:p-3">
        <header className="flex-none">
          <h1 className="font-brand text-base uppercase tracking-wide text-amber-100 sm:text-lg">
            Combinate
          </h1>
        </header>

        <div
          ref={combineStageRef}
          className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-hidden sm:gap-5"
          data-testid="build-combine-stage"
        >
          <BuildSlotConnectionOverlay
            slots={session.slots}
            containerRef={combineStageRef}
            previewTargetRef={previewTargetRef}
            slotAnchorRefs={slotAnchorRefs}
          />

          <div className="relative z-[1] flex min-h-0 flex-[0.9] flex-col overflow-visible pb-1">
            <BuildPreviewPane
              connectionTargetRef={previewTargetRef}
              previewRoles={previewRoles}
              combinationLabel={combinationLabel}
              previewCards={previewCards}
              catalogCombination={catalogCombination}
              displayName={session.name}
            />
          </div>

          <div className="relative z-[1] flex min-h-0 flex-[1.1] flex-col overflow-visible pt-1">
            <BuildSlotsPanel
              slots={session.slots}
              catalog={catalog}
              onAssign={(cardId) =>
                setSession((prev) => assignCardToSession(prev, catalog, cardId))
              }
              onClear={(role) => setSession((prev) => clearSlot(prev, role))}
              onSlotAnchorRef={(role, el) => {
                slotAnchorRefs.current[role] = el;
              }}
            />
          </div>
        </div>
      </section>

      <BuildResultCard
        name={session.name}
        onNameChange={(name) => setSession((prev) => ({ ...prev, name }))}
        slots={session.slots}
        catalog={catalog}
        catalogCombination={catalogCombination}
        heroFrameUrl={null}
        onSave={handleSaveCombination}
        saving={saving}
        saveMessage={saveMessage}
        onSuggestName={handleApplyCatalogName}
        suggestingName={false}
        suggestNameError={suggestNameError}
      />
    </div>
  );
}
