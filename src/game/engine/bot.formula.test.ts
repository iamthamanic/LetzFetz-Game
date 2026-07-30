/**
 * V5 bot formula-phase heuristics (#228).
 * Location: src/game/engine/bot.formula.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from './createGame';
import { chooseBotAction } from './bot';
import { getLegalActions } from './actions';
import { V5_PACK, V5_PACK_RULESET } from '../packs/v5/v5-pack';

describe('V5 bot formula heuristics', () => {
  it('picks FORMULA_BUILD or SKIP_BUILD in Formelphase', () => {
    let state = createGame({
      pack: V5_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p2',
      seed: 77,
      ruleset: V5_PACK_RULESET,
    });
    state = { ...state, phase: 'build', activePlayer: 'p2' };
    // Seed a formula card into bot hand.
    const tech = V5_PACK.techniques![0];
    state = {
      ...state,
      players: {
        ...state.players,
        p2: {
          ...state.players.p2,
          hand: [
            ...state.players.p2.hand,
            { instanceId: 'bot-tech', defId: tech.id },
          ],
        },
      },
    };
    const legal = getLegalActions(state, {
      pack: V5_PACK,
      playerId: 'p2',
      ruleset: V5_PACK_RULESET,
    });
    expect(legal.some((a) => a.type === 'FORMULA_BUILD' || a.type === 'SKIP_BUILD')).toBe(
      true,
    );
    const action = chooseBotAction(state, V5_PACK);
    expect(action).not.toBeNull();
    expect(
      action!.type === 'FORMULA_BUILD' ||
        action!.type === 'FORMULA_REPLACE' ||
        action!.type === 'FORMULA_SCHNELLMIX' ||
        action!.type === 'FORMULA_ACTIVATE' ||
        action!.type === 'SKIP_BUILD',
    ).toBe(true);
  });

  it('plays Großformel when charge is 3 and HP pressure fits', () => {
    let state = createGame({
      pack: V5_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p2',
      seed: 88,
      ruleset: V5_PACK_RULESET,
    });
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p2',
      players: {
        ...state.players,
        p1: { ...state.players.p1, hp: 8 },
        p2: {
          ...state.players.p2,
          hp: 12,
          fetzCharge: 3,
          ultimateAvailable: true,
        },
      },
    };
    const action = chooseBotAction(state, V5_PACK);
    expect(action?.type).toBe('PLAY_ULTIMATE');
  });
});
