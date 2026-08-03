/**
 * Build-time generator: V6 authoring → src/generated/v6/formulaRecipes.generated.ts
 *
 * Usage:
 *   npx tsx scripts/generate-v6-formula-recipes.ts
 *   npm run generate:v6-formula-recipes
 *
 * Slice-1 catalog (current): expands TE/TK/EK + TE×catalyst TEK + Überformel.
 * Missing keys → exit 1. Do not hand-edit the generated file.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  V6_FORMULA_AUTHORING_SLICE1,
  v6Slice1CatalystShortName,
} from '../src/content/v6/formulaAuthoring.slice1';
import { V6_PLAYTEST_CONSTRUCT_DEF_ID } from '../src/content/v6/cards/playtestConstructCards';
import { assertV6FormulaAuthoring } from '../src/content/v6/validateFormulaAuthoring';
import type {
  V6CatalystTransformAuthoring,
  V6PrimaryEffectAuthoring,
  V6RiderAuthoring,
  V6TeBaseAuthoring,
} from '../src/content/v6/schemas/formulaRecipeAuthoring';
import {
  V6_OVERFORMULA_DEFAULT_INTENSITY_BONUS,
  V6_OVERFORMULA_DEFAULT_PRIMARY_BONUS,
} from '../src/game/engine/v6/overformula';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src/generated/v6/formulaRecipes.generated.ts');

interface GeneratedRecipe {
  recipeId: string;
  kind: 'te' | 'tk' | 'ek' | 'tek' | 'overformula';
  /** Locked Slice-1 catalog marker for later expansion diffs. */
  catalogSlice: 'slice1';
  techniqueId: string | null;
  essenceId: string | null;
  catalystId: string | null;
  name: string;
  /** German player-facing effect summary (no stubs). */
  effectSummary: string;
  primary: V6PrimaryEffectAuthoring;
  rider: V6RiderAuthoring | null;
  intensity: number | null;
  transformId: string | null;
  grantsFetz: boolean;
  catalystConsumed: boolean;
  overformulaPrimaryBonus: number | null;
  overformulaIntensityBonus: number | null;
  formulaDefensePenalty: number | null;
  /** Catalog construct summon (#381); null when not a summon recipe. */
  summonConstructDefId: string | null;
  /** Echo / Delay timing — null means immediate. */
  timingMode: 'immediate' | 'echo' | 'delay' | null;
  echoAmount: number | null;
  delayBonus: number | null;
  /** supported = playable; unsupported = explicit gap (§50.3), not invent. */
  availability: 'supported' | 'unsupported';
}

function clampPrimary(p: V6PrimaryEffectAuthoring): V6PrimaryEffectAuthoring {
  return { ...p, value: Math.max(0, p.value) };
}

function formatPrimaryDe(primary: V6PrimaryEffectAuthoring, intensity: number | null): string {
  const target = primary.target === 'opponent' ? 'Gegner' : 'dich';
  switch (primary.kind) {
    case 'damage':
      return `Verursache ${primary.value} Schaden am ${target}.`;
    case 'heal':
      return `Heile ${primary.value} Leben.`;
    case 'shield':
      return `Gewinne ${primary.value} Schild.`;
    case 'prep_attack':
      return `Bereite Angriff +${primary.value} vor.`;
    case 'prep_block':
      return `Bereite Block +${primary.value} vor.`;
    case 'prep_boost':
      return `Bereite Boost +${primary.value} vor.`;
    case 'fessel': {
      const n = intensity ?? primary.value;
      return `Fessel Intensität ${n} auf einen besetzten gegnerischen Formelplatz (manuelle Wahl).`;
    }
    case 'summon_construct':
      return `Beschwöre ein Konstrukt mit Haltbarkeit ${primary.value}. Ersetzt ein bestehendes Konstrukt. Keine Fetzladung.`;
    default:
      return `${primary.kind} ${primary.value} → ${target}.`;
  }
}

function buildEffectSummary(parts: {
  primary: V6PrimaryEffectAuthoring;
  intensity: number | null;
  rider: V6RiderAuthoring | null;
  transformSummary?: string | null;
  extras?: string[];
}): string {
  const chunks: string[] = [formatPrimaryDe(parts.primary, parts.intensity)];
  if (parts.rider?.summary) chunks.push(parts.rider.summary);
  if (parts.transformSummary) chunks.push(parts.transformSummary);
  if (parts.extras) chunks.push(...parts.extras.filter(Boolean));
  const summary = chunks.join(' ').replace(/\s+/g, ' ').trim();
  if (!summary) {
    throw new Error('V6_AUTHORING_INVALID: empty effectSummary');
  }
  if (/\bstub\b/i.test(summary)) {
    throw new Error(`V6_AUTHORING_INVALID: effectSummary contains stub: ${summary}`);
  }
  return summary;
}

/**
 * Apply catalyst delta. For Fessel, intensity is authoritative and tracks the delta.
 */
function applyCatalystToTe(
  te: V6TeBaseAuthoring,
  xform: V6CatalystTransformAuthoring,
): { primary: V6PrimaryEffectAuthoring; intensity: number | null } {
  if (te.primary.kind === 'fessel') {
    const baseInt = te.intensity ?? te.primary.value;
    const intensity = Math.max(0, baseInt + xform.primaryDelta);
    return {
      primary: { ...te.primary, value: intensity },
      intensity,
    };
  }
  return {
    primary: clampPrimary({
      ...te.primary,
      value: te.primary.value + xform.primaryDelta,
    }),
    intensity: te.intensity ?? null,
  };
}

function applyOverformulaBonus(
  primary: V6PrimaryEffectAuthoring,
  intensity: number | null,
): {
  primary: V6PrimaryEffectAuthoring;
  intensity: number | null;
  overformulaPrimaryBonus: number;
  overformulaIntensityBonus: number;
} {
  if (primary.kind === 'damage' || primary.kind === 'heal' || primary.kind === 'shield' || primary.kind === 'summon_construct') {
    const bonus = V6_OVERFORMULA_DEFAULT_PRIMARY_BONUS;
    return {
      primary: clampPrimary({ ...primary, value: primary.value + bonus }),
      intensity,
      overformulaPrimaryBonus: bonus,
      overformulaIntensityBonus: 0,
    };
  }
  if (primary.kind === 'fessel') {
    const baseInt = intensity ?? primary.value;
    const next = Math.max(0, baseInt + V6_OVERFORMULA_DEFAULT_INTENSITY_BONUS);
    return {
      primary: { ...primary, value: next },
      intensity: next,
      overformulaPrimaryBonus: 0,
      overformulaIntensityBonus: V6_OVERFORMULA_DEFAULT_INTENSITY_BONUS,
    };
  }
  const nextIntensity = (intensity ?? 0) + V6_OVERFORMULA_DEFAULT_INTENSITY_BONUS;
  return {
    primary,
    intensity: nextIntensity,
    overformulaPrimaryBonus: 0,
    overformulaIntensityBonus: V6_OVERFORMULA_DEFAULT_INTENSITY_BONUS,
  };
}

function main(): void {
  assertV6FormulaAuthoring(V6_FORMULA_AUTHORING_SLICE1);
  const auth = V6_FORMULA_AUTHORING_SLICE1;
  const allXforms = auth.catalystTransforms;
  if (allXforms.length === 0) {
    throw new Error('V6_AUTHORING_INVALID: no catalyst transforms');
  }
  // Fail closed: never promote Umkehrung/Ausbreitung/Spiegelung/Kettenkopplung to supported without explicit engine authoring.
  for (const x of allXforms) {
    const banned =
      x.catalystId.includes('umkehrung') ||
      x.catalystId.includes('ausbreitung') ||
      x.catalystId.includes('spiegelung') ||
      x.catalystId.includes('kettenkopplung');
    if (banned && x.availability === 'supported') {
      throw new Error(
        `V6_AUTHORING_INVALID: ${x.catalystId} must stay unsupported — do not invent transforms (§50.3)`,
      );
    }
  }
  const recipes: GeneratedRecipe[] = [];

  for (const te of auth.teBases) {
    const intensity = te.intensity ?? null;
    const summonId = te.primary.kind === 'summon_construct' ? (te.summonConstructDefId ?? null) : null;
    if (te.primary.kind === 'summon_construct' && !summonId) {
      throw new Error(`V6_AUTHORING_INVALID: summon TE ${te.recipeId} missing summonConstructDefId`);
    }
    recipes.push({
      recipeId: te.recipeId,
      kind: 'te',
      catalogSlice: 'slice1',
      techniqueId: te.techniqueId,
      essenceId: te.essenceId,
      catalystId: null,
      name: te.name,
      effectSummary: buildEffectSummary({
        primary: te.primary,
        intensity,
        rider: te.rider ?? null,
      }),
      primary: te.primary,
      rider: te.rider ?? null,
      intensity,
      transformId: null,
      grantsFetz: false,
      catalystConsumed: false,
      overformulaPrimaryBonus: null,
      overformulaIntensityBonus: null,
      formulaDefensePenalty: null,
      summonConstructDefId: summonId,
      timingMode: null,
      echoAmount: null,
      delayBonus: null,
      availability: 'supported',
    });
  }

  for (const tk of auth.tkBases) {
    const xform = allXforms.find((t) => t.catalystId === tk.catalystId);
    if (!xform) {
      throw new Error(`V6_AUTHORING_INVALID: no supported transform for TK catalyst ${tk.catalystId}`);
    }
    const timingMode = xform.timingMode ?? 'immediate';
    const primary = clampPrimary({
      ...tk.primary,
      value: tk.primary.value + xform.primaryDelta,
    });
    const tkIntensity = primary.kind === 'fessel' ? primary.value : null;
    const tkSummon =
      primary.kind === 'summon_construct' ? V6_PLAYTEST_CONSTRUCT_DEF_ID : null;
    recipes.push({
      recipeId: tk.recipeId,
      kind: 'tk',
      catalogSlice: 'slice1',
      techniqueId: tk.techniqueId,
      essenceId: null,
      catalystId: tk.catalystId,
      name: tk.name,
      effectSummary: buildEffectSummary({
        primary,
        intensity: tkIntensity,
        rider: null,
        transformSummary: xform.summary,
      }),
      primary,
      rider: null,
      intensity: tkIntensity,
      transformId: xform.transformId,
      grantsFetz: false,
      catalystConsumed: timingMode === 'immediate',
      overformulaPrimaryBonus: null,
      overformulaIntensityBonus: null,
      formulaDefensePenalty: null,
      summonConstructDefId: tkSummon,
      timingMode,
      echoAmount: timingMode === 'echo' ? (xform.echoAmount ?? 1) : null,
      delayBonus: timingMode === 'delay' ? (xform.delayBonus ?? 2) : null,
      availability: xform.availability,
    });
  }

  for (const ek of auth.ekBases) {
    const xform = allXforms.find((t) => t.catalystId === ek.catalystId);
    if (!xform) {
      throw new Error(`V6_AUTHORING_INVALID: no supported transform for EK catalyst ${ek.catalystId}`);
    }
    const timingMode = xform.timingMode ?? 'immediate';
    const primary = clampPrimary({
      ...ek.primary,
      value: ek.primary.value + xform.primaryDelta,
    });
    recipes.push({
      recipeId: ek.recipeId,
      kind: 'ek',
      catalogSlice: 'slice1',
      techniqueId: null,
      essenceId: ek.essenceId,
      catalystId: ek.catalystId,
      name: ek.name,
      effectSummary: buildEffectSummary({
        primary,
        intensity: null,
        rider: ek.rider ?? null,
        transformSummary: xform.summary,
      }),
      primary,
      rider: ek.rider ?? null,
      intensity: null,
      transformId: xform.transformId,
      grantsFetz: false,
      catalystConsumed: timingMode === 'immediate',
      overformulaPrimaryBonus: null,
      overformulaIntensityBonus: null,
      formulaDefensePenalty: null,
      summonConstructDefId: null,
      timingMode,
      echoAmount: timingMode === 'echo' ? (xform.echoAmount ?? 1) : null,
      delayBonus: timingMode === 'delay' ? (xform.delayBonus ?? 2) : null,
      availability: xform.availability,
    });
  }

  for (const te of auth.teBases) {
    const teSummonId =
      te.primary.kind === 'summon_construct' ? (te.summonConstructDefId ?? null) : null;
    for (const xform of allXforms) {
      const catShort = v6Slice1CatalystShortName(xform.catalystId);
      const applied = applyCatalystToTe(te, xform);
      const isSummon = applied.primary.kind === 'summon_construct';
      const timingMode = xform.timingMode ?? 'immediate';
      const tekId = `v6-tek-${te.recipeId.replace(/^v6-te-/, '')}-${xform.catalystId.replace(
        'v6-katalysator-',
        '',
      )}`;
      const tek: GeneratedRecipe = {
        recipeId: tekId,
        kind: 'tek',
        catalogSlice: 'slice1',
        techniqueId: te.techniqueId,
        essenceId: te.essenceId,
        catalystId: xform.catalystId,
        name: `${te.name} · ${catShort}`,
        effectSummary: buildEffectSummary({
          primary: applied.primary,
          intensity: applied.intensity,
          rider: te.rider ?? null,
          transformSummary: xform.summary,
          extras: isSummon
            ? ['TEK-Beschwörung: keine Fetzladung.']
            : ['TEK: +1 Fetzladung (max 1×/Zug).'],
        }),
        primary: applied.primary,
        rider: te.rider ?? null,
        intensity: applied.intensity,
        transformId: xform.transformId,
        grantsFetz: isSummon ? false : true,
        catalystConsumed: timingMode === 'immediate',
        overformulaPrimaryBonus: null,
        overformulaIntensityBonus: null,
        formulaDefensePenalty: null,
        summonConstructDefId: teSummonId,
        timingMode,
        echoAmount: timingMode === 'echo' ? (xform.echoAmount ?? 1) : null,
        delayBonus: timingMode === 'delay' ? (xform.delayBonus ?? 2) : null,
        availability: xform.availability,
      };
      recipes.push(tek);

      const over = applyOverformulaBonus(applied.primary, applied.intensity);
      const overId = `v6-over-${tekId.replace(/^v6-tek-/, '')}`;
      const overRider = te.rider
        ? { ...te.rider, summary: `${te.rider.summary} (verstärkt)` }
        : null;
      recipes.push({
        recipeId: overId,
        kind: 'overformula',
        catalogSlice: 'slice1',
        techniqueId: te.techniqueId,
        essenceId: te.essenceId,
        catalystId: xform.catalystId,
        name: `Überformel ${te.name} · ${catShort}`,
        effectSummary: buildEffectSummary({
          primary: over.primary,
          intensity: over.intensity,
          rider: overRider,
          transformSummary: xform.summary,
          extras: [
            over.overformulaPrimaryBonus > 0
              ? `Überformel: Primär +${over.overformulaPrimaryBonus} (fester Slice-1-Bonus).`
              : over.overformulaIntensityBonus > 0
                ? `Überformel: Intensität +${over.overformulaIntensityBonus} (fester Slice-1-Bonus).`
                : 'Überformel: verstärkt.',
            'Überformel: Fetzladung wird verbraucht.',
            'Formelabwehr −1.',
          ],
        }),
        primary: over.primary,
        rider: overRider,
        intensity: over.intensity,
        transformId: xform.transformId,
        grantsFetz: false,
        catalystConsumed: timingMode === 'immediate',
        overformulaPrimaryBonus: over.overformulaPrimaryBonus || null,
        overformulaIntensityBonus: over.overformulaIntensityBonus || null,
        formulaDefensePenalty: -1,
        summonConstructDefId: teSummonId,
        timingMode,
        echoAmount: timingMode === 'echo' ? (xform.echoAmount ?? 1) : null,
        delayBonus: timingMode === 'delay' ? (xform.delayBonus ?? 2) : null,
        availability: xform.availability,
      });
    }
  }

  const ids = new Set<string>();
  for (const r of recipes) {
    if (ids.has(r.recipeId)) {
      throw new Error(`V6_AUTHORING_INVALID: duplicate recipeId ${r.recipeId}`);
    }
    ids.add(r.recipeId);
    if (!r.effectSummary.trim()) {
      throw new Error(`V6_AUTHORING_INVALID: missing effectSummary for ${r.recipeId}`);
    }
    if (!r.name.trim() || /\bstub\b/i.test(r.name)) {
      throw new Error(`V6_AUTHORING_INVALID: bad name for ${r.recipeId}`);
    }
  }

  const expectedTek = auth.teBases.length * allXforms.length;
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

  const byKind = {
    te: recipes.filter((r) => r.kind === 'te').length,
    tk: recipes.filter((r) => r.kind === 'tk').length,
    ek: recipes.filter((r) => r.kind === 'ek').length,
    tek: recipes.filter((r) => r.kind === 'tek').length,
    overformula: recipes.filter((r) => r.kind === 'overformula').length,
  };

  const body = `/**
 * GENERATED FILE — DO NOT HAND-EDIT.
 * Produced by scripts/generate-v6-formula-recipes.ts
 * Location: src/generated/v6/formulaRecipes.generated.ts
 *
 * Catalog: V6 Slice-1 (10 Techniken × 6 Essenzen × 10 Katalysatoren).
 * These ${recipes.length} recipes are the locked current set — later expansion
 * adds new ids; do not renumber or replace Slice-1 recipeIds.
 * Four catalysts emit availability:unsupported recipes (no invented effects §50.3).
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
  catalogSlice: 'slice1';
  techniqueId: string | null;
  essenceId: string | null;
  catalystId: string | null;
  name: string;
  effectSummary: string;
  primary: V6GeneratedPrimaryEffect;
  rider: V6GeneratedRider | null;
  intensity: number | null;
  transformId: string | null;
  grantsFetz: boolean;
  catalystConsumed: boolean;
  overformulaPrimaryBonus: number | null;
  overformulaIntensityBonus: number | null;
  formulaDefensePenalty: number | null;
  /** Catalog construct summon (#381); null when not a summon recipe. */
  summonConstructDefId: string | null;
  /** Echo / Delay timing — null means immediate (or TE without catalyst). */
  timingMode: 'immediate' | 'echo' | 'delay' | null;
  echoAmount: number | null;
  delayBonus: number | null;
  availability: 'supported' | 'unsupported';
}

/** Meta for the locked Slice-1 recipe catalog (10T×6E×10K; unsupported = explicit). */
export const V6_SLICE1_RECIPE_CATALOG = {
  id: 'v6-slice1',
  label: 'V6 Slice-1 Formelkatalog (10T×6E×10K)',
  recipeCount: ${recipes.length},
  breakdown: ${JSON.stringify(byKind)},
} as const;

export const V6_GENERATED_FORMULA_RECIPES: readonly V6GeneratedFormulaRecipe[] = ${JSON.stringify(
    recipes,
    null,
    2,
  )} as const;

export const V6_GENERATED_CATALOG_VERSION = 1 as const;

export const V6_GENERATED_RECIPE_COUNT = ${recipes.length} as const;
`;

  writeFileSync(outPath, body, 'utf8');
  console.log(`Wrote ${outPath} (${recipes.length} recipes, Slice-1 catalog)`);
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
}
