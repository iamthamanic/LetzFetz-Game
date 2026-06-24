/**
 * Single draw-phase presentation step (deck → hand).
 * Location: src/components/game/presentation/buildDrawCardStep.ts
 */
import type { GameState, PlayerId } from '../../../game/types';
import type { PresentationStep } from './types';

export const DRAW_CARD_MS = 280;

export function buildDrawCardStep(
  playerId: PlayerId,
  cardInstanceId: string,
  options: { locksInput?: boolean } = {},
): PresentationStep {
  return {
    id: `draw-card-${cardInstanceId}`,
    kind: 'draw-card',
    durationMs: DRAW_CARD_MS,
    locksInput: options.locksInput ?? true,
    payload: { playerId, cardInstanceId },
  };
}

export function isDrawCardStep(step: PresentationStep): boolean {
  return step.kind === 'draw-card';
}

/** Returns the instance id of a single card added to a player's hand, if any. */
export function findNewlyDrawnCard(
  prev: GameState,
  next: GameState,
  playerId: PlayerId,
): string | null {
  const prevIds = new Set(prev.players[playerId].hand.map((c) => c.instanceId));
  const added = next.players[playerId].hand.filter((c) => !prevIds.has(c.instanceId));
  if (added.length === 0) return null;
  return added[added.length - 1].instanceId;
}
