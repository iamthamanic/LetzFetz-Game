import { describe, it, expect } from 'vitest';
import { createGame } from './createGame';
import { applyAction, getLegalActions } from './actions';
import { BASE_PACK } from '../packs/base-pack';

const ctx = { pack: BASE_PACK, playerId: 'p1' as const };

function advanceToAction(state: ReturnType<typeof createGame>) {
  let current = state;
  for (let i = 0; i < 6 && current.phase !== 'action' && !current.winner; i++) {
    const actions = getLegalActions(current, {
      pack: BASE_PACK,
      playerId: current.activePlayer,
    });
    const next = actions.find((a) => a.type === 'ADVANCE_PHASE' || a.type === 'SKIP_BUILD');
    if (!next) break;
    current = applyAction(current, next, current.activePlayer, {
      pack: BASE_PACK,
      playerId: current.activePlayer,
    });
  }
  return current;
}

describe('PLAY_ULTIMATE', () => {
  it('is legal in action phase when available', () => {
    let state = advanceToAction(
      createGame({
        pack: BASE_PACK,
        p1CharacterId: 'schluckspecht',
        p2CharacterId: 'knuspergnom',
        startingPlayer: 'p1',
        seed: 50,
      }),
    );
    expect(state.players.p1.ultimateAvailable).toBe(true);
    const ulti = getLegalActions(state, ctx).find((a) => a.type === 'PLAY_ULTIMATE');
    expect(ulti).toBeDefined();
  });

  it('applies schluckspecht ultimate and marks it used', () => {
    let state = advanceToAction(
      createGame({
        pack: BASE_PACK,
        p1CharacterId: 'schluckspecht',
        p2CharacterId: 'knuspergnom',
        startingPlayer: 'p1',
        seed: 50,
      }),
    );
    const hpBefore = state.players.p1.hp;
    const oppHpBefore = state.players.p2.hp;

    state = applyAction(state, { type: 'PLAY_ULTIMATE' }, 'p1', ctx);
    expect(state.players.p1.ultimateAvailable).toBe(false);
    expect(state.players.p1.hp).toBeGreaterThanOrEqual(hpBefore);
    expect(state.players.p2.hp).toBeLessThanOrEqual(oppHpBefore);
    expect(state.phase).toBe('end');
  });

  it('sets doubleNextAttack for stiernackenkommando', () => {
    let state = advanceToAction(
      createGame({
        pack: BASE_PACK,
        p1CharacterId: 'stiernackenkommando',
        p2CharacterId: 'knuspergnom',
        startingPlayer: 'p1',
        seed: 60,
      }),
    );
    state = applyAction(state, { type: 'PLAY_ULTIMATE' }, 'p1', ctx);
    expect(state.players.p1.doubleNextAttack).toBe(true);
  });

  it('mysterium echo vs mysterium does not recurse', () => {
    let state = advanceToAction(
      createGame({
        pack: BASE_PACK,
        p1CharacterId: 'mysterium',
        p2CharacterId: 'mysterium',
        startingPlayer: 'p1',
        seed: 1,
      }),
    );
    const handBefore = state.players.p1.hand.length;
    state = applyAction(state, { type: 'PLAY_ULTIMATE' }, 'p1', ctx);
    expect(state.players.p1.ultimateAvailable).toBe(false);
    expect(state.players.p1.hand.length).toBeGreaterThanOrEqual(handBefore);
    expect(state.lastEvent).toContain('Echo');
  });
});
