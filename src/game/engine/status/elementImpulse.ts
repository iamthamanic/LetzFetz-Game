/**
 * V3 element impulse → primary mark or reaction candidates (§3).
 * Location: src/game/engine/status/elementImpulse.ts
 */
import type { Element, GameState, PlayerId, PrimaryMarkId, StatusId } from '../../types';
import { isV3CombatEnabled, type RulesetConfig } from '../../types';
import { applyStatus, getStatus, hasStatus } from './applyStatus';

/** Primary mark created by an impulse when no reaction fires (§2.3). */
export const PRIMARY_MARK_BY_ELEMENT: Record<Element, PrimaryMarkId> = {
  fire: 'brennen',
  water: 'durchnaesst',
  earth: 'high',
  air: 'aufgewirbelt',
  light: 'erleuchtet',
  shadow: 'verflucht',
};

/** All primary marks that can form a reaction with an impulse (mono or mixed). */
export function reactionPartnerMarks(_impulseElement: Element): PrimaryMarkId[] {
  return [
    'brennen',
    'durchnaesst',
    'high',
    'aufgewirbelt',
    'erleuchtet',
    'verflucht',
  ];
}

export interface ReactionCandidate {
  impulseElement: Element;
  markId: PrimaryMarkId;
}

export type ImpulseResult =
  | { kind: 'mark'; state: GameState; markId: PrimaryMarkId }
  | { kind: 'reaction'; state: GameState; candidates: ReactionCandidate[] }
  | { kind: 'skipped'; state: GameState; reason: 'v3-disabled' };

/**
 * Resolve an element impulse on a target (V3 §3.3).
 * When one or more primary marks would react, returns candidates without applying a new mark
 * (reaction resolve is a later slice). Otherwise applies the primary mark.
 */
export function applyElementImpulse(
  state: GameState,
  targetId: PlayerId,
  impulseElement: Element,
  ruleset: RulesetConfig,
): ImpulseResult {
  if (!isV3CombatEnabled(ruleset)) {
    return { kind: 'skipped', state, reason: 'v3-disabled' };
  }

  const candidates: ReactionCandidate[] = [];
  for (const markId of reactionPartnerMarks(impulseElement)) {
    if (hasStatus(state, targetId, markId as StatusId)) {
      candidates.push({ impulseElement, markId });
    }
  }

  if (candidates.length > 0) {
    return { kind: 'reaction', state, candidates };
  }

  const markId = PRIMARY_MARK_BY_ELEMENT[impulseElement];
  const next = applyStatus(state, targetId, markId, 1);
  return { kind: 'mark', state: next, markId };
}

export function primaryMarkStacks(
  state: GameState,
  playerId: PlayerId,
  markId: PrimaryMarkId,
): number {
  return getStatus(state, playerId, markId)?.stacks ?? 0;
}
