/**
 * Tests for V3 mono reactions + Dampf (#104).
 * Location: src/game/engine/status/reactionOutcomes.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { BASE_PACK } from '../../packs/base-pack';
import { V3_RULESET } from '../../types';
import { applyStatus, getStatus } from './applyStatus';
import { resolveImpulseReactions } from './reactionChoice';

function freshV3() {
  return createGame({
    pack: BASE_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed: 9,
    ruleset: V3_RULESET,
  });
}

describe('mono + Dampf outcomes', () => {
  it('Inferno: 3 Brennen + Feuerimpuls → 4 damage, no new Brennen', () => {
    let state = freshV3();
    const hp = state.players.p2.hp;
    state = applyStatus(state, 'p2', 'brennen', 3);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'brennen')).toBeUndefined();
    expect(state.players.p2.hp).toBe(hp - 4);
  });

  it('Überflutung: Durchnässt + Wasser → Überflutet', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'water', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'durchnaesst')).toBeUndefined();
    expect(getStatus(state, 'p2', 'ueberflutet')?.stacks).toBe(1);
  });

  it('Deep High: keeps High and adds a stack', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'high', 1);
    state = resolveImpulseReactions(state, 'p2', 'earth', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'high')?.stacks).toBe(2);
  });

  it('Rückenwind: Fokus after Aufgewirbelt', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'aufgewirbelt', 1);
    state = resolveImpulseReactions(state, 'p2', 'air', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'aufgewirbelt')).toBeUndefined();
    expect(getStatus(state, 'p2', 'fokus')?.stacks).toBe(1);
  });

  it('Erleuchtung: two shield when no negative status', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'erleuchtet', 1);
    state = resolveImpulseReactions(state, 'p2', 'light', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'erleuchtet')).toBeUndefined();
    expect(state.players.p2.shield).toBe(2);
  });

  it('Tiefer Fluch: adds two curse stacks (cap 3)', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'verflucht', 1);
    state = resolveImpulseReactions(state, 'p2', 'shadow', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'verflucht')?.stacks).toBe(3);
  });

  it('Dampf: Durchnässt + Feuer → Nebel, no Brennen', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'durchnaesst')).toBeUndefined();
    expect(getStatus(state, 'p2', 'brennen')).toBeUndefined();
    expect(getStatus(state, 'p2', 'nebel')?.stacks).toBe(1);
  });
});
