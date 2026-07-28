/**
 * Minimal lighting for MVP placeholder GLBs.
 * Location: src/components/engine3d/three/EngineLighting.tsx
 */
export function EngineLighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} />
      <directionalLight position={[-2, 1, -1]} intensity={0.35} />
    </>
  );
}
