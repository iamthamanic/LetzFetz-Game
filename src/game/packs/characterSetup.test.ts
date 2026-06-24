import { describe, expect, it } from 'vitest';
import { BASE_PACK } from './base-pack';
import { formatCharacterElements, getUltimateForCharacter } from './characterSetup';

describe('characterSetup', () => {
  it('formats dual elements in German', () => {
    const gnome = BASE_PACK.characters.find((c) => c.id === 'knuspergnom')!;
    expect(formatCharacterElements(gnome.elements)).toBe('Erde / Feuer');
  });

  it('formats mysterium as Frei / Frei', () => {
    const myst = BASE_PACK.characters.find((c) => c.id === 'mysterium')!;
    expect(formatCharacterElements(myst.elements)).toBe('Frei / Frei');
  });

  it('resolves ultimate for schluckspecht', () => {
    const bird = BASE_PACK.characters.find((c) => c.id === 'schluckspecht')!;
    const ult = getUltimateForCharacter(bird);
    expect(ult?.name).toBe('Lass laufen, Bruder');
    expect(ult?.effectText).toContain('Heile 4 Leben');
  });
});
