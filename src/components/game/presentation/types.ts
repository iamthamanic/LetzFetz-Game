/**
 * UI-only presentation step types — no engine coupling.
 * Location: src/components/game/presentation/types.ts
 */

/** Stable id for deduping or logging; callers supply unique ids per step. */
export type PresentationStepId = string;

/** One sequenced UI animation beat (deal card, draw, build snap, etc.). */
export type PresentationStep = {
  id: PresentationStepId;
  /** Semantic kind for renderers, e.g. `deal-card`, `draw-card`, `build-snap`. */
  kind: string;
  /** Auto-advance after N ms; `0` waits for manual `completeStep()`. */
  durationMs: number;
  /** When false, step animates without blocking human input (e.g. bot draw). */
  locksInput?: boolean;
  /** Optional opaque payload for zone components (card ids, player side, …). */
  payload?: Record<string, unknown>;
};

export type PresentationQueueSnapshot = {
  pending: PresentationStep[];
  active: PresentationStep | null;
  /** True while any step is active or pending — human input should stay blocked. */
  inputLocked: boolean;
  /** Set when `skip()` aborts the remaining sequence. */
  skipped: boolean;
};
