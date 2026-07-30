/**
 * Build workbench session + slot roles + per-part asset picks.
 * Location: src/features/build/model/buildTypes.ts
 */

export const BUILD_SESSION_KEY = 'letz-fetz:build-session';
/** v3: Formel slots (Technik/Essenz/Katalysator). v2 Fetzgerät sessions reset on load. */
export const BUILD_SESSION_VERSION = 3 as const;

/** UI / storage slot ids — V5 Formelplätze. */
export type BuildSlotRole = 'technik' | 'essenz' | 'katalysator';

export const BUILD_SLOT_ORDER: BuildSlotRole[] = ['technik', 'essenz', 'katalysator'];

export const BUILD_SLOT_LABEL_DE: Record<BuildSlotRole, string> = {
  technik: 'Technik',
  essenz: 'Essenz',
  katalysator: 'Katalysator',
};

export interface BuildSlots {
  technik: string | null;
  essenz: string | null;
  katalysator: string | null;
}

/** Which generated artifact the user is viewing / using for a part. */
export type PartViewMode = '2d' | '3d';

export interface PartAssetPick {
  /** Selected master version number, or null = latest available 2D. */
  masterVersion: number | null;
  /** Selected model version number, or null = none / latest 3D. */
  modelVersion: number | null;
  /** Preferred preview mode; falls back to 2d when no 3D exists. */
  view: PartViewMode;
}

export interface BuildSession {
  version: typeof BUILD_SESSION_VERSION;
  slots: BuildSlots;
  /** Cosmetic display name for the result card. */
  name: string;
  /** Last part id dropped (drives 2D preview fallback). */
  lastDroppedPartId: string | null;
  /** Per-part history selection (version + 2D/3D view). */
  assetPicks: Record<string, PartAssetPick>;
}

export function createFreshBuildSession(): BuildSession {
  return {
    version: BUILD_SESSION_VERSION,
    slots: { technik: null, essenz: null, katalysator: null },
    name: 'Meine Formel',
    lastDroppedPartId: null,
    assetPicks: {},
  };
}

export function defaultPartAssetPick(): PartAssetPick {
  return { masterVersion: null, modelVersion: null, view: '2d' };
}

/**
 * Map Meshy / engine spec slot strings → Build Formel role.
 * Legacy Fetzgerät: Träger→Technik, Antrieb→Essenz, Aufsatz→Katalysator.
 */
export function mapSpecSlotToRole(slot: string): BuildSlotRole | null {
  switch (slot.trim().toLowerCase()) {
    case 'technik':
    case 'carrier':
    case 'traeger':
    case 'träger':
      return 'technik';
    case 'essenz':
    case 'drive':
    case 'antrieb':
      return 'essenz';
    case 'katalysator':
    case 'attachment':
    case 'aufsatz':
      return 'katalysator';
    default:
      return null;
  }
}

export interface Part2dVersion {
  version: number;
  url: string;
  approved: boolean;
  labelDe: string;
}

export interface Part3dVersion {
  version: number;
  glbUrl: string;
  /**
   * Optional still render for static thumbs. Never the UV atlas
   * (`model_base_color.png`) — that looks like a texture sheet, not the model.
   */
  previewUrl: string | null;
  sourceMasterVersion: number | null;
  labelDe: string;
}

export interface MeshyCatalogPart {
  id: string;
  name: string;
  role: BuildSlotRole;
  /** Default display image (resolved from pick / approved / current). */
  masterUrl: string;
  /** Default GLB for current pipeline tip, if any. */
  glbUrl: string | null;
  element: string | null;
  currentMasterUrl: string | null;
  currentMasterVersion: number | null;
  approvedMasterVersion: number | null;
  modelVersion: number | null;
  sourceMasterVersion: number | null;
  sourceMultiviewVersion: number | null;
  pairStatus: PartPairStatus;
  pairLabelDe: string;
  /** Full 2D master history (v001…). */
  masters: Part2dVersion[];
  /** Full 3D model history (v001…). Empty ⇒ nur 2D. */
  models: Part3dVersion[];
}

/** How 2D master and 3D model versions relate for this part. */
export type PartPairStatus = 'matched' | 'stale' | '2d-only' | 'unknown';

/** Map Meshy / free-text element strings → engine Element keys. */
export type BuildElementId = 'fire' | 'water' | 'earth' | 'air' | 'shadow' | 'light';

export function normalizePartElement(raw: string | null | undefined): BuildElementId | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  switch (key) {
    case 'fire':
    case 'feuer':
      return 'fire';
    case 'water':
    case 'wasser':
      return 'water';
    case 'earth':
    case 'erde':
      return 'earth';
    case 'air':
    case 'luft':
      return 'air';
    case 'shadow':
    case 'schatten':
      return 'shadow';
    case 'light':
    case 'licht':
      return 'light';
    default:
      return null;
  }
}

/** Resolve display URLs for a part given the user's history pick. */
export function resolvePartAssets(
  part: MeshyCatalogPart,
  pick: PartAssetPick | null | undefined,
): {
  masterUrl: string;
  glbUrl: string | null;
  view: PartViewMode;
  masterVersion: number | null;
  modelVersion: number | null;
  statusLabelDe: string;
} {
  const masters = part.masters;
  const models = part.models;
  const masterVersion =
    pick?.masterVersion != null && masters.some((m) => m.version === pick.masterVersion)
      ? pick.masterVersion
      : (part.approvedMasterVersion ??
        part.currentMasterVersion ??
        masters[masters.length - 1]?.version ??
        null);
  const master =
    masters.find((m) => m.version === masterVersion) ??
    masters[masters.length - 1] ??
    null;

  const modelVersion =
    pick?.modelVersion != null && models.some((m) => m.version === pick.modelVersion)
      ? pick.modelVersion
      : (part.modelVersion ?? models[models.length - 1]?.version ?? null);
  const model = models.find((m) => m.version === modelVersion) ?? null;

  const wants3d = pick?.view === '3d';
  const view: PartViewMode = wants3d && model ? '3d' : '2d';

  let statusLabelDe: string;
  if (models.length === 0) {
    statusLabelDe =
      masterVersion != null ? `Nur 2D · v${masterVersion}` : 'Nur 2D · kein 3D';
  } else if (view === '3d' && model) {
    const src =
      model.sourceMasterVersion != null ? ` · aus 2D v${model.sourceMasterVersion}` : '';
    statusLabelDe = `3D v${model.version}${src}`;
  } else {
    statusLabelDe =
      masterVersion != null
        ? `2D v${masterVersion}${model ? ` · 3D v${model.version} verfügbar` : ''}`
        : '2D';
  }

  return {
    masterUrl: master?.url ?? part.masterUrl,
    glbUrl: model?.glbUrl ?? null,
    view,
    masterVersion: master?.version ?? null,
    modelVersion: model?.version ?? null,
    statusLabelDe,
  };
}

/** Flat `<img>` thumb: always the 2D master — never a UV atlas. Live 3D is Canvas-only. */
export function partStillThumbUrl(
  part: MeshyCatalogPart,
  pick: PartAssetPick | null | undefined,
): string {
  return resolvePartAssets(part, pick).masterUrl;
}
