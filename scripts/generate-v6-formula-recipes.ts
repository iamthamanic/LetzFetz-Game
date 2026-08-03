/**
 * Build-time generator: V6 authoring → src/generated/v6/formulaRecipes.generated.ts
 *
 * Usage:
 *   npx tsx scripts/generate-v6-formula-recipes.ts
 *   npm run generate:v6-formula-recipes
 *
 * Slice-1: expands TE/TK/EK + TE×catalyst TEK + Überformel. Missing keys → exit 1.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { V6_FORMULA_AUTHORING_SLICE1 } from '../src/content/v6/formulaAuthoring.slice1';
import { assertV6FormulaAuthoring } from '../src/content/v6/validateFormulaAuthoring';
import type {
  V6PrimaryEffectAuthoring,
  V6RiderAuthoring,
} from '../src/content/v6/schemas/formulaRecipeAuthoring';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src/generated/v6/formulaRecipes.generated.ts');

interface GeneratedRecipe {
  recipeId: string;
  kind: 'te' | 'tk' | 'ek' | 'tek' | 'overformula';
  techniqueId: string | null;
  essenceId: string | null;
  catalystId: string | null;
  name: string;
  primary: V6PrimaryEffectAuthoring;
  rider: V6RiderAuthoring | null;
  intensity: number | null;
  transformId: string | null;
  grantsFetz: boolean;
  catalystConsumed: boolean;
  overformulaPrimaryBonus: number | null;
  overformulaIntensityBonus: number | null;
  formulaDefensePenalty: number | null;
}

function clampPrimary(p: V6PrimaryEffectAuthoring): V6PrimaryEffectAuthoring {
  return { ...p, value: Math.max(0, p.value) };
}

function main(): void {
  assertV6FormulaAuthoring(V6_FORMULA_AUTHORING_SLICE1);
  const auth = V6_FORMULA_AUTHORING_SLICE1;
  const recipes: GeneratedRecipe[] = [];

  for (const te of auth.teBases) {
    recipes.push({
      recipeId: te.recipeId,
      kind: 'te',
      techniqueId: te.techniqueId,
      essenceId: te.essenceId,
      catalystId: null,
      name: te.name,
      primary: te.primary,
      rider: te.rider ?? null,
      intensity: te.intensity ?? null,
      transformId: null,
      grantsFetz: false,
      catalystConsumed: false,
      overformulaPrimaryBonus: null,
      overformulaIntensityBonus: null,
      formulaDefensePenalty: null,
    });
  }

  for (const tk of auth.tkBases) {
    const xform = auth.catalystTransforms.find((t) => t.catalystId === tk.catalystId);
    if (!xform) {
      throw new Error(`V6_AUTHORING_INVALID: no transform for TK catalyst ${tk.catalystId}`);
    }
    recipes.push({
      recipeId: tk.recipeId,
      kind: 'tk',
      techniqueId: tk.techniqueId,
      essenceId: null,
      catalystId: tk.catalystId,
      name: tk.name,
      primary: clampPrimary({
        ...tk.primary,
        value: tk.primary.value + xform.primaryDelta,
      }),
      rider: null,
      intensity: null,
      transformId: xform.transformId,
      grantsFetz: false,
      catalystConsumed: true,
      overformulaPrimaryBonus: null,
      overformulaIntensityBonus: null,
      formulaDefensePenalty: null,
    });
  }

  for (const ek of auth.ekBases) {
    const xform = auth.catalystTransforms.find((t) => t.catalystId === ek.catalystId);
    if (!xform) {
      throw new Error(`V6_AUTHORING_INVALID: no transform for EK catalyst ${ek.catalystId}`);
    }
    recipes.push({
      recipeId: ek.recipeId,
      kind: 'ek',
      techniqueId: null,
      essenceId: ek.essenceId,
      catalystId: ek.catalystId,
      name: ek.name,
      primary: clampPrimary({
        ...ek.primary,
        value: ek.primary.value + xform.primaryDelta,
      }),
      rider: ek.rider ?? null,
      intensity: null,
      transformId: xform.transformId,
      grantsFetz: false,
      catalystConsumed: true,
      overformulaPrimaryBonus: null,
      overformulaIntensityBonus: null,
      formulaDefensePenalty: null,
    });
  }

  for (const te of auth.teBases) {
    for (const xform of auth.catalystTransforms) {
      const tekId = `v6-tek-${te.recipeId.replace(/^v6-te-/, '')}-${xform.catalystId.replace(
        'v6-katalysator-',
        '',
      )}`;
      const primary = clampPrimary({
        ...te.primary,
        value: te.primary.value + xform.primaryDelta,
      });
      const tek: GeneratedRecipe = {
        recipeId: tekId,
        kind: 'tek',
        techniqueId: te.techniqueId,
        essenceId: te.essenceId,
        catalystId: xform.catalystId,
        name: `${te.name} · Fusion`,
        primary,
        rider: te.rider ?? null,
        intensity: te.intensity ?? null,
        transformId: xform.transformId,
        grantsFetz: true,
        catalystConsumed: true,
        overformulaPrimaryBonus: null,
        overformulaIntensityBonus: null,
        formulaDefensePenalty: null,
      };
      recipes.push(tek);

      const overId = `v6-over-${tekId.replace(/^v6-tek-/, '')}`;
      const overPrimaryBonus = primary.kind === 'damage' || primary.kind === 'heal' || primary.kind === 'shield'
        ? 2
        : 0;
      const overIntensityBonus = overPrimaryBonus === 0 ? 1 : 0;
      recipes.push({
        recipeId: overId,
        kind: 'overformula',
        techniqueId: te.techniqueId,
        essenceId: te.essenceId,
        catalystId: xform.catalystId,
        name: `${te.name} · Überformel`,
        primary: clampPrimary({
          ...primary,
          value: primary.value + overPrimaryBonus,
        }),
        rider: te.rider
          ? { ...te.rider, summary: `${te.rider.summary} (verstärkt)` }
          : null,
        intensity:
          te.intensity !== undefined
            ? te.intensity + overIntensityBonus
            : overIntensityBonus || null,
        transformId: xform.transformId,
        grantsFetz: false,
        catalystConsumed: true,
        overformulaPrimaryBonus: overPrimaryBonus || null,
        overformulaIntensityBonus: overIntensityBonus || null,
        formulaDefensePenalty: -1,
      });
    }
  }

  const ids = new Set<string>();
  for (const r of recipes) {
    if (ids.has(r.recipeId)) {
      throw new Error(`V6_AUTHORING_INVALID: duplicate recipeId ${r.recipeId}`);
    }
    ids.add(r.recipeId);
  }

  const expectedTek = auth.teBases.length * auth.catalystTransforms.length;
  const expectedOver = expectedTek;
  const expected =
    auth.teBases.length +
    auth.tkBases.length +
    auth.ekBases.length +
    expectedTek +
    expectedOver;
  if (recipes.length !== expected) {
    throw new Error(
      `V6_SLICE1_INCOMPLETE: generated ${recipes.length} recipes, expected ${expected}`,
    );
  }

  const body = `/**
 * GENERATED FILE — DO NOT HAND-EDIT.
 * Produced by scripts/generate-v6-formula-recipes.ts
 * Location: src/generated/v6/formulaRecipes.generated.ts
 */

export type V6GeneratedRecipeKind = 'te' | 'tk' | 'ek' | 'tek' | 'overformula';

export interface V6GeneratedPrimaryEffect {
  kind: string;
  value: number;
  target: 'opponent' | 'self';
  offensive?: boolean;
}

export interface V6GeneratedRider {
  id: string;
  summary: string;
  defenseSuppressible: boolean;
}

export interface V6GeneratedFormulaRecipe {
  recipeId: string;
  kind: V6GeneratedRecipeKind;
  techniqueId: string | null;
  essenceId: string | null;
  catalystId: string | null;
  name: string;
  primary: V6GeneratedPrimaryEffect;
  rider: V6GeneratedRider | null;
  intensity: number | null;
  transformId: string | null;
  grantsFetz: boolean;
  catalystConsumed: boolean;
  overformulaPrimaryBonus: number | null;
  overformulaIntensityBonus: number | null;
  formulaDefensePenalty: number | null;
}

export const V6_GENERATED_FORMULA_RECIPES: readonly V6GeneratedFormulaRecipe[] = ${JSON.stringify(
    recipes,
    null,
    2,
  )} as const;

export const V6_GENERATED_CATALOG_VERSION = 1 as const;

export const V6_GENERATED_RECIPE_COUNT = ${recipes.length} as const;
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
