/**
 * Right column: combination preview card when ≥2 Formelplätze filled.
 * Location: src/features/build/BuildResultCard.tsx
 */
import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  BUILD_SLOT_LABEL_DE,
  BUILD_SLOT_ORDER,
  type BuildSlotRole,
  type BuildSlots,
} from './model/buildTypes';
import {
  buildCombinationLabel,
  countFilledSlots,
  findFormulaCard,
  type FormulaCatalogCard,
} from './model/combinateFormula';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import type { FormulaCombinationEntry } from '../../game/packs/v5/formulaCombinations';

interface BuildResultCardProps {
  name: string;
  onNameChange: (name: string) => void;
  slots: BuildSlots;
  catalog: FormulaCatalogCard[];
  /** Resolved catalog combination for current slots. */
  catalogCombination?: FormulaCombinationEntry | null;
  /** Optional captured hero-frame URL from preview save. */
  heroFrameUrl?: string | null;
  onSave?: () => void;
  saving?: boolean;
  saveMessage?: string | null;
  /** Apply catalog combination name into the name field. */
  onSuggestName?: () => void;
  suggestingName?: boolean;
  suggestNameError?: string | null;
}

const ROLE_CHIP: Record<BuildSlotRole, string> = {
  technik: 'border-emerald-600/50 bg-emerald-950/40 text-emerald-200',
  essenz: 'border-sky-600/50 bg-sky-950/40 text-sky-200',
  katalysator: 'border-amber-600/50 bg-amber-950/40 text-amber-200',
};

export function BuildResultCard({
  name,
  onNameChange,
  slots,
  catalog,
  catalogCombination = null,
  heroFrameUrl = null,
  onSave,
  saving = false,
  saveMessage = null,
  onSuggestName,
  suggestingName = false,
  suggestNameError = null,
}: BuildResultCardProps) {
  const filledCount = countFilledSlots(slots);
  const combinationLabel = buildCombinationLabel(slots);
  const canSave = filledCount >= 2 && Boolean(onSave);

  if (filledCount < 2 || !combinationLabel) {
    return (
      <aside
        className="flex h-full max-h-full w-56 shrink-0 flex-col overflow-hidden border-l border-stone-800 bg-stone-950/95"
        data-testid="build-result-empty"
      >
        <header className="flex-none border-b border-stone-800 px-2.5 py-2">
          <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100 sm:text-sm">
            Kombination
          </h2>
        </header>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-3 text-center">
          <p className="text-[11px] text-stone-500">
            Mindestens zwei Formelplätze belegen, um eine Kombination zu sehen.
          </p>
          <Button
            type="button"
            variant="secondary"
            disabled
            data-testid="build-result-save"
            className="w-full text-xs"
          >
            Speichern
          </Button>
          <p className="text-[10px] text-stone-600" data-testid="build-result-save-hint">
            Mindestens zwei Formelplätze belegen, um zu speichern.
          </p>
        </div>
      </aside>
    );
  }

  /** Only the saved/captured combination hero — never a single Baustein as stand-in. */
  const hero = heroFrameUrl ?? null;
  /** Filled Bausteine only (2er/3er) — order Technik → Essenz → Katalysator. */
  const comboPieces = BUILD_SLOT_ORDER.map((role) => {
    const cardId = slots[role];
    if (!cardId) return null;
    return { role, card: findFormulaCard(catalog, cardId) };
  }).filter((piece): piece is { role: BuildSlotRole; card: FormulaCatalogCard | null } => piece != null);

  return (
    <aside
      className="flex h-full max-h-full w-56 shrink-0 flex-col overflow-hidden border-l border-stone-800 bg-stone-950/95"
      data-testid="build-result"
    >
      <header className="flex-none border-b border-stone-800 px-2.5 py-2">
        <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100 sm:text-sm">
          Kombination
        </h2>
        <p className="mt-0.5 text-[10px] text-stone-500">Name anpassen und speichern</p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-2.5">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-amber-700/35 bg-gradient-to-b from-stone-800 to-stone-950 shadow-lg">
          <div className="relative min-h-0 flex-[1.35] overflow-y-auto bg-stone-900" data-testid="build-result-hero">
            {hero ? (
              <ImageWithFallback
                src={hero}
                alt={name}
                className="h-full w-full object-contain p-3"
              />
            ) : (
              <div
                role="group"
                className="flex h-full flex-col items-stretch justify-center gap-1.5 px-2 py-2"
                data-testid="build-result-combo-effect"
                aria-label={name.trim() || catalogCombination?.name || combinationLabel}
              >
                {comboPieces.map(({ role, card }) => (
                  <div
                    key={role}
                    className="min-h-0 flex-1 overflow-hidden rounded-md border border-stone-700/60 bg-stone-950/70"
                    data-testid={`build-result-combo-piece-${role}`}
                  >
                    {card?.imageUrl ? (
                      <ImageWithFallback
                        src={card.imageUrl}
                        alt={`${BUILD_SLOT_LABEL_DE[role]}: ${card.name}`}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <div
                        role="img"
                        className="h-full min-h-[3.5rem] w-full bg-stone-900/80"
                        aria-label={`${BUILD_SLOT_LABEL_DE[role]}: leer`}
                        data-testid={`build-result-combo-piece-empty-${role}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-none space-y-2 border-t border-stone-800 p-2 sm:p-2.5">
            <Input
              label="Name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              maxLength={48}
              data-testid="build-result-name"
              placeholder="Meine Formel"
              disabled={suggestingName}
              className="[&_input]:py-1.5 [&_span]:text-[9px]"
            />
            <Button
              type="button"
              variant="accent"
              size="sm"
              disabled={!onSuggestName || suggestingName || !catalogCombination}
              aria-busy={suggestingName}
              onClick={() => onSuggestName?.()}
              data-testid="build-result-suggest-name"
              icon={
                suggestingName ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                )
              }
              className="w-full text-[10px]"
            >
              Katalogname übernehmen
            </Button>
            {suggestNameError ? (
              <p
                className="text-center text-[10px] leading-snug text-red-400"
                data-testid="build-result-suggest-error"
              >
                {suggestNameError}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-1" data-testid="build-result-slots">
              {BUILD_SLOT_ORDER.map((role) => {
                const card = findFormulaCard(catalog, slots[role]);
                return (
                  <span
                    key={role}
                    className={`max-w-full truncate rounded border px-1.5 py-0.5 text-[9px] font-semibold ${ROLE_CHIP[role]}`}
                    title={
                      card
                        ? `${BUILD_SLOT_LABEL_DE[role]}: ${card.name}`
                        : BUILD_SLOT_LABEL_DE[role]
                    }
                  >
                    {card?.name ?? BUILD_SLOT_LABEL_DE[role]}
                  </span>
                );
              })}
            </div>

            <Button
              type="button"
              variant="primary"
              disabled={!canSave || saving || suggestingName}
              onClick={onSave}
              data-testid="build-result-save"
              className="w-full text-xs"
            >
              {saving ? 'Speichern…' : 'Speichern'}
            </Button>
            {saveMessage ? (
              <p
                className="text-center text-[10px] text-emerald-400/90"
                data-testid="build-result-save-message"
              >
                {saveMessage}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
