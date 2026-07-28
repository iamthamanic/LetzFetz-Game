/**
 * Tests for V3 reaction matrix core + pick-reaction (#103).
 * Location: src/game/engine/status/reactionChoice.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { BASE_PACK } from '../../packs/base-pack';
import { V3_RULESET } from '../../types';
import { applyStatus, getStatus } from './applyStatus';
import { reactionIdFor } from './reactions';
import { pickReaction, resolveImpulseReactions } from './reactionChoice';

function freshV3() {
  return createGame({
    pack: BASE_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed: 5,
    ruleset: V3_RULESET,
  });
}

describe('reactionIdFor', () => {
  it('maps unordered pairs including mono and Dampf', () => {
    expect(reactionIdFor('fire', 'brennen')).toBe('inferno');
    expect(reactionIdFor('fire', 'durchnaesst')).toBe('dampf');
    expect(reactionIdFor('water', 'brennen')).toBe('dampf');
  });
});

describe('resolveImpulseReactions', () => {
  it('auto-resolves when exactly one reaction matches', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    expect(state.pendingChoice).toBeNull();
    expect(getStatus(state, 'p2', 'durchnaesst')).toBeUndefined();
    expect(state.meta.v3ReactionsThisAction).toBe(1);
    expect(state.lastEvent).toContain('Dampf');
    expect(state.lastEvent).toMatch(/^Auto-Reaktion:/);
  });

  it('opens pick-reaction when multiple marks match', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = applyStatus(state, 'p2', 'high', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    expect(state.pendingChoice?.type).toBe('pick-reaction');
    if (state.pendingChoice?.type !== 'pick-reaction') return;
    expect(state.pendingChoice.options.map((o) => o.reactionId).sort()).toEqual(
      ['dampf', 'hotbox'].sort(),
    );
    expect(getStatus(state, 'p2', 'durchnaesst')).toBeTruthy();
    expect(getStatus(state, 'p2', 'high')).toBeTruthy();
  });

  it('applies chosen reaction and leaves other mark', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = applyStatus(state, 'p2', 'high', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    state = pickReaction(state, 'dampf', V3_RULESET);
    expect(getStatus(state, 'p2', 'durchnaesst')).toBeUndefined();
    expect(getStatus(state, 'p2', 'high')?.stacks).toBe(1);
    expect(state.meta.v3ReactionsThisAction).toBe(1);
  });

  it('blocks a second reaction in the same action', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    expect(state.meta.v3ReactionsThisAction).toBe(1);
    state = applyStatus(state, 'p2', 'brennen', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    // Second impulse forced to mark path (stacks Brennen) — no second reaction
    expect(state.meta.v3ReactionsThisAction).toBe(1);
    expect(getStatus(state, 'p2', 'brennen')?.stacks).toBeGreaterThanOrEqual(1);
  });
});
