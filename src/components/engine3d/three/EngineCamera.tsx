/**
 * Fixed perspective camera for engine detail preview.
 * Location: src/components/engine3d/three/EngineCamera.tsx
 */
import { PerspectiveCamera } from '@react-three/drei';

export function EngineCamera() {
  return (
    <PerspectiveCamera
      makeDefault
      position={[1.6, 1.1, 2.2]}
      fov={42}
      near={0.1}
      far={40}
    />
  );
}
