import { describe, it, expect } from 'vitest';
import { BASE_PACK } from '../packs/base-pack';
import { pickOpponentCharacter } from './pickBotCharacter';

describe('pickOpponentCharacter', () => {
  it('never returns the human character when alternatives exist', () => {
    const human = 'knuspergnom';
    for (let i = 0; i < 20; i++) {
      const bot = pickOpponentCharacter(BASE_PACK, human, () => i / 20);
      expect(bot).not.toBe(human);
    }
  });

  it('returns a valid character id from the pack', () => {
    const bot = pickOpponentCharacter(BASE_PACK, 'schluckspecht', () => 0);
    expect(BASE_PACK.characters.some((c) => c.id === bot)).toBe(true);
  });
});
