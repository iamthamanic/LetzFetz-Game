/**
 * UI helpers for W6 combat dice feedback — bonus labels from engine rules.
 * Location: src/features/play/board/diceRollFeedback.ts
 */
import { diceBonusFromRoll } from '../../../game/engine/dice';
import { DEFAULT_RULESET, type RulesetConfig } from '../../../game/types/ruleset';

export const COMBAT_DICE_ROLL_MS = 520;

export function formatDiceBonusLabel(bonus: number): string {
  return `Bonus +${bonus}`;
}

export function buildDiceRollFeedback(
  roll: number,
  ruleset: RulesetConfig = DEFAULT_RULESET,
): { roll: number; bonus: number; bonusLabel: string } {
  const bonus = diceBonusFromRoll(roll, ruleset);
  return { roll, bonus, bonusLabel: formatDiceBonusLabel(bonus) };
}
