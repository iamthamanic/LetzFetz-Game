/**
 * Authoring schemas for V6 formula recipes (build-time SoT).
 * Location: src/content/v6/schemas/formulaRecipeAuthoring.ts
 *
 * Generator consumes these shapes and writes `src/generated/v6/`.
 */

/** Recipe kinds required for Slice-1 fail-closed coverage. */
export type V6RecipeKind = 'te' | 'tk' | 'ek' | 'tek' | 'overformula';

export type V6PrimaryKind =
  | 'damage'
  | 'heal'
  | 'shield'
  | 'prep_attack'
  | 'prep_block'
  | 'prep_boost'
  /** V6 Slice-2: Fessel intensity on an enemy formula component. */
  | 'fessel';

export type V6EffectTarget = 'opponent' | 'self';

/** Numeric / prep primary effect on a recipe. */
export interface V6PrimaryEffectAuthoring {
  kind: V6PrimaryKind;
  value: number;
  target: V6EffectTarget;
  /** Offensive TEK sets Post-Formula-Action-Policy lock. */
  offensive?: boolean;
}

/** Optional essence rider (defense-suppressible on formula defense 5–6). */
export interface V6RiderAuthoring {
  id: string;
  summary: string;
  defenseSuppressible: boolean;
}

/** Technique × Essenz base recipe (TE). */
export interface V6TeBaseAuthoring {
  recipeId: string;
  techniqueId: string;
  essenceId: string;
  name: string;
  primary: V6PrimaryEffectAuthoring;
  rider?: V6RiderAuthoring;
  intensity?: number;
}

/** Technique × Katalysator without Essenz (TK). */
export interface V6TkBaseAuthoring {
  recipeId: string;
  techniqueId: string;
  catalystId: string;
  name: string;
  primary: V6PrimaryEffectAuthoring;
}

/** Essenz × Katalysator without Technik (EK). */
export interface V6EkBaseAuthoring {
  recipeId: string;
  essenceId: string;
  catalystId: string;
  name: string;
  primary: V6PrimaryEffectAuthoring;
  rider?: V6RiderAuthoring;
}

/**
 * Katalysator transform overlay applied onto TE bases at generate-time
 * to produce TEK (+ Überformel) recipes. Must be explicit per catalyst.
 */
export interface V6CatalystTransformAuthoring {
  transformId: string;
  catalystId: string;
  /** Delta applied to TE primary.value (may be negative). */
  primaryDelta: number;
  selfDamage?: number;
  stabilityBuffUsed?: number;
  drawDiscardAfter?: boolean;
  /** Opfergabe: optional hand discard for this bonus (engine resolves choice). */
  offerDiscardBonus?: number;
  summary: string;
}

/** Minimal authoring catalog root. */
export interface V6FormulaAuthoringCatalog {
  version: 1;
  slice: 'slice1';
  teBases: V6TeBaseAuthoring[];
  tkBases: V6TkBaseAuthoring[];
  ekBases: V6EkBaseAuthoring[];
  catalystTransforms: V6CatalystTransformAuthoring[];
}

export const EMPTY_V6_FORMULA_AUTHORING: V6FormulaAuthoringCatalog = {
  version: 1,
  slice: 'slice1',
  teBases: [],
  tkBases: [],
  ekBases: [],
  catalystTransforms: [],
};
