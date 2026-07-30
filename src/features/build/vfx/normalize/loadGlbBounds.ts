/**
 * Browser GLB bounds loader via Three.js Box3.
 * Location: src/features/build/vfx/normalize/loadGlbBounds.ts
 */
import { Box3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { AabbBounds } from '../types/wireTypes';
import { DEFAULT_MOCK_BOUNDS } from './computeNormalizeTransform';

function box3ToBounds(box: Box3): AabbBounds | null {
  if (box.isEmpty()) return null;
  return {
    min: { x: box.min.x, y: box.min.y, z: box.min.z },
    max: { x: box.max.x, y: box.max.y, z: box.max.z },
  };
}

/** Load world-space AABB from a GLB URL. Returns null when load fails or bounds are empty. */
export async function loadGlbBounds(glbUrl: string): Promise<AabbBounds | null> {
  const trimmed = glbUrl.trim();
  if (!trimmed) return null;

  const loader = new GLTFLoader();
  try {
    const gltf = await loader.loadAsync(trimmed);
    const box = new Box3().setFromObject(gltf.scene);
    return box3ToBounds(box);
  } catch {
    return null;
  }
}

/** Fallback bounds when GLB is missing (mock demo path) or load fails. */
export function fallbackBoundsForGlb(_glbUrl: string): AabbBounds {
  return DEFAULT_MOCK_BOUNDS;
}
