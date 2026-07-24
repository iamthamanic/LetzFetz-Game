/**
 * One versioned Sandbox session in localStorage — load / save / clear.
 * Location: src/features/sandbox/storage/sandboxSessionStorage.ts
 *
 * Parses as unknown; corrupt or wrong version → fresh session.
 * Never stores secrets or credentials.
 */
import {
  SANDBOX_SESSION_KEY,
  SANDBOX_SESSION_VERSION,
  createFreshSandboxSession,
  type SandboxCustomField,
  type SandboxDiceRoll,
  type SandboxPlacedCard,
  type SandboxPosition,
  type SandboxSession,
} from '../model/sandboxTypes';

export type SandboxSaveResult = { ok: true } | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function parsePosition(raw: unknown): SandboxPosition | null {
  if (!isRecord(raw)) return null;
  if (!isFiniteNumber(raw.x) || !isFiniteNumber(raw.y)) return null;
  return { x: raw.x, y: raw.y };
}

function parseCustomField(raw: unknown): SandboxCustomField | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.name !== 'string' || !isFiniteNumber(raw.value)) return null;
  return { name: raw.name, value: raw.value };
}

function parsePlacedCard(raw: unknown): SandboxPlacedCard | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.instanceId !== 'string' || raw.instanceId.length === 0) return null;
  if (typeof raw.cardId !== 'string' || raw.cardId.length === 0) return null;
  if (!isFiniteNumber(raw.zIndex)) return null;
  const position = parsePosition(raw.position);
  if (!position) return null;
  return {
    instanceId: raw.instanceId,
    cardId: raw.cardId,
    position,
    zIndex: raw.zIndex,
  };
}

function parseDiceRoll(raw: unknown): SandboxDiceRoll | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.id !== 'string' || raw.id.length === 0) return null;
  if (!isFiniteNumber(raw.value)) return null;
  if (typeof raw.timestamp !== 'string') return null;
  return { id: raw.id, value: raw.value, timestamp: raw.timestamp };
}

function parseVariantIndex(raw: unknown): 0 | 1 | 2 | null {
  if (raw === null) return null;
  if (raw === 0 || raw === 1 || raw === 2) return raw;
  return null;
}

function parseSession(raw: unknown): SandboxSession | null {
  if (!isRecord(raw)) return null;
  if (raw.version !== SANDBOX_SESSION_VERSION) return null;

  if (!Array.isArray(raw.placedCards)) return null;
  const placedCards: SandboxPlacedCard[] = [];
  for (const item of raw.placedCards) {
    const card = parsePlacedCard(item);
    if (!card) return null;
    placedCards.push(card);
  }

  if (!isFiniteNumber(raw.nextZIndex)) return null;
  if (!isFiniteNumber(raw.p1Hp) || !isFiniteNumber(raw.p2Hp)) return null;
  if (typeof raw.p1Notes !== 'string' || typeof raw.p2Notes !== 'string') return null;

  if (!Array.isArray(raw.p1CustomFields) || !Array.isArray(raw.p2CustomFields)) return null;
  const p1CustomFields: SandboxCustomField[] = [];
  const p2CustomFields: SandboxCustomField[] = [];
  for (const item of raw.p1CustomFields) {
    const field = parseCustomField(item);
    if (!field) return null;
    p1CustomFields.push(field);
  }
  for (const item of raw.p2CustomFields) {
    const field = parseCustomField(item);
    if (!field) return null;
    p2CustomFields.push(field);
  }

  if (!Array.isArray(raw.diceHistory)) return null;
  const diceHistory: SandboxDiceRoll[] = [];
  for (const item of raw.diceHistory) {
    const roll = parseDiceRoll(item);
    if (!roll) return null;
    diceHistory.push(roll);
  }

  const arenaId =
    raw.arenaId === null
      ? null
      : typeof raw.arenaId === 'string'
        ? raw.arenaId
        : undefined;
  if (arenaId === undefined) return null;

  const arenaVariantIndex = parseVariantIndex(raw.arenaVariantIndex);
  if (raw.arenaVariantIndex !== null && arenaVariantIndex === null) return null;

  if (!isFiniteNumber(raw.roundCounter)) return null;
  if (typeof raw.roundNotes !== 'string') return null;
  if (!isFiniteNumber(raw.zoomLevel)) return null;

  const panOffset = parsePosition(raw.panOffset);
  const arenaInfoPosition = parsePosition(raw.arenaInfoPosition);
  if (!panOffset || !arenaInfoPosition) return null;

  if (typeof raw.sidebarOpen !== 'boolean' || typeof raw.arenaInfoExpanded !== 'boolean') {
    return null;
  }

  return {
    version: SANDBOX_SESSION_VERSION,
    placedCards,
    nextZIndex: raw.nextZIndex,
    p1Hp: raw.p1Hp,
    p2Hp: raw.p2Hp,
    p1Notes: raw.p1Notes,
    p2Notes: raw.p2Notes,
    p1CustomFields,
    p2CustomFields,
    diceHistory,
    arenaId,
    arenaVariantIndex,
    roundCounter: raw.roundCounter,
    roundNotes: raw.roundNotes,
    zoomLevel: raw.zoomLevel,
    panOffset,
    arenaInfoPosition,
    sidebarOpen: raw.sidebarOpen,
    arenaInfoExpanded: raw.arenaInfoExpanded,
  };
}

export type LoadSandboxSessionResult = {
  session: SandboxSession;
  /** true when a valid stored record was restored */
  restored: boolean;
};

/** Always returns a valid session; corrupt/missing/unavailable → fresh. */
export function loadSandboxSession(): LoadSandboxSessionResult {
  try {
    const raw = localStorage.getItem(SANDBOX_SESSION_KEY);
    if (!raw) {
      return { session: createFreshSandboxSession(), restored: false };
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      return { session: createFreshSandboxSession(), restored: false };
    }
    const session = parseSession(parsed);
    if (!session) {
      return { session: createFreshSandboxSession(), restored: false };
    }
    return { session, restored: true };
  } catch {
    return { session: createFreshSandboxSession(), restored: false };
  }
}

/** Overwrite the single session record. */
export function saveSandboxSession(session: SandboxSession): SandboxSaveResult {
  if (session.version !== SANDBOX_SESSION_VERSION) {
    return { ok: false, error: 'unsupported-version' };
  }
  try {
    localStorage.setItem(SANDBOX_SESSION_KEY, JSON.stringify(session));
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'storage-unavailable';
    return { ok: false, error: message };
  }
}

/** Remove the current session record (reset). */
export function clearSandboxSession(): SandboxSaveResult {
  try {
    localStorage.removeItem(SANDBOX_SESSION_KEY);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'storage-unavailable';
    return { ok: false, error: message };
  }
}
