/**
 * VFX Studio — left node library with category placeholders.
 * Location: src/features/build/vfx/VfxNodeLibrary.tsx
 */
import React from 'react';

export type VfxStudioMode = 'assets' | 'formeln' | 'batch';

const LIBRARY_CATEGORIES = [
  { id: 'technique', labelDe: 'Technik' },
  { id: 'essence', labelDe: 'Essenz' },
  { id: 'catalyst', labelDe: 'Katalysator' },
  { id: 'render', labelDe: 'Render' },
] as const;

const MODE_HINT: Record<VfxStudioMode, string> = {
  assets: 'Asset-Pipeline: Bausteine per Drag & Drop (demnächst).',
  formeln: 'Formel-Pipeline: T + E + K kombinieren (demnächst).',
  batch: 'Batch-Render: gleiche Szene headless (demnächst).',
};

interface VfxNodeLibraryProps {
  mode: VfxStudioMode;
}

export function VfxNodeLibrary({ mode }: VfxNodeLibraryProps) {
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

      <ul className="min-h-0 flex-1 overflow-auto p-2">
        {LIBRARY_CATEGORIES.map((category) => (
          <li key={category.id} className="mb-1.5">
            <div
              className="rounded-lg border border-dashed border-stone-700/80 bg-stone-950/80 px-2.5 py-2"
              data-testid={`vfx-studio-library-${category.id}`}
            >
              <p className="text-xs font-semibold text-stone-200">{category.labelDe}</p>
              <p className="mt-0.5 text-[10px] text-stone-500">Platzhalter — noch keine Nodes</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
