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
  /** Action phase: Improvisieren — pick any hand card to DISCARD_DRAW. */
  | { type: 'improvise' }
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
  if (
    legalActions.some(
      (a) => a.type === 'FORMULA_REPLACE' && a.cardInstanceId === handInstanceId,
    )
  ) {
    // FORMULA_REPLACE does not need a slot pick — still flag for coach copy.
    return false;
  }
  const buildActions = legalActions.filter(
    (a) => a.type === 'BUILD_CARD' && a.cardInstanceId === handInstanceId,
  );
  return buildActions.length > 0 && buildActions.every((a) => a.type === 'BUILD_CARD' && Boolean(a.discardBoundId));
}

export function findDirectBuildAction(
  legalActions: GameAction[],
  handInstanceId: string,
): GameAction | null {
  const formulaBuild =
    legalActions.find(
      (a) => a.type === 'FORMULA_BUILD' && a.cardInstanceId === handInstanceId,
    ) ??
    legalActions.find(
      (a) => a.type === 'FORMULA_REPLACE' && a.cardInstanceId === handInstanceId,
    ) ??
    legalActions.find(
      (a) => a.type === 'FORMULA_SCHNELLMIX' && a.cardInstanceId === handInstanceId,
    );
  if (formulaBuild) return formulaBuild;

  return (
    legalActions.find(
      (a) =>
        a.type === 'BUILD_CARD' &&
        a.cardInstanceId === handInstanceId &&
        !a.discardBoundId,
    ) ?? null
  );
}

export function findPlayItemAction(
  legalActions: GameAction[],
  cardInstanceId: string,
): GameAction | null {
  return (
    legalActions.find(
      (a) => a.type === 'PLAY_ITEM' && a.cardInstanceId === cardInstanceId,
    ) ?? null
  );
}

export function formulaChallengeTargetIds(
  legalActions: GameAction[],
  attackInstanceId: string,
): string[] {
  return legalActions
    .filter(
      (a): a is Extract<GameAction, { type: 'CHALLENGE' }> =>
        a.type === 'CHALLENGE' && a.attackCardInstanceId === attackInstanceId,
    )
    .map((a) => a.targetBoundInstanceId);
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

/** V3 pool activate: ACTIVATE_BOUND without hand discard. */
export function findPoolActivateAction(
  legalActions: GameAction[],
  boundInstanceId: string,
): GameAction | null {
  return (
    legalActions.find(
      (a) =>
        a.type === 'ACTIVATE_BOUND' &&
        a.boundInstanceId === boundInstanceId &&
        a.discardHandInstanceId == null,
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
