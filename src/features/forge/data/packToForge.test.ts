import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { packToForgeCards } from './packToForge';
import { BASE_PACK } from '../../../game/packs/base-pack';
import { V5_PACK } from '../../../game/packs/v5';
import { CARD_CATEGORIES } from '../model/categories';
import { resolveFormulaCardArtPath } from '../../../services/cardArt/manifest';
import { VFX_REGISTRY_STORAGE_KEY } from '../../../services/storage/vfxRegistryBridge';
import { V6_SLICE1_RECIPE_CATALOG } from '../../../generated/v6/formulaRecipes.generated';
import { isKombinationForgeCard } from '../model/formulaRoles';

class MockStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

describe('packToForgeCards', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', new MockStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it('exports V1 cards plus V5 Formelkomponenten and V6 Katalog-Kombinationen', () => {
    const cards = packToForgeCards(BASE_PACK);
    const formulaBausteine =
      (V5_PACK.techniques?.length ?? 0) +
      (V5_PACK.essences?.length ?? 0) +
      (V5_PACK.catalysts?.length ?? 0);
    const catalogKombis = V6_SLICE1_RECIPE_CATALOG.recipeCount;
    const itemCount = V5_PACK.items?.length ?? 0;
    expect(cards).toHaveLength(90 + formulaBausteine + catalogKombis + itemCount);

    for (const category of CARD_CATEGORIES) {
      const count = cards.filter((c) => c.type === category.id).length;
      expect(count).toBe(category.expectedCount);
    }
  });

  it('maps knuspergnom with both elements', () => {
    const gnome = packToForgeCards().find((c) => c.id === 'knuspergnom');
    expect(gnome?.type).toBe('Character');
    expect(gnome?.elementDisplay).toBe('Erde / Feuer');
    expect(gnome?.elements).toEqual(['Earth', 'Fire']);
    expect(gnome?.stats_json.hp).toBe(20);
    expect(gnome?.effects.some((e) => e.includes('Passiv'))).toBe(true);
  });

  it('maps element cards with value and cardType', () => {
    const fireAttack = packToForgeCards().find((c) => c.id === 'fire-attack-4');
    expect(fireAttack?.type).toBe('Element');
    expect(fireAttack?.stats_json.value).toBe(4);
    expect(fireAttack?.stats_json.cardType).toBe('attack');
  });

  it('maps all glitches including playable and instant', () => {
    const glitches = packToForgeCards().filter((c) => c.type === 'Glitch');
    expect(glitches).toHaveLength(10);
    expect(glitches.some((g) => g.id === 'glitch-selbstschaden')).toBe(true);
    expect(glitches.some((g) => g.id === 'glitch-riss')).toBe(true);
  });

  it('includes V5 formula cards as Formula kind with role badges', () => {
    const technik = packToForgeCards().find((c) => c.id === 'v5-technik-impulsgeschoss');
    expect(technik?.type).toBe('Formula');
    expect(technik?.effects.some((e) => e === 'Rolle: Technik')).toBe(true);
    expect(technik?.image_asset).toBe(resolveFormulaCardArtPath('v5-technik-impulsgeschoss'));

    const essenz = packToForgeCards().find((c) => c.id === 'v5-essenz-feuer');
    expect(essenz?.type).toBe('Formula');
    expect(essenz?.effects.some((e) => e === 'Rolle: Essenz')).toBe(true);
    expect(essenz?.element).toBe('Fire');

    const katalysator = packToForgeCards().find((c) => c.id === 'v5-katalysator-echo');
    expect(katalysator?.type).toBe('Formula');
    expect(katalysator?.effects.some((e) => e === 'Rolle: Katalysator')).toBe(true);
  });

  it('includes V5 items as Item kind with art paths', () => {
    const nagel = packToForgeCards().find((c) => c.id === 'v5-item-rostiger-nagel');
    expect(nagel?.type).toBe('Item');
    expect(nagel?.image_asset).toBe('/cards/item/rostiger-nagel.png');
    expect(nagel?.effects.some((e) => e.startsWith('Timing:'))).toBe(true);
  });

  it('includes V6 Katalog-Kombinationen with component art', () => {
    const kombis = packToForgeCards().filter(isKombinationForgeCard);
    expect(kombis.length).toBeGreaterThanOrEqual(V6_SLICE1_RECIPE_CATALOG.recipeCount);

    const glut = kombis.find((c) => c.id === 'v6-te-impulsgeschoss-feuer');
    expect(glut?.effects).toContain('Rolle: Kombination');
    expect(glut?.effects).toContain('Quelle: V6 Katalog');
    expect(glut?.component_images?.length).toBe(2);
    expect(glut?.image_asset).toBe(resolveFormulaCardArtPath('v6-technik-impulsgeschoss'));
  });

  it('includes saved Combinate Kombinationen with Kombination role', () => {
    const TS = '2026-07-30T12:00:00.000Z';
    localStorage.setItem(
      VFX_REGISTRY_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        techniques: [],
        formulaRecipes: [
          {
            kind: 'formulaRecipe',
            id: 'kombi-forge-test',
            name: 'Glut-Duo',
            status: 'READY',
            version: 1,
            techniqueId: 'v5-technik-impulsgeschoss',
            essenceId: 'v5-essenz-feuer',
            catalystId: null,
            techniqueVersion: 1,
            essenceVersion: 1,
            catalystVersion: null,
            heroFrame: {
              kind: 'renderOutput',
              id: 'render-1',
              url: 'data:image/png;base64,abc',
              format: 'png',
              width: 64,
              height: 48,
              capturedAt: TS,
            },
            createdAt: TS,
            updatedAt: TS,
          },
        ],
        updatedAt: TS,
      }),
    );

    const kombi = packToForgeCards().find((c) => c.id === 'kombi-forge-test');
    expect(kombi?.type).toBe('Formula');
    expect(kombi?.effects.some((e) => e === 'Rolle: Kombination')).toBe(true);
    expect(kombi?.image_asset).toBe('data:image/png;base64,abc');
  });

  it('skips Combinate save that duplicates a V6 catalog slot triple', () => {
    const TS = '2026-07-30T12:00:00.000Z';
    localStorage.setItem(
      VFX_REGISTRY_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        techniques: [],
        formulaRecipes: [
          {
            kind: 'formulaRecipe',
            id: 'kombi-dup-catalog',
            name: 'Custom Glut',
            status: 'READY',
            version: 1,
            techniqueId: 'v6-technik-impulsgeschoss',
            essenceId: 'v6-essenz-feuer',
            catalystId: null,
            techniqueVersion: 1,
            essenceVersion: 1,
            catalystVersion: null,
            heroFrame: null,
            createdAt: TS,
            updatedAt: TS,
          },
        ],
        updatedAt: TS,
      }),
    );

    const cards = packToForgeCards();
    expect(cards.find((c) => c.id === 'kombi-dup-catalog')).toBeUndefined();
    expect(cards.find((c) => c.id === 'v6-te-impulsgeschoss-feuer')).toBeDefined();
  });
});
