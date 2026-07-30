import { describe, it, expect } from 'vitest';
import { packToForgeCards } from './packToForge';
import { BASE_PACK } from '../../../game/packs/base-pack';
import { V5_PACK } from '../../../game/packs/v5';
import { CARD_CATEGORIES } from '../model/categories';
import { resolveFormulaCardArtPath } from '../../../services/cardArt/manifest';

describe('packToForgeCards', () => {
  it('exports V1 cards plus V5 Formelkomponenten with rulebook categories', () => {
    const cards = packToForgeCards(BASE_PACK);
    const formulaCount =
      (V5_PACK.techniques?.length ?? 0) +
      (V5_PACK.essences?.length ?? 0) +
      (V5_PACK.catalysts?.length ?? 0);
    expect(cards).toHaveLength(90 + formulaCount);

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
    const technik = packToForgeCards().find((c) => c.id === 'v5-technik-durchschuss');
    expect(technik?.type).toBe('Formula');
    expect(technik?.effects.some((e) => e === 'Rolle: Technik')).toBe(true);
    expect(technik?.image_asset).toBe(resolveFormulaCardArtPath('v5-technik-durchschuss'));

    const essenz = packToForgeCards().find((c) => c.id === 'v5-essenz-eingekochte-glut');
    expect(essenz?.type).toBe('Formula');
    expect(essenz?.effects.some((e) => e === 'Rolle: Essenz')).toBe(true);
    expect(essenz?.element).toBe('Fire');

    const katalysator = packToForgeCards().find((c) => c.id === 'v5-katalysator-echo');
    expect(katalysator?.type).toBe('Formula');
    expect(katalysator?.effects.some((e) => e === 'Rolle: Katalysator')).toBe(true);
  });
});
