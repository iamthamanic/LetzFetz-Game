/**
 * Builds a single bind-snap presentation step for a newly bound card.
 * Location: src/components/game/presentation/buildBindSnapStep.ts
 */
import type { GameState, PlayerId } from '../../../game/types';
import type { PresentationStep } from './types';

export const BIND_SNAP_MS = 600;

export function buildBindSnapStep(
  playerId: PlayerId,
  cardInstanceId: string,
): PresentationStep {
  return {
    id: `bind-snap-${cardInstanceId}`,
    kind: 'bind-snap',
    durationMs: BIND_SNAP_MS,
    locksInput: false,
    payload: { playerId, cardInstanceId },
  };
}

export function isBindSnapStep(step: PresentationStep): boolean {
  return step.kind === 'bind-snap';
}

/** Returns instance ids that are newly bound (present in next, absent in prev). */
export function findNewlyBoundCardIds(
  prev: GameState,
  next: GameState,
  playerId: PlayerId,
): string[] {
  const prevIds = new Set(prev.players[playerId].bound.map((b) => b.instanceId));
  return next.players[playerId].bound
    .map((b) => b.instanceId)
    .filter((id) => !prevIds.has(id));
}