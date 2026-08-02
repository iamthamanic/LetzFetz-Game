/**
 * Authoring schemas for V6 formula recipes (build-time SoT).
 * Location: src/content/v6/schemas/formulaRecipeAuthoring.ts
 *
 * Generator (later Slice 0) consumes these shapes and writes `src/generated/v6/`.
 */

/** Technique × Essenz base recipe key (TE). */
export interface V6TeBaseAuthoring {
  techniqueId: string;
  essenceId: string;
  /** Required stable id for fail-closed generation. */
  recipeId: string;
}

/** Katalysator transformation overlay on a TE base. */
export interface V6CatalystTransformAuthoring {
  recipeId: string;
  catalystId: string;
  transformId: string;
}

/** Minimal authoring catalog root — empty OK for Slice 0 stub. */
export interface V6FormulaAuthoringCatalog {
  version: 1;
  teBases: V6TeBaseAuthoring[];
  catalystTransforms: V6CatalystTransformAuthoring[];
}

export const EMPTY_V6_FORMULA_AUTHORING: V6FormulaAuthoringCatalog = {
  version: 1,
  teBases: [],
  catalystTransforms: [],
};
