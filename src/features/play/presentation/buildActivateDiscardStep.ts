/**
 * Builds a presentation step for the activate-bound discard fly VFX.
 * Location: src/features/play/presentation/buildActivateDiscardStep.ts
 *
 * When a bound card is activated, a hand card is discarded. This step animates
 * that hand card flying to the discard pile.
 */
import type { GameState, PlayerId } from '../../../game/types';
import type { PresentationStep } from './types';

export const ACTIVATE_DISCARD_MS = 420;

export function buildActivateDiscardStep(
  playerId: PlayerId,
  cardInstanceId: string,
): PresentationStep {
  return {
    id: `activate-discard-${cardInstanceId}`,
    kind: 'activate-discard',
    durationMs: ACTIVATE_DISCARD_MS,
    locksInput: false,
    payload: { playerId, cardInstanceId },
  };
}

export function isActivateDiscardStep(step: PresentationStep): boolean {
  return step.kind === 'activate-discard';
}

/** Returns the hand card instance id that was discarded by an ACTIVATE_BOUND action. */
export function findActivatedDiscardCardId(
  prev: GameState,
  next: GameState,
  playerId: PlayerId,
): string | null {
  const prevHand = prev.players[playerId].hand.map((c) => c.instanceId);
  const nextHandSet = new Set(next.players[playerId].hand.map((c) => c.instanceId));
  const removed = prevHand.find((id) => !nextHandSet.has(id));
  if (!removed) return null;

  // Confirm the discard pile grew (not just a draw replacing it)
  if (next.piles.discard.length > prev.piles.discard.length) {
    return removed;
  }
  return null;
}