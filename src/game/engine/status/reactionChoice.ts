/**
 * V3 reaction choice window + outcome resolve.
 * Location: src/game/engine/status/reactionChoice.ts
 */
import type { Element, GameState, PlayerId, PrimaryMarkId, RulesetConfig } from '../../types';
import { isV3CombatEnabled } from '../../types';
import { cloneState } from '../helpers';
import {
  applyElementImpulse,
  PRIMARY_MARK_BY_ELEMENT,
  type ReactionCandidate,
} from './elementImpulse';
import { applyStatus } from './applyStatus';
import { REACTION_LABEL_DE, reactionIdFor, type ReactionId } from './reactions';
import { applyReactionWithOutcome } from './reactionOutcomes';
import { reactionLimitReached } from './v3CombatHooks';
import { applyActiveBlueprintHooks } from './applyBlueprints';
import type { ContentPack } from '../../types';

export interface PickReactionOption {
  reactionId: ReactionId;
  markId: PrimaryMarkId;
  labelDe: string;
}

/**
 * After an impulse that found marks: auto-resolve one candidate, or open pick-reaction.
 */
export function resolveImpulseReactions(
  state: GameState,
  targetId: PlayerId,
  impulseElement: Element,
  ruleset: RulesetConfig,
  chooserId: PlayerId,
  pack?: ContentPack,
): GameState {
  if (!isV3CombatEnabled(ruleset)) return state;

  let working = state;
  if (pack) {
    working = applyActiveBlueprintHooks(working, pack, chooserId, ruleset);
  }

  if (reactionLimitReached(working.meta)) {
    const markId = PRIMARY_MARK_BY_ELEMENT[impulseElement];
    return applyStatus(working, targetId, markId, 1);
  }

  const impulse = applyElementImpulse(working, targetId, impulseElement, ruleset);
  if (impulse.kind !== 'reaction') {
    return impulse.state;
  }

  const options = candidatesToOptions(impulse.candidates);
  if (options.length === 0) return impulse.state;

  if (options.length === 1) {
    return applyChosenReaction(impulse.state, targetId, options[0], chooserId, ruleset, pack);
  }

  const next = cloneState(impulse.state);
  next.pendingChoice = {
    type: 'pick-reaction',
    chooserId,
    targetId,
    impulseElement,
    options,
  };
  next.lastEvent = 'Reaktion wählen.';
  return next;
}

export function candidatesToOptions(
  candidates: ReactionCandidate[],
): PickReactionOption[] {
  const seen = new Set<ReactionId>();
  const options: PickReactionOption[] = [];
  for (const c of candidates) {
    const reactionId = reactionIdFor(c.impulseElement, c.markId);
    if (seen.has(reactionId)) continue;
    seen.add(reactionId);
    options.push({
      reactionId,
      markId: c.markId,
      labelDe: REACTION_LABEL_DE[reactionId],
    });
  }
  return options;
}

export function applyChosenReaction(
  state: GameState,
  targetId: PlayerId,
  option: PickReactionOption,
  chooserId: PlayerId,
  ruleset: RulesetConfig,
  pack?: ContentPack,
): GameState {
  return applyReactionWithOutcome(state, option.reactionId, {
    targetId,
    chooserId,
    consumedMark: option.markId,
    ruleset,
    pack,
  });
}

/** @deprecated use applyChosenReaction */
export const applyReactionStub = applyChosenReaction;

export function pickReaction(
  state: GameState,
  reactionId: ReactionId,
  ruleset: RulesetConfig,
  pack?: ContentPack,
): GameState {
  const pending = state.pendingChoice;
  if (pending?.type !== 'pick-reaction') {
    throw new Error('No pick-reaction pending');
  }
  const option = pending.options.find((o) => o.reactionId === reactionId);
  if (!option) throw new Error('Illegal reaction choice');
  return applyChosenReaction(
    state,
    pending.targetId,
    {
      reactionId: option.reactionId as ReactionId,
      markId: option.markId,
      labelDe: option.labelDe,
    },
    pending.chooserId,
    ruleset,
    pack,
  );
}
