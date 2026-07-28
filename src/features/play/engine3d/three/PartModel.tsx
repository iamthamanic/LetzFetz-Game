/**
 * Loads one engine-part GLB and exposes a cloned scene via callback.
 * Location: src/features/play/engine3d/three/PartModel.tsx
 * ADR D4: R3F hooks allowed under engine3d/three/**
 */
import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { Object3D } from 'three';
import { cloneSceneSafe } from './model-utils';

interface PartModelProps {
  url: string;
  assetId: string;
  /** Called when clone is ready (and on cleanup with null). */
  onReady: (scene: Object3D | null) => void;
}

export function PartModel({ url, onReady }: PartModelProps) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => cloneSceneSafe(scene), [scene]);

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
