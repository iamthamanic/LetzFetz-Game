/**
 * R3F scene content for shared VFX preview (model + effect stand-in).
 * Location: src/features/build/vfx/preview/VfxPreviewScene.tsx
 */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Bounds, Center, Grid, OrbitControls, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
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

/** Request a frame when demand-mode scene inputs change. */
function DemandInvalidate({
  playheadMs,
  markersRevision,
  activeSocket,
}: {
  playheadMs: number;
  markersRevision: string;
  activeSocket: string;
}) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate, playheadMs, markersRevision, activeSocket]);
  return null;
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
  const safeMarkers = socketMarkers.filter(
    (entry): entry is VfxSocketMarkerEntry =>
      Boolean(entry?.name && entry.position),
  );
  const markersRevision = safeMarkers
    .map(
      (entry) =>
        `${entry.name}:${entry.position.x.toFixed(3)},${entry.position.y.toFixed(3)},${entry.position.z.toFixed(3)}`,
    )
    .join('|');

  return (
    <>
      <DemandInvalidate
        playheadMs={playheadMs}
        markersRevision={markersRevision}
        activeSocket={activeSocket}
      />
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
      {safeMarkers.length > 0 ? (
        <VfxSocketMarkers
          markers={safeMarkers}
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
