/**
 * V3 ulti / transform / blueprint extension hooks (§14–16).
 * Content later; this module is the engine contract + meta flags.
 * Location: src/game/engine/status/v3CombatHooks.ts
 */
import type { GameState, MatchMeta, PlayerId } from '../../types';
import { cloneState } from '../helpers';
import type { ReactionId } from './reactions';

/** Default V3: one reaction per main action (§4.4). */
export const DEFAULT_REACTION_LIMIT = 1;

/** Ulti/Blueprint may raise to 2 for the current action. */
export const DOUBLE_REACTION_LIMIT = 2;

/**
 * Active combat hooks for the current action (meta-driven stubs).
 * Ultis / blueprints set these; engine reads them — no content authoring yet.
 */
export interface V3CombatHooks {
  /** Max reactions this action (default 1). */
  reactionLimit: number;
  /** When Dampf resolves, apply dichter_nebel instead of nebel. */
  dampfBecomesDichterNebel: boolean;
  /** First consumed mark this action is not removed. */
  preserveFirstConsumedMark: boolean;
}

export function readV3CombatHooks(meta: MatchMeta): V3CombatHooks {
  return {
    reactionLimit: meta.v3ReactionLimitThisAction ?? DEFAULT_REACTION_LIMIT,
    dampfBecomesDichterNebel: meta.v3DampfBecomesDichterNebel === true,
    preserveFirstConsumedMark: meta.v3PreserveFirstConsumedMark === true,
  };
}

/** Ulti stub: allow two reactions this action. */
export function enableDoubleReactionThisAction(state: GameState): GameState {
  const next = cloneState(state);
  next.meta = {
    ...next.meta,
    v3ReactionLimitThisAction: DOUBLE_REACTION_LIMIT,
  };
  return next;
}

/** Blueprint stub: Dampf → Dichter Nebel. */
export function enableDampfMutation(state: GameState): GameState {
  const next = cloneState(state);
  next.meta = {
    ...next.meta,
    v3DampfBecomesDichterNebel: true,
  };
  return next;
}

/** Ulti stub: first used mark this action is kept. */
export function enablePreserveFirstConsumedMark(state: GameState): GameState {
  const next = cloneState(state);
  next.meta = {
    ...next.meta,
    v3PreserveFirstConsumedMark: true,
  };
  return next;
}

/** Clear per-action hook flags (call when action ends). */
export function clearV3ActionHooks(meta: MatchMeta): MatchMeta {
  return {
    ...meta,
    v3ReactionLimitThisAction: undefined,
    v3DampfBecomesDichterNebel: undefined,
    v3PreserveFirstConsumedMark: undefined,
    v3FirstMarkPreservedThisAction: undefined,
  };
}

export function reactionLimitReached(meta: MatchMeta): boolean {
  const hooks = readV3CombatHooks(meta);
  const used = meta.v3ReactionsThisAction ?? 0;
  return used >= hooks.reactionLimit;
}

/**
 * Whether mark consumption should be skipped for this reaction resolve.
 * Consumes the one-shot preserve flag after first use.
 */
export function shouldPreserveConsumedMark(
  meta: MatchMeta,
  reactionId: ReactionId,
  keepsMarkByReaction: boolean,
): { preserve: boolean; nextMeta: MatchMeta } {
  if (keepsMarkByReaction) {
    return { preserve: true, nextMeta: meta };
  }
  const hooks = readV3CombatHooks(meta);
  if (hooks.preserveFirstConsumedMark && !meta.v3FirstMarkPreservedThisAction) {
    return {
      preserve: true,
      nextMeta: { ...meta, v3FirstMarkPreservedThisAction: true },
    };
  }
  return { preserve: false, nextMeta: meta };
}

/** Transform stub placeholder — engine modifier id for later content. */
export function applyTransformEngineModifier(
  state: GameState,
  _playerId: PlayerId,
  modifierId: string,
): GameState {
  const next = cloneState(state);
  next.lastEvent = `Transform-Modifikator aktiv: ${modifierId}`;
  return next;
}
