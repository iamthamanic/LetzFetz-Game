import { describe, it, expect } from 'vitest';
import { createGame } from './createGame';
import { applyAction, getLegalActions } from './actions';
import { BASE_PACK } from '../packs/base-pack';

const ctx = { pack: BASE_PACK, playerId: 'p1' as const };

describe('applyAction — turn flow', () => {
  it('advances start → draw → build', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 100,
    });

    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', ctx);
    expect(state.phase).toBe('draw');

    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', ctx);
    expect(state.phase).toBe('build');
  });

  it('builds a card and moves to action phase', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 100,
    });
    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', ctx);
    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', ctx);

    const buildActions = getLegalActions(state, ctx).filter((a) => a.type === 'BUILD_CARD');
    expect(buildActions.length).toBeGreaterThan(0);

    state = applyAction(state, buildActions[0], 'p1', ctx);
    expect(state.phase).toBe('action');
    expect(state.players.p1.bound.length).toBe(1);
  });
});

describe('applyAction — combat', () => {
  it('resolves attack with block', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 200,
    });

    while (state.phase !== 'action' && !state.winner) {
      const actions = getLegalActions(state, { pack: BASE_PACK, playerId: state.activePlayer });
      const advance = actions.find((a) => a.type === 'ADVANCE_PHASE' || a.type === 'SKIP_BUILD');
      if (!advance) break;
      state = applyAction(state, advance, state.activePlayer, {
        pack: BASE_PACK,
        playerId: state.activePlayer,
      });
    }

    const attack = getLegalActions(state, ctx).find((a) => a.type === 'PLAY_ATTACK');
    if (!attack || attack.type !== 'PLAY_ATTACK') return;

    const hpBefore = state.players.p2.hp;
    state = applyAction(
      state,
      { ...attack, diceRoll: 6 },
      'p1',
      ctx,
    );
    expect(state.combat).not.toBeNull();

    const blockCtx = { pack: BASE_PACK, playerId: 'p2' as const };
    const block = getLegalActions(state, blockCtx).find((a) => a.type === 'PLAY_BLOCK');
    if (block && block.type === 'PLAY_BLOCK') {
      state = applyAction(state, { ...block, diceRoll: 1 }, 'p2', blockCtx);
      expect(state.combat).toBeNull();
      expect(state.players.p2.hp).toBeLessThanOrEqual(hpBefore);
    }
  });
});
