/**
 * Validated Card Forge pack overlays in localStorage (images/notes).
 * Location: src/services/storage/cardOverlays.ts
 *
 * Cross-feature storage — Sandbox and Forge both read/write this key.
 * Parses as unknown; unknown ids and fields are dropped.
 */

/** Compatible with legacy Forge overlay key. */
export const CARD_OVERLAYS_STORAGE_KEY = 'letzfetz-forge-overlays';

export interface CardOverlayFields {
  image_asset?: string;
  notes?: string;
  updated_at?: string;
}

export interface CardOverlayEntry extends CardOverlayFields {
  id: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function parseOverlayFields(raw: unknown): CardOverlayFields | null {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  const fields: CardOverlayFields = {};

  if (typeof record.image_asset === 'string') {
    fields.image_asset = record.image_asset;
  }
  if (typeof record.notes === 'string') {
    fields.notes = record.notes;
  }
  if (typeof record.updated_at === 'string') {
    fields.updated_at = record.updated_at;
  }

  // Ignore unknown keys; require at least one known presentation field.
  if (
    fields.image_asset === undefined &&
    fields.notes === undefined &&
    fields.updated_at === undefined
  ) {
    return null;
  }
  return fields;
}

function parseOverlayMap(raw: unknown): Record<string, CardOverlayFields> {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: Record<string, CardOverlayFields> = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!isNonEmptyString(id)) continue;
    // Keep every non-empty string id; known-pack filtering happens in content loaders.
    const fields = parseOverlayFields(value);
    if (fields) out[id] = fields;
  }
  return out;
}

function readRawOverlays(): Record<string, CardOverlayFields> {
  try {
    const raw = localStorage.getItem(CARD_OVERLAYS_STORAGE_KEY);
    if (!raw) return {};
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      return {};
    }
    return parseOverlayMap(parsed);
  } catch {
    return {};
  }
}

/** Load validated overlay entries. Corrupt/missing storage → []. */
export function loadCardOverlays(): CardOverlayEntry[] {
  return Object.entries(readRawOverlays()).map(([id, data]) => ({ id, ...data }));
}

/**
 * Merge presentation fields for one card id and persist the single overlay map.
 * Returns false when localStorage is unavailable or write fails.
 */
export function saveCardOverlay(
  id: string,
  overlay: Pick<CardOverlayFields, 'image_asset' | 'notes'>,
): boolean {
  if (!isNonEmptyString(id)) return false;

  const imageAsset =
    overlay.image_asset === undefined
      ? undefined
      : typeof overlay.image_asset === 'string'
        ? overlay.image_asset
        : undefined;
  const notes =
    overlay.notes === undefined
      ? undefined
      : typeof overlay.notes === 'string'
        ? overlay.notes
        : undefined;

  if (imageAsset === undefined && notes === undefined) return false;

  try {
    const all = readRawOverlays();
    const prev = all[id] ?? {};
    all[id] = {
      ...prev,
      ...(imageAsset !== undefined ? { image_asset: imageAsset } : {}),
      ...(notes !== undefined ? { notes } : {}),
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(CARD_OVERLAYS_STORAGE_KEY, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
}
