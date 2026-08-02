/**
 * Resolve effective ruleset for a match (playtest HP cap O11 + V3/V5/V6 flags).
 * Location: src/game/engine/rulesetFromState.ts
 */
import type { GameState, RulesetConfig } from '../types';
import {
  DEFAULT_RULESET,
  V5_RULESET,
  V6_RULESET,
  assertExclusiveFormulaRuleset,
} from '../types';

/** Ruleset with playtest HP override and optional V3/V5/V6 flags from MatchMeta. */
export function rulesetFromState(state: GameState | null | undefined): RulesetConfig {
  const cap = state?.meta.playtestHpCap;
  const v3 = state?.meta.v3CombatEnabled === true;
  const v5 = state?.meta.v5FormulaEnabled === true;
  const v6 = state?.meta.v6FormulaEnabled === true;
  if (v5 && v6) {
    throw new Error('RULESET_MIX: v5FormulaEnabled and v6FormulaEnabled are mutually exclusive');
  }
  if (cap === undefined && !v3 && !v5 && !v6) return DEFAULT_RULESET;
  const next: RulesetConfig = {
    ...DEFAULT_RULESET,
    ...(v6
      ? {
          startingHp: V6_RULESET.startingHp,
          maxHp: V6_RULESET.maxHp,
          v6Formula: true,
          v5Formula: false,
          v3Combat: true,
          maxBoundCards: 3,
          maxFetzCharge: 3,
          mainDeckSize: V6_RULESET.mainDeckSize,
        }
      : {}),
    ...(v5
      ? {
          startingHp: V5_RULESET.startingHp,
          maxHp: V5_RULESET.maxHp,
          v5Formula: true,
          v6Formula: false,
          v3Combat: true,
          maxBoundCards: 3,
          maxFetzCharge: 3,
          mainDeckSize: 106,
        }
      : {}),
    ...(v3 && !v5 && !v6 ? { v3Combat: true } : {}),
    ...(cap !== undefined ? { startingHp: cap, maxHp: cap } : {}),
  };
  assertExclusiveFormulaRuleset(next);
  return next;
}
