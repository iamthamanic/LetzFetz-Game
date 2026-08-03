/**
 * Playtest Echo / Delay recipe hooks (#344) — outside locked Slice-1 105 catalog.
 * Location: src/game/engine/v6/playtestEchoDelayRecipes.ts
 */
import type { V6GeneratedFormulaRecipe } from '../../../generated/v6/formulaRecipes.generated';
import {
  V6_PLAYTEST_DELAY_CATALYST_ID,
  V6_PLAYTEST_ECHO_CATALYST_ID,
} from '../../../content/v6/cards/playtestEchoDelayCards';
import type { V6RecipeTimingMode } from './echoDelay';
import { V6_DELAY_DEFAULT_BONUS, V6_ECHO_DEFAULT_AMOUNT } from './echoDelay';

export { V6_PLAYTEST_DELAY_CATALYST_ID, V6_PLAYTEST_ECHO_CATALYST_ID };

/** Lookup recipe with optional timing / summon hooks (generated omit → defaults). */
export interface V6LookupRecipe extends V6GeneratedFormulaRecipe {
  timingMode?: V6RecipeTimingMode;
  echoAmount?: number;
  delayBonus?: number;
  /** Playtest construct summon (#346). */
  summonConstructDefId?: string;
}

/**
 * Two TEK playtest hooks: Impulsgeschoss×Feuer + Echo / Verzögerung.
 * Not part of V6_SLICE1_RECIPE_CATALOG.recipeCount (105).
 */
export const V6_PLAYTEST_ECHO_DELAY_RECIPES: readonly V6LookupRecipe[] = [
  {
    recipeId: 'v6-playtest-tek-impulsgeschoss-feuer-echo',
    kind: 'tek',
    catalogSlice: 'slice1',
    techniqueId: 'v6-technik-impulsgeschoss',
    essenceId: 'v6-essenz-feuer',
    catalystId: V6_PLAYTEST_ECHO_CATALYST_ID,
    name: 'Glutimpuls-Echo',
    effectSummary:
      'Verursache 3 Schaden. Echo: zu Beginn deines nächsten Zuges wiederhole 1 Punkt des Primärwerts. Katalysator bleibt bis zur Echo-Auflösung.',
    primary: {
      kind: 'damage',
      value: 3,
      target: 'opponent',
      offensive: true,
    },
    rider: {
      id: 'rider-brennen',
      summary: 'Bei Lebensschaden: Brennen, falls keine Reaktion.',
      defenseSuppressible: true,
    },
    intensity: null,
    transformId: 'xform-playtest-echo',
    grantsFetz: true,
    /** Discard deferred to Echo resolve (§8). */
    catalystConsumed: false,
    overformulaPrimaryBonus: null,
    overformulaIntensityBonus: null,
    formulaDefensePenalty: null,
    timingMode: 'echo',
    echoAmount: V6_ECHO_DEFAULT_AMOUNT,
  },
  {
    recipeId: 'v6-playtest-tek-impulsgeschoss-feuer-verzoegerung',
    kind: 'tek',
    catalogSlice: 'slice1',
    techniqueId: 'v6-technik-impulsgeschoss',
    essenceId: 'v6-essenz-feuer',
    catalystId: V6_PLAYTEST_DELAY_CATALYST_ID,
    name: 'Glutimpuls-Verzögerung',
    effectSummary:
      'Primäreffekt geschieht nicht sofort, sondern zu Beginn deines nächsten Zuges und erhält +2. Katalysator bleibt bis zur Auflösung.',
    primary: {
      kind: 'damage',
      value: 3,
      target: 'opponent',
      offensive: true,
    },
    rider: {
      id: 'rider-brennen',
      summary: 'Bei Lebensschaden: Brennen, falls keine Reaktion.',
      defenseSuppressible: true,
    },
    intensity: null,
    transformId: 'xform-playtest-verzoegerung',
    grantsFetz: true,
    catalystConsumed: false,
    overformulaPrimaryBonus: null,
    overformulaIntensityBonus: null,
    formulaDefensePenalty: null,
    timingMode: 'delay',
    delayBonus: V6_DELAY_DEFAULT_BONUS,
  },
];
