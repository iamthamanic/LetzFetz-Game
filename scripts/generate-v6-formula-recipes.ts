/**
 * Build-time generator: V6 authoring → src/generated/v6/formulaRecipes.generated.ts
 *
 * Usage:
 *   npx tsx scripts/generate-v6-formula-recipes.ts
 *   npm run generate:v6-formula-recipes
 *
 * Empty/minimal authoring is OK. Missing required keys → non-zero exit.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { V6_FORMULA_AUTHORING_STUB } from '../src/content/v6/formulaAuthoring.stub';
import { assertV6FormulaAuthoring } from '../src/content/v6/validateFormulaAuthoring';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src/generated/v6/formulaRecipes.generated.ts');

function main(): void {
  assertV6FormulaAuthoring(V6_FORMULA_AUTHORING_STUB);

  const recipes = V6_FORMULA_AUTHORING_STUB.teBases.map((te) => {
    const transforms = V6_FORMULA_AUTHORING_STUB.catalystTransforms.filter(
      (t) => t.recipeId === te.recipeId,
    );
    return {
      recipeId: te.recipeId,
      techniqueId: te.techniqueId,
      essenceId: te.essenceId,
      transformIds: transforms.map((t) => t.transformId),
    };
  });

  const body = `/**
 * GENERATED FILE — DO NOT HAND-EDIT.
 * Produced by scripts/generate-v6-formula-recipes.ts
 * Location: src/generated/v6/formulaRecipes.generated.ts
 */

export interface V6GeneratedFormulaRecipe {
  recipeId: string;
  techniqueId: string;
  essenceId: string;
  transformIds: string[];
}

export const V6_GENERATED_FORMULA_RECIPES: readonly V6GeneratedFormulaRecipe[] = ${JSON.stringify(
    recipes,
    null,
    2,
  )} as const;

export const V6_GENERATED_CATALOG_VERSION = 1 as const;
`;

  writeFileSync(outPath, body, 'utf8');
  console.log(`Wrote ${outPath} (${recipes.length} recipes)`);
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
}
