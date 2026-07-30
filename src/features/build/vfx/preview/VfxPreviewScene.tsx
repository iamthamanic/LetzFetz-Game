/**
 * R3F scene content for shared VFX preview (model + effect stand-in).
 * Location: src/features/build/vfx/preview/VfxPreviewScene.tsx
 */
import { Suspense, useMemo, useRef, useState } from 'react';
import { Bounds, Center, Grid, OrbitControls, useGLTF } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { AuraParticleStandIn } from './AuraParticleStandIn';
import {
  VfxSocketMarkers,
  type VfxSocketMarkerEntry,
} from './VfxSocketMarkers';
import type { VfxEffectPresetDefinition } from './effectPresets';
import type { Vec3 } from '../types/wireTypes';
import type { VfxTechniqueSocketName } from '../sockets/vfxSocketRoles';

interface LoadedGlbProps {
  url: string;
}

function LoadedGlb({ url }: LoadedGlbProps) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} />;
}

export interface VfxPreviewSceneProps {
  preset: VfxEffectPresetDefinition;
  playheadMs: number;
  durationMs: number;
  modelUrls: string[];
  useStandIn: boolean;
  socketMarkers?: VfxSocketMarkerEntry[];
  activeSocket?: VfxTechniqueSocketName;
  editableSockets?: boolean;
  onSocketPositionChange?: (name: VfxTechniqueSocketName, position: Vec3) => void;
  onSelectSocket?: (name: VfxTechniqueSocketName) => void;
}

export function VfxPreviewScene({
  preset,
  playheadMs,
  durationMs,
  modelUrls,
  useStandIn,
  socketMarkers = [],
  activeSocket = 'essenceOrigin',
  editableSockets = false,
  onSocketPositionChange,
  onSelectSocket,
}: VfxPreviewSceneProps) {
  const showAuraStandIn = useStandIn && preset.category === 'aura';
  const orbitRef = useRef<OrbitControlsImpl>(null);
  const [orbitEnabled, setOrbitEnabled] = useState(true);

  return (
    <>
      <color attach="background" args={['#0c0a09']} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 4, 2]} intensity={1.1} />
      <directionalLight position={[-2, 1, -1]} intensity={0.3} />
      <Grid
        args={[4, 4]}
        cellSize={0.25}
        cellThickness={0.4}
        sectionSize={1}
        fadeDistance={5}
        infiniteGrid
        position={[0, -0.4, 0]}
      />
      <Suspense fallback={null}>
        {modelUrls.length > 0 ? (
          <Bounds fit clip observe margin={1.35}>
            <group>
              {modelUrls.map((url, index) => (
                <group key={url} position={[(index - (modelUrls.length - 1) / 2) * 1.1, 0, 0]}>
                  <Center>
                    <LoadedGlb url={url} />
                  </Center>
                </group>
              ))}
            </group>
          </Bounds>
        ) : null}
      </Suspense>
      {showAuraStandIn ? (
        <AuraParticleStandIn playheadMs={playheadMs} durationMs={durationMs} />
      ) : null}
      {socketMarkers.length > 0 ? (
        <VfxSocketMarkers
          markers={socketMarkers}
          activeSocket={activeSocket}
          editable={editableSockets}
          onPositionChange={onSocketPositionChange}
          onSelectSocket={onSelectSocket}
          onDraggingChange={(dragging) => setOrbitEnabled(!dragging)}
        />
      ) : null}
      <OrbitControls
        ref={orbitRef}
        makeDefault
        enabled={orbitEnabled}
        enablePan={false}
        minDistance={0.9}
        maxDistance={6}
      />
    </>
  );
}
