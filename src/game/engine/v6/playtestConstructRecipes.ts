/**
 * Playtest Construct / Beschwörung recipe hooks (#346) — outside locked Slice-1 105 catalog.
 * Location: src/game/engine/v6/playtestConstructRecipes.ts
 */
import {
  V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID,
  V6_PLAYTEST_CONSTRUCT_DEF_ID,
} from '../../../content/v6/cards/playtestConstructCards';
import type { V6LookupRecipe } from './playtestEchoDelayRecipes';

export { V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID, V6_PLAYTEST_CONSTRUCT_DEF_ID };

/**
 * One EK playtest hook: Feuer × Beschwörung → Schattenpuppe.
 * Not part of V6_SLICE1_RECIPE_CATALOG.recipeCount (105). No Fetz.
 */
export const V6_PLAYTEST_CONSTRUCT_RECIPES: readonly V6LookupRecipe[] = [
  {
    recipeId: 'v6-playtest-ek-feuer-beschwoerung',
    kind: 'ek',
    catalogSlice: 'slice1',
    techniqueId: null,
    essenceId: 'v6-essenz-feuer',
    catalystId: V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID,
    name: 'Schattenpuppen-Beschwörung',
    effectSummary:
      'Beschwöre die Schattenpuppe (Haltbarkeit 3). Ersetzt ein bestehendes Konstrukt. Keine Fetzladung. Katalysator wird verbraucht.',
    primary: {
      kind: 'summon_construct',
      value: 3,
      target: 'self',
      offensive: false,
    },
    rider: null,
    intensity: null,
    transformId: 'xform-playtest-beschwoerung',
    grantsFetz: false,
    catalystConsumed: true,
    overformulaPrimaryBonus: null,
    overformulaIntensityBonus: null,
    formulaDefensePenalty: null,
    timingMode: 'immediate',
    echoAmount: null,
    delayBonus: null,
    summonConstructDefId: V6_PLAYTEST_CONSTRUCT_DEF_ID,
  },
];
