/**
 * V6/V5 formula component PNGs on disk for Material Kombination strips.
 * Location: src/services/cardArt/formulaArtFiles.test.ts
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { V6_GENERATED_FORMULA_RECIPES } from '../../generated/v6/formulaRecipes.generated';
import { V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID } from '../../content/v6/cards/playtestConstructCards';
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

  it('resolves playtest Beschwörung via art alias to an existing PNG', () => {
    const path = resolveFormulaCardArtPath(V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID);
    expect(path).toBe('/cards/formula/opfergabe.png');
    expect(publicPngExists(path)).toBe(true);
  });
});
