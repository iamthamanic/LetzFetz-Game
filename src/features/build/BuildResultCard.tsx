/**
 * Right column: combination preview card when ≥2 Formelplätze filled.
 * Location: src/features/build/BuildResultCard.tsx
 */
import React from 'react';
import { Input } from '../../components/ui/Input';
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

interface BuildResultCardProps {
  name: string;
  onNameChange: (name: string) => void;
  slots: BuildSlots;
  catalog: FormulaCatalogCard[];
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
}: BuildResultCardProps) {
  const filledCount = countFilledSlots(slots);
  const combinationLabel = buildCombinationLabel(slots);

  if (filledCount < 2 || !combinationLabel) {
    return (
      <aside
        className="flex h-full w-56 shrink-0 flex-col overflow-hidden border-l border-stone-800 bg-stone-950/95"
        data-testid="build-result-empty"
      >
        <header className="flex-none border-b border-stone-800 px-2.5 py-2">
          <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100 sm:text-sm">
            Kombination
          </h2>
        </header>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-3 text-center">
          <p className="text-[11px] text-stone-500">
            Mindestens zwei Formelplätze belegen, um eine Kombination zu sehen.
          </p>
        </div>
      </aside>
    );
  }

  const hero =
    findFormulaCard(catalog, slots.katalysator) ??
    findFormulaCard(catalog, slots.essenz) ??
    findFormulaCard(catalog, slots.technik);

  return (
    <aside
      className="flex h-full w-56 shrink-0 flex-col overflow-hidden border-l border-stone-800 bg-stone-950/95"
      data-testid="build-result"
    >
      <header className="flex-none border-b border-stone-800 px-2.5 py-2">
        <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100 sm:text-sm">
          Kombination
        </h2>
        <p className="mt-0.5 text-[10px] text-stone-500">Vorschau — Speichern folgt in #258</p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-2.5">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-amber-700/35 bg-gradient-to-b from-stone-800 to-stone-950 shadow-lg">
          <div className="relative min-h-0 flex-[1.35] bg-stone-900">
            {hero ? (
              <ImageWithFallback
                src={hero.imageUrl}
                alt={name}
                className="h-full w-full object-contain p-3"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-3 text-center text-[11px] text-stone-500">
                Hero-Frame folgt (#257)
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent px-2.5 pb-2 pt-10">
              <p className="font-brand text-sm uppercase leading-none tracking-wide text-brand-cream sm:text-base">
                {name.trim() || 'Unbenannt'}
              </p>
              <p
                className="mt-1 text-[9px] uppercase tracking-widest text-amber-500/80"
                data-testid="build-result-combination-label"
              >
                {combinationLabel}
              </p>
            </div>
          </div>

          <div className="flex-none space-y-2 border-t border-stone-800 p-2 sm:p-2.5">
            <Input
              label="Name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              maxLength={48}
              data-testid="build-result-name"
              placeholder="Meine Formel"
              className="[&_input]:py-1.5 [&_span]:text-[9px]"
            />

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
          </div>
        </div>
      </div>
    </aside>
  );
}
