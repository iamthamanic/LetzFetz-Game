/**
 * Builds a build-snap presentation step — fly hand → engine + impact.
 * Location: src/features/play/presentation/buildBuildSnapStep.ts
 */
import type { GameState, PlayerId } from '../../../game/types';
import type { PresentationStep } from './types';

/** Total fly + impact settle. */
export const BUILD_SNAP_MS = 720;
/** Time until the card hits the slot (dust fires here). */
export const BUILD_FLY_MS = 480;

export interface BuildSnapPayload {
  playerId: PlayerId;
  cardInstanceId: string;
  cardDefId: string;
  slotIndex: number;
}

export function buildBuildSnapStep(
  playerId: PlayerId,
  cardInstanceId: string,
  cardDefId: string,
  slotIndex: number,
): PresentationStep {
  return {
    id: `build-snap-${cardInstanceId}`,
    kind: 'build-snap',
    durationMs: BUILD_SNAP_MS,
    locksInput: true,
    payload: {
      playerId,
      cardInstanceId,
      cardDefId,
      slotIndex,
    } satisfies BuildSnapPayload as Record<string, unknown>,
  };
}

export function isBuildSnapStep(step: PresentationStep): boolean {
  return step.kind === 'build-snap';
}

/** Returns instance ids that are newly bound (present in next, absent in prev). */
export function findNewlyBuiltCardIds(
  prev: GameState,
  next: GameState,
  playerId: PlayerId,
): string[] {
  const prevIds = new Set(prev.players[playerId].bound.map((b) => b.instanceId));
  return next.players[playerId].bound
    .map((b) => b.instanceId)
    .filter((id) => !prevIds.has(id));
}
