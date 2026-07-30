/**
 * Center preview: 3D orbit when WebGL+GLB, else 2D master; fullscreen modal.
 * Location: src/features/build/BuildPreviewPane.tsx
 */
import React, { useEffect, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { detectWebGL } from '../../components/engine3d/EnginePreviewCanvas';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Modal } from '../../components/ui/Modal';
import type { MeshyCatalogPart } from './model/buildTypes';
import { BuildOrbitCanvas } from './BuildOrbitCanvas';

interface BuildPreviewPaneProps {
  /** False while Build tab is hidden — skip mounting Canvas. */
  active: boolean;
  glbParts: MeshyCatalogPart[];
  fallbackMasterUrl: string | null;
  fallbackLabel: string;
  /** Version pairing badge from catalog (2D↔3D). */
  pairLabelDe?: string | null;
  pairStatus?: MeshyCatalogPart['pairStatus'] | null;
}

function pairTone(status: MeshyCatalogPart['pairStatus'] | null | undefined): string {
  switch (status) {
    case 'matched':
      return 'border-emerald-700/50 bg-emerald-950/85 text-emerald-200';
    case 'stale':
      return 'border-amber-600/55 bg-amber-950/90 text-amber-100';
    case '2d-only':
      return 'border-stone-600/50 bg-stone-950/85 text-stone-400';
    default:
      return 'border-stone-600/50 bg-stone-950/85 text-stone-300';
  }
}

export function BuildPreviewPane({
  active,
  glbParts,
  fallbackMasterUrl,
  fallbackLabel,
  pairLabelDe,
  pairStatus,
}: BuildPreviewPaneProps) {
  const [webgl, setWebgl] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  useEffect(() => {
    if (!active) setFullscreen(false);
  }, [active]);

  const orbitParts = glbParts.flatMap((p) =>
    p.glbUrl ? [{ id: p.id, url: p.glbUrl }] : [],
  );
  const use3d = active && webgl && orbitParts.length > 0;
  const mode: '2D' | '3D' = use3d ? '3D' : '2D';
  const canExpand = use3d || Boolean(fallbackMasterUrl);
  const modalTitle = use3d
    ? glbParts.length === 1
      ? `${glbParts[0].name} — 3D`
      : '3D-Vorschau'
    : `${fallbackLabel} — 2D`;

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
          {mode}
        </span>
        {pairLabelDe ? (
          <span
            className={`rounded border px-2 py-0.5 text-left text-[9px] font-semibold leading-snug ${pairTone(pairStatus)}`}
            data-testid="build-preview-pair"
            title={pairLabelDe}
          >
            {pairLabelDe}
          </span>
        ) : null}
      </div>

      {use3d && !fullscreen ? (
        <BuildOrbitCanvas
          parts={orbitParts}
          className="h-full w-full touch-none"
          testId="build-preview-canvas"
        />
      ) : use3d && fullscreen ? (
        <div
          className="flex h-full items-center justify-center text-[11px] text-stone-500"
          data-testid="build-preview-fullscreen-placeholder"
        >
          Vollbild geöffnet…
        </div>
      ) : fallbackMasterUrl ? (
        <ImageWithFallback
          src={fallbackMasterUrl}
          alt={fallbackLabel}
          className="h-full w-full object-contain p-3"
          data-testid="build-preview-2d"
        />
      ) : (
        <div
          className="flex h-full items-center justify-center p-4 text-center text-sm text-stone-500"
          data-testid="build-preview-empty"
        >
          Live-Vorschau
          <br />
          <span className="mt-1 block text-xs text-stone-600">
            Teile in die Slots legen
          </span>
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
          {use3d ? (
            <BuildOrbitCanvas
              parts={orbitParts}
              className="h-full w-full touch-none"
              testId="build-preview-fullscreen-canvas"
            />
          ) : fallbackMasterUrl ? (
            <ImageWithFallback
              src={fallbackMasterUrl}
              alt={fallbackLabel}
              className="h-full w-full object-contain p-6"
            />
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
