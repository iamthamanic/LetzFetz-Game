/**
 * Resolve ruleset when rebuilding a match after MatchIntro initiative.
 * Location: src/features/play/setup/rulesetForMatchRebuild.ts
 *
 * V6 sets both `v6FormulaEnabled` and `v3CombatEnabled` — must prefer V6 over V3.
 */
import {
  P100_RULESET,
  V3_RULESET,
  V5_PACK_RULESET,
  V6_PACK_RULESET,
  type ContentPack,
  type GameState,
  type RulesetConfig,
} from '../../../game';

export function rulesetForMatchRebuild(
  state: GameState,
  matchPack: ContentPack,
): RulesetConfig | undefined {
  if (state.meta.v6FormulaEnabled === true) return V6_PACK_RULESET;
  if (state.meta.v5FormulaEnabled === true) return V5_PACK_RULESET;
  if (state.meta.v3CombatEnabled === true) return V3_RULESET;
  if (matchPack.id === 'v2-p100') return P100_RULESET;
  return undefined;
}
