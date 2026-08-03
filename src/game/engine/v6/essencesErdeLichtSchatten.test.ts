/**
 * V6 Essenzen Erde / Licht / Schatten (#380).
 * Location: src/game/engine/v6/essencesErdeLichtSchatten.test.ts
 */
import { describe, expect, it } from 'vitest';
import { V6_CORE_PACK } from '../../packs/v6/v6-pack';
import { V6_SLICE1_ESSENCE_IDS } from '../../../content/v6/slice1Ids';
import { V6_FORMULA_AUTHORING_SLICE1 } from '../../../content/v6/formulaAuthoring.slice1';
import {
  V6_GENERATED_FORMULA_RECIPES,
  V6_GENERATED_RECIPE_COUNT,
  V6_SLICE1_RECIPE_CATALOG,
} from '../../../generated/v6/formulaRecipes.generated';
import { resolveCardArtPath } from '../../../services/cardArt/manifest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('V6 Essenzen Erde / Licht / Schatten (#380)', () => {
  it('ships all six essence identities in pack + ids', () => {
    expect([...V6_SLICE1_ESSENCE_IDS]).toEqual([
      'v6-essenz-feuer',
      'v6-essenz-wasser',
      'v6-essenz-erde',
      'v6-essenz-luft',
      'v6-essenz-licht',
      'v6-essenz-schatten',
    ]);
    const byId = Object.fromEntries((V6_CORE_PACK.essences ?? []).map((e) => [e.id, e]));
    expect(byId['v6-essenz-erde']?.element).toBe('earth');
    expect(byId['v6-essenz-erde']?.effectText).toMatch(/Stabilität/);
    expect(byId['v6-essenz-licht']?.element).toBe('light');
    expect(byId['v6-essenz-licht']?.effectText).toMatch(/Schild/);
    expect(byId['v6-essenz-schatten']?.element).toBe('shadow');
    expect(byId['v6-essenz-schatten']?.effectText).toMatch(/Fluch/);
  });

  it('authoring + generated catalog cover new essence ids (fail-closed size)', () => {
    expect(V6_FORMULA_AUTHORING_SLICE1.teBases).toHaveLength(60);
    expect(V6_FORMULA_AUTHORING_SLICE1.ekBases).toHaveLength(60);
    expect(V6_GENERATED_RECIPE_COUNT).toBe(1420);
    expect(V6_SLICE1_RECIPE_CATALOG.recipeCount).toBe(1420);
    for (const id of ['v6-essenz-erde', 'v6-essenz-licht', 'v6-essenz-schatten'] as const) {
      expect(V6_FORMULA_AUTHORING_SLICE1.teBases.some((r) => r.essenceId === id)).toBe(true);
      expect(V6_GENERATED_FORMULA_RECIPES.some((r) => r.essenceId === id)).toBe(true);
    }
    // Prior recipe ids stay stable
    expect(
      V6_GENERATED_FORMULA_RECIPES.some((r) => r.recipeId === 'v6-te-impulsgeschoss-feuer'),
    ).toBe(true);
  });

  it('reuses formula art PNGs for Erde / Licht / Schatten', () => {
    for (const id of ['v6-essenz-erde', 'v6-essenz-licht', 'v6-essenz-schatten'] as const) {
      const path = resolveCardArtPath(id);
      expect(path).toMatch(/^\/cards\/formula\/(erde|licht|schatten)\.png$/);
      const relative = path.replace(/^\//, '');
      expect(existsSync(resolve(process.cwd(), 'public', relative)), path).toBe(true);
    }
  });
});
