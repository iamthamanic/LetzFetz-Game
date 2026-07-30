/**
 * Named VFX technique socket roles for Asset Pipeline placement.
 * Location: src/features/build/vfx/sockets/vfxSocketRoles.ts
 */

export const VFX_TECHNIQUE_SOCKET_NAMES = [
  'essenceOrigin',
  'trailStart',
  'trailEnd',
  'impact',
  'auraCenter',
  'catalystOrbit',
  'cameraFocus',
] as const;

export type VfxTechniqueSocketName = (typeof VFX_TECHNIQUE_SOCKET_NAMES)[number];

export const VFX_TECHNIQUE_SOCKET_LABEL_DE: Record<VfxTechniqueSocketName, string> = {
  essenceOrigin: 'Essenz-Ursprung',
  trailStart: 'Trail-Start',
  trailEnd: 'Trail-Ende',
  impact: 'Impact',
  auraCenter: 'Aura-Mitte',
  catalystOrbit: 'Katalysator-Orbit',
  cameraFocus: 'Kamera-Fokus',
};

export function isVfxTechniqueSocketName(value: unknown): value is VfxTechniqueSocketName {
  return (
    typeof value === 'string' &&
    (VFX_TECHNIQUE_SOCKET_NAMES as readonly string[]).includes(value)
  );
}
