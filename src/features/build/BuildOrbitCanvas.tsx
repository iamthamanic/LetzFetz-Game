/**
 * Shared orbit Canvas for Build 3D previews (inline + fullscreen).
 * Location: src/features/build/BuildOrbitCanvas.tsx
 */
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { LoosePartsScene, type LoosePartUrl } from './three/LoosePartsScene';

interface BuildOrbitCanvasProps {
  parts: LoosePartUrl[];
  className?: string;
  testId?: string;
}

export function BuildOrbitCanvas({ parts, className, testId }: BuildOrbitCanvasProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [1.4, 0.9, 1.6], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false }}
      data-testid={testId}
    >
      <color attach="background" args={['#0c0a09']} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 4, 2]} intensity={1.15} />
      <directionalLight position={[-2, 1, -1]} intensity={0.35} />
      <Suspense fallback={null}>
        <LoosePartsScene parts={parts} />
      </Suspense>
      <OrbitControls makeDefault enablePan={false} minDistance={0.8} maxDistance={8} />
    </Canvas>
  );
}
