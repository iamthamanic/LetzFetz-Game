/**
 * Center preview: placeholder for formula combination (Effekseer/3D in #257).
 * Location: src/features/build/BuildPreviewPane.tsx
 */
import React, { useEffect, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Modal } from '../../components/ui/Modal';

interface BuildPreviewPaneProps {
  /** False while Build tab is hidden. */
  active: boolean;
  /** Card art for the last focused slotted card, if any. */
  focusImageUrl: string | null;
  focusLabel: string;
  /** Shown when ≥2 slots filled; null hides the badge. */
  combinationLabel: string | null;
}

export function BuildPreviewPane({
  active,
  focusImageUrl,
  focusLabel,
  combinationLabel,
}: BuildPreviewPaneProps) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!active) setFullscreen(false);
  }, [active]);

  const canExpand = Boolean(focusImageUrl);
  const modalTitle = combinationLabel ?? focusLabel;

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

      {focusImageUrl ? (
        <ImageWithFallback
          src={focusImageUrl}
          alt={focusLabel}
          className="h-full w-full object-contain p-3"
          data-testid="build-preview-card-art"
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
          {combinationLabel ? (
            <span
              className="mt-1 text-[11px] font-semibold text-violet-300/90"
              data-testid="build-preview-combination-empty-hint"
            >
              {combinationLabel}
            </span>
          ) : null}
        </div>
      )}

      <Modal
        open={fullscreen && canExpand}
        onClose={() => setFullscreen(false)}
        title={modalTitle}
        size="full"
        testId="build-preview-fullscreen-modal"
        bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden p-0"
      >
        <div className="min-h-0 flex-1 w-full bg-stone-950">
          {focusImageUrl ? (
            <ImageWithFallback
              src={focusImageUrl}
              alt={focusLabel}
              className="h-full w-full object-contain p-6"
            />
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
