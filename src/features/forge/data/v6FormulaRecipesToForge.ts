/**
 * Map V6 generated FormulaRecipes → Material Formeln Kombination forge cards.
 * Location: src/features/forge/data/v6FormulaRecipesToForge.ts
 */
import {
  V6_GENERATED_FORMULA_RECIPES,
  V6_SLICE1_RECIPE_CATALOG,
  type V6GeneratedFormulaRecipe,
  type V6GeneratedRecipeKind,
} from '../../../generated/v6/formulaRecipes.generated';
import { resolveFormulaCardArtPath } from '../../../services/cardArt/manifest';
import type { ForgeCardData } from '../model/types';

const KIND_LABEL_DE: Record<V6GeneratedRecipeKind, string> = {
  te: 'Technik + Essenz',
  tk: 'Technik + Katalysator',
  ek: 'Essenz + Katalysator',
  tek: 'Technik + Essenz + Katalysator',
  overformula: 'Überformel',
};

/** Stable slot triple for Combinate ↔ catalog dedup. */
export function formulaSlotKey(
  techniqueId: string | null | undefined,
  essenceId: string | null | undefined,
  catalystId: string | null | undefined,
): string {
  return `${techniqueId ?? ''}|${essenceId ?? ''}|${catalystId ?? ''}`;
}

function componentImagesForRecipe(recipe: V6GeneratedFormulaRecipe): string[] {
  const ids = [recipe.techniqueId, recipe.essenceId, recipe.catalystId];
  const paths: string[] = [];
  for (const id of ids) {
    if (!id) continue;
    const path = resolveFormulaCardArtPath(id);
    if (path) paths.push(path);
  }
  return paths;
}

export function v6GeneratedRecipeToForgeCard(recipe: V6GeneratedFormulaRecipe): ForgeCardData {
  const componentImages = componentImagesForRecipe(recipe);
  const slotLines = [
    recipe.techniqueId ? `Technik: ${recipe.techniqueId}` : null,
    recipe.essenceId ? `Essenz: ${recipe.essenceId}` : null,
    recipe.catalystId ? `Katalysator: ${recipe.catalystId}` : null,
  ].filter((line): line is string => line != null);

  return {
    id: recipe.recipeId,
    name: recipe.name,
    type: 'Formula',
    element: 'Neutral',
    stats_json: {
      resistance: recipe.intensity ?? 1,
    },
    effects: [
      'Rolle: Kombination',
      'Quelle: V6 Katalog',
      `Art: ${KIND_LABEL_DE[recipe.kind]}`,
      recipe.availability === 'unsupported'
        ? 'Status: Nicht freigeschaltet (Authoring/Engine ausstehend)'
        : 'Status: Freigeschaltet',
      `Effekt: ${recipe.effectSummary}`,
      ...slotLines,
    ],
    image_asset: componentImages[0] ?? '',
    component_images: componentImages,
    fromPack: true,
  };
}

/** All locked Slice-1 catalog recipes as Material Kombination forge cards. */
export function v6FormulaRecipesToForgeCards(
  recipes: readonly V6GeneratedFormulaRecipe[] = V6_GENERATED_FORMULA_RECIPES,
): ForgeCardData[] {
  return recipes.map(v6GeneratedRecipeToForgeCard);
}

export { V6_SLICE1_RECIPE_CATALOG };
