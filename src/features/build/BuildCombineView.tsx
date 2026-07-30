/**
 * Build → Combinate: V5 Formel-Bausteine library, slots, preview, combination card.
 * Location: src/features/build/BuildCombineView.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { FormulaLibraryPanel } from './FormulaLibraryPanel';
import { BuildSlotsPanel } from './BuildSlotsPanel';
import { BuildPreviewPane } from './BuildPreviewPane';
import { mapCombinateSlotsToPresetLayers } from './vfx/preview/visualRecipePresetLayers';
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
import { suggestCombinationNameWithAi } from './model/combinateNameSuggest';
import { buildFormulaRecipeFromSlots } from './model/combinateSave';
import {
  type BuildSession,
  type BuildSlotRole,
} from './model/buildTypes';
import { loadBuildSession, saveBuildSession } from './storage/buildSessionStorage';
import { saveFormulaRecipe } from './vfx/registry';
import type { VfxSharedPreviewHandle } from './vfx/preview';

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
  const previewRef = useRef<VfxSharedPreviewHandle>(null);
  const combineStageRef = useRef<HTMLDivElement>(null);
  const previewTargetRef = useRef<HTMLDivElement>(null);
  const slotAnchorRefs = useRef<Partial<Record<BuildSlotRole, HTMLElement | null>>>({});
  const [session, setSession] = useState<BuildSession>(() => loadBuildSession().session);
  const [savedHeroUrl, setSavedHeroUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [suggestingName, setSuggestingName] = useState(false);
  const [suggestNameError, setSuggestNameError] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestRequestRef = useRef(0);

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
  const previewPreset = mapCombinateSlotsToPresetLayers(session.slots, catalog);
  const singleSlotted =
    previewRoles.length === 1
      ? findFormulaCard(catalog, session.slots[previewRoles[0]])
      : null;

  const handleSuggestName = () => {
    if (countFilledSlots(session.slots) < 2) {
      setSuggestNameError('Mindestens zwei Formelplätze belegen.');
      return;
    }
    if (suggestingName) return;

    const requestId = suggestRequestRef.current + 1;
    suggestRequestRef.current = requestId;
    setSuggestingName(true);
    setSuggestNameError(null);

    const slotsSnapshot = {
      technik: session.slots.technik,
      essenz: session.slots.essenz,
      katalysator: session.slots.katalysator,
    };

    void suggestCombinationNameWithAi(slotsSnapshot, catalog)
      .then((aiName) => {
        if (suggestRequestRef.current !== requestId) return;
        if (!aiName) {
          setSuggestNameError('Kein Name erhalten.');
          return;
        }
        setSession((prev) => ({ ...prev, name: aiName }));
      })
      .catch((error: unknown) => {
        if (suggestRequestRef.current !== requestId) return;
        const message =
          error instanceof Error ? error.message : 'Namen erzeugen fehlgeschlagen.';
        setSuggestNameError(message.slice(0, 160));
      })
      .finally(() => {
        if (suggestRequestRef.current === requestId) {
          setSuggestingName(false);
        }
      });
  };

  const handleSaveCombination = () => {
    if (filledSlotCount < 2) return;

    setSaving(true);
    setSaveMessage(null);

    const heroFrame = previewRef.current?.captureHeroFrame() ?? null;
    const recipe = buildFormulaRecipeFromSlots({
      slots: session.slots,
      name: session.name,
      heroFrame,
    });
    if (!recipe) {
      setSaving(false);
      return;
    }

    saveFormulaRecipe(recipe);
    if (heroFrame?.url) {
      setSavedHeroUrl(heroFrame.url);
    }
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
              ref={previewRef}
              connectionTargetRef={previewTargetRef}
              active={active}
              focusLabel={singleSlotted?.name ?? 'Vorschau'}
              previewRoles={previewRoles}
              combinationLabel={combinationLabel}
              hasSlottedCards={filledSlotCount > 0}
              presetId={previewPreset.primaryPresetId}
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
        heroFrameUrl={savedHeroUrl}
        onSave={handleSaveCombination}
        saving={saving}
        saveMessage={saveMessage}
        onSuggestName={handleSuggestName}
        suggestingName={suggestingName}
        suggestNameError={suggestNameError}
      />
    </div>
  );
}
