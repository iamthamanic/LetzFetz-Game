/**
 * Read-only bridge for VFX Studio technique registry (Forge Material Formeln).
 * Location: src/services/storage/vfxRegistryBridge.ts
 *
 * Shared layer must not import feature modules — minimal parse only.
 * Full TechniqueAsset read/write lives in features/build/vfx/registry.ts.
 */
export const VFX_REGISTRY_STORAGE_KEY = 'letz-fetz:vfx-registry';

export interface VfxRegistryTechniqueSummary {
  id: string;
  name: string;
  status: string;
  modelId: string | null;
  createdAt: string;
  updatedAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseSummary(raw: unknown): VfxRegistryTechniqueSummary | null {
  if (!isRecord(raw)) return null;
  if (raw.kind !== 'technique' || raw.role !== 'technik') return null;
  const id = raw.id;
  const name = raw.name;
  if (typeof id !== 'string' || id.trim().length === 0) return null;
  if (typeof name !== 'string' || name.trim().length === 0) return null;
  const status = typeof raw.status === 'string' ? raw.status : 'DRAFT';
  const modelId =
    typeof raw.modelId === 'string' && raw.modelId.trim().length > 0 ? raw.modelId : null;
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : '';
  const updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : createdAt;
  return { id, name, status, modelId, createdAt, updatedAt };
}

/** Load technique summaries for cross-feature UI (Forge Formeln tab). */
export function readVfxRegistryTechniqueSummaries(): VfxRegistryTechniqueSummary[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(VFX_REGISTRY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !Array.isArray(parsed.techniques)) return [];
    const out: VfxRegistryTechniqueSummary[] = [];
    for (const item of parsed.techniques) {
      const summary = parseSummary(item);
      if (summary) out.push(summary);
    }
    return out;
  } catch {
    return [];
  }
}
