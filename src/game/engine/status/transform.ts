/**
 * V3 character transformation when Fetzgerät is complete (§15 seed).
 * Location: src/game/engine/status/transform.ts
 */
import type { ContentPack, GameState, PlayerId, RulesetConfig } from '../../types';
import { isV3CombatEnabled } from '../../types';
import { cloneState } from '../helpers';
import { effectiveFetzSlot } from './fetzgeraetSlots';
import { applyTransformEngineModifier } from './v3CombatHooks';

const ALL_ROLES = ['traeger', 'antrieb', 'aufsatz'] as const;

export function hasCompleteFetzgeraet(state: GameState, playerId: PlayerId): boolean {
  const roles = new Set(
    state.players[playerId].bound
      .map((c) => effectiveFetzSlot(c))
      .filter(Boolean) as string[],
  );
  return ALL_ROLES.every((r) => roles.has(r));
}

export function isTransformed(state: GameState, playerId: PlayerId): boolean {
  return (state.meta.v3TransformedPlayers ?? []).includes(playerId);
}

/**
 * Once per player: 3 Fetzgerät roles built → transform modifier active.
 */
export function tryApplyTransform(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  if (!isV3CombatEnabled(ruleset)) return state;
  if (isTransformed(state, playerId)) return state;
  if (!hasCompleteFetzgeraet(state, playerId)) return state;

  let next = cloneState(state);
  next.meta = {
    ...next.meta,
    v3TransformedPlayers: [...(next.meta.v3TransformedPlayers ?? []), playerId],
  };
  const charId = next.players[playerId].characterId;
  next = applyTransformEngineModifier(next, playerId, `transform-${charId}`);
  next.lastEvent = `${next.lastEvent ?? ''} Transformation freigeschaltet.`.trim();
  void pack;
  return next;
}
