/**
 * View/cache DTO for modular Fetzgerät 3D (not match truth).
 * Location: src/game/types/engineVisual.ts
 * ADR: docs/engine-system/architecture.md (D1)
 */

/** Bump when socket/material assembly contract changes. */
export const ENGINE_RENDER_VERSION = 1;

/**
 * Derived visual recipe. English field names are DTO aliases only:
 * carrier ← traeger, drive ← antrieb, attachment ← aufsatz.
 */
export interface EngineRecipe {
  /** Träger defId — required for an active/assemblable engine. */
  carrierId?: string;
  /** Antrieb defId. */
  driveId?: string;
  /** Aufsatz defId. */
  attachmentId?: string;
  cosmeticSeed: number;
  renderVersion: number;
}

/** Result of validating a recipe and/or bound role slots. */
export interface EngineRecipeValidation {
  /** Structurally valid and assemblable (has Träger, ≤1 per role). */
  ok: boolean;
  /** True when a Träger is present and validation passed. */
  active: boolean;
  errors: readonly string[];
}
