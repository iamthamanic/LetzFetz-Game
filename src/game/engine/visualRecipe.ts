/**
 * Build VisualRecipe from Formelboard (+ optional action element) — property-based.
 * Location: src/game/engine/visualRecipe.ts
 */
import type {
  ContentPack,
  Element,
  FormulaBoard,
  VisualRecipe,
} from '../types';
import {
  findCatalystDef,
  findEssenceDef,
  findTechniqueDef,
} from './formulaSlots';

export interface BuildVisualRecipeInput {
  pack: ContentPack;
  formula: FormulaBoard;
  /** Action card primary element when casting (optional). */
  primaryElement?: Element;
}

/** Compose recipe from Technik / Essenz / Katalysator visual profiles. */
export function buildVisualRecipe(input: BuildVisualRecipeInput): VisualRecipe | null {
  const { pack, formula, primaryElement } = input;
  const technik = formula.technik
    ? findTechniqueDef(pack, formula.technik.defId)
    : undefined;
  if (!technik) return null;

  const essenz = formula.essenz
    ? findEssenceDef(pack, formula.essenz.defId)
    : undefined;
  const katalysator = formula.katalysator
    ? findCatalystDef(pack, formula.katalysator.defId)
    : undefined;

  const techVisual = technik.visual;
  const recipe: VisualRecipe = {
    delivery: techVisual?.delivery ?? 'projectile',
    shape: techVisual?.shape ?? 'slash',
    primaryElement,
    secondaryElement: essenz?.visual?.element ?? essenz?.element,
    material: essenz?.visual?.materialProfile,
    timing: katalysator?.visual?.timing,
    transformation: katalysator?.visual?.transformation,
  };
  return recipe;
}

/** German one-line summary for FormulaRig / a11y. */
export function describeVisualRecipeDe(recipe: VisualRecipe | null): string {
  if (!recipe) return 'Leeres Formelgestell';
  const parts: string[] = [];
  if (recipe.shape) parts.push(recipe.shape === 'drill' ? 'Bohrstrahl' : recipe.shape);
  if (recipe.secondaryElement) parts.push(`Sekundär ${recipe.secondaryElement}`);
  if (recipe.primaryElement) parts.push(`Primär ${recipe.primaryElement}`);
  if (recipe.transformation === 'duplicate') parts.push('Echo');
  if (recipe.transformation === 'overcharge') parts.push('Überladung');
  if (recipe.transformation === 'reflect') parts.push('Spiegelung');
  return parts.length > 0 ? parts.join(' · ') : 'Formel aktiv';
}
