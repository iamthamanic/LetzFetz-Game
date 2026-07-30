/**
 * Particle stand-in for Aura preset until Effekseer efkefc is wired.
 * Location: src/features/build/vfx/preview/AuraParticleStandIn.tsx
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AuraParticleStandInProps {
  playheadMs: number;
  durationMs: number;
}

const PARTICLE_COUNT = 48;

export function AuraParticleStandIn({ playheadMs, durationMs }: AuraParticleStandInProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const baseAngles = useMemo(() => {
    const angles = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      angles[i] = (i / PARTICLE_COUNT) * Math.PI * 2;
    }
    return angles;
  }, []);

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  useFrame(() => {
    const points = pointsRef.current;
    if (!points) return;

    const t = durationMs > 0 ? (playheadMs % durationMs) / durationMs : 0;
    const pulse = 0.85 + Math.sin(t * Math.PI * 2) * 0.15;
    const radius = 0.55 * pulse;

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const angle = baseAngles[i] + t * Math.PI * 2;
      const yWave = Math.sin(angle * 2 + t * Math.PI * 4) * 0.12;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = yWave;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    const attr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    attr.array.set(positions);
    attr.needsUpdate = true;
  });

  return (
    <group>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.08, 24]} />
        <meshStandardMaterial color="#44403c" metalness={0.35} roughness={0.65} />
      </mesh>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#fbbf24"
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <pointLight position={[0, 0.4, 0]} intensity={1.2} color="#fbbf24" distance={2.5} />
    </group>
  );
}
