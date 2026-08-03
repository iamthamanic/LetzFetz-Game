/**
 * Unit tests for VisualRecipe builder (#226).
 * Location: src/game/engine/visualRecipe.test.ts
 */
import { describe, expect, it } from 'vitest';
import { buildVisualRecipe, describeVisualRecipeDe } from './visualRecipe';
import { V5_PACK } from '../packs/v5';

describe('buildVisualRecipe', () => {
  it('returns null for empty formula', () => {
    expect(
      buildVisualRecipe({
        pack: V5_PACK,
        formula: { technik: null, essenz: null, katalysator: null },
      }),
    ).toBeNull();
  });

  it('composes Impulsgeschoss + Feuer + Echo with action water', () => {
    const recipe = buildVisualRecipe({
      pack: V5_PACK,
      formula: {
        technik: {
          instanceId: 't',
          defId: 'v5-technik-impulsgeschoss',
          slot: 'technik',
          exhausted: false,
          disturbed: false,
          stabilityBonus: 0,
        },
        essenz: {
          instanceId: 'e',
          defId: 'v5-essenz-feuer',
          slot: 'essenz',
          exhausted: false,
          disturbed: false,
          stabilityBonus: 0,
        },
        katalysator: {
          instanceId: 'k',
          defId: 'v5-katalysator-echo',
          slot: 'katalysator',
          exhausted: false,
          disturbed: false,
          stabilityBonus: 0,
        },
      },
      primaryElement: 'water',
    });
    expect(recipe).toMatchObject({
      delivery: 'projectile',
      shape: 'drill',
      primaryElement: 'water',
      secondaryElement: 'fire',
      transformation: 'duplicate',
    });
    expect(describeVisualRecipeDe(recipe)).toBeTruthy();
  });

  it('works with technik only', () => {
    const recipe = buildVisualRecipe({
      pack: V5_PACK,
      formula: {
        technik: {
          instanceId: 't',
          defId: 'v5-technik-bannkreis',
          slot: 'technik',
          exhausted: false,
          disturbed: false,
          stabilityBonus: 0,
        },
        essenz: null,
        katalysator: null,
      },
    });
    expect(recipe?.delivery).toBe('area');
    expect(recipe?.shape).toBe('wall');
    expect(recipe?.secondaryElement).toBeUndefined();
  });
});
