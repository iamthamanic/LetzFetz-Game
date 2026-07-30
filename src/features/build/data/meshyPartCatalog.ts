/**
 * Discover Meshy pipeline parts with full 2D/3D version history for Build.
 * Location: src/features/build/data/meshyPartCatalog.ts
 */
import {
  mapSpecSlotToRole,
  type MeshyCatalogPart,
  type Part2dVersion,
  type Part3dVersion,
  type PartPairStatus,
} from '../model/buildTypes';

const PART_MIME = 'application/x-letz-fetz-build-part';

export const BUILD_PART_DRAG_MIME = PART_MIME;

type SpecModule = { default?: unknown } | unknown;

const specModules = import.meta.glob('../../../../assets/meshy/specs/*.json', {
  eager: true,
}) as Record<string, SpecModule>;

const currentMasterModules = import.meta.glob(
  '../../../../assets/meshy/*/2d/master/current.png',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const approvedMasterModules = import.meta.glob(
  '../../../../assets/meshy/*/2d/master/approved.png',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const versionedMasterModules = import.meta.glob(
  '../../../../assets/meshy/*/2d/master/v*.png',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const glbUrlModules = import.meta.glob(
  '../../../../assets/meshy/*/3d/models/current/model.glb',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const versionedGlbModules = import.meta.glob(
  '../../../../assets/meshy/*/3d/models/v*/model.glb',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const twoDStateModules = import.meta.glob(
  '../../../../assets/meshy/*/2d/state.json',
  { eager: true },
) as Record<string, SpecModule>;

const threeDStateModules = import.meta.glob(
  '../../../../assets/meshy/*/3d/state.json',
  { eager: true },
) as Record<string, SpecModule>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function idFromPath(path: string, pattern: RegExp): string | null {
  const match = pattern.exec(path);
  return match?.[1] ?? null;
}

function versionFromToken(token: string): number | null {
  const match = /^v0*([1-9]\d*)$/i.exec(token);
  if (!match) return null;
  return Number(match[1]);
}

function unwrapJson(mod: SpecModule): unknown {
  if (isRecord(mod) && 'default' in mod) return mod.default;
  return mod;
}

function asPositiveInt(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null;
}

export interface PartVersionMeta {
  currentMasterVersion: number | null;
  approvedMasterVersion: number | null;
  modelVersion: number | null;
  sourceMasterVersion: number | null;
  sourceMultiviewVersion: number | null;
  modelSourceByVersion: Record<number, number | null>;
}

/** Pure: resolve pairing badge + status from version numbers + asset presence. */
export function resolvePartPairing(input: {
  hasGlb: boolean;
  currentMasterVersion: number | null;
  approvedMasterVersion: number | null;
  modelVersion: number | null;
  sourceMasterVersion: number | null;
}): { pairStatus: PartPairStatus; pairLabelDe: string } {
  const {
    hasGlb,
    currentMasterVersion,
    approvedMasterVersion,
    modelVersion,
    sourceMasterVersion,
  } = input;

  if (!hasGlb) {
    const v = currentMasterVersion ?? approvedMasterVersion;
    return {
      pairStatus: '2d-only',
      pairLabelDe: v != null ? `Nur 2D · v${v}` : 'Nur 2D · kein 3D',
    };
  }

  const source = sourceMasterVersion ?? approvedMasterVersion;
  const modelLabel = modelVersion != null ? `3D v${modelVersion}` : '3D';
  const sourceLabel = source != null ? `2D v${source}` : '2D';

  if (source == null || modelVersion == null) {
    return {
      pairStatus: 'unknown',
      pairLabelDe: `${sourceLabel} ↔ ${modelLabel}`,
    };
  }

  const currentAhead =
    currentMasterVersion != null &&
    approvedMasterVersion != null &&
    currentMasterVersion !== approvedMasterVersion;

  if (source === approvedMasterVersion || sourceMasterVersion != null) {
    if (currentAhead && (sourceMasterVersion ?? approvedMasterVersion) !== currentMasterVersion) {
      return {
        pairStatus: 'stale',
        pairLabelDe: `2D v${currentMasterVersion} neu ≠ ${modelLabel} aus v${source}`,
      };
    }
    return {
      pairStatus: 'matched',
      pairLabelDe: `${sourceLabel} ↔ ${modelLabel}`,
    };
  }

  return {
    pairStatus: 'unknown',
    pairLabelDe: `${sourceLabel} ↔ ${modelLabel}`,
  };
}

export function parseVersionMetaFromStates(
  twoDState: unknown,
  threeDState: unknown,
): PartVersionMeta {
  let currentMasterVersion: number | null = null;
  let approvedMasterVersion: number | null = null;
  let modelVersion: number | null = null;
  let sourceMasterVersion: number | null = null;
  let sourceMultiviewVersion: number | null = null;
  const modelSourceByVersion: Record<number, number | null> = {};

  if (isRecord(twoDState) && isRecord(twoDState.master)) {
    currentMasterVersion = asPositiveInt(twoDState.master.currentVersion);
    approvedMasterVersion = asPositiveInt(twoDState.master.approvedVersion);
  }

  if (isRecord(threeDState) && isRecord(threeDState.model)) {
    modelVersion =
      asPositiveInt(threeDState.model.currentVersion) ??
      asPositiveInt(threeDState.model.approvedVersion);

    const candidates = threeDState.model.candidates;
    if (Array.isArray(candidates)) {
      for (const c of candidates) {
        if (!isRecord(c)) continue;
        const v = asPositiveInt(c.version);
        if (v == null) continue;
        modelSourceByVersion[v] = asPositiveInt(c.sourceMasterVersion);
      }
      if (modelVersion != null) {
        const match = candidates.find(
          (c) => isRecord(c) && asPositiveInt(c.version) === modelVersion,
        );
        if (isRecord(match)) {
          sourceMasterVersion = asPositiveInt(match.sourceMasterVersion);
          sourceMultiviewVersion = asPositiveInt(match.sourceMultiviewVersion);
        }
      }
    }
    if (sourceMasterVersion == null) {
      sourceMasterVersion = asPositiveInt(threeDState.model.sourceMasterVersion);
    }
    if (sourceMultiviewVersion == null) {
      sourceMultiviewVersion = asPositiveInt(threeDState.model.sourceMultiviewVersion);
    }
  }

  return {
    currentMasterVersion,
    approvedMasterVersion,
    modelVersion,
    sourceMasterVersion,
    sourceMultiviewVersion,
    modelSourceByVersion,
  };
}

/** Pure: build one catalog entry from raw inputs (testable). */
export function catalogPartFromSources(input: {
  id: string;
  spec: unknown;
  currentMasterUrl: string | undefined;
  approvedMasterUrl: string | undefined;
  glbUrl: string | undefined;
  versions?: PartVersionMeta;
  masters?: Part2dVersion[];
  models?: Part3dVersion[];
}): MeshyCatalogPart | null {
  const masters = [...(input.masters ?? [])].sort((a, b) => a.version - b.version);
  const models = [...(input.models ?? [])].sort((a, b) => a.version - b.version);
  const currentMasterUrl = input.currentMasterUrl;
  const approvedMasterUrl = input.approvedMasterUrl;
  const displayMaster =
    (input.glbUrl && approvedMasterUrl ? approvedMasterUrl : null) ??
    currentMasterUrl ??
    approvedMasterUrl ??
    masters[masters.length - 1]?.url;
  if (!displayMaster) return null;
  if (!isRecord(input.spec)) return null;
  if (typeof input.spec.id === 'string' && input.spec.id !== input.id) return null;
  if (typeof input.spec.slot !== 'string') return null;
  const role = mapSpecSlotToRole(input.spec.slot);
  if (!role) return null;
  const name =
    typeof input.spec.name === 'string' && input.spec.name.trim().length > 0
      ? input.spec.name.trim()
      : input.id;
  const element =
    typeof input.spec.element === 'string' && input.spec.element.trim().length > 0
      ? input.spec.element.trim()
      : null;

  const versions = input.versions ?? {
    currentMasterVersion: null,
    approvedMasterVersion: null,
    modelVersion: null,
    sourceMasterVersion: null,
    sourceMultiviewVersion: null,
    modelSourceByVersion: {},
  };
  const pairing = resolvePartPairing({
    hasGlb: Boolean(input.glbUrl) || models.length > 0,
    currentMasterVersion: versions.currentMasterVersion,
    approvedMasterVersion: versions.approvedMasterVersion,
    modelVersion: versions.modelVersion,
    sourceMasterVersion: versions.sourceMasterVersion,
  });

  return {
    id: input.id,
    name,
    role,
    masterUrl: displayMaster,
    glbUrl: input.glbUrl ?? models[models.length - 1]?.glbUrl ?? null,
    element,
    currentMasterUrl: currentMasterUrl ?? null,
    currentMasterVersion: versions.currentMasterVersion,
    approvedMasterVersion: versions.approvedMasterVersion,
    modelVersion: versions.modelVersion,
    sourceMasterVersion: versions.sourceMasterVersion,
    sourceMultiviewVersion: versions.sourceMultiviewVersion,
    pairStatus: pairing.pairStatus,
    pairLabelDe: pairing.pairLabelDe,
    masters,
    models,
  };
}

function indexByPartId(modules: Record<string, string>, pattern: RegExp): Map<string, string> {
  const map = new Map<string, string>();
  for (const [path, url] of Object.entries(modules)) {
    const id = idFromPath(path, pattern);
    if (id) map.set(id, url);
  }
  return map;
}

function indexJsonByPartId(
  modules: Record<string, SpecModule>,
  pattern: RegExp,
): Map<string, unknown> {
  const map = new Map<string, unknown>();
  for (const [path, mod] of Object.entries(modules)) {
    const id = idFromPath(path, pattern);
    if (id) map.set(id, unwrapJson(mod));
  }
  return map;
}

function collectMastersForPart(
  partId: string,
  approvedVersion: number | null,
): Part2dVersion[] {
  const byVersion = new Map<number, Part2dVersion>();
  for (const [path, url] of Object.entries(versionedMasterModules)) {
    const id = idFromPath(path, /assets\/meshy\/([^/]+)\/2d\/master\/(v\d+)\.png/);
    const verToken = /\/(v\d+)\.png$/i.exec(path)?.[1];
    if (id !== partId || !verToken) continue;
    const version = versionFromToken(verToken);
    if (version == null) continue;
    byVersion.set(version, {
      version,
      url,
      approved: approvedVersion === version,
      labelDe: `2D v${version}`,
    });
  }
  return [...byVersion.values()].sort((a, b) => a.version - b.version);
}

function collectModelsForPart(
  partId: string,
  sourceByVersion: Record<number, number | null>,
): Part3dVersion[] {
  // Do not use model_base_color.png as a UI thumb — that is a UV atlas, not a render.
  const byVersion = new Map<number, Part3dVersion>();
  for (const [path, url] of Object.entries(versionedGlbModules)) {
    const match = /assets\/meshy\/([^/]+)\/3d\/models\/(v\d+)\/model\.glb/.exec(path);
    if (!match || match[1] !== partId) continue;
    const version = versionFromToken(match[2]);
    if (version == null) continue;
    const sourceMasterVersion = sourceByVersion[version] ?? null;
    const src =
      sourceMasterVersion != null ? ` · aus 2D v${sourceMasterVersion}` : '';
    byVersion.set(version, {
      version,
      glbUrl: url,
      previewUrl: null,
      sourceMasterVersion,
      labelDe: `3D v${version}${src}`,
    });
  }
  return [...byVersion.values()].sort((a, b) => a.version - b.version);
}

let cachedParts: MeshyCatalogPart[] | null = null;

/** All Meshy parts that have a current or approved 2D master + valid slot in specs. */
export function loadMeshyPartCatalog(): MeshyCatalogPart[] {
  if (cachedParts) return cachedParts;

  const currentMasters = indexByPartId(
    currentMasterModules,
    /assets\/meshy\/([^/]+)\/2d\/master\/current\.png/,
  );
  const approvedMasters = indexByPartId(
    approvedMasterModules,
    /assets\/meshy\/([^/]+)\/2d\/master\/approved\.png/,
  );
  const glbs = indexByPartId(
    glbUrlModules,
    /assets\/meshy\/([^/]+)\/3d\/models\/current\/model\.glb/,
  );
  const twoDStates = indexJsonByPartId(
    twoDStateModules,
    /assets\/meshy\/([^/]+)\/2d\/state\.json/,
  );
  const threeDStates = indexJsonByPartId(
    threeDStateModules,
    /assets\/meshy\/([^/]+)\/3d\/state\.json/,
  );

  const parts: MeshyCatalogPart[] = [];
  for (const [path, mod] of Object.entries(specModules)) {
    const id = idFromPath(path, /assets\/meshy\/specs\/([^/]+)\.json/);
    if (!id) continue;
    const versions = parseVersionMetaFromStates(twoDStates.get(id), threeDStates.get(id));
    const masters = collectMastersForPart(id, versions.approvedMasterVersion);
    const models = collectModelsForPart(id, versions.modelSourceByVersion);
    const part = catalogPartFromSources({
      id,
      spec: unwrapJson(mod),
      currentMasterUrl: currentMasters.get(id),
      approvedMasterUrl: approvedMasters.get(id),
      glbUrl: glbs.get(id),
      versions,
      masters,
      models,
    });
    if (part) parts.push(part);
  }

  parts.sort((a, b) => a.name.localeCompare(b.name, 'de'));
  cachedParts = parts;
  return parts;
}

export function findCatalogPart(
  parts: MeshyCatalogPart[],
  id: string | null | undefined,
): MeshyCatalogPart | null {
  if (!id) return null;
  return parts.find((p) => p.id === id) ?? null;
}
