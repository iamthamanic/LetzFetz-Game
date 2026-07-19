/**
 * Resolve effective ruleset for a match (playtest HP cap O11).
 * Location: src/game/engine/rulesetFromState.ts
 */
import type { GameState, RulesetConfig } from '../types';
import { DEFAULT_RULESET } from '../types';

/** Ruleset with playtest HP override from MatchMeta when set. */
export function rulesetFromState(state: GameState | null | undefined): RulesetConfig {
  const cap = state?.meta.playtestHpCap;
  if (cap === undefined) return DEFAULT_RULESET;
  return {
    ...DEFAULT_RULESET,
    startingHp: cap,
    maxHp: cap,
  };
}
