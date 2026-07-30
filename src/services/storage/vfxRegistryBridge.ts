/**
 * Read-only bridge for VFX Studio registry (Forge Material Formeln).
 * Location: src/services/storage/vfxRegistryBridge.ts
 *
 * Shared layer must not import feature modules — minimal parse only.
 * Full asset read/write lives in features/build/vfx/registry.ts.
 */
export const VFX_REGISTRY_STORAGE_KEY = 'letz-fetz:vfx-registry';

/** Dispatched on same-tab registry writes so Forge can refresh. */
export const VFX_REGISTRY_UPDATED_EVENT = 'letz-fetz:vfx-registry-updated';

export interface VfxRegistryTechniqueSummary {
  id: string;
  name: string;
  status: string;
  version: number;
  modelId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VfxRegistryFormulaRecipeSummary {
  id: string;
  name: string;
  status: string;
  version: number;
  techniqueId: string | null;
  essenceId: string | null;
  catalystId: string | null;
  techniqueVersion: number | null;
  essenceVersion: number | null;
  catalystVersion: number | null;
  heroFrameUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parsePositiveInt(raw: unknown, fallback: number): number {
  if (typeof raw === 'number' && Number.isInteger(raw) && raw >= 1) return raw;
  return fallback;
}

function parseOptionalPositiveInt(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isInteger(raw) && raw >= 1) return raw;
  return null;
}

function parseTechniqueSummary(raw: unknown): VfxRegistryTechniqueSummary | null {
  if (!isRecord(raw)) return null;
  if (raw.kind !== 'technique' || raw.role !== 'technik') return null;
  const id = raw.id;
  const name = raw.name;
  if (typeof id !== 'string' || id.trim().length === 0) return null;
  if (typeof name !== 'string' || name.trim().length === 0) return null;
  const status = typeof raw.status === 'string' ? raw.status : 'DRAFT';
  const version = parsePositiveInt(raw.version, 1);
  const modelId =
    typeof raw.modelId === 'string' && raw.modelId.trim().length > 0 ? raw.modelId : null;
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : '';
  const updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : createdAt;
  return { id, name, status, version, modelId, createdAt, updatedAt };
}

function parseFormulaRecipeSummary(raw: unknown): VfxRegistryFormulaRecipeSummary | null {
  if (!isRecord(raw)) return null;
  if (raw.kind !== 'formulaRecipe') return null;
  const id = raw.id;
  const name = raw.name;
  if (typeof id !== 'string' || id.trim().length === 0) return null;
  if (typeof name !== 'string' || name.trim().length === 0) return null;
  const status = typeof raw.status === 'string' ? raw.status : 'DRAFT';
  const version = parsePositiveInt(raw.version, 1);
  const techniqueId =
    typeof raw.techniqueId === 'string' && raw.techniqueId.trim().length > 0
      ? raw.techniqueId
      : null;
  const essenceId =
    typeof raw.essenceId === 'string' && raw.essenceId.trim().length > 0 ? raw.essenceId : null;
  const catalystId =
    typeof raw.catalystId === 'string' && raw.catalystId.trim().length > 0
      ? raw.catalystId
      : null;
  const heroFrame = raw.heroFrame;
  let heroFrameUrl: string | null = null;
  if (isRecord(heroFrame) && typeof heroFrame.url === 'string' && heroFrame.url.trim().length > 0) {
    heroFrameUrl = heroFrame.url;
  }
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : '';
  const updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : createdAt;
  return {
    id,
    name,
    status,
    version,
    techniqueId,
    essenceId,
    catalystId,
    techniqueVersion: parseOptionalPositiveInt(raw.techniqueVersion),
    essenceVersion: parseOptionalPositiveInt(raw.essenceVersion),
    catalystVersion: parseOptionalPositiveInt(raw.catalystVersion),
    heroFrameUrl,
    createdAt,
    updatedAt,
  };
}

function readRegistryRecord(): Record<string, unknown> | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(VFX_REGISTRY_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Load technique summaries for cross-feature UI (Forge Formeln tab). */
export function readVfxRegistryTechniqueSummaries(): VfxRegistryTechniqueSummary[] {
  const record = readRegistryRecord();
  if (!record || !Array.isArray(record.techniques)) return [];
  const out: VfxRegistryTechniqueSummary[] = [];
  for (const item of record.techniques) {
    const summary = parseTechniqueSummary(item);
    if (summary) out.push(summary);
  }
  return out;
}

/** Load saved Combinate Kombinationen for Material Formeln tab. */
export function readVfxRegistryFormulaRecipeSummaries(): VfxRegistryFormulaRecipeSummary[] {
  const record = readRegistryRecord();
  if (!record || !Array.isArray(record.formulaRecipes)) return [];
  const out: VfxRegistryFormulaRecipeSummary[] = [];
  for (const item of record.formulaRecipes) {
    const summary = parseFormulaRecipeSummary(item);
    if (summary) out.push(summary);
  }
  return out;
}
