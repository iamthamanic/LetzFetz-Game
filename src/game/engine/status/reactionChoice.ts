/**
 * V3 reaction choice window + stub resolve (full outcomes in later slices).
 * Location: src/game/engine/status/reactionChoice.ts
 */
import type { Element, GameState, PlayerId, PrimaryMarkId, RulesetConfig } from '../../types';
import { isV3CombatEnabled } from '../../types';
import { cloneState } from '../helpers';
import { applyElementImpulse, type ReactionCandidate } from './elementImpulse';
import { applyStatus, removeStatus } from './applyStatus';
import { PRIMARY_MARK_BY_ELEMENT } from './elementImpulse';
import { REACTION_LABEL_DE, reactionIdFor, type ReactionId } from './reactions';

export interface PickReactionOption {
  reactionId: ReactionId;
  markId: PrimaryMarkId;
  labelDe: string;
}

/**
 * After an impulse that found marks: auto-resolve one candidate, or open pick-reaction.
 * Enforces max one reaction per action via meta.v3ReactionsThisAction.
 */
export function resolveImpulseReactions(
  state: GameState,
  targetId: PlayerId,
  impulseElement: Element,
  ruleset: RulesetConfig,
  chooserId: PlayerId,
): GameState {
  if (!isV3CombatEnabled(ruleset)) return state;

  const reactionsUsed = state.meta.v3ReactionsThisAction ?? 0;
  if (reactionsUsed >= 1) {
    const markId = PRIMARY_MARK_BY_ELEMENT[impulseElement];
    return applyStatus(state, targetId, markId, 1);
  }

  const impulse = applyElementImpulse(state, targetId, impulseElement, ruleset);
  if (impulse.kind !== 'reaction') {
    return impulse.state;
  }

  const options = candidatesToOptions(impulse.candidates);
  if (options.length === 0) return impulse.state;

  if (options.length === 1) {
    return applyReactionStub(impulse.state, targetId, options[0], chooserId);
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

/** Core stub: consume chosen mark, no new mark, no outcome effects yet (#104+). */
export function applyReactionStub(
  state: GameState,
  targetId: PlayerId,
  option: PickReactionOption,
  _chooserId: PlayerId,
): GameState {
  let next = removeStatus(state, targetId, option.markId);
  next = cloneState(next);
  next.pendingChoice = null;
  next.meta = {
    ...next.meta,
    v3ReactionsThisAction: (next.meta.v3ReactionsThisAction ?? 0) + 1,
  };
  next.lastEvent = `Reaktion: ${option.labelDe}.`;
  return next;
}

export function pickReaction(
  state: GameState,
  reactionId: ReactionId,
): GameState {
  const pending = state.pendingChoice;
  if (pending?.type !== 'pick-reaction') {
    throw new Error('No pick-reaction pending');
  }
  const option = pending.options.find((o) => o.reactionId === reactionId);
  if (!option) throw new Error('Illegal reaction choice');
  return applyReactionStub(state, pending.targetId, option, pending.chooserId);
}
