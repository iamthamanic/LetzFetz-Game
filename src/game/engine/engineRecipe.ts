/**
 * Pure EngineRecipe helpers — derive / validate / render keys from bound.
 * Location: src/game/engine/engineRecipe.ts
 * No React, DOM, or Three.js.
 */
import type { BoundCardInstance, ContentPack, FetzgeraetSlot } from '../types';
import type { EngineRecipe, EngineRecipeValidation } from '../types/engineVisual';
import { ENGINE_RENDER_VERSION } from '../types/engineVisual';
import { findEnginePartDef } from './lookup';
import { effectiveFetzSlot } from './status/fetzgeraetSlots';

export interface BoundToRecipeOptions {
  cosmeticSeed?: number;
  renderVersion?: number;
}

/** Collect defIds per Fetzgerät role (charge / non-role cards skipped). */
function defIdsByFetzSlot(
  bound: BoundCardInstance[],
): Record<FetzgeraetSlot, string[]> {
  const bySlot: Record<FetzgeraetSlot, string[]> = {
    traeger: [],
    antrieb: [],
    aufsatz: [],
  };
  for (const card of bound) {
    const slot = effectiveFetzSlot(card);
    if (!slot) continue;
    bySlot[slot].push(card.defId);
  }
  return bySlot;
}

/**
 * Derive a visual recipe from bound role cards.
 * Picks the first card per slot; duplicates are detected via validateBoundRecipe.
 */
export function boundToRecipe(
  bound: BoundCardInstance[],
  options: BoundToRecipeOptions = {},
): EngineRecipe {
  const bySlot = defIdsByFetzSlot(bound);
  const recipe: EngineRecipe = {
    cosmeticSeed: options.cosmeticSeed ?? 0,
    renderVersion: options.renderVersion ?? ENGINE_RENDER_VERSION,
  };
  const carrier = bySlot.traeger[0];
  const drive = bySlot.antrieb[0];
  const attachment = bySlot.aufsatz[0];
  if (carrier !== undefined) recipe.carrierId = carrier;
  if (drive !== undefined) recipe.driveId = drive;
  if (attachment !== undefined) recipe.attachmentId = attachment;
  return recipe;
}

function validationFrom(
  ok: boolean,
  active: boolean,
  errors: string[],
): EngineRecipeValidation {
  return { ok, active, errors };
}

/** Validate bound role occupancy (≤1 per slot) and assemblable recipe rules. */
export function validateBoundRecipe(bound: BoundCardInstance[]): EngineRecipeValidation {
  const bySlot = defIdsByFetzSlot(bound);
  const errors: string[] = [];

  for (const slot of Object.keys(bySlot) as FetzgeraetSlot[]) {
    if (bySlot[slot].length > 1) {
      errors.push(`More than one part in slot "${slot}"`);
    }
  }

  const recipe = boundToRecipe(bound);
  const recipeResult = validateRecipe(recipe);
  for (const err of recipeResult.errors) {
    if (!errors.includes(err)) errors.push(err);
  }

  const ok = errors.length === 0;
  return validationFrom(ok, ok && Boolean(recipe.carrierId), errors);
}

/**
 * Validate a recipe DTO: active engine requires Träger;
 * Antrieb/Aufsatz alone are invalid.
 */
export function validateRecipe(recipe: EngineRecipe): EngineRecipeValidation {
  const errors: string[] = [];
  const hasCarrier = Boolean(recipe.carrierId);
  const hasDrive = Boolean(recipe.driveId);
  const hasAttachment = Boolean(recipe.attachmentId);

  if (!hasCarrier && !hasDrive && !hasAttachment) {
    errors.push('Empty recipe — no Fetzgerät parts');
    return validationFrom(false, false, errors);
  }

  if (!hasCarrier) {
    errors.push('Active engine requires Träger (carrierId)');
    return validationFrom(false, false, errors);
  }

  return validationFrom(true, true, errors);
}

/** Stable cache / snapshot key for identical recipe + seed + renderVersion. */
export function createRenderKey(recipe: EngineRecipe): string {
  return [
    `rv${recipe.renderVersion}`,
    `cs${recipe.cosmeticSeed}`,
    recipe.carrierId ?? '',
    recipe.driveId ?? '',
    recipe.attachmentId ?? '',
  ].join('|');
}

/** German display label from pack part names (Träger · Antrieb · Aufsatz). */
export function createEngineDisplayName(
  pack: ContentPack,
  recipe: EngineRecipe,
): string {
  const parts: string[] = [];
  for (const field of ['carrierId', 'driveId', 'attachmentId'] as const) {
    const defId = recipe[field];
    if (!defId) continue;
    const def = findEnginePartDef(pack, defId);
    parts.push(def?.name ?? defId);
  }
  if (parts.length === 0) return 'Leeres Fetzgerät';
  return parts.join(' · ');
}
