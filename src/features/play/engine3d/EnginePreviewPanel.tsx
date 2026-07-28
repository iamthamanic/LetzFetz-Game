/**
 * Play UI panel hosting the single Engine 3D preview canvas.
 * Location: src/features/play/engine3d/EnginePreviewPanel.tsx
 */
import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { EngineRecipe } from '../../../game/types/engineVisual';
import { createEngineDisplayName } from '../../../game/engine/engineRecipe';
import type { ContentPack } from '../../../game/types';
import { Button } from '../../../components/ui/Button';
import { Panel } from '../../../components/ui/Panel';
import { EnginePreviewCanvas } from '../../../components/engine3d';
import {
  requestEngineSnapshot,
  type EngineSnapshotSource,
} from './rendering/requestEngineSnapshot';

interface EnginePreviewPanelProps {
  recipe: EngineRecipe;
  pack?: ContentPack;
  title?: string;
  onClose: () => void;
}

function snapshotStatusDe(source: EngineSnapshotSource, hasData: boolean): string {
  if (source === 'cache') return 'Snapshot aus Cache';
  if (source === 'canvas') return 'Canvas-Snapshot gespeichert';
  if (source === 'placeholder') return 'Snapshot-Stub gespeichert (kein Canvas)';
  if (hasData) return 'Snapshot gespeichert';
  return 'Kein Snapshot verfügbar';
}

export function EnginePreviewPanel({
  recipe,
  pack,
  title,
  onClose,
}: EnginePreviewPanelProps) {
  const [snapshotHint, setSnapshotHint] = useState<string | null>(null);
  const [glCanvas, setGlCanvas] = useState<HTMLCanvasElement | null>(null);
  const heading =
    title ??
    (pack ? createEngineDisplayName(pack, recipe) : 'Fetzgerät 3D');

  const onCacheSnapshot = () => {
    // Prefer live WebGL canvas from open preview; stub only when capture unavailable.
    const result = requestEngineSnapshot(recipe, {
      canvas: glCanvas,
      allowPlaceholder: true,
      // Re-grab from canvas when available so an earlier stub does not stick.
      force: Boolean(glCanvas),
    });
    setSnapshotHint(snapshotStatusDe(result.source, Boolean(result.dataUrl)));
  };

  return (
    <div
      className="pointer-events-auto absolute bottom-3 left-3 z-40 w-[min(22rem,calc(100vw-1.5rem))]"
      data-testid="engine-preview-panel"
    >
      <Panel tone="game" dense className="border-cyan-800/50">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
              Fetzgerät 3D
            </p>
            <p className="text-xs text-stone-300">{heading}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            aria-label="3D-Vorschau schließen"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <EnginePreviewCanvas
          recipe={recipe}
          className="h-48 w-full"
          onGlCanvasReady={setGlCanvas}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onCacheSnapshot}
            data-testid="engine-snapshot-cache-btn"
          >
            Snapshot cachen
          </Button>
          {snapshotHint ? (
            <p className="text-[10px] text-stone-400" role="status">
              {snapshotHint}
            </p>
          ) : null}
        </div>
      </Panel>
    </div>
  );
}
