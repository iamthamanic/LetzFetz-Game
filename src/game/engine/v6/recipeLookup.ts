/**
 * Lookup helpers for generated V6 formula recipes (+ playtest Echo/Delay hooks).
 * Location: src/game/engine/v6/recipeLookup.ts
 */
import {
  V6_GENERATED_FORMULA_RECIPES,
  type V6GeneratedRecipeKind,
} from '../../../generated/v6/formulaRecipes.generated';
import {
  V6_PLAYTEST_ECHO_DELAY_RECIPES,
  type V6LookupRecipe,
} from './playtestEchoDelayRecipes';
import { V6_PLAYTEST_CONSTRUCT_RECIPES } from './playtestConstructRecipes';

const ALL_RECIPES: readonly V6LookupRecipe[] = [
  ...V6_GENERATED_FORMULA_RECIPES,
  ...V6_PLAYTEST_ECHO_DELAY_RECIPES,
  ...V6_PLAYTEST_CONSTRUCT_RECIPES,
];

const BY_ID = new Map<string, V6LookupRecipe>(ALL_RECIPES.map((r) => [r.recipeId, r]));

export function getV6RecipeById(recipeId: string): V6LookupRecipe | undefined {
  return BY_ID.get(recipeId);
}

export function findV6Recipe(input: {
  kind: V6GeneratedRecipeKind;
  techniqueId: string | null;
  essenceId: string | null;
  catalystId: string | null;
}): V6LookupRecipe {
  const match = ALL_RECIPES.find(
    (r) =>
      r.kind === input.kind &&
      r.techniqueId === input.techniqueId &&
      r.essenceId === input.essenceId &&
      r.catalystId === input.catalystId,
  );
  if (!match) {
    throw new Error(
      `V6_RECIPE_MISSING: kind=${input.kind} t=${input.techniqueId} e=${input.essenceId} c=${input.catalystId}`,
    );
  }
  return match;
}
