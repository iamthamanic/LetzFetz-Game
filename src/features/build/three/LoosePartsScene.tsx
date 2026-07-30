/**
 * R3F scene: place Meshy WIP GLBs loosely (no socket assembly yet).
 * Location: src/features/build/three/LoosePartsScene.tsx
 * ADR: R3F hooks allowed under features/build/three/**
 */
import { useMemo } from 'react';
import { Bounds, Center, useGLTF } from '@react-three/drei';

export interface LoosePartUrl {
  id: string;
  url: string;
}

function LoadedGlb({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} />;
}

interface LoosePartsSceneProps {
  parts: LoosePartUrl[];
}

export function LoosePartsScene({ parts }: LoosePartsSceneProps) {
  if (parts.length === 0) return null;
  const span = 1.35;
  const mid = (parts.length - 1) / 2;

  return (
    <Bounds fit clip observe margin={1.35}>
      <group>
        {parts.map((part, index) => (
          <group key={part.id} position={[(index - mid) * span, 0, 0]}>
            <Center>
              <LoadedGlb url={part.url} />
            </Center>
          </group>
        ))}
      </group>
    </Bounds>
  );
}

export function preloadLoosePart(url: string): void {
  useGLTF.preload(url);
}
