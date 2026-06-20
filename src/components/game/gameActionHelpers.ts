/**
 * Helpers to resolve full GameAction payloads from legal actions + UI selection.
 * Location: src/components/game/gameActionHelpers.ts
 */
import type { GameAction } from '../../game';

export type PendingIntent =
  | { type: 'attack'; attackInstanceId: string }
  | { type: 'bind'; handInstanceId: string }
  | { type: 'activate'; boundInstanceId: string };

export function hasChallengeForAttack(
  legalActions: GameAction[],
  attackInstanceId: string,
): boolean {
  return legalActions.some(
    (a) => a.type === 'CHALLENGE' && a.attackCardInstanceId === attackInstanceId,
  );
}

export function bindRequiresReplace(
  legalActions: GameAction[],
  handInstanceId: string,
): boolean {
  const bindActions = legalActions.filter(
    (a) => a.type === 'BIND_CARD' && a.cardInstanceId === handInstanceId,
  );
  return bindActions.length > 0 && bindActions.every((a) => a.type === 'BIND_CARD' && Boolean(a.discardBoundId));
}

export function findDirectBindAction(
  legalActions: GameAction[],
  handInstanceId: string,
): GameAction | null {
  return (
    legalActions.find(
      (a) =>
        a.type === 'BIND_CARD' &&
        a.cardInstanceId === handInstanceId &&
        !a.discardBoundId,
    ) ?? null
  );
}

export function findBindReplaceAction(
  legalActions: GameAction[],
  handInstanceId: string,
  discardBoundId: string,
): GameAction | null {
  return (
    legalActions.find(
      (a) =>
        a.type === 'BIND_CARD' &&
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
      (a) => a.type === 'DISCARD_DRAW' && a.discardInstanceId === discardInstanceId,
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

export function isBindReplaceTarget(
  legalActions: GameAction[],
  handInstanceId: string,
  boundInstanceId: string,
): boolean {
  return findBindReplaceAction(legalActions, handInstanceId, boundInstanceId) !== null;
}
