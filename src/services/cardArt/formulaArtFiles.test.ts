/**
 * V6/V5 formula component PNGs on disk for Material Kombination strips.
 * Location: src/services/cardArt/formulaArtFiles.test.ts
 *
 * Default Material/Play catalyst art is white line-art under /cards/formula/*.png
 * (restored after PR #373 briefly replaced some with full-color z-image sources).
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { V6_GENERATED_FORMULA_RECIPES } from '../../generated/v6/formulaRecipes.generated';
import { V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID } from '../../content/v6/cards/playtestConstructCards';
import { V5_PACK } from '../../game/packs/v5';
import { resolveCardArtPath, resolveFormulaCardArtPath } from './manifest';

function publicPngExists(publicPath: string): boolean {
  const relative = publicPath.replace(/^\//, '');
  return existsSync(resolve(process.cwd(), 'public', relative));
}

describe('formula component art files', () => {
  it('ships PNGs for every V6 catalog recipe component (T/E/K)', () => {
    const ids = new Set<string>();
    for (const recipe of V6_GENERATED_FORMULA_RECIPES) {
      if (recipe.techniqueId) ids.add(recipe.techniqueId);
      if (recipe.essenceId) ids.add(recipe.essenceId);
      if (recipe.catalystId) ids.add(recipe.catalystId);
    }
    expect(ids.size).toBeGreaterThan(0);
    for (const id of ids) {
      const path = resolveFormulaCardArtPath(id);
      expect(path, id).toMatch(/^\/cards\/formula\/[a-z0-9-]+\.png$/);
      expect(publicPngExists(path), `${id} → ${path}`).toBe(true);
      expect(resolveCardArtPath(id)).toBe(path);
    }
  });

  it('ships PNGs for every V5 katalysator (Material → Katalysator filter)', () => {
    const catalysts = V5_PACK.catalysts ?? [];
    expect(catalysts.length).toBeGreaterThan(0);
    for (const catalyst of catalysts) {
      const path = resolveFormulaCardArtPath(catalyst.id);
      expect(path, catalyst.id).toMatch(/^\/cards\/formula\/[a-z0-9-]+\.png$/);
      expect(publicPngExists(path), `${catalyst.id} → ${path}`).toBe(true);
      expect(resolveCardArtPath(catalyst.id)).toBe(path);
    }
  });

  it('resolves V5/V6 katalysator ids to root formula white-line-art PNGs', () => {
    expect(resolveCardArtPath('v5-katalysator-spiegelung')).toBe('/cards/formula/spiegelung.png');
    expect(resolveCardArtPath('v5-katalysator-ueberspannung')).toBe(
      '/cards/formula/ueberspannung.png',
    );
    expect(resolveCardArtPath('v6-katalysator-ueberladung')).toBe(
      '/cards/formula/ueberspannung.png',
    );
    expect(resolveCardArtPath('v6-katalysator-verdichtung')).toBe('/cards/formula/verdichtung.png');
    expect(resolveCardArtPath('v6-katalysator-ausbreitung')).toBe('/cards/formula/ausbreitung.png');
    expect(publicPngExists('/cards/formula/spiegelung.png')).toBe(true);
    expect(publicPngExists('/cards/formula/ueberspannung.png')).toBe(true);
    expect(publicPngExists('/cards/formula/verdichtung.png')).toBe(true);
    expect(publicPngExists('/cards/formula/ausbreitung.png')).toBe(true);
  });

  it('does not ship leftover full-color catalyst orphans', () => {
    expect(publicPngExists('/cards/formula/ueberladung.png')).toBe(false);
    expect(publicPngExists('/cards/formula/doppelecho.png')).toBe(false);
    expect(publicPngExists('/cards/formula/sicherheitsventil.png')).toBe(false);
  });

  it('does not ship z-image katalysator alternate arts', () => {
    expect(existsSync(resolve(process.cwd(), 'public/cards/formula/z-image'))).toBe(false);
  });

  it('resolves playtest Beschwörung via art alias to an existing PNG', () => {
    const path = resolveFormulaCardArtPath(V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID);
    expect(path).toBe('/cards/formula/opfergabe.png');
    expect(publicPngExists(path)).toBe(true);
  });

  it('maps every V6 catalog catalyst slot to a shipped formula PNG', () => {
    const recipesWithCatalyst = V6_GENERATED_FORMULA_RECIPES.filter((r) => r.catalystId);
    expect(recipesWithCatalyst.length).toBeGreaterThan(0);
    for (const recipe of recipesWithCatalyst) {
      const path = resolveFormulaCardArtPath(recipe.catalystId!);
      expect(path, `${recipe.recipeId} catalyst ${recipe.catalystId}`).toMatch(
        /^\/cards\/formula\/[a-z0-9-]+\.png$/,
      );
      expect(publicPngExists(path), `${recipe.catalystId} → ${path}`).toBe(true);
      expect(path).not.toContain('z-image');
      expect(path).not.toBe('/cards/formula/ueberladung.png');
      expect(path).not.toBe('/cards/formula/doppelecho.png');
      expect(path).not.toBe('/cards/formula/sicherheitsventil.png');
    }
  });
});
