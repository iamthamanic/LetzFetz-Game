/**
 * Shared VFX preview: Three.js scene + Effekseer adapter + timeline scrub.
 * Used by VFX Studio (Formeln) and Build → Combinate.
 * Location: src/features/build/vfx/preview/VfxSharedPreview.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { getEffekseerAdapter, type EffekseerLoadState } from './effekseerAdapter';
import {
  probeEffectFile,
  resolveEffectPreset,
  type VfxEffectPresetDefinition,
} from './effectPresets';
import { VfxPreviewScene } from './VfxPreviewScene';

export interface VfxSharedPreviewProps {
  /** When false, WebGL canvas is not mounted (hidden tab). */
  active?: boolean;
  /** Built-in preset id, e.g. `aura`. Defaults to aura. */
  presetId?: string;
  /** Optional GLB URLs to display in the scene. */
  modelUrls?: string[];
  className?: string;
  /** Shown when preset id is unknown. */
  emptyMessage?: string;
  /** Hide timeline controls (e.g. compact embed). */
  showTimeline?: boolean;
  /** Controlled hero frame ms; falls back to preset default. */
  heroFrameMs?: number;
  onHeroFrameMsChange?: (ms: number) => void;
}

function formatMs(ms: number): string {
  return `${Math.round(ms)} ms`;
}

function resolveStatusLabel(
  preset: VfxEffectPresetDefinition | null,
  loadState: EffekseerLoadState,
  filePresent: boolean,
): string {
  if (!preset) return 'Effekt nicht gefunden';
  if (loadState === 'loading') return `${preset.labelDe} — wird geladen…`;
  if (filePresent) {
    return `${preset.labelDe} — Effekseer-Datei vorhanden (Stand-in aktiv)`;
  }
  return `${preset.labelDe} — Platzhalter-Vorschau`;
}

export function VfxSharedPreview({
  active = true,
  presetId = 'aura',
  modelUrls = [],
  className = '',
  emptyMessage = 'Kein Effekt ausgewählt',
  showTimeline = true,
  heroFrameMs: heroFrameMsProp,
  onHeroFrameMsChange,
}: VfxSharedPreviewProps) {
  const preset = resolveEffectPreset(presetId);
  const durationMs = preset?.durationMs ?? 3000;

  const [playheadMs, setPlayheadMs] = useState(0);
  const [heroFrameMsInternal, setHeroFrameMsInternal] = useState(
    () => preset?.defaultHeroFrameMs ?? 1200,
  );
  const [loadState, setLoadState] = useState<EffekseerLoadState>('idle');
  const [filePresent, setFilePresent] = useState(false);
  const adapterRef = useRef(getEffekseerAdapter());

  const heroFrameMs = heroFrameMsProp ?? heroFrameMsInternal;
  const setHeroFrameMs = onHeroFrameMsChange ?? setHeroFrameMsInternal;

  useEffect(() => {
    if (!preset) return;
    setPlayheadMs(0);
    if (heroFrameMsProp === undefined) {
      setHeroFrameMsInternal(preset.defaultHeroFrameMs);
    }
  }, [preset?.id, heroFrameMsProp]);

  useEffect(() => {
    if (!active || !preset) {
      setLoadState('idle');
      setFilePresent(false);
      return;
    }

    let cancelled = false;
    setLoadState('loading');

    void (async () => {
      const present = await probeEffectFile(preset.efkefcPath);
      if (cancelled) return;
      setFilePresent(present);
      const state = await adapterRef.current.loadEffect(preset.efkefcPath);
      if (cancelled) return;
      setLoadState(state);
    })();

    return () => {
      cancelled = true;
    };
  }, [active, preset?.efkefcPath]);

  const useStandIn = Boolean(preset) && loadState !== 'loading';
  const statusLabel = resolveStatusLabel(preset, loadState, filePresent);

  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden ${className}`}
      data-testid="vfx-shared-preview"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-stone-800 bg-stone-950">
        {!preset ? (
          <div
            className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 p-4 text-center text-sm text-stone-500"
            data-testid="vfx-shared-preview-missing"
          >
            <span>{emptyMessage}</span>
            <span className="text-xs text-stone-600">Effekt nicht gefunden</span>
          </div>
        ) : !active ? (
          <div
            className="flex h-full min-h-[12rem] items-center justify-center p-4 text-center text-xs text-stone-600"
            data-testid="vfx-shared-preview-inactive"
          >
            Vorschau pausiert
          </div>
        ) : (
          <>
            <Canvas
              className="h-full w-full"
              camera={{ position: [1.4, 0.9, 1.6], fov: 42 }}
              dpr={[1, 1.75]}
              gl={{ antialias: true, alpha: false }}
              data-testid="vfx-shared-preview-canvas"
            >
              <VfxPreviewScene
                preset={preset}
                playheadMs={playheadMs}
                durationMs={durationMs}
                modelUrls={modelUrls}
                useStandIn={useStandIn}
              />
            </Canvas>
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between gap-2 p-2">
              <span
                className="rounded border border-amber-600/50 bg-stone-950/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-200"
                data-testid="vfx-shared-preview-preset-label"
              >
                {statusLabel}
              </span>
            </div>
          </>
        )}
      </div>

      {showTimeline && preset && active ? (
        <div
          className="mt-2 flex flex-none flex-col gap-1.5 rounded-lg border border-stone-800 bg-stone-950/80 px-2.5 py-2"
          data-testid="vfx-shared-preview-timeline"
        >
          <div className="flex items-center justify-between gap-2 text-[10px] text-stone-500">
            <span>Timeline</span>
            <span data-testid="vfx-shared-preview-playhead">{formatMs(playheadMs)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={durationMs}
            step={16}
            value={playheadMs}
            onChange={(e) => setPlayheadMs(Number(e.target.value))}
            aria-label="Timeline scrub"
            data-testid="vfx-shared-preview-scrub"
            className="w-full accent-amber-500"
          />
          <div className="flex items-center justify-between gap-2 text-[10px] text-stone-500">
            <span>Hero-Frame</span>
            <span data-testid="vfx-shared-preview-hero-ms">{formatMs(heroFrameMs)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={durationMs}
            step={16}
            value={heroFrameMs}
            onChange={(e) => setHeroFrameMs(Number(e.target.value))}
            aria-label="Hero-Frame Position"
            data-testid="vfx-shared-preview-hero-scrub"
            className="w-full accent-violet-500"
          />
        </div>
      ) : null}
    </div>
  );
}
