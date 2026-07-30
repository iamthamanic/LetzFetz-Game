/**
 * Pure helpers for VFX technique socket maps (create, update, parse, format).
 * Location: src/features/build/vfx/sockets/socketMapHelpers.ts
 */

import type { Vec3 } from '../types/wireTypes';
import { parseRequiredNumber, assertObject } from '../types/parseHelpers';
import {
  VFX_TECHNIQUE_SOCKET_NAMES,
  isVfxTechniqueSocketName,
  type VfxTechniqueSocketName,
} from './vfxSocketRoles';

export type VfxTechniqueSocketMap = Record<VfxTechniqueSocketName, Vec3>;

export function zeroVec3(): Vec3 {
  return { x: 0, y: 0, z: 0 };
}

export function createDefaultSocketMap(): VfxTechniqueSocketMap {
  const map = {} as VfxTechniqueSocketMap;
  for (const name of VFX_TECHNIQUE_SOCKET_NAMES) {
    map[name] = zeroVec3();
  }
  return map;
}

export function parseVec3(raw: unknown, label: string): Vec3 {
  const record = assertObject(raw, label);
  return {
    x: parseRequiredNumber(record, 'x'),
    y: parseRequiredNumber(record, 'y'),
    z: parseRequiredNumber(record, 'z'),
  };
}

export function parseTechniqueSocketMap(raw: unknown): VfxTechniqueSocketMap {
  const defaults = createDefaultSocketMap();
  if (raw === undefined || raw === null) return defaults;
  const record = assertObject(raw, 'TechniqueAsset.sockets');
  const result = { ...defaults };
  for (const name of VFX_TECHNIQUE_SOCKET_NAMES) {
    if (record[name] !== undefined) {
      result[name] = parseVec3(record[name], `TechniqueAsset.sockets.${name}`);
    }
  }
  return result;
}

export function updateSocketInMap(
  map: VfxTechniqueSocketMap,
  name: VfxTechniqueSocketName,
  position: Vec3,
): VfxTechniqueSocketMap {
  return { ...map, [name]: { ...position } };
}

export function formatSocketPositionDe(position: Vec3): string {
  const fmt = (value: number) => value.toFixed(2);
  return `(${fmt(position.x)}, ${fmt(position.y)}, ${fmt(position.z)})`;
}

export function coerceActiveSocketName(value: unknown): VfxTechniqueSocketName {
  if (isVfxTechniqueSocketName(value)) return value;
  return 'essenceOrigin';
}

export function roundVec3(position: Vec3, decimals = 3): Vec3 {
  const factor = 10 ** decimals;
  return {
    x: Math.round(position.x * factor) / factor,
    y: Math.round(position.y * factor) / factor,
    z: Math.round(position.z * factor) / factor,
  };
}
