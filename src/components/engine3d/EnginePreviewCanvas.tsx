/**
 * Single R3F canvas for Fetzgerät detail preview (max one per view).
 * Location: src/components/engine3d/EnginePreviewCanvas.tsx
 * Outside three/**: only useState / useRef / useEffect.
 */
import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { EngineRecipe } from '../../game/types/engineVisual';
import { EnginePerfHud } from './EnginePerfHud';
import { isEnginePerfHudEnabled } from './enginePerfFlag';
import { prefersReducedMotion } from './prefersReducedMotion';
import { EngineCamera } from './three/EngineCamera';
import { EngineLighting } from './three/EngineLighting';
import {
  WeaponAssembler,
  type AssemblerIssue,
} from './three/WeaponAssembler';

export function detectWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl'),
    );
  } catch {
    return false;
  }
}

function LoadingFallback() {
  return (
    <Html center>
      <p className="rounded bg-stone-950/80 px-3 py-2 text-sm text-stone-300">
        3D-Modell wird geladen…
      </p>
    </Html>
  );
}

interface EnginePreviewCanvasProps {
  recipe: EngineRecipe;
  className?: string;
  /**
   * Live WebGL canvas for snapshot capture (`toDataURL`).
   * Called with the element after R3F create; `null` on unmount / no-WebGL paths.
   */
  onGlCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
}

export function EnginePreviewCanvas({
  recipe,
  className,
  onGlCanvasReady,
}: EnginePreviewCanvasProps) {
  const [webglOk, setWebglOk] = useState(true);
  const [issues, setIssues] = useState<AssemblerIssue[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [perfHud, setPerfHud] = useState(false);
  const onGlCanvasReadyRef = useRef(onGlCanvasReady);
  onGlCanvasReadyRef.current = onGlCanvasReady;

  useEffect(() => {
    setWebglOk(detectWebGL());
    setReducedMotion(prefersReducedMotion());
    setPerfHud(isEnginePerfHudEnabled());
  }, []);

  useEffect(() => {
    return () => {
      onGlCanvasReadyRef.current?.(null);
    };
  }, []);

  const onIssuesChange = useCallback((next: AssemblerIssue[]) => {
    setIssues(next);
  }, []);

  if (!webglOk) {
    return (
      <div
        className={`relative flex items-center justify-center rounded-lg border border-stone-700 bg-stone-950/90 p-4 text-center text-sm text-stone-300 ${className ?? ''}`}
        data-testid="engine-preview-no-webgl"
        role="status"
      >
        {perfHud ? <EnginePerfHud webglActive={false} /> : null}
        3D-Vorschau nicht verfügbar (WebGL fehlt).
      </div>
    );
  }

  if (!recipe.carrierId) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-stone-700 bg-stone-950/90 p-4 text-center text-sm text-stone-300 ${className ?? ''}`}
        data-testid="engine-preview-no-carrier"
        role="status"
      >
        Kein Träger gebunden — 3D-Assembly nicht möglich.
      </div>
    );
  }

  const blockingIssue = !import.meta.env.DEV
    ? issues.find((i) => i.userMessage.includes('Socket fehlt'))
    : null;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-stone-700 bg-gradient-to-b from-stone-900 to-stone-950 ${className ?? ''}`}
      data-testid="engine-preview-canvas"
    >
      {perfHud ? <EnginePerfHud webglActive /> : null}
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%', minHeight: 180 }}
        onCreated={(state) => {
          onGlCanvasReadyRef.current?.(state.gl.domElement);
        }}
      >
        <color attach="background" args={['#1c1917']} />
        <EngineCamera />
        <EngineLighting />
        <Suspense fallback={<LoadingFallback />}>
          <WeaponAssembler
            recipe={recipe}
            reducedMotion={reducedMotion}
            onIssuesChange={onIssuesChange}
          />
        </Suspense>
      </Canvas>

      {import.meta.env.DEV && issues.length > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 max-h-24 overflow-y-auto bg-red-950/90 p-2 text-[10px] text-red-200"
          data-testid="engine-preview-dev-errors"
          role="alert"
        >
          {issues.map((issue) => (
            <p key={`${issue.assetId}-${issue.message}`}>
              [{issue.assetId}] {issue.message}
            </p>
          ))}
        </div>
      )}

      {!import.meta.env.DEV && blockingIssue && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-stone-950/85 p-4 text-center text-sm text-stone-200"
          role="alert"
        >
          {blockingIssue.userMessage}
        </div>
      )}

      {!import.meta.env.DEV && issues.length > 0 && !blockingIssue && (
        <p className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-amber-200/90">
          {issues[0]!.userMessage}
        </p>
      )}
    </div>
  );
}
