/**
 * Types for Formula play deck overlay merge (engine + storage).
 * Location: src/game/packs/formulaPlayOverlayTypes.ts
 */
export const FORMULA_BAUSTEIN_ROLES = ['technik', 'essenz', 'katalysator'] as const;
export type FormulaBausteinRole = (typeof FORMULA_BAUSTEIN_ROLES)[number];

export interface DeckOptInEntry {
  cardId: string;
  role: FormulaBausteinRole;
  name: string;
  pinnedVersion: number;
  addedAt: string;
}

export interface ActivatedRecipeEntry {
  recipeId: string;
  name: string;
  pinnedRecipeVersion: number;
  techniqueId: string | null;
  essenceId: string | null;
  catalystId: string | null;
  techniqueVersion: number | null;
  essenceVersion: number | null;
  catalystVersion: number | null;
  activatedAt: string;
}

export interface RecipeVersionSnapshot {
  recipeVersion: number;
  techniqueVersion: number | null;
  essenceVersion: number | null;
  catalystVersion: number | null;
}
