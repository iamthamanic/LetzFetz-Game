/**
 * VFX Studio — left node library with Asset Pipeline node add buttons.
 * Location: src/features/build/vfx/VfxNodeLibrary.tsx
 */
import React from 'react';
import { Box, Crosshair, MessageSquareText, Save, Scaling } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import {
  VFX_PIPELINE_NODE_TYPES,
  type VfxPipelineNodeType,
} from './nodes/vfxNodeTypes';
import type { TechniqueAsset } from './types/assets';
import { VFX_STATUS_LABEL_DE } from './nodes/vfxNodeTypes';

export type VfxStudioMode = 'assets' | 'formeln' | 'batch';

const ASSET_PIPELINE_NODES: Array<{
  type: VfxPipelineNodeType;
  labelDe: string;
  hint: string;
  icon: React.ReactNode;
}> = [
  {
    type: VFX_PIPELINE_NODE_TYPES.vfxPrompt,
    labelDe: 'Prompt',
    hint: 'Texteingabe für Meshy',
    icon: <MessageSquareText className="h-3.5 w-3.5" />,
  },
  {
    type: VFX_PIPELINE_NODE_TYPES.vfxMeshy,
    labelDe: 'Meshy 3D',
    hint: 'Text-to-3D via Worker',
    icon: <Box className="h-3.5 w-3.5" />,
  },
  {
    type: VFX_PIPELINE_NODE_TYPES.vfxNormalize,
    labelDe: 'Normalisieren',
    hint: 'Stub — Identity',
    icon: <Scaling className="h-3.5 w-3.5" />,
  },
  {
    type: VFX_PIPELINE_NODE_TYPES.vfxSocket,
    labelDe: 'Socket',
    hint: 'Stub — Default-Koords',
    icon: <Crosshair className="h-3.5 w-3.5" />,
  },
  {
    type: VFX_PIPELINE_NODE_TYPES.vfxSaveTechnique,
    labelDe: 'Technik speichern',
    hint: 'TechniqueAsset → Registry',
    icon: <Save className="h-3.5 w-3.5" />,
  },
];

const MODE_HINT: Record<VfxStudioMode, string> = {
  assets: 'Nodes hinzufügen und im Graph verbinden.',
  formeln: 'Formel-Pipeline: T + E + K kombinieren (demnächst).',
  batch: 'Batch-Render: ausstehende Kombinationen headless rendern.',
};

interface VfxNodeLibraryProps {
  mode: VfxStudioMode;
  onAddNode?: (type: VfxPipelineNodeType) => void;
  savedTechniques?: TechniqueAsset[];
}

export function VfxNodeLibrary({
  mode,
  onAddNode,
  savedTechniques = [],
}: VfxNodeLibraryProps) {
  return (
    <aside
      className="flex w-52 shrink-0 flex-col overflow-hidden border-r border-stone-800 bg-stone-900/60 sm:w-56"
      data-testid="vfx-studio-library"
    >
      <header className="flex-none border-b border-stone-800 px-3 py-2.5">
        <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100">
          Node-Bibliothek
        </h2>
        <p className="mt-1 text-[10px] leading-snug text-stone-500">{MODE_HINT[mode]}</p>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-2">
        {mode === 'assets' ? (
          <ul className="space-y-1.5">
            {ASSET_PIPELINE_NODES.map((entry) => (
              <li key={entry.type}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start gap-2 text-left"
                  icon={entry.icon}
                  onClick={() => onAddNode?.(entry.type)}
                  data-testid={`vfx-add-node-${entry.type}`}
                >
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-xs">{entry.labelDe}</span>
                    <span className="text-[9px] font-normal text-stone-500">{entry.hint}</span>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-1.5">
            {['technique', 'essence', 'catalyst', 'render'].map((category) => (
              <li key={category}>
                <div
                  className="rounded-lg border border-dashed border-stone-700/80 bg-stone-950/80 px-2.5 py-2"
                  data-testid={`vfx-studio-library-${category}`}
                >
                  <p className="text-xs font-semibold text-stone-200 capitalize">{category}</p>
                  <p className="mt-0.5 text-[10px] text-stone-500">Demnächst</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {mode === 'assets' && savedTechniques.length > 0 ? (
          <section className="mt-4 border-t border-stone-800 pt-3">
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-stone-400">
              Studio-Bibliothek
            </h3>
            <ul className="space-y-1">
              {savedTechniques.map((tech) => (
                <li
                  key={tech.id}
                  className="rounded border border-stone-800 bg-stone-950/80 px-2 py-1.5"
                  data-testid={`vfx-saved-technique-${tech.id}`}
                >
                  <p className="truncate text-[11px] font-medium text-stone-200">{tech.name}</p>
                  <p className="text-[9px] text-stone-500">
                    {VFX_STATUS_LABEL_DE[tech.status]} · v{tech.version}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </aside>
  );
}
