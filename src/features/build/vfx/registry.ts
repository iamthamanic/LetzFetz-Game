/**
 * VFX Studio registry — localStorage persistence for techniques + combinations.
 * Location: src/features/build/vfx/registry.ts
 */
import {
  VFX_REGISTRY_STORAGE_KEY,
  VFX_REGISTRY_UPDATED_EVENT,
} from '../../../services/storage/vfxRegistryBridge';
import {
  parseFormulaRecipe,
  parseTechniqueAsset,
  type FormulaRecipe,
  type TechniqueAsset,
} from './types/assets';
import { assertObject } from './types/parseHelpers';

export const VFX_REGISTRY_VERSION = 1 as const;

export interface VfxRegistry {
  version: typeof VFX_REGISTRY_VERSION;
  techniques: TechniqueAsset[];
  formulaRecipes: FormulaRecipe[];
  updatedAt: string;
}

function emptyRegistry(): VfxRegistry {
  return {
    version: VFX_REGISTRY_VERSION,
    techniques: [],
    formulaRecipes: [],
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

function parseFormulaRecipeList(raw: unknown): FormulaRecipe[] {
  if (!Array.isArray(raw)) return [];
  const out: FormulaRecipe[] = [];
  for (const item of raw) {
    try {
      out.push(parseFormulaRecipe(item));
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
    formulaRecipes: parseFormulaRecipeList(record.formulaRecipes),
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

function notifyRegistryUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(VFX_REGISTRY_UPDATED_EVENT));
}

function writeRegistry(registry: VfxRegistry): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(VFX_REGISTRY_STORAGE_KEY, JSON.stringify(registry));
  notifyRegistryUpdated();
}

export function loadVfxRegistry(): VfxRegistry {
  return readRawRegistry();
}

export function listTechniqueAssets(): TechniqueAsset[] {
  return readRawRegistry().techniques;
}

export function listFormulaRecipes(): FormulaRecipe[] {
  return readRawRegistry().formulaRecipes;
}

export function saveTechniqueAsset(asset: TechniqueAsset): TechniqueAsset {
  const validated = parseTechniqueAsset(JSON.parse(JSON.stringify(asset)));
  const registry = readRawRegistry();
  const next = registry.techniques.filter((t) => t.id !== validated.id);
  next.push(validated);
  writeRegistry({
    version: VFX_REGISTRY_VERSION,
    techniques: next,
    formulaRecipes: registry.formulaRecipes,
    updatedAt: new Date().toISOString(),
  });
  return validated;
}

export function saveFormulaRecipe(recipe: FormulaRecipe): FormulaRecipe {
  const validated = parseFormulaRecipe(JSON.parse(JSON.stringify(recipe)));
  const registry = readRawRegistry();
  const next = registry.formulaRecipes.filter((r) => r.id !== validated.id);
  next.push(validated);
  writeRegistry({
    version: VFX_REGISTRY_VERSION,
    techniques: registry.techniques,
    formulaRecipes: next,
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
    formulaRecipes: registry.formulaRecipes,
    updatedAt: new Date().toISOString(),
  });
}

export function removeFormulaRecipe(id: string): void {
  const registry = readRawRegistry();
  const next = registry.formulaRecipes.filter((r) => r.id !== id);
  if (next.length === registry.formulaRecipes.length) return;
  writeRegistry({
    version: VFX_REGISTRY_VERSION,
    techniques: registry.techniques,
    formulaRecipes: next,
    updatedAt: new Date().toISOString(),
  });
}
