/**
 * Bot pick-reaction heuristics smoke tests.
 * Location: src/game/engine/bot.reaction.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from './createGame';
import { BASE_PACK } from '../packs/base-pack';
import { V3_RULESET } from '../types';
import { applyStatus } from './status/applyStatus';
import { resolveImpulseReactions } from './status/reactionChoice';
import { chooseBotAction } from './bot';
import { applyAction } from './actions';

function freshV3() {
  return createGame({
    pack: BASE_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p2',
    seed: 112,
    ruleset: V3_RULESET,
  });
}

describe('bot pick-reaction', () => {
  it('resolves multi-option pick-reaction without UI', () => {
    let state = freshV3();
    state = applyStatus(state, 'p1', 'brennen', 1);
    state = applyStatus(state, 'p1', 'durchnaesst', 1);
    // Fire impulse vs both marks → pick-reaction (inferno vs dampf)
    state = resolveImpulseReactions(state, 'p1', 'fire', V3_RULESET, 'p2');
    expect(state.pendingChoice?.type).toBe('pick-reaction');

    const action = chooseBotAction(state, BASE_PACK);
    expect(action?.type).toBe('PICK_REACTION');
    if (action?.type !== 'PICK_REACTION') return;

    // Prefer inferno over dampf when harming opponent
    expect(action.reactionId).toBe('inferno');

    state = applyAction(state, action, 'p2', {
      pack: BASE_PACK,
      playerId: 'p2',
      ruleset: V3_RULESET,
    });
    expect(state.pendingChoice).toBeNull();
  });
});
