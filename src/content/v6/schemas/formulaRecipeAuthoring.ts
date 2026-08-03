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
  | 'fessel'
  /** V6 Constructs (#381): summon construct; value = Haltbarkeit. */
  | 'summon_construct';

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
  /** Required when primary.kind === summon_construct. */
  summonConstructDefId?: string;
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

/** Fail-closed: unsupported catalysts must not invent TEK rows (§50.3). */
export type V6CatalystTransformAvailability = 'supported' | 'unsupported';

/** Timing overlay for Echo / Verzögerung (fixed amounts — no invent). */
export type V6CatalystTimingMode = 'immediate' | 'echo' | 'delay';

/**
 * Katalysator transform overlay applied onto TE bases at generate-time
 * to produce TEK (+ Überformel) recipes. Must be explicit per catalyst.
 */
export interface V6CatalystTransformAuthoring {
  transformId: string;
  catalystId: string;
  /**
   * `supported` → matrix TEK expansion.
   * `unsupported` → card + authoring row only; generator skips TEK (§50.3).
   */
  availability: V6CatalystTransformAvailability;
  /** Delta applied to TE primary.value (may be negative). Ignored when unsupported. */
  primaryDelta: number;
  selfDamage?: number;
  stabilityBuffUsed?: number;
  drawDiscardAfter?: boolean;
  /** Opfergabe: optional hand discard for this bonus (engine resolves choice). */
  offerDiscardBonus?: number;
  /** Echo / Verzögerung timing (defaults immediate). */
  timingMode?: V6CatalystTimingMode;
  /** Fixed Echo replay amount (default 1 when timingMode === echo). */
  echoAmount?: number;
  /** Fixed Delay primary bonus (default 2 when timingMode === delay). */
  delayBonus?: number;
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
