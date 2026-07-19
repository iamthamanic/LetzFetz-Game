import { describe, expect, it } from 'vitest';
import type { GameState } from '../../../game/types';
import { findRemovedAttackCard } from './buildAttackCardFlyStep';

describe('findRemovedAttackCard', () => {
  it('returns the attack card removed from attacker hand when combat opens', () => {
    const prev: GameState = {
      players: {
        p1: {
          characterId: 'knuspergnom',
          hp: 20,
          hand: [
            { instanceId: 'atk-1', defId: 'fire-attack', exhausted: false, resistanceBonus: 0 },
            { instanceId: 'other', defId: 'water-block', exhausted: false, resistanceBonus: 0 },
          ],
          bound: [],
          ultimateAvailable: true,
        },
        p2: {
          characterId: 'pillendoktora',
          hp: 20,
          hand: [],
          bound: [],
          ultimateAvailable: true,
        },
      },
      piles: { deck: [], discard: [] },
      arena: { arenaId: 'arena-spaeti', d6Variant: null },
      activePlayer: 'p1',
      phase: 'action',
      turnNumber: 1,
      winner: null,
      combat: null,
      lastEvent: null,
    };

    const next: GameState = {
      ...prev,
      players: {
        ...prev.players,
        p1: {
          ...prev.players.p1,
          hand: [prev.players.p1.hand[1]],
        },
      },
      combat: {
        attackerId: 'p1',
        defenderId: 'p2',
        attackCardDefId: 'fire-attack',
        attackRoll: 4,
        attackValue: 5,
        mode: 'player',
      },
    };

    expect(findRemovedAttackCard(prev, next)).toEqual({
      instanceId: 'atk-1',
      defId: 'fire-attack',
      attackerId: 'p1',
    });
  });
});
