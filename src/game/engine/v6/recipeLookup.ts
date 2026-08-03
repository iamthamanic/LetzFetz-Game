/**
 * Lookup helpers for generated V6 formula recipes.
 * Location: src/game/engine/v6/recipeLookup.ts
 */
import {
  V6_GENERATED_FORMULA_RECIPES,
  type V6GeneratedFormulaRecipe,
  type V6GeneratedRecipeKind,
} from '../../../generated/v6/formulaRecipes.generated';

const BY_ID = new Map<string, V6GeneratedFormulaRecipe>(
  V6_GENERATED_FORMULA_RECIPES.map((r) => [r.recipeId, r]),
);

export function getV6RecipeById(recipeId: string): V6GeneratedFormulaRecipe | undefined {
  return BY_ID.get(recipeId);
}

export function findV6Recipe(input: {
  kind: V6GeneratedRecipeKind;
  techniqueId: string | null;
  essenceId: string | null;
  catalystId: string | null;
}): V6GeneratedFormulaRecipe {
  const match = V6_GENERATED_FORMULA_RECIPES.find(
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
