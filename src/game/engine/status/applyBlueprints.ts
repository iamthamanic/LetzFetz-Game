/**
 * Activate V3 blueprint hooks from the chooser's built Fetzgerät (§16).
 * Location: src/game/engine/status/applyBlueprints.ts
 */
import type { ContentPack, GameState, PlayerId, RulesetConfig } from '../../types';
import { isV3CombatEnabled } from '../../types';
import { findEnginePartDef } from '../lookup';
import { countPartsByElement } from './resonance';
import { effectiveFetzSlot } from './fetzgeraetSlots';
import {
  enableDampfMutation,
  enableDoubleReactionThisAction,
  enablePreserveFirstConsumedMark,
} from './v3CombatHooks';

function blueprintMatches(
  pack: ContentPack,
  state: GameState,
  ownerId: PlayerId,
  blueprintId: string,
): boolean {
  const bp = pack.blueprints?.find((b) => b.id === blueprintId);
  if (!bp) return false;
  const bound = state.players[ownerId].bound;

  if (bp.requiredRoles?.length) {
    const roles = new Set(
      bound.map((c) => effectiveFetzSlot(c)).filter(Boolean) as string[],
    );
    for (const r of bp.requiredRoles) {
      if (!roles.has(r)) return false;
    }
  }

  if (bp.sameElementCount && bp.element) {
    const n = countPartsByElement(pack, bound)[bp.element] ?? 0;
    if (n < bp.sameElementCount) return false;
  } else if (bp.sameElementCount) {
    const counts = countPartsByElement(pack, bound);
    const ok = Object.values(counts).some((n) => (n ?? 0) >= bp.sameElementCount!);
    if (!ok) return false;
  }

  // Ensure at least one engine part is built when roles required
  if (bp.requiredRoles?.length) {
    const hasPart = bound.some((c) => findEnginePartDef(pack, c.defId));
    if (!hasPart) return false;
  }

  return true;
}

/**
 * Merge active blueprint hooks into match meta for the current action chooser.
 */
export function applyActiveBlueprintHooks(
  state: GameState,
  pack: ContentPack,
  ownerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  if (!isV3CombatEnabled(ruleset) || !pack.blueprints?.length) return state;
  let next = state;
  for (const bp of pack.blueprints) {
    if (!blueprintMatches(pack, next, ownerId, bp.id)) continue;
    if (bp.hooks.dampfBecomesDichterNebel) next = enableDampfMutation(next);
    if (bp.hooks.preserveFirstConsumedMark) next = enablePreserveFirstConsumedMark(next);
    if (bp.hooks.doubleReaction) next = enableDoubleReactionThisAction(next);
  }
  return next;
}

/** Debug helper: list matching blueprint ids. */
export function matchingBlueprintIds(
  state: GameState,
  pack: ContentPack,
  ownerId: PlayerId,
): string[] {
  return (pack.blueprints ?? [])
    .filter((bp) => blueprintMatches(pack, state, ownerId, bp.id))
    .map((bp) => bp.id);
}
