/**
 * Formula play opt-in — deck entries + activated field recipes (localStorage).
 * Location: src/services/storage/formulaPlayOptIn.ts
 *
 * Play merges deck opt-ins into V5 pack at match start (see mergeFormulaPlayOverlay).
 * Kombinationen are never added to the main deck — only activated recipe templates.
 */
export const FORMULA_PLAY_OPTIN_STORAGE_KEY = 'letzfetz:formula-play-opt-in';

/** Dispatched after opt-in writes so Forge / Play setup can refresh. */
export const FORMULA_PLAY_OPTIN_UPDATED_EVENT = 'letzfetz:formula-play-opt-in-updated';

export const FORMULA_PLAY_OPTIN_STORE_VERSION = 1 as const;

import {
  FORMULA_BAUSTEIN_ROLES,
  type ActivatedRecipeEntry,
  type DeckOptInEntry,
  type FormulaBausteinRole,
  type RecipeVersionSnapshot,
} from '../../game/packs/formulaPlayOverlayTypes';

export {
  FORMULA_BAUSTEIN_ROLES,
  type ActivatedRecipeEntry,
  type DeckOptInEntry,
  type FormulaBausteinRole,
  type RecipeVersionSnapshot,
};

export interface FormulaPlayOptInStore {
  version: typeof FORMULA_PLAY_OPTIN_STORE_VERSION;
  deckOptIns: DeckOptInEntry[];
  activatedRecipes: ActivatedRecipeEntry[];
  updatedAt: string;
}

export type OptInFreshness = 'fresh' | 'outdated' | 'missing';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFormulaBausteinRole(value: unknown): value is FormulaBausteinRole {
  return typeof value === 'string' && (FORMULA_BAUSTEIN_ROLES as readonly string[]).includes(value);
}

function parsePositiveInt(raw: unknown): number | null {
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 1) return null;
  return raw;
}

function parseOptionalPositiveInt(raw: unknown): number | null {
  if (raw === undefined || raw === null) return null;
  return parsePositiveInt(raw);
}

function parseIsoTimestamp(raw: unknown): string | null {
  if (typeof raw !== 'string' || Number.isNaN(Date.parse(raw))) return null;
  return raw;
}

function parseDeckOptInEntry(raw: unknown): DeckOptInEntry | null {
  if (!isRecord(raw)) return null;
  const cardId = raw.cardId;
  const name = raw.name;
  const role = raw.role;
  const pinnedVersion = parsePositiveInt(raw.pinnedVersion);
  const addedAt = parseIsoTimestamp(raw.addedAt);
  if (typeof cardId !== 'string' || cardId.trim().length === 0) return null;
  if (typeof name !== 'string' || name.trim().length === 0) return null;
  if (!isFormulaBausteinRole(role)) return null;
  if (pinnedVersion === null || addedAt === null) return null;
  return { cardId, role, name, pinnedVersion, addedAt };
}

function parseActivatedRecipeEntry(raw: unknown): ActivatedRecipeEntry | null {
  if (!isRecord(raw)) return null;
  const recipeId = raw.recipeId;
  const name = raw.name;
  const pinnedRecipeVersion = parsePositiveInt(raw.pinnedRecipeVersion);
  const activatedAt = parseIsoTimestamp(raw.activatedAt);
  if (typeof recipeId !== 'string' || recipeId.trim().length === 0) return null;
  if (typeof name !== 'string' || name.trim().length === 0) return null;
  if (pinnedRecipeVersion === null || activatedAt === null) return null;

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

  return {
    recipeId,
    name,
    pinnedRecipeVersion,
    techniqueId,
    essenceId,
    catalystId,
    techniqueVersion: parseOptionalPositiveInt(raw.techniqueVersion),
    essenceVersion: parseOptionalPositiveInt(raw.essenceVersion),
    catalystVersion: parseOptionalPositiveInt(raw.catalystVersion),
    activatedAt,
  };
}

function emptyStore(): FormulaPlayOptInStore {
  return {
    version: FORMULA_PLAY_OPTIN_STORE_VERSION,
    deckOptIns: [],
    activatedRecipes: [],
    updatedAt: new Date(0).toISOString(),
  };
}

export function parseFormulaPlayOptInStore(raw: unknown): FormulaPlayOptInStore {
  if (!isRecord(raw)) return emptyStore();
  if (raw.version !== FORMULA_PLAY_OPTIN_STORE_VERSION) return emptyStore();

  const deckOptIns: DeckOptInEntry[] = [];
  if (Array.isArray(raw.deckOptIns)) {
    for (const item of raw.deckOptIns) {
      const entry = parseDeckOptInEntry(item);
      if (entry) deckOptIns.push(entry);
    }
  }

  const activatedRecipes: ActivatedRecipeEntry[] = [];
  if (Array.isArray(raw.activatedRecipes)) {
    for (const item of raw.activatedRecipes) {
      const entry = parseActivatedRecipeEntry(item);
      if (entry) activatedRecipes.push(entry);
    }
  }

  const updatedAt =
    parseIsoTimestamp(raw.updatedAt) ?? new Date().toISOString();

  return {
    version: FORMULA_PLAY_OPTIN_STORE_VERSION,
    deckOptIns,
    activatedRecipes,
    updatedAt,
  };
}

function readRawStore(): FormulaPlayOptInStore {
  if (typeof localStorage === 'undefined') return emptyStore();
  try {
    const raw = localStorage.getItem(FORMULA_PLAY_OPTIN_STORAGE_KEY);
    if (!raw) return emptyStore();
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      return emptyStore();
    }
    return parseFormulaPlayOptInStore(parsed);
  } catch {
    return emptyStore();
  }
}

function notifyOptInUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(FORMULA_PLAY_OPTIN_UPDATED_EVENT));
}

function writeStore(store: FormulaPlayOptInStore): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    localStorage.setItem(FORMULA_PLAY_OPTIN_STORAGE_KEY, JSON.stringify(store));
    notifyOptInUpdated();
    return true;
  } catch {
    return false;
  }
}

export function loadFormulaPlayOptInStore(): FormulaPlayOptInStore {
  return readRawStore();
}

export function getDeckOptIn(cardId: string): DeckOptInEntry | undefined {
  return readRawStore().deckOptIns.find((e) => e.cardId === cardId);
}

export function getActivatedRecipe(recipeId: string): ActivatedRecipeEntry | undefined {
  return readRawStore().activatedRecipes.find((e) => e.recipeId === recipeId);
}

export interface AddToDeckOptInInput {
  cardId: string;
  role: FormulaBausteinRole;
  name: string;
  pinnedVersion: number;
}

/** Pin / refresh a Baustein for the playable deck overlay. */
export function addBausteinToPlayDeck(input: AddToDeckOptInInput): boolean {
  if (!input.cardId.trim() || !input.name.trim()) return false;
  if (!Number.isInteger(input.pinnedVersion) || input.pinnedVersion < 1) return false;

  const registry = readRawStore();
  const now = new Date().toISOString();
  const next = registry.deckOptIns.filter((e) => e.cardId !== input.cardId);
  next.push({
    cardId: input.cardId,
    role: input.role,
    name: input.name.trim(),
    pinnedVersion: input.pinnedVersion,
    addedAt: now,
  });

  return writeStore({
    version: FORMULA_PLAY_OPTIN_STORE_VERSION,
    deckOptIns: next,
    activatedRecipes: registry.activatedRecipes,
    updatedAt: now,
  });
}

export interface ActivateRecipeOptInInput {
  recipeId: string;
  name: string;
  pinnedRecipeVersion: number;
  techniqueId: string | null;
  essenceId: string | null;
  catalystId: string | null;
  techniqueVersion: number | null;
  essenceVersion: number | null;
  catalystVersion: number | null;
}

/** Activate a Kombination as a field recipe template (never a hand card). */
export function activateFormulaRecipe(input: ActivateRecipeOptInInput): boolean {
  if (!input.recipeId.trim() || !input.name.trim()) return false;
  if (!Number.isInteger(input.pinnedRecipeVersion) || input.pinnedRecipeVersion < 1) return false;

  const registry = readRawStore();
  const now = new Date().toISOString();
  const next = registry.activatedRecipes.filter((e) => e.recipeId !== input.recipeId);
  next.push({
    recipeId: input.recipeId,
    name: input.name.trim(),
    pinnedRecipeVersion: input.pinnedRecipeVersion,
    techniqueId: input.techniqueId,
    essenceId: input.essenceId,
    catalystId: input.catalystId,
    techniqueVersion: input.techniqueVersion,
    essenceVersion: input.essenceVersion,
    catalystVersion: input.catalystVersion,
    activatedAt: now,
  });

  return writeStore({
    version: FORMULA_PLAY_OPTIN_STORE_VERSION,
    deckOptIns: registry.deckOptIns,
    activatedRecipes: next,
    updatedAt: now,
  });
}

export function isDeckOptInOutdated(
  entry: DeckOptInEntry,
  currentVersion: number,
): boolean {
  return currentVersion > entry.pinnedVersion;
}

export function isActivatedRecipeOutdated(
  entry: ActivatedRecipeEntry,
  current: RecipeVersionSnapshot,
): boolean {
  if (current.recipeVersion > entry.pinnedRecipeVersion) return true;
  if (
    entry.techniqueId &&
    entry.techniqueVersion !== null &&
    current.techniqueVersion !== null &&
    current.techniqueVersion > entry.techniqueVersion
  ) {
    return true;
  }
  if (
    entry.essenceId &&
    entry.essenceVersion !== null &&
    current.essenceVersion !== null &&
    current.essenceVersion > entry.essenceVersion
  ) {
    return true;
  }
  if (
    entry.catalystId &&
    entry.catalystVersion !== null &&
    current.catalystVersion !== null &&
    current.catalystVersion > entry.catalystVersion
  ) {
    return true;
  }
  return false;
}

export function deckOptInFreshness(
  entry: DeckOptInEntry | undefined,
  currentVersion: number,
): OptInFreshness {
  if (!entry) return 'missing';
  return isDeckOptInOutdated(entry, currentVersion) ? 'outdated' : 'fresh';
}

export function activatedRecipeFreshness(
  entry: ActivatedRecipeEntry | undefined,
  current: RecipeVersionSnapshot | null,
): OptInFreshness {
  if (!entry) return 'missing';
  if (!current) return 'fresh';
  return isActivatedRecipeOutdated(entry, current) ? 'outdated' : 'fresh';
}

export interface OutdatedPlayOptInSummary {
  outdatedDeckCount: number;
  outdatedRecipeCount: number;
  hasOutdated: boolean;
}

/** Count outdated entries — caller supplies version resolvers from pack/registry. */
export function summarizeOutdatedOptIns(input: {
  deckOptIns: DeckOptInEntry[];
  activatedRecipes: ActivatedRecipeEntry[];
  resolveBausteinVersion: (cardId: string) => number;
  resolveRecipeSnapshot: (recipeId: string) => RecipeVersionSnapshot | null;
}): OutdatedPlayOptInSummary {
  let outdatedDeckCount = 0;
  for (const entry of input.deckOptIns) {
    if (isDeckOptInOutdated(entry, input.resolveBausteinVersion(entry.cardId))) {
      outdatedDeckCount += 1;
    }
  }

  let outdatedRecipeCount = 0;
  for (const entry of input.activatedRecipes) {
    const snap = input.resolveRecipeSnapshot(entry.recipeId);
    if (snap && isActivatedRecipeOutdated(entry, snap)) {
      outdatedRecipeCount += 1;
    }
  }

  return {
    outdatedDeckCount,
    outdatedRecipeCount,
    hasOutdated: outdatedDeckCount > 0 || outdatedRecipeCount > 0,
  };
}
