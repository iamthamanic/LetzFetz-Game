/**
 * Typed Sandbox domain model — content display + one local session record.
 * Location: src/features/sandbox/model/sandboxTypes.ts
 */

export const SANDBOX_SESSION_VERSION = 1 as const;
export const SANDBOX_SESSION_KEY = 'letz-fetz:sandbox:session:v1';

/** German toolbar labels for Issue 2 UI (foundation contract). */
export type SandboxStorageStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface SandboxPosition {
  x: number;
  y: number;
}

export interface SandboxCustomField {
  name: string;
  value: number;
}

/** Placed table card — stable pack/forge id, not full card payload. */
export interface SandboxPlacedCard {
  instanceId: string;
  cardId: string;
  position: SandboxPosition;
  zIndex: number;
}

export interface SandboxDiceRoll {
  id: string;
  value: number;
  timestamp: string;
}

/**
 * Exactly one versioned local session record.
 * Stores playtest state + stable IDs only — never tokens or secrets.
 */
export interface SandboxSession {
  version: typeof SANDBOX_SESSION_VERSION;
  placedCards: SandboxPlacedCard[];
  nextZIndex: number;
  p1Hp: number;
  p2Hp: number;
  p1Notes: string;
  p2Notes: string;
  p1CustomFields: SandboxCustomField[];
  p2CustomFields: SandboxCustomField[];
  diceHistory: SandboxDiceRoll[];
  arenaId: string | null;
  /** W6 variant index 0|1|2 when arena has d6Variants; otherwise null. */
  arenaVariantIndex: 0 | 1 | 2 | null;
  roundCounter: number;
  roundNotes: string;
  zoomLevel: number;
  panOffset: SandboxPosition;
  arenaInfoPosition: SandboxPosition;
  sidebarOpen: boolean;
  arenaInfoExpanded: boolean;
}

/** Display card for the free table — presentation fields only. */
export interface SandboxCard {
  id: string;
  name: string;
  kind: string;
  element: string;
  imageAsset: string;
  notes: string;
  effects: string[];
  fromPack: boolean;
}

export interface SandboxArena {
  id: string;
  name: string;
  role: string;
  baseEffect: string;
  trigger: string;
  specialRule: string;
  d6Variants?: [string, string, string];
}

export interface SandboxContent {
  cards: SandboxCard[];
  arenas: SandboxArena[];
}

export function createFreshSandboxSession(): SandboxSession {
  return {
    version: SANDBOX_SESSION_VERSION,
    placedCards: [],
    nextZIndex: 100,
    p1Hp: 20,
    p2Hp: 20,
    p1Notes: '',
    p2Notes: '',
    p1CustomFields: [
      { name: 'Stat 1', value: 0 },
      { name: 'Stat 2', value: 0 },
      { name: 'Stat 3', value: 0 },
    ],
    p2CustomFields: [
      { name: 'Stat 1', value: 0 },
      { name: 'Stat 2', value: 0 },
      { name: 'Stat 3', value: 0 },
    ],
    diceHistory: [],
    arenaId: null,
    arenaVariantIndex: null,
    roundCounter: 1,
    roundNotes: '',
    zoomLevel: 1,
    panOffset: { x: 0, y: 0 },
    arenaInfoPosition: { x: 100, y: 100 },
    sidebarOpen: true,
    arenaInfoExpanded: true,
  };
}
