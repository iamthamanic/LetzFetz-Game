/**
 * Resolve current authoring versions for Formula play opt-in / OUTDATED checks.
 * Location: src/services/storage/formulaPlayVersions.ts
 */
import { V5_PACK } from '../../game/packs/v5';
import type { RecipeVersionSnapshot } from '../../game/packs/formulaPlayOverlayTypes';
import {
  readVfxRegistryFormulaRecipeSummaries,
  readVfxRegistryTechniqueSummaries,
} from './vfxRegistryBridge';

/** Baseline pack version for shipped V5 Formel-Bausteine. */
export const V5_FORMULA_COMPONENT_VERSION = 1 as const;

function packBausteinVersion(cardId: string): number | null {
  if ((V5_PACK.techniques ?? []).some((t) => t.id === cardId)) {
    return V5_FORMULA_COMPONENT_VERSION;
  }
  if ((V5_PACK.essences ?? []).some((e) => e.id === cardId)) {
    return V5_FORMULA_COMPONENT_VERSION;
  }
  if ((V5_PACK.catalysts ?? []).some((c) => c.id === cardId)) {
    return V5_FORMULA_COMPONENT_VERSION;
  }
  return null;
}

/** Current version for a Baustein id (pack baseline or VFX registry). */
export function resolveBausteinCurrentVersion(cardId: string): number {
  const packVersion = packBausteinVersion(cardId);
  if (packVersion !== null) return packVersion;

  const studio = readVfxRegistryTechniqueSummaries().find((t) => t.id === cardId);
  if (studio) return studio.version;

  return V5_FORMULA_COMPONENT_VERSION;
}

/** Snapshot for activated recipe OUTDATED comparison. */
export function resolveRecipeVersionSnapshot(recipeId: string): RecipeVersionSnapshot | null {
  const recipe = readVfxRegistryFormulaRecipeSummaries().find((r) => r.id === recipeId);
  if (!recipe) return null;

  return {
    recipeVersion: recipe.version,
    techniqueVersion: recipe.techniqueId
      ? recipe.techniqueVersion ?? resolveBausteinCurrentVersion(recipe.techniqueId)
      : null,
    essenceVersion: recipe.essenceId
      ? recipe.essenceVersion ?? resolveBausteinCurrentVersion(recipe.essenceId)
      : null,
    catalystVersion: recipe.catalystId
      ? recipe.catalystVersion ?? resolveBausteinCurrentVersion(recipe.catalystId)
      : null,
  };
}

/** Build opt-in resolvers for summarizeOutdatedOptIns. */
export function createFormulaPlayVersionResolvers(): {
  resolveBausteinVersion: (cardId: string) => number;
  resolveRecipeSnapshot: (recipeId: string) => RecipeVersionSnapshot | null;
} {
  return {
    resolveBausteinVersion: resolveBausteinCurrentVersion,
    resolveRecipeSnapshot: resolveRecipeVersionSnapshot,
  };
}
