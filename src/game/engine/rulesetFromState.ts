/**
 * Resolve effective ruleset for a match (playtest HP cap O11 + V3 combat flag).
 * Location: src/game/engine/rulesetFromState.ts
 */
import type { GameState, RulesetConfig } from '../types';
import { DEFAULT_RULESET } from '../types';

/** Ruleset with playtest HP override and optional V3 combat from MatchMeta. */
export function rulesetFromState(state: GameState | null | undefined): RulesetConfig {
  const cap = state?.meta.playtestHpCap;
  const v3 = state?.meta.v3CombatEnabled === true;
  if (cap === undefined && !v3) return DEFAULT_RULESET;
  return {
    ...DEFAULT_RULESET,
    ...(cap !== undefined ? { startingHp: cap, maxHp: cap } : {}),
    ...(v3 ? { v3Combat: true } : {}),
  };
}
