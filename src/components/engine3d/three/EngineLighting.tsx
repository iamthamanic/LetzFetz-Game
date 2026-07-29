/**
 * Lighting tuned for MeshToonMaterial (central EngineMaterials).
 * Location: src/components/engine3d/three/EngineLighting.tsx
 */
export function EngineLighting() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 2]} intensity={1.25} />
      <directionalLight position={[-2, 1, -1]} intensity={0.4} />
      <hemisphereLight args={['#fafaf9', '#292524', 0.35]} />
    </>
  );
}
