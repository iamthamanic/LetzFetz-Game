/**
 * R3F socket markers + optional TransformControls gizmo for VFX preview.
 * Location: src/features/build/vfx/preview/VfxSocketMarkers.tsx
 */
import { useEffect, useRef, useState } from 'react';
import { Html, TransformControls } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import type { Group } from 'three';
import type { Vec3 } from '../types/wireTypes';
import {
  VFX_TECHNIQUE_SOCKET_LABEL_DE,
  type VfxTechniqueSocketName,
} from '../sockets/vfxSocketRoles';

export interface VfxSocketMarkerEntry {
  name: VfxTechniqueSocketName;
  position: Vec3;
}

interface VfxSocketMarkersProps {
  markers: VfxSocketMarkerEntry[];
  activeSocket: VfxTechniqueSocketName;
  editable?: boolean;
  onPositionChange?: (name: VfxTechniqueSocketName, position: Vec3) => void;
  onSelectSocket?: (name: VfxTechniqueSocketName) => void;
  onDraggingChange?: (dragging: boolean) => void;
}

const MARKER_COLORS: Record<VfxTechniqueSocketName, string> = {
  essenceOrigin: '#a78bfa',
  trailStart: '#38bdf8',
  trailEnd: '#0ea5e9',
  impact: '#f87171',
  auraCenter: '#fbbf24',
  catalystOrbit: '#34d399',
  cameraFocus: '#e879f9',
};

function SocketMarker({
  name,
  position,
  active,
  onSelect,
}: {
  name: VfxTechniqueSocketName;
  position: Vec3;
  active: boolean;
  onSelect?: (name: VfxTechniqueSocketName) => void;
}) {
  const color = MARKER_COLORS[name];

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect?.(name);
  };

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh onClick={handleClick}>
        <sphereGeometry args={[active ? 0.06 : 0.04, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.85 : 0.35}
        />
      </mesh>
      {active ? (
        <Html
          center
          distanceFactor={6}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <span className="whitespace-nowrap rounded border border-violet-500/60 bg-stone-950/90 px-1.5 py-0.5 text-[9px] font-medium text-violet-100">
            {VFX_TECHNIQUE_SOCKET_LABEL_DE[name]}
          </span>
        </Html>
      ) : null}
    </group>
  );
}

function ActiveSocketGizmo({
  name,
  position,
  onPositionChange,
  onDraggingChange,
}: {
  name: VfxTechniqueSocketName;
  position: Vec3;
  onPositionChange: (name: VfxTechniqueSocketName, position: Vec3) => void;
  onDraggingChange?: (dragging: boolean) => void;
}) {
  const groupRef = useRef<Group>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [name]);

  useEffect(() => {
    const obj = groupRef.current;
    if (!obj) return;
    obj.position.set(position.x, position.y, position.z);
  }, [position.x, position.y, position.z]);

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color={MARKER_COLORS[name]}
          emissive={MARKER_COLORS[name]}
          emissiveIntensity={0.85}
        />
      </mesh>
      {ready && groupRef.current ? (
        <TransformControls
          object={groupRef.current}
          mode="translate"
          size={0.75}
          onMouseDown={() => onDraggingChange?.(true)}
          onMouseUp={() => onDraggingChange?.(false)}
          onObjectChange={() => {
            const obj = groupRef.current;
            if (!obj) return;
            onPositionChange(name, {
              x: obj.position.x,
              y: obj.position.y,
              z: obj.position.z,
            });
          }}
        />
      ) : null}
    </group>
  );
}

export function VfxSocketMarkers({
  markers,
  activeSocket,
  editable = false,
  onPositionChange,
  onSelectSocket,
  onDraggingChange,
}: VfxSocketMarkersProps) {
  const activeEntry = markers.find((entry) => entry.name === activeSocket);

  return (
    <group data-testid="vfx-socket-markers">
      {markers
        .filter((entry) => entry.name !== activeSocket)
        .map((entry) => (
          <SocketMarker
            key={entry.name}
            name={entry.name}
            position={entry.position}
            active={false}
            onSelect={onSelectSocket}
          />
        ))}
      {activeEntry ? (
        editable && onPositionChange ? (
          <ActiveSocketGizmo
            name={activeEntry.name}
            position={activeEntry.position}
            onPositionChange={onPositionChange}
            onDraggingChange={onDraggingChange}
          />
        ) : (
          <SocketMarker
            name={activeEntry.name}
            position={activeEntry.position}
            active
            onSelect={onSelectSocket}
          />
        )
      ) : null}
    </group>
  );
}
