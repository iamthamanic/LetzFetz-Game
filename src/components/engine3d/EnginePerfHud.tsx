/**
 * Lightweight FPS / canvas-count overlay for engine preview (flag-gated).
 * Location: src/components/engine3d/EnginePerfHud.tsx
 * Hooks: useState, useRef, useEffect only.
 */
import React, { useEffect, useRef, useState } from 'react';

interface EnginePerfHudProps {
  /** True when WebGL canvas path is active (not fallback). */
  webglActive: boolean;
}

interface PerfSample {
  fps: number;
  canvasCount: number;
}

export function EnginePerfHud({ webglActive }: EnginePerfHudProps) {
  const [sample, setSample] = useState<PerfSample>({ fps: 0, canvasCount: 0 });
  const framesRef = useRef(0);
  const lastTsRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    framesRef.current = 0;
    lastTsRef.current = performance.now();

    const tick = (now: number) => {
      framesRef.current += 1;
      const elapsed = now - lastTsRef.current;
      if (elapsed >= 500) {
        const fps = Math.round((framesRef.current * 1000) / elapsed);
        const canvasCount =
          typeof document !== 'undefined'
            ? document.querySelectorAll('canvas').length
            : 0;
        setSample({ fps, canvasCount });
        framesRef.current = 0;
        lastTsRef.current = now;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="pointer-events-none absolute left-2 top-2 z-10 rounded bg-stone-950/85 px-2 py-1 font-mono text-[10px] leading-tight text-cyan-300"
      data-testid="engine-perf-hud"
      aria-hidden="true"
    >
      <p>FPS {sample.fps}</p>
      <p>Canvas {sample.canvasCount}</p>
      <p>{webglActive ? 'WebGL an' : 'WebGL aus'}</p>
    </div>
  );
}
