/**
 * Helpers to resolve full GameAction payloads from legal actions + UI selection.
 * Location: src/features/play/board/gameActionHelpers.ts
 */
import type { GameAction } from '../../../game';

export type PendingIntent =
  | { type: 'attack'; attackInstanceId: string; targetBoundInstanceId?: string }
  /** Build phase: choosing which hand card to put into the engine. */
  | { type: 'build-select' }
  | { type: 'build'; handInstanceId: string }
  /** Action phase: choosing a hand card to play as the main action. */
  | { type: 'action-select' }
  | { type: 'activate'; boundInstanceId: string };

export function hasChallengeForAttack(
  legalActions: GameAction[],
  attackInstanceId: string,
): boolean {
  return legalActions.some(
    (a) => a.type === 'CHALLENGE' && a.attackCardInstanceId === attackInstanceId,
  );
}

export function buildRequiresReplace(
  legalActions: GameAction[],
  handInstanceId: string,
): boolean {
  const buildActions = legalActions.filter(
    (a) => a.type === 'BUILD_CARD' && a.cardInstanceId === handInstanceId,
  );
  return buildActions.length > 0 && buildActions.every((a) => a.type === 'BUILD_CARD' && Boolean(a.discardBoundId));
}

export function findDirectBuildAction(
  legalActions: GameAction[],
  handInstanceId: string,
): GameAction | null {
  return (
    legalActions.find(
      (a) =>
        a.type === 'BUILD_CARD' &&
        a.cardInstanceId === handInstanceId &&
        !a.discardBoundId,
    ) ?? null
  );
}

export function findBuildReplaceAction(
  legalActions: GameAction[],
  handInstanceId: string,
  discardBoundId: string,
): GameAction | null {
  return (
    legalActions.find(
      (a) =>
        a.type === 'BUILD_CARD' &&
        a.cardInstanceId === handInstanceId &&
        a.discardBoundId === discardBoundId,
    ) ?? null
  );
}

export function findChallengeAction(
  legalActions: GameAction[],
  attackInstanceId: string,
  targetBoundInstanceId: string,
): GameAction | null {
  return (
    legalActions.find(
      (a) =>
        a.type === 'CHALLENGE' &&
        a.attackCardInstanceId === attackInstanceId &&
        a.targetBoundInstanceId === targetBoundInstanceId,
    ) ?? null
  );
}

export function findActivateAction(
  legalActions: GameAction[],
  boundInstanceId: string,
  discardHandInstanceId: string,
): GameAction | null {
  return (
    legalActions.find(
      (a) =>
        a.type === 'ACTIVATE_BOUND' &&
        a.boundInstanceId === boundInstanceId &&
        a.discardHandInstanceId === discardHandInstanceId,
    ) ?? null
  );
}

export function findDiscardDrawAction(
  legalActions: GameAction[],
  discardInstanceId: string,
): GameAction | null {
  return (
    legalActions.find(
      (a) =>
        (a.type === 'DISCARD_DRAW' && a.discardInstanceId === discardInstanceId) ||
        (a.type === 'RESOLVE_DRAW_DISCARD' && a.discardInstanceId === discardInstanceId),
    ) ?? null
  );
}

export function findPlayGlitchAction(
  legalActions: GameAction[],
  glitchInstanceId: string,
): GameAction | null {
  return (
    legalActions.find(
      (a) =>
        a.type === 'PLAY_GLITCH' &&
        a.glitchInstanceId === glitchInstanceId &&
        !a.discardHandInstanceId &&
        !a.targetBoundInstanceId,
    ) ?? null
  );
}

export function isChallengeTargetForAttack(
  legalActions: GameAction[],
  attackInstanceId: string,
  targetBoundInstanceId: string,
): boolean {
  return findChallengeAction(legalActions, attackInstanceId, targetBoundInstanceId) !== null;
}

export function isActivateDiscardOption(
  legalActions: GameAction[],
  boundInstanceId: string,
  handInstanceId: string,
): boolean {
  return findActivateAction(legalActions, boundInstanceId, handInstanceId) !== null;
}

export function isBuildReplaceTarget(
  legalActions: GameAction[],
  handInstanceId: string,
  boundInstanceId: string,
): boolean {
  return findBuildReplaceAction(legalActions, handInstanceId, boundInstanceId) !== null;
}
