/**
 * Primary Live-3D surface for the human board Engine-Zone + auto snapshot warmup.
 * Location: src/features/play/engine3d/BoardEngineLiveZone.tsx
 * Max one R3F canvas per view — mount only when this zone owns the recipe.
 */
import React, { useEffect, useRef, useState } from 'react';
import type { EngineRecipe } from '../../../game/types/engineVisual';
import { EnginePreviewCanvas } from '../../../components/engine3d';
import { prefersReducedMotion } from '../../../components/engine3d/prefersReducedMotion';
import { boardEngineWarmupDelayMs } from './boardEngineWarmup';
import { requestEngineSnapshot } from './rendering/requestEngineSnapshot';

interface BoardEngineLiveZoneProps {
  /** Active live recipe, or null for empty placeholder. */
  recipe: EngineRecipe | null;
  /** Optional label under the zone chrome. */
  heading?: string;
  /** Fired after a warmup attempt writes/reads the snapshot cache. */
  onSnapshotWarmed?: () => void;
}

export function BoardEngineLiveZone({
  recipe,
  heading = 'Live-3D',
  onSnapshotWarmed,
}: BoardEngineLiveZoneProps) {
  const [glCanvas, setGlCanvas] = useState<HTMLCanvasElement | null>(null);
  const [warmupHint, setWarmupHint] = useState<string | null>(null);
  const onWarmedRef = useRef(onSnapshotWarmed);
  onWarmedRef.current = onSnapshotWarmed;

  useEffect(() => {
    if (!recipe || !glCanvas) {
      setWarmupHint(null);
      return;
    }

    const delay = boardEngineWarmupDelayMs(prefersReducedMotion());
    const timer = window.setTimeout(() => {
      const result = requestEngineSnapshot(recipe, {
        canvas: glCanvas,
        allowPlaceholder: true,
        force: true,
      });
      if (result.source === 'canvas') {
        setWarmupHint('Snapshot automatisch gespeichert');
      } else if (result.source === 'placeholder') {
        setWarmupHint('Snapshot-Stub (Capture fehlgeschlagen)');
      } else if (result.source === 'cache') {
        setWarmupHint('Snapshot aus Cache');
      } else {
        setWarmupHint(null);
      }
      onWarmedRef.current?.();
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [recipe, glCanvas]);

  if (!recipe) {
    return (
      <div
        className="flex min-h-[7.5rem] items-center justify-center rounded-lg border border-dashed border-stone-700/80 bg-stone-950/40 px-3 py-4 text-center"
        data-testid="board-engine-live-empty"
        role="status"
      >
        <p className="text-xs text-stone-500">
          Keine aktive Engine — Träger binden für Live-3D.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5" data-testid="board-engine-live-zone">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500/90">
          {heading}
        </span>
        {warmupHint ? (
          <span className="text-[10px] text-stone-500" role="status">
            {warmupHint}
          </span>
        ) : null}
      </div>
      <EnginePreviewCanvas
        recipe={recipe}
        className="h-44 w-full max-w-md sm:h-52"
        onGlCanvasReady={setGlCanvas}
      />
    </div>
  );
}
