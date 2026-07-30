/**
 * VFX Studio technique registry — localStorage persistence.
 * Location: src/features/build/vfx/registry.ts
 */
import { VFX_REGISTRY_STORAGE_KEY } from '../../../services/storage/vfxRegistryBridge';
import {
  parseTechniqueAsset,
  type TechniqueAsset,
} from './types/assets';
import { assertObject } from './types/parseHelpers';

export const VFX_REGISTRY_VERSION = 1 as const;

export interface VfxRegistry {
  version: typeof VFX_REGISTRY_VERSION;
  techniques: TechniqueAsset[];
  updatedAt: string;
}

function emptyRegistry(): VfxRegistry {
  return {
    version: VFX_REGISTRY_VERSION,
    techniques: [],
    updatedAt: new Date(0).toISOString(),
  };
}

function parseTechniqueList(raw: unknown): TechniqueAsset[] {
  if (!Array.isArray(raw)) return [];
  const out: TechniqueAsset[] = [];
  for (const item of raw) {
    try {
      out.push(parseTechniqueAsset(item));
    } catch {
      /* drop invalid entries */
    }
  }
  return out;
}

/** Narrow unknown JSON into a VfxRegistry; throws on invalid version. */
export function parseVfxRegistry(raw: unknown): VfxRegistry {
  const record = assertObject(raw, 'VfxRegistry');
  const version = record.version;
  if (version !== VFX_REGISTRY_VERSION) {
    throw new Error(`VfxRegistry.version must be ${VFX_REGISTRY_VERSION}`);
  }
  const updatedAtRaw = record.updatedAt;
  const updatedAt =
    typeof updatedAtRaw === 'string' && !Number.isNaN(Date.parse(updatedAtRaw))
      ? updatedAtRaw
      : new Date().toISOString();
  return {
    version: VFX_REGISTRY_VERSION,
    techniques: parseTechniqueList(record.techniques),
    updatedAt,
  };
}

function readRawRegistry(): VfxRegistry {
  if (typeof localStorage === 'undefined') return emptyRegistry();
  try {
    const raw = localStorage.getItem(VFX_REGISTRY_STORAGE_KEY);
    if (!raw) return emptyRegistry();
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      return emptyRegistry();
    }
    return parseVfxRegistry(parsed);
  } catch {
    return emptyRegistry();
  }
}

function writeRegistry(registry: VfxRegistry): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(VFX_REGISTRY_STORAGE_KEY, JSON.stringify(registry));
}

export function loadVfxRegistry(): VfxRegistry {
  return readRawRegistry();
}

export function listTechniqueAssets(): TechniqueAsset[] {
  return readRawRegistry().techniques;
}

export function saveTechniqueAsset(asset: TechniqueAsset): TechniqueAsset {
  const validated = parseTechniqueAsset(JSON.parse(JSON.stringify(asset)));
  const registry = readRawRegistry();
  const next = registry.techniques.filter((t) => t.id !== validated.id);
  next.push(validated);
  writeRegistry({
    version: VFX_REGISTRY_VERSION,
    techniques: next,
    updatedAt: new Date().toISOString(),
  });
  return validated;
}

export function removeTechniqueAsset(id: string): void {
  const registry = readRawRegistry();
  const next = registry.techniques.filter((t) => t.id !== id);
  if (next.length === registry.techniques.length) return;
  writeRegistry({
    version: VFX_REGISTRY_VERSION,
    techniques: next,
    updatedAt: new Date().toISOString(),
  });
}
