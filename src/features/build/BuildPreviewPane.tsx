/**
 * Center preview: shared VFX viewport for formula combinations (#257).
 * Location: src/features/build/BuildPreviewPane.tsx
 */
import React, { useEffect, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { VfxSharedPreview } from './vfx/preview';

interface BuildPreviewPaneProps {
  /** False while Build tab is hidden. */
  active: boolean;
  /** Card art for the last focused slotted card, if any. */
  focusImageUrl: string | null;
  focusLabel: string;
  /** Shown when ≥2 slots filled; null hides the badge. */
  combinationLabel: string | null;
  /** True when at least one formula slot is filled. */
  hasSlottedCards?: boolean;
}

export function BuildPreviewPane({
  active,
  focusImageUrl,
  focusLabel,
  combinationLabel,
  hasSlottedCards = false,
}: BuildPreviewPaneProps) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!active) setFullscreen(false);
  }, [active]);

  const canExpand = hasSlottedCards || Boolean(focusImageUrl);
  const modalTitle = combinationLabel ?? focusLabel;
  const showPreview = hasSlottedCards || Boolean(combinationLabel);

  return (
    <div
      className="relative h-full min-h-0 overflow-hidden rounded-xl border border-amber-700/40 bg-gradient-to-b from-stone-900 via-stone-950 to-black shadow-[inset_0_0_40px_rgba(0,0,0,0.55)]"
      data-testid="build-preview"
    >
      <div className="absolute left-2 top-2 z-10">
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

      <div className="absolute right-2 top-2 z-10 flex max-w-[min(100%,18rem)] flex-col items-end gap-1">
        <span
          className="rounded border border-amber-600/50 bg-stone-950/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-200"
          data-testid="build-preview-mode"
        >
          Vorschau
        </span>
        {combinationLabel ? (
          <span
            className="rounded border border-violet-600/55 bg-violet-950/90 px-2 py-0.5 text-left text-[9px] font-semibold leading-snug text-violet-100"
            data-testid="build-preview-combination"
            title={combinationLabel}
          >
            {combinationLabel}
          </span>
        ) : null}
      </div>

      <div className="flex h-full min-h-0 flex-col p-2 pt-9">
        {showPreview ? (
          <VfxSharedPreview
            active={active}
            presetId="aura"
            className="min-h-0 flex-1"
            emptyMessage="Formel-Bausteine in die Formelplätze legen"
          />
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
        <div className="min-h-0 flex-1 w-full bg-stone-950 p-3">
          <VfxSharedPreview
            active={active && fullscreen}
            presetId="aura"
            className="h-full min-h-0"
            emptyMessage="Formel-Bausteine in die Formelplätze legen"
          />
        </div>
      </Modal>
    </div>
  );
}
