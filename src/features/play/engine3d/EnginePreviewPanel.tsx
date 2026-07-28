/**
 * Play UI panel hosting the single Engine 3D preview canvas.
 * Location: src/features/play/engine3d/EnginePreviewPanel.tsx
 */
import React from 'react';
import { X } from 'lucide-react';
import type { EngineRecipe } from '../../../game/types/engineVisual';
import { createEngineDisplayName } from '../../../game/engine/engineRecipe';
import type { ContentPack } from '../../../game/types';
import { Button } from '../../../components/ui/Button';
import { Panel } from '../../../components/ui/Panel';
import { EnginePreviewCanvas } from './EnginePreviewCanvas';

interface EnginePreviewPanelProps {
  recipe: EngineRecipe;
  pack?: ContentPack;
  title?: string;
  onClose: () => void;
}

export function EnginePreviewPanel({
  recipe,
  pack,
  title,
  onClose,
}: EnginePreviewPanelProps) {
  const heading =
    title ??
    (pack ? createEngineDisplayName(pack, recipe) : 'Fetzgerät 3D');

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
        <EnginePreviewCanvas recipe={recipe} className="h-48 w-full" />
      </Panel>
    </div>
  );
}
