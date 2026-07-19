import { describe, it, expect } from 'vitest';
import { createGame } from '../engine/createGame';
import { BASE_PACK } from '../packs/base-pack';
import { DEFAULT_RULESET } from '../types';

describe('createGame', () => {
  it('sets up hands 5/6 for starter/second player', () => {
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 42,
    });

    expect(state.players.p1.hand).toHaveLength(DEFAULT_RULESET.p1StartingHand);
    expect(state.players.p2.hand).toHaveLength(DEFAULT_RULESET.p2SecondHand);
    expect(state.players.p1.hp).toBe(20);
    expect(state.players.p2.hp).toBe(20);
    expect(state.winner).toBeNull();
  });

  it('uses 70-card main deck', () => {
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      seed: 1,
    });
    const total =
      state.piles.deck.length +
      state.players.p1.hand.length +
      state.players.p2.hand.length +
      state.piles.discard.length;
    expect(total).toBe(70);
  });

  it('assigns arena', () => {
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      arenaId: 'arena-spaeti',
      seed: 1,
    });
    expect(state.arena.arenaId).toBe('arena-spaeti');
    expect(state.arena.d6Variant).toBeNull();
  });

  it('never deals Sofort-Glitches into opening hands', () => {
    const instantIds = new Set(
      BASE_PACK.glitches.filter((g) => g.glitchType === 'instant').map((g) => g.id),
    );
    expect(instantIds.size).toBeGreaterThan(0);

    for (let seed = 0; seed < 40; seed += 1) {
      const state = createGame({
        pack: BASE_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: seed % 2 === 0 ? 'p1' : 'p2',
        seed,
      });
      const opening = [...state.players.p1.hand, ...state.players.p2.hand];
      expect(opening.every((c) => !instantIds.has(c.defId))).toBe(true);
      expect(state.instantReveals).toEqual([]);
      expect(state.players.p1.hp).toBe(20);
      expect(state.players.p2.hp).toBe(20);
    }
  });
});
