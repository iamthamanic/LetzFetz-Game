/**
 * Smoke tests for V3 ulti/transform/blueprint combat hooks.
 * Location: src/game/engine/status/v3CombatHooks.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { BASE_PACK } from '../../packs/base-pack';
import { V3_RULESET } from '../../types';
import { applyStatus, getStatus } from './applyStatus';
import { resolveImpulseReactions, pickReaction } from './reactionChoice';
import {
  enableDampfMutation,
  enableDoubleReactionThisAction,
  enablePreserveFirstConsumedMark,
  reactionLimitReached,
  readV3CombatHooks,
} from './v3CombatHooks';

function freshV3() {
  return createGame({
    pack: BASE_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed: 110,
    ruleset: V3_RULESET,
  });
}

describe('v3CombatHooks', () => {
  it('defaults to reaction limit 1', () => {
    const hooks = readV3CombatHooks(freshV3().meta);
    expect(hooks.reactionLimit).toBe(1);
    expect(hooks.dampfBecomesDichterNebel).toBe(false);
  });

  it('blueprint: Dampf → Dichter Nebel', () => {
    let state = freshV3();
    state = enableDampfMutation(state);
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'dichter_nebel')).toBeTruthy();
    expect(getStatus(state, 'p2', 'nebel')).toBeUndefined();
  });

  it('ulti: preserve first consumed mark', () => {
    let state = freshV3();
    state = enablePreserveFirstConsumedMark(state);
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'durchnaesst')).toBeTruthy();
    expect(getStatus(state, 'p2', 'nebel')).toBeTruthy();
  });

  it('ulti: double reaction limit allows second reaction', () => {
    let state = freshV3();
    state = enableDoubleReactionThisAction(state);
    state = applyStatus(state, 'p2', 'brennen', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    expect(reactionLimitReached(state.meta)).toBe(false);
    expect(state.meta.v3ReactionsThisAction).toBe(1);

    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    // second reaction (dampf) — may be pick if multi; ensure not force-mark path
    if (state.pendingChoice?.type === 'pick-reaction') {
      state = pickReaction(state, 'dampf', V3_RULESET);
    }
    expect(state.meta.v3ReactionsThisAction).toBe(2);
    expect(reactionLimitReached(state.meta)).toBe(true);
  });
});
