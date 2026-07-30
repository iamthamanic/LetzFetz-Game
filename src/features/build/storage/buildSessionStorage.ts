/**
 * Build workbench session in localStorage — load / save / clear.
 * Location: src/features/build/storage/buildSessionStorage.ts
 *
 * Parses as unknown; corrupt or wrong version → fresh session.
 */
import {
  BUILD_SESSION_KEY,
  BUILD_SESSION_VERSION,
  createFreshBuildSession,
  defaultPartAssetPick,
  type BuildSession,
  type BuildSlotRole,
  type BuildSlots,
  type PartAssetPick,
  type PartViewMode,
} from '../model/buildTypes';

export type BuildSaveResult = { ok: true } | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function parseSlots(raw: unknown): BuildSlots | null {
  if (!isRecord(raw)) return null;
  const roles: BuildSlotRole[] = ['technik', 'essenz', 'katalysator'];
  const slots: BuildSlots = { technik: null, essenz: null, katalysator: null };
  for (const role of roles) {
    const value = raw[role];
    if (value === null) {
      slots[role] = null;
      continue;
    }
    if (typeof value === 'string' && value.length > 0) {
      slots[role] = value;
      continue;
    }
    return null;
  }
  return slots;
}

function parseLastDropped(raw: unknown): string | null | undefined {
  if (raw === null) return null;
  if (typeof raw === 'string' && raw.length > 0) return raw;
  return undefined;
}

function parseView(raw: unknown): PartViewMode | null {
  return raw === '2d' || raw === '3d' ? raw : null;
}

function parseAssetPick(raw: unknown): PartAssetPick | null {
  if (!isRecord(raw)) return null;
  const view = parseView(raw.view);
  if (!view) return null;
  const masterVersion =
    raw.masterVersion === null
      ? null
      : typeof raw.masterVersion === 'number' && Number.isInteger(raw.masterVersion)
        ? raw.masterVersion
        : undefined;
  const modelVersion =
    raw.modelVersion === null
      ? null
      : typeof raw.modelVersion === 'number' && Number.isInteger(raw.modelVersion)
        ? raw.modelVersion
        : undefined;
  if (masterVersion === undefined || modelVersion === undefined) return null;
  return { masterVersion, modelVersion, view };
}

function parseAssetPicks(raw: unknown): Record<string, PartAssetPick> | null {
  if (raw === undefined) return {};
  if (!isRecord(raw)) return null;
  const out: Record<string, PartAssetPick> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key.length === 0) return null;
    const pick = parseAssetPick(value);
    if (!pick) return null;
    out[key] = pick;
  }
  return out;
}

function parseSession(raw: unknown): BuildSession | null {
  if (!isRecord(raw)) return null;
  if (raw.version !== BUILD_SESSION_VERSION) return null;
  const slots = parseSlots(raw.slots);
  if (!slots) return null;
  if (typeof raw.name !== 'string') return null;
  const lastDroppedPartId = parseLastDropped(raw.lastDroppedPartId);
  if (lastDroppedPartId === undefined) return null;
  const assetPicks = parseAssetPicks(raw.assetPicks);
  if (!assetPicks) return null;
  return {
    version: BUILD_SESSION_VERSION,
    slots,
    name: raw.name,
    lastDroppedPartId,
    assetPicks,
  };
}

export type LoadBuildSessionResult = {
  session: BuildSession;
  restored: boolean;
};

export function loadBuildSession(): LoadBuildSessionResult {
  try {
    const raw = localStorage.getItem(BUILD_SESSION_KEY);
    if (!raw) {
      return { session: createFreshBuildSession(), restored: false };
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      return { session: createFreshBuildSession(), restored: false };
    }
    const session = parseSession(parsed);
    if (!session) {
      return { session: createFreshBuildSession(), restored: false };
    }
    return { session, restored: true };
  } catch {
    return { session: createFreshBuildSession(), restored: false };
  }
}

export function saveBuildSession(session: BuildSession): BuildSaveResult {
  if (session.version !== BUILD_SESSION_VERSION) {
    return { ok: false, error: 'unsupported-version' };
  }
  try {
    localStorage.setItem(BUILD_SESSION_KEY, JSON.stringify(session));
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'storage-unavailable';
    return { ok: false, error: message };
  }
}

export function clearBuildSession(): BuildSaveResult {
  try {
    localStorage.removeItem(BUILD_SESSION_KEY);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'storage-unavailable';
    return { ok: false, error: message };
  }
}

export function getPartAssetPick(
  session: BuildSession,
  partId: string,
): PartAssetPick {
  return session.assetPicks[partId] ?? defaultPartAssetPick();
}
