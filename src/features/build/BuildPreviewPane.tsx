/**
 * Center Combinate preview: catalog combination name + effect.
 * Location: src/features/build/BuildPreviewPane.tsx
 */
import React from 'react';
import {
  BUILD_SLOT_LABEL_DE,
  type BuildSlotRole,
} from './model/buildTypes';
import type { FormulaCatalogCard } from './model/combinateFormula';
import type { FormulaCombinationEntry } from '../../game/packs/v5/formulaCombinations';

const ROLE_BADGE: Record<BuildSlotRole, string> = {
  technik: 'border-emerald-500/60 bg-emerald-950/90 text-emerald-200',
  essenz: 'border-sky-500/60 bg-sky-950/90 text-sky-200',
  katalysator: 'border-amber-500/60 bg-amber-950/90 text-amber-200',
};

const ROLE_FRAME: Record<BuildSlotRole, string> = {
  technik: 'border-emerald-400/70 shadow-[0_0_28px_rgba(52,211,153,0.28)]',
  essenz: 'border-sky-400/70 shadow-[0_0_28px_rgba(56,189,248,0.28)]',
  katalysator: 'border-amber-400/70 shadow-[0_0_28px_rgba(251,191,36,0.25)]',
};

const ROLE_PORT: Record<BuildSlotRole, string> = {
  technik: 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]',
  essenz: 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]',
  katalysator: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.75)]',
};

interface BuildPreviewPaneProps {
  previewRoles: BuildSlotRole[];
  combinationLabel: string | null;
  previewCards: FormulaCatalogCard[];
  /** Resolved catalog combination (≥2 slots), or null. */
  catalogCombination: FormulaCombinationEntry | null;
  /** Editable combination name from the result panel (overrides catalog title in UI). */
  displayName?: string;
  connectionTargetRef?: React.Ref<HTMLDivElement>;
}

export function BuildPreviewPane({
  previewRoles,
  combinationLabel,
  previewCards,
  catalogCombination,
  displayName = '',
  connectionTargetRef,
}: BuildPreviewPaneProps) {
  const isCombination = previewRoles.length >= 2;
  const singleRole = previewRoles.length === 1 ? previewRoles[0] : null;
  const showConnection = previewRoles.length >= 1;
  const focusCard = previewCards.length === 1 ? previewCards[0] : null;

  const frameClass = isCombination
    ? 'border-violet-400/80 shadow-[0_0_32px_rgba(167,139,250,0.35)]'
    : singleRole
      ? ROLE_FRAME[singleRole]
      : 'border-amber-700/40';

  const portClass = isCombination
    ? 'bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]'
    : singleRole
      ? ROLE_PORT[singleRole]
      : 'bg-violet-400';

  return (
    <div
      ref={connectionTargetRef}
      className={`relative h-full min-h-0 overflow-visible rounded-xl border bg-gradient-to-b from-stone-900 via-stone-950 to-black shadow-[inset_0_0_40px_rgba(0,0,0,0.55)] ${frameClass}`}
      data-testid="build-preview"
    >
      {showConnection ? (
        <span
          className={`pointer-events-none absolute bottom-0 left-1/2 z-20 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-stone-950 ${portClass}`}
          aria-hidden
          data-testid="build-preview-connection-port"
        />
      ) : null}

      <div className="absolute right-2 top-2 z-30 flex max-w-[min(100%,22rem)] flex-wrap items-center justify-end gap-1.5">
        {isCombination ? (
          <div
            className="flex flex-wrap items-center justify-end gap-1"
            data-testid="build-preview-combination"
            title={combinationLabel ?? undefined}
          >
            <span className="text-[9px] font-semibold text-stone-400">Kombination aus</span>
            {previewRoles.map((role, index) => (
              <React.Fragment key={role}>
                {index > 0 ? (
                  <span className="text-[10px] font-bold text-stone-500" aria-hidden>
                    +
                  </span>
                ) : null}
                <span
                  className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${ROLE_BADGE[role]}`}
                  data-testid={`build-preview-role-${role}`}
                >
                  {BUILD_SLOT_LABEL_DE[role]}
                </span>
              </React.Fragment>
            ))}
          </div>
        ) : singleRole ? (
          <div
            className="flex flex-wrap items-center justify-end gap-1"
            data-testid="build-preview-single"
            title={focusCard?.name}
          >
            <span
              className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${ROLE_BADGE[singleRole]}`}
              data-testid={`build-preview-role-${singleRole}`}
            >
              {BUILD_SLOT_LABEL_DE[singleRole]}
            </span>
            {focusCard?.name ? (
              <span className="max-w-[10rem] truncate rounded border border-stone-700/80 bg-stone-950/85 px-1.5 py-0.5 text-[9px] font-medium text-stone-200">
                {focusCard.name}
              </span>
            ) : null}
          </div>
        ) : (
          <span
            className="rounded border border-amber-600/50 bg-stone-950/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-200"
            data-testid="build-preview-mode"
          >
            Vorschau
          </span>
        )}
      </div>

      <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl p-2 pt-9">
        {catalogCombination ? (
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-1"
            data-testid="build-preview-catalog-combo"
          >
            <div className="flex min-h-full flex-col justify-center gap-2 py-1">
              <p
                className="font-brand text-base uppercase leading-tight tracking-wide text-violet-100 sm:text-lg"
                data-testid="build-preview-combo-name"
              >
                {displayName.trim() || catalogCombination.name}
              </p>
              {(catalogCombination.role || catalogCombination.primaryValue) && (
                <p className="text-[10px] uppercase tracking-widest text-stone-500">
                  {[catalogCombination.role, catalogCombination.primaryValue]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}
              <p
                className="text-[12px] leading-snug text-stone-200"
                data-testid="build-preview-combo-effect"
              >
                {catalogCombination.effect}
              </p>
              {catalogCombination.status ? (
                <p className="text-[9px] text-stone-600">{catalogCombination.status}</p>
              ) : null}
            </div>
          </div>
        ) : isCombination ? (
          <div
            className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center"
            data-testid="build-preview-combo-missing"
          >
            <p className="text-sm text-stone-400">Keine Katalog-Kombination</p>
            <p className="text-xs text-stone-600">
              Für diese Slot-Belegung gibt es noch keinen Eintrag im Kombi-Katalog.
            </p>
          </div>
        ) : focusCard ? (
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-1"
            data-testid="build-preview-single-card"
          >
            <div className="flex min-h-full flex-col justify-center gap-2 py-1">
              <p className="font-brand text-base uppercase tracking-wide text-stone-100">
                {focusCard.name}
              </p>
              <p className="text-[12px] leading-snug text-stone-300">{focusCard.effectText}</p>
              <p className="text-[10px] text-stone-500">
                Zweiten Formelplatz belegen, um die Kombination zu sehen.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-stone-500"
            data-testid="build-preview-empty"
          >
            <span>Kombinations-Vorschau</span>
            <span className="text-xs text-stone-600">
              Mindestens zwei Formelplätze belegen
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
