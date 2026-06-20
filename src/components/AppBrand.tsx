/**
 * App header brand block — logo, title, subtitle.
 * Location: src/components/AppBrand.tsx
 */
import React from 'react';

export function AppBrand() {
  return (
    <div
      data-testid="app-brand"
      className="flex shrink-0 items-center gap-3 rounded-xl border border-stone-800/80 bg-gradient-to-br from-purple-950/50 to-stone-950/80 px-3 py-2"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-900/80 text-2xl shadow-inner ring-1 ring-purple-800/40">
        ⚔️
      </div>
      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold tracking-tight text-stone-100 sm:text-xl">
          Letz Fetz
        </h1>
        <p className="truncate text-xs text-stone-500 sm:text-sm">Prototype Engine</p>
      </div>
    </div>
  );
}
