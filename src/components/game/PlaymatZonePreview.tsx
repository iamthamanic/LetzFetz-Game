/**
 * DEV preview — top-down playmat + zone overlay (arena-agnostic layout).
 * Location: src/components/game/PlaymatZonePreview.tsx
 * Open: http://localhost:4789/?playmat-preview=1
 */
import React, { useMemo, useState } from 'react';
import { getPlaymatLayoutForArena } from './playmat';
import { PlaymatZoneOverlay } from './playmat/PlaymatZoneOverlay';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';

const PREVIEW_ARENA_ID = 'arena-spaeti';

export function PlaymatZonePreview() {
  const layout = useMemo(() => getPlaymatLayoutForArena(PREVIEW_ARENA_ID), []);
  const [showZones, setShowZones] = useState(true);
  const [bgFailed, setBgFailed] = useState(false);

  const bgSrc = bgFailed
    ? layout.assets.fallback
    : layout.assets.topdown ?? layout.assets.fallback;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-stone-950 text-stone-100">
      <header className="flex flex-none flex-wrap items-center justify-between gap-3 border-b border-stone-800 px-4 py-3">
        <div>
          <h1 className="text-lg font-bold text-amber-300">Playmat-Zonen ({PREVIEW_ARENA_ID})</h1>
          <p className="text-xs text-stone-400">
            DEV-Preview — Top-Down-Art unter{' '}
            <code className="text-amber-200/90">public/textures/playmat/</code> oder Fallback.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowZones((v) => !v)}>
            {showZones ? 'Zonen aus' : 'Zonen an'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => (window.location.search = '')}>
            Schließen
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-auto p-4 lg:flex-row lg:items-start lg:gap-4">
        <div
          className="relative w-full max-w-5xl shrink-0 overflow-hidden rounded-lg border border-stone-700 shadow-2xl"
          style={{
            aspectRatio: `${layout.viewBox.width} / ${layout.viewBox.height}`,
          }}
        >
          <img
            src={bgSrc}
            alt="Playmat Top-Down"
            className="absolute inset-0 h-full w-full object-contain"
            onError={() => setBgFailed(true)}
          />
          {showZones && (
            <PlaymatZoneOverlay layout={layout} className="pointer-events-none absolute inset-0 h-full w-full" />
          )}
        </div>

        <Panel dense className="w-full max-w-sm lg:sticky lg:top-4" title="Legende">
          <ul className="space-y-2 text-sm text-stone-300">
            {layout.zones.map((z) => (
              <li key={z.id}>
                <span className="font-semibold text-stone-100">{z.label}</span>
                <span className="text-stone-500">
                  {' '}
                  — {z.width}×{z.height} @ ({z.x},{z.y})
                </span>
              </li>
            ))}
            <li>
              <span className="font-semibold text-stone-100">Engine-Slots</span>
              <span className="text-stone-500">
                {' '}
                — je 4 ({layout.engineSlots.player[0].width}×{layout.engineSlots.player[0].height})
              </span>
            </li>
            <li>
              <span className="font-semibold text-stone-100">Hand</span>
              <span className="text-stone-500"> — Bogen unten (skaliertes SVG)</span>
            </li>
          </ul>
          <p className="mt-3 border-t border-stone-800 pt-3 text-xs text-stone-500">
            ViewBox {layout.viewBox.width}×{layout.viewBox.height} (skaliert aus Design{' '}
            {layout.designViewBox.width}×{layout.designViewBox.height}). Gegner-Charakter oben rechts;
            Engine-Slots mittig oben/unten.
          </p>
        </Panel>
      </div>
    </div>
  );
}
