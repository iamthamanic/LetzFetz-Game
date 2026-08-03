/**
 * Unit tests for V6 catalog → Material Kombination forge mapping.
 * Location: src/features/forge/data/v6FormulaRecipesToForge.test.ts
 */
import { describe, it, expect } from 'vitest';
import {
  V6_GENERATED_FORMULA_RECIPES,
  V6_SLICE1_RECIPE_CATALOG,
} from '../../../generated/v6/formulaRecipes.generated';
import { resolveFormulaCardArtPath } from '../../../services/cardArt/manifest';
import {
  formulaSlotKey,
  v6FormulaRecipesToForgeCards,
  v6GeneratedRecipeToForgeCard,
} from './v6FormulaRecipesToForge';

describe('v6FormulaRecipesToForgeCards', () => {
  it('maps the locked Slice-1 catalog count', () => {
    const cards = v6FormulaRecipesToForgeCards();
    expect(cards).toHaveLength(V6_SLICE1_RECIPE_CATALOG.recipeCount);
    expect(cards).toHaveLength(105);
    expect(V6_GENERATED_FORMULA_RECIPES).toHaveLength(105);
  });

  it('maps Glutimpuls as Formel-Kombination with V6 Katalog source', () => {
    const recipe = V6_GENERATED_FORMULA_RECIPES.find(
      (r) => r.recipeId === 'v6-te-impulsgeschoss-feuer',
    );
    expect(recipe).toBeDefined();
    if (!recipe) return;

    const card = v6GeneratedRecipeToForgeCard(recipe);
    expect(card.id).toBe('v6-te-impulsgeschoss-feuer');
    expect(card.name).toBe('Glutimpuls');
    expect(card.type).toBe('Formula');
    expect(card.effects).toContain('Rolle: Kombination');
    expect(card.effects).toContain('Quelle: V6 Katalog');
    expect(card.effects.some((e) => e.startsWith('Effekt:'))).toBe(true);
    expect(card.fromPack).toBe(true);

    const technikArt = resolveFormulaCardArtPath('v6-technik-impulsgeschoss');
    const essenzArt = resolveFormulaCardArtPath('v6-essenz-feuer');
    expect(card.component_images).toEqual([technikArt, essenzArt]);
    expect(card.image_asset).toBe(technikArt);
  });

  it('builds stable slot keys for dedup', () => {
    expect(formulaSlotKey('t', 'e', null)).toBe('t|e|');
    expect(formulaSlotKey(null, 'e', 'k')).toBe('|e|k');
  });
});
