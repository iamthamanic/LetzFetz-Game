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
});
