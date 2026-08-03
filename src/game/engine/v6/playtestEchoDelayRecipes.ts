/**
 * Echo / Delay recipe hooks — catalog TEK now carries timing (#382).
 * Location: src/game/engine/v6/playtestEchoDelayRecipes.ts
 *
 * Legacy playtest-only recipe rows removed; lookup uses generated catalog.
 */
import type { V6GeneratedFormulaRecipe } from '../../../generated/v6/formulaRecipes.generated';
import {
  V6_PLAYTEST_DELAY_CATALYST_ID,
  V6_PLAYTEST_ECHO_CATALYST_ID,
} from '../../../content/v6/cards/playtestEchoDelayCards';
import type { V6RecipeTimingMode } from './echoDelay';
import { V6_DELAY_DEFAULT_BONUS, V6_ECHO_DEFAULT_AMOUNT } from './echoDelay';

export { V6_PLAYTEST_DELAY_CATALYST_ID, V6_PLAYTEST_ECHO_CATALYST_ID };
export { V6_DELAY_DEFAULT_BONUS, V6_ECHO_DEFAULT_AMOUNT };

/** Lookup recipe with optional timing / summon hooks (generated may omit → defaults). */
export interface V6LookupRecipe extends V6GeneratedFormulaRecipe {
  timingMode?: V6RecipeTimingMode;
  echoAmount?: number;
  delayBonus?: number;
  /** Playtest construct summon (#346). */
  summonConstructDefId?: string;
}

/**
 * Empty — Echo/Delay TEK live in `V6_GENERATED_FORMULA_RECIPES` with timingMode.
 * Kept so imports/tests that reference the array stay green.
 */
export const V6_PLAYTEST_ECHO_DELAY_RECIPES: readonly V6LookupRecipe[] = [];
