/**
 * V5 §25 character passive smoke tests (#229).
 * Location: src/game/engine/characterPassives.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from './createGame';
import { applyAction } from './actions';
import { V5_PACK, V5_PACK_RULESET } from '../packs/v5/v5-pack';
import {
  consumeStiernackenRevengeBonus,
  tryKnuspergnomFormulaFilter,
  trySchluckspechtFullBlockHeal,
  tryStiernackenRevengeBonus,
} from './characterPassives';
import { createSeededRng } from './deck';

const V5_CTX = {
  pack: V5_PACK,
  playerId: 'p1' as const,
  ruleset: V5_PACK_RULESET,
};

describe('V5 character passives', () => {
  it('Schluckspecht heals 1 once on full block', () => {
    let state = createGame({
      pack: V5_PACK,
      p1CharacterId: 'schluckspecht',
      p2CharacterId: 'knuspergnom',
      startingPlayer: 'p1',
      seed: 11,
      ruleset: V5_PACK_RULESET,
    });
    state = {
      ...state,
      players: {
        ...state.players,
        p1: { ...state.players.p1, hp: 15 },
      },
    };
    const hp = state.players.p1.hp;
    state = trySchluckspechtFullBlockHeal(state, 'p1', V5_PACK_RULESET);
    expect(state.players.p1.hp).toBe(hp + 1);
    const again = trySchluckspechtFullBlockHeal(state, 'p1', V5_PACK_RULESET);
    expect(again.players.p1.hp).toBe(hp + 1);
  });

  it('Knuspergnom filters hand after earth/fire essence build', () => {
    let state = createGame({
      pack: V5_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 22,
      ruleset: V5_PACK_RULESET,
    });
    state = {
      ...state,
      phase: 'build',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [
            {
              instanceId: 'ess-fire',
              defId: 'v5-essenz-eingekochte-glut',
            },
            { instanceId: 'spare', defId: 'fire-attack-3' },
          ],
          formula: { technik: null, essenz: null, katalysator: null },
        },
      },
    };
    state = applyAction(
      state,
      { type: 'FORMULA_BUILD', cardInstanceId: 'ess-fire' },
      'p1',
      V5_CTX,
    );
    expect(state.players.p1.formula.essenz?.defId).toBe('v5-essenz-eingekochte-glut');
    expect(state.lastEvent).toMatch(/Knuspergnom/);
    expect(state.meta.v5PassiveUsed?.p1).toContain('knuspergnom-filter');
  });

  it('Stiernacken stores revenge bonus up to 2 and consumes on attack', () => {
    let state = createGame({
      pack: V5_PACK,
      p1CharacterId: 'stiernackenkommando',
      p2CharacterId: 'knuspergnom',
      startingPlayer: 'p1',
      seed: 33,
      ruleset: V5_PACK_RULESET,
    });
    state = tryStiernackenRevengeBonus(state, 'p1', 2, V5_PACK_RULESET);
    state = tryStiernackenRevengeBonus(state, 'p1', 1, V5_PACK_RULESET);
    state = tryStiernackenRevengeBonus(state, 'p1', 1, V5_PACK_RULESET);
    expect(state.meta.v5RevengeBonus?.p1).toBe(2);
    const consumed = consumeStiernackenRevengeBonus(state, 'p1');
    expect(consumed.bonus).toBe(2);
    expect(consumed.state.meta.v5RevengeBonus?.p1).toBe(0);
  });

  it('does not run Knuspergnom filter outside v5Formula', () => {
    const state = createGame({
      pack: V5_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 44,
    });
    const next = tryKnuspergnomFormulaFilter(
      {
        ...state,
        players: {
          ...state.players,
          p1: {
            ...state.players.p1,
            formula: {
              technik: null,
              essenz: {
                instanceId: 'e1',
                defId: 'v5-essenz-eingekochte-glut',
                slot: 'essenz',
                exhausted: false,
                disturbed: false,
                stabilityBonus: 0,
              },
              katalysator: null,
            },
            hand: [{ instanceId: 'h1', defId: 'fire-attack-3' }],
          },
        },
      },
      V5_PACK,
      'p1',
      'e1',
      createSeededRng(1),
      { ...V5_PACK_RULESET, v5Formula: false },
    );
    expect(next.meta.v5PassiveUsed?.p1 ?? []).not.toContain('knuspergnom-filter');
  });
});
