/**
 * Compact Formel-Kombinationsvorschau (thumbnail + catalog name + effect).
 * Location: src/components/cards/formula/FormulaComboPreview.tsx
 */
import React from 'react';
import type { FormulaCombinationEntry } from '../../../game/packs/v5/formulaCombinations';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { FormulaComboArt, FormulaComboArtPlaceholder } from './FormulaComboArt';
import {
  FORMULA_SLOT_LABEL_DE,
  type FormulaSlotRole,
} from './formulaSlotMeta';
import type { FormulaDisplayCard } from './formulaDisplayCard';

const ROLE_BADGE: Record<FormulaSlotRole, string> = {
  technik: 'border-emerald-500/60 bg-emerald-950/90 text-emerald-200',
  essenz: 'border-sky-500/60 bg-sky-950/90 text-sky-200',
  katalysator: 'border-amber-500/60 bg-amber-950/90 text-amber-200',
};

interface FormulaComboPreviewProps {
  previewRoles: FormulaSlotRole[];
  previewCards: FormulaDisplayCard[];
  catalogCombination: FormulaCombinationEntry | null;
  connectionTargetRef?: React.Ref<HTMLDivElement>;
  testId?: string;
  compact?: boolean;
}

export function FormulaComboPreview({
  previewRoles,
  previewCards,
  catalogCombination,
  connectionTargetRef,
  testId = 'formula-combo-preview',
  compact = false,
}: FormulaComboPreviewProps) {
  const isCombination = previewRoles.length >= 2;
  const focusCard = previewCards.length === 1 ? previewCards[0] : null;
  const showConnection = previewRoles.length >= 1;
  const showThumb = Boolean(focusCard) || isCombination;

  return (
    <div
      ref={connectionTargetRef}
      className={`relative min-h-0 overflow-visible rounded-xl border bg-gradient-to-b from-stone-900 via-stone-950 to-black shadow-[inset_0_0_40px_rgba(0,0,0,0.55)] ${
        isCombination
          ? 'border-violet-400/80 shadow-[0_0_24px_rgba(167,139,250,0.28)]'
          : 'border-stone-700/60'
      } ${compact ? 'min-h-[4.5rem]' : 'min-h-[6rem]'}`}
      data-testid={testId}
    >
      {showConnection ? (
        <span
          className={`pointer-events-none absolute bottom-0 left-1/2 z-20 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-stone-950 sm:h-3 sm:w-3 ${
            isCombination
              ? 'bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]'
              : 'bg-stone-500'
          }`}
          aria-hidden
          data-testid="formula-preview-connection-port"
        />
      ) : null}

      <div
        className={`relative flex items-start gap-2 overflow-hidden rounded-xl ${
          compact ? 'p-2' : 'p-2.5'
        }`}
      >
        {showThumb ? (
          <div className="flex-none" data-testid={`${testId}-thumb`}>
            {focusCard ? (
              <div
                className={`overflow-hidden rounded-lg border border-stone-700/70 bg-stone-950/80 ${
                  compact ? 'h-12 w-12' : 'h-16 w-16'
                }`}
              >
                <ImageWithFallback
                  src={focusCard.imageUrl}
                  alt={focusCard.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : catalogCombination ? (
              <FormulaComboArt
                slug={catalogCombination.slug}
                alt={catalogCombination.name}
                compact={compact}
              />
            ) : (
              <FormulaComboArtPlaceholder compact={compact} />
            )}
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {isCombination ? (
            <div className="flex flex-wrap items-center gap-1" data-testid={`${testId}-roles`}>
              <span className="text-[8px] font-semibold text-stone-400 sm:text-[9px]">
                Kombination aus
              </span>
              {previewRoles.map((role, index) => (
                <React.Fragment key={role}>
                  {index > 0 ? (
                    <span className="text-[9px] font-bold text-stone-500" aria-hidden>
                      +
                    </span>
                  ) : null}
                  <span
                    className={`rounded border px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide sm:text-[9px] ${ROLE_BADGE[role]}`}
                  >
                    {FORMULA_SLOT_LABEL_DE[role]}
                  </span>
                </React.Fragment>
              ))}
            </div>
          ) : null}

          {catalogCombination ? (
            <div data-testid={`${testId}-catalog`}>
              <p
                className={`font-brand uppercase leading-tight tracking-wide text-violet-100 ${
                  compact ? 'text-sm' : 'text-base'
                }`}
                data-testid={`${testId}-name`}
              >
                {catalogCombination.name}
              </p>
              <p
                className={`leading-snug text-stone-200 ${
                  compact ? 'text-[11px] line-clamp-2' : 'text-[12px]'
                }`}
                data-testid={`${testId}-effect`}
              >
                {catalogCombination.effect}
              </p>
            </div>
          ) : isCombination ? (
            <p className="text-[11px] text-stone-500" data-testid={`${testId}-missing`}>
              Keine Katalog-Kombination für diese Belegung.
            </p>
          ) : focusCard ? (
            <div data-testid={`${testId}-single`}>
              <p className="font-brand text-sm uppercase tracking-wide text-stone-100">
                {focusCard.name}
              </p>
              <p className="line-clamp-2 text-[11px] leading-snug text-stone-300">
                {focusCard.effectText}
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-stone-500" data-testid={`${testId}-empty`}>
              Formelplätze belegen — Kombination erscheint hier
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
