/**
 * Loads one engine-part GLB and exposes a cloned scene via callback.
 * Location: src/components/engine3d/three/PartModel.tsx
 * ADR D4: R3F hooks allowed under engine3d/three/**
 */
import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { Object3D } from 'three';
import { cloneSceneSafe } from './model-utils';
import {
  applyEngineLook,
  elementHintFromPartId,
} from './EngineMaterials';

interface PartModelProps {
  url: string;
  assetId: string;
  /** Edge outline (caller disables for reduced-motion / low-end). */
  outline?: boolean;
  /** Called when clone is ready (and on cleanup with null). */
  onReady: (scene: Object3D | null) => void;
}

export function PartModel({ url, assetId, outline = true, onReady }: PartModelProps) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => {
    const next = cloneSceneSafe(scene);
    applyEngineLook(next, {
      elementHint: elementHintFromPartId(assetId),
      outline,
    });
    return next;
  }, [scene, assetId, outline]);

  useEffect(() => {
    onReady(cloned);
    return () => onReady(null);
  }, [cloned, onReady]);

  // Parenting is handled by WeaponAssembler via sockets.
  return null;
}

/** Preload helper for known MVP URLs (optional call sites). */
export function preloadPartModel(url: string): void {
  useGLTF.preload(url);
}
