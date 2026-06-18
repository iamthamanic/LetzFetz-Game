import { describe, it, expect } from 'vitest';
import { createGame } from './createGame';
import { applyAction, getLegalActions } from './actions';
import { BASE_PACK } from '../packs/base-pack';

const ctx = { pack: BASE_PACK, playerId: 'p1' as const };

describe('CHALLENGE', () => {
  it('offers challenge when opponent has bound cards', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 42,
    });

    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p2.bound = [
      {
        instanceId: 'bound-target',
        defId: 'earth-block-4',
        exhausted: false,
        resistanceBonus: 0,
      },
    ];
    state.players.p1.hand = [
      { instanceId: 'attack-card', defId: 'fire-attack-4' },
    ];

    const challenges = getLegalActions(state, ctx).filter((a) => a.type === 'CHALLENGE');
    expect(challenges.length).toBeGreaterThan(0);
  });

  it('destroys bound card when challenge succeeds without block', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 300,
    });

    state.players.p2.bound = [
      {
        instanceId: 'bound-target',
        defId: 'water-block-2',
        exhausted: false,
        resistanceBonus: 0,
      },
    ];

    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p1.hand = [
      { instanceId: 'attack-card', defId: 'fire-attack-6' },
    ];

    const boundBefore = state.players.p2.bound.length;
    state = applyAction(
      state,
      {
        type: 'CHALLENGE',
        attackCardInstanceId: 'attack-card',
        targetBoundInstanceId: 'bound-target',
        diceRoll: 6,
      },
      'p1',
      ctx,
    );
    expect(state.combat?.mode).toBe('challenge');

    state = applyAction(state, { type: 'PASS_BLOCK' }, 'p2', {
      pack: BASE_PACK,
      playerId: 'p2',
    });
    expect(state.players.p2.bound.length).toBeLessThan(boundBefore);
    expect(state.combat).toBeNull();
  });
});
