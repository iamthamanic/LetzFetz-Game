import { describe, it, expect } from 'vitest';
import { BASE_PACK } from '../packs/base-pack';

describe('BASE_PACK', () => {
  it('has correct card counts per rulebook', () => {
    expect(BASE_PACK.characters).toHaveLength(7);
    expect(BASE_PACK.ultimates).toHaveLength(7);
    expect(BASE_PACK.arenas).toHaveLength(6);
    expect(BASE_PACK.glitches).toHaveLength(10);
    expect(BASE_PACK.elementCards).toHaveLength(60);
  });

  it('main deck is 70 cards (elements + glitches)', () => {
    expect(BASE_PACK.elementCards.length + BASE_PACK.glitches.length).toBe(70);
  });

  it('each element has 10 cards', () => {
    const elements = ['fire', 'water', 'earth', 'air', 'shadow', 'light'] as const;
    for (const el of elements) {
      const count = BASE_PACK.elementCards.filter((c) => c.element === el).length;
      expect(count).toBe(10);
    }
  });

  it('links characters to ultimates', () => {
    for (const ch of BASE_PACK.characters) {
      expect(BASE_PACK.ultimates.some((u) => u.id === ch.ultimateId)).toBe(true);
    }
  });
});
