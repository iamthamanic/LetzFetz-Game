/**
 * Combinate catalog entries from engine-parts with combinateVisible.
 * Location: src/features/build/data/enginePartsCombinateCatalog.ts
 */
import {
  mapSpecSlotToRole,
  type MeshyCatalogPart,
  type Part2dVersion,
  type Part3dVersion,
} from '../model/buildTypes';

type SpecModule = { default?: unknown } | unknown;

const specModules = import.meta.glob('../../../../assets/engine-parts/specs/*.json', {
  eager: true,
}) as Record<string, SpecModule>;

const stateModules = import.meta.glob('../../../../assets/engine-parts/*/asset-state.json', {
  eager: true,
}) as Record<string, SpecModule>;

const conceptCurrentModules = import.meta.glob(
  '../../../../assets/engine-parts/*/2d/concept-sheet/current/sheet.png',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const isolatedApprovedModules = import.meta.glob(
  '../../../../assets/engine-parts/*/2d/isolated/approved.png',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const glbCurrentModules = import.meta.glob(
  '../../../../assets/engine-parts/*/3d/models/current/model.glb',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function unwrap(mod: SpecModule): unknown {
  if (isRecord(mod) && 'default' in mod) return mod.default;
  return mod;
}

function idFromPath(filePath: string, pattern: RegExp): string | null {
  return pattern.exec(filePath)?.[1] ?? null;
}

/** Parts flagged combinateVisible in asset-state (manual Combinate gate). */
export function loadCombinateVisibleEngineParts(): MeshyCatalogPart[] {
  const states = new Map<string, Record<string, unknown>>();
  for (const [p, mod] of Object.entries(stateModules)) {
    const id = idFromPath(p, /assets\/engine-parts\/([^/]+)\/asset-state\.json/);
    if (!id) continue;
    const raw = unwrap(mod);
    if (isRecord(raw)) states.set(id, raw);
  }

  const concepts = new Map<string, string>();
  for (const [p, url] of Object.entries(conceptCurrentModules)) {
    const id = idFromPath(p, /assets\/engine-parts\/([^/]+)\/2d\/concept-sheet/);
    if (id) concepts.set(id, url);
  }
  const isolated = new Map<string, string>();
  for (const [p, url] of Object.entries(isolatedApprovedModules)) {
    const id = idFromPath(p, /assets\/engine-parts\/([^/]+)\/2d\/isolated/);
    if (id) isolated.set(id, url);
  }
  const glbs = new Map<string, string>();
  for (const [p, url] of Object.entries(glbCurrentModules)) {
    const id = idFromPath(p, /assets\/engine-parts\/([^/]+)\/3d\/models/);
    if (id) glbs.set(id, url);
  }

  const parts: MeshyCatalogPart[] = [];
  for (const [p, mod] of Object.entries(specModules)) {
    const id = idFromPath(p, /assets\/engine-parts\/specs\/([^/]+)\.json/);
    if (!id) continue;
    const state = states.get(id);
    if (!state || state.combinateVisible !== true) continue;
    const spec = unwrap(mod);
    if (!isRecord(spec) || typeof spec.slot !== 'string') continue;
    const role = mapSpecSlotToRole(spec.slot);
    if (!role) continue;
    const masterUrl = isolated.get(id) ?? concepts.get(id);
    if (!masterUrl) continue;
    const name =
      typeof spec.name === 'string' && spec.name.trim() ? spec.name.trim() : id;
    const element =
      typeof spec.element === 'string' && spec.element.trim() ? spec.element.trim() : null;
    const masters: Part2dVersion[] = [
      { version: 1, url: masterUrl, approved: true, labelDe: '2D v1' },
    ];
    const glbUrl = glbs.get(id) ?? null;
    const models: Part3dVersion[] = glbUrl
      ? [
          {
            version: 1,
            glbUrl,
            previewUrl: null,
            sourceMasterVersion: 1,
            labelDe: '3D v1',
          },
        ]
      : [];
    parts.push({
      id,
      name,
      role,
      masterUrl,
      glbUrl,
      element,
      currentMasterUrl: masterUrl,
      currentMasterVersion: 1,
      approvedMasterVersion: 1,
      modelVersion: glbUrl ? 1 : null,
      sourceMasterVersion: glbUrl ? 1 : null,
      sourceMultiviewVersion: null,
      pairStatus: glbUrl ? 'matched' : '2d-only',
      pairLabelDe: glbUrl ? '2D v1 ↔ 3D v1' : 'Nur 2D · v1',
      masters,
      models,
    });
  }
  return parts;
}
