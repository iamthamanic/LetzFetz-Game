/**
 * Center preview: shared VFX viewport for formula combinations (#257).
 * Location: src/features/build/BuildPreviewPane.tsx
 */
import React, { forwardRef, useEffect, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import {
  BUILD_SLOT_LABEL_DE,
  type BuildSlotRole,
} from './model/buildTypes';
import { VfxSharedPreview, type VfxSharedPreviewHandle } from './vfx/preview';

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
  /** False while Build tab is hidden. */
  active: boolean;
  /** Label for single slotted card (badge only — never card art over VFX). */
  focusLabel: string;
  /** Filled roles driving badges + connections (≥1). */
  previewRoles: BuildSlotRole[];
  /** Accessible / modal title when ≥2 slots form a combination. */
  combinationLabel: string | null;
  /** True when at least one formula slot is filled. */
  hasSlottedCards?: boolean;
  /** Effekseer preset from VisualRecipe / MVP-9 mapper. */
  presetId?: string;
  /** Bottom-edge anchor for Combinate connection overlay. */
  connectionTargetRef?: React.Ref<HTMLDivElement>;
}

export const BuildPreviewPane = forwardRef<VfxSharedPreviewHandle, BuildPreviewPaneProps>(
  function BuildPreviewPane(
    {
      active,
      focusLabel,
      previewRoles,
      combinationLabel,
      hasSlottedCards = false,
      presetId = 'aura',
      connectionTargetRef,
    },
    ref,
  ) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!active) setFullscreen(false);
  }, [active]);

  const canExpand = hasSlottedCards;
  const isCombination = previewRoles.length >= 2;
  const singleRole = previewRoles.length === 1 ? previewRoles[0] : null;
  const showPreview = hasSlottedCards || Boolean(combinationLabel);
  const showConnection = previewRoles.length >= 1;
  const modalTitle = combinationLabel ?? (focusLabel || 'Vorschau');

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
      <div className="absolute left-2 top-2 z-30">
        <button
          type="button"
          disabled={!canExpand}
          data-testid="build-preview-fullscreen"
          aria-label="Vollbild-Vorschau öffnen"
          title="Vollbild"
          onClick={() => setFullscreen(true)}
          className="rounded border border-amber-600/50 bg-stone-950/85 p-1.5 text-amber-200 hover:border-amber-400/70 hover:bg-stone-900 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

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
            title={focusLabel}
          >
            <span
              className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${ROLE_BADGE[singleRole]}`}
              data-testid={`build-preview-role-${singleRole}`}
            >
              {BUILD_SLOT_LABEL_DE[singleRole]}
            </span>
            {focusLabel ? (
              <span className="max-w-[10rem] truncate rounded border border-stone-700/80 bg-stone-950/85 px-1.5 py-0.5 text-[9px] font-medium text-stone-200">
                {focusLabel}
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
        {showPreview ? (
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg">
            <VfxSharedPreview
              ref={ref}
              active={active}
              presetId={presetId}
              className="h-full min-h-0 [&_[data-testid=vfx-shared-preview-preset-label]]:opacity-50"
              showTimeline={false}
              emptyMessage="Formel-Bausteine in die Formelplätze legen"
            />
          </div>
        ) : (
          <div
            className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-stone-500"
            data-testid="build-preview-empty"
          >
            <span>Live-Vorschau</span>
            <span className="text-xs text-stone-600">
              Formel-Bausteine in die Formelplätze legen
            </span>
          </div>
        )}
      </div>

      <Modal
        open={fullscreen && canExpand}
        onClose={() => setFullscreen(false)}
        title={modalTitle}
        size="full"
        testId="build-preview-fullscreen-modal"
        bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden p-0"
      >
        <div className="relative min-h-0 flex-1 w-full bg-stone-950 p-3">
          <div className="relative h-full min-h-0 overflow-hidden rounded-lg">
            <VfxSharedPreview
              ref={ref}
              active={active && fullscreen}
              presetId={presetId}
              className="h-full min-h-0"
              showTimeline={false}
              emptyMessage="Formel-Bausteine in die Formelplätze legen"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
  },
);
