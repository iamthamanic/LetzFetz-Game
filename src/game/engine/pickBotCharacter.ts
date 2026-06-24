/**
 * Pick a random opponent character distinct from the human pick.
 * Location: src/game/engine/pickBotCharacter.ts
 */
import type { ContentPack } from '../types';

export function pickOpponentCharacter(
  pack: ContentPack,
  humanCharacterId: string,
  rng: () => number = Math.random,
): string {
  const pool = pack.characters.filter((c) => c.id !== humanCharacterId);
  if (pool.length === 0) {
    return pack.characters[0]?.id ?? humanCharacterId;
  }
  const index = Math.floor(rng() * pool.length);
  return pool[index].id;
}
