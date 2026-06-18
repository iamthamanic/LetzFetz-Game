import { describe, it, expect } from 'vitest';
import { packToForgeCards } from './packToForge';
import { BASE_PACK } from '../../game/packs/base-pack';
import { CARD_CATEGORIES } from './categories';

describe('packToForgeCards', () => {
  it('exports all 90 V1 cards with rulebook categories', () => {
    const cards = packToForgeCards(BASE_PACK);
    expect(cards).toHaveLength(90);

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
});
