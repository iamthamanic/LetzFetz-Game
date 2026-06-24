/**
 * Pure presentation queue reducer — testable without React.
 * Location: src/components/game/presentation/presentationQueue.ts
 */
import type { PresentationQueueSnapshot, PresentationStep } from './types';

export const IDLE_PRESENTATION_QUEUE: PresentationQueueSnapshot = {
  pending: [],
  active: null,
  inputLocked: false,
  skipped: false,
};

function startNext(snapshot: PresentationQueueSnapshot): PresentationQueueSnapshot {
  if (snapshot.pending.length === 0) {
    return {
      ...snapshot,
      active: null,
      inputLocked: false,
    };
  }

  const [next, ...rest] = snapshot.pending;
  return {
    ...snapshot,
    pending: rest,
    active: next,
    inputLocked: true,
  };
}

/** Append steps; starts playback when queue was idle. */
export function enqueuePresentationSteps(
  snapshot: PresentationQueueSnapshot,
  steps: PresentationStep[],
): PresentationQueueSnapshot {
  if (steps.length === 0) return snapshot;

  const withPending: PresentationQueueSnapshot = {
    ...snapshot,
    pending: [...snapshot.pending, ...steps],
    skipped: false,
  };

  if (withPending.active) {
    return { ...withPending, inputLocked: true };
  }

  return startNext(withPending);
}

/** Mark the active step finished and advance to the next one. */
export function completePresentationStep(
  snapshot: PresentationQueueSnapshot,
): PresentationQueueSnapshot {
  if (!snapshot.active) return snapshot;
  return startNext({ ...snapshot, active: null });
}

/**
 * Abort remaining steps (user skip or reduced-motion fast path).
 * Clears pending + active and unlocks input; sets `skipped`.
 */
export function skipPresentation(snapshot: PresentationQueueSnapshot): PresentationQueueSnapshot {
  return {
    pending: [],
    active: null,
    inputLocked: false,
    skipped: true,
  };
}

/** Hard reset — match end, rematch, teardown. Clears skip flag too. */
export function flushPresentationQueue(
  snapshot: PresentationQueueSnapshot,
): PresentationQueueSnapshot {
  void snapshot;
  return { ...IDLE_PRESENTATION_QUEUE };
}

export function isPresentationIdle(snapshot: PresentationQueueSnapshot): boolean {
  return !snapshot.active && snapshot.pending.length === 0;
}

export function pendingPresentationCount(snapshot: PresentationQueueSnapshot): number {
  return snapshot.pending.length + (snapshot.active ? 1 : 0);
}
