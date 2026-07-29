/**
 * Resolve effective ruleset for a match (playtest HP cap O11 + V3 combat flag).
 * Location: src/game/engine/rulesetFromState.ts
 */
import type { GameState, RulesetConfig } from '../types';
import { DEFAULT_RULESET } from '../types';

/** Ruleset with playtest HP override and optional V3/V5 flags from MatchMeta. */
export function rulesetFromState(state: GameState | null | undefined): RulesetConfig {
  const cap = state?.meta.playtestHpCap;
  const v3 = state?.meta.v3CombatEnabled === true;
  const v5 = state?.meta.v5FormulaEnabled === true;
  if (cap === undefined && !v3 && !v5) return DEFAULT_RULESET;
  return {
    ...DEFAULT_RULESET,
    ...(cap !== undefined ? { startingHp: cap, maxHp: cap } : {}),
    ...(v3 ? { v3Combat: true } : {}),
    ...(v5
      ? {
          v5Formula: true,
          v3Combat: true,
          maxBoundCards: 3,
          maxFetzCharge: 3,
          mainDeckSize: 106,
        }
      : {}),
  };
}
