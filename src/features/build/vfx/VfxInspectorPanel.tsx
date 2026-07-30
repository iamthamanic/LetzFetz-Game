/**
 * VFX Studio — right inspector placeholder panel.
 * Location: src/features/build/vfx/VfxInspectorPanel.tsx
 */
import React from 'react';

export function VfxInspectorPanel() {
  return (
    <aside
      className="flex w-52 shrink-0 flex-col overflow-hidden border-l border-stone-800 bg-stone-900/60 sm:w-56"
      data-testid="vfx-studio-inspector"
    >
      <header className="flex-none border-b border-stone-800 px-3 py-2.5">
        <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100">Inspektor</h2>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <p className="text-xs text-stone-500">Kein Node ausgewählt</p>
        <p className="mt-1 text-[10px] text-stone-600">
          Eigenschaften erscheinen hier, sobald Nodes im Graph landen.
        </p>
      </div>
    </aside>
  );
}
