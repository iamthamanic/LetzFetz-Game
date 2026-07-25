/**
 * Tests for V3 applyStatus + elementImpulse (#101).
 * Location: src/game/engine/status/elementImpulse.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { BASE_PACK } from '../../packs/base-pack';
import { DEFAULT_RULESET, V3_RULESET } from '../../types';
import { applyStatus, getStatus } from './applyStatus';
import { applyElementImpulse, PRIMARY_MARK_BY_ELEMENT } from './elementImpulse';

function freshV3() {
  return createGame({
    pack: BASE_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed: 11,
    ruleset: V3_RULESET,
  });
}

describe('applyStatus', () => {
  it('stacks Brennen up to 3', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'brennen', 2);
    state = applyStatus(state, 'p2', 'brennen', 2);
    expect(getStatus(state, 'p2', 'brennen')?.stacks).toBe(3);
  });

  it('overdoses High into Verpeilt', () => {
    let state = freshV3();
    state = applyStatus(state, 'p1', 'high', 3);
    state = applyStatus(state, 'p1', 'high', 1);
    expect(getStatus(state, 'p1', 'high')).toBeUndefined();
    expect(getStatus(state, 'p1', 'verpeilt')?.stacks).toBe(1);
  });
});

describe('applyElementImpulse', () => {
  it('skips when v3Combat is off', () => {
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      seed: 1,
      ruleset: DEFAULT_RULESET,
    });
    const result = applyElementImpulse(state, 'p2', 'fire', DEFAULT_RULESET);
    expect(result.kind).toBe('skipped');
    expect(state.players.p2.statuses).toEqual([]);
  });

  it('applies primary mark when target has no marks', () => {
    const state = freshV3();
    const result = applyElementImpulse(state, 'p2', 'fire', V3_RULESET);
    expect(result.kind).toBe('mark');
    if (result.kind !== 'mark') return;
    expect(result.markId).toBe(PRIMARY_MARK_BY_ELEMENT.fire);
    expect(getStatus(result.state, 'p2', 'brennen')?.stacks).toBe(1);
  });

  it('returns reaction candidates when a mark is present', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    const result = applyElementImpulse(state, 'p2', 'fire', V3_RULESET);
    expect(result.kind).toBe('reaction');
    if (result.kind !== 'reaction') return;
    expect(result.candidates.some((c) => c.markId === 'durchnaesst')).toBe(true);
    expect(getStatus(result.state, 'p2', 'brennen')).toBeUndefined();
    expect(getStatus(result.state, 'p2', 'durchnaesst')?.stacks).toBe(1);
  });

  it('maps all six elements to primary marks', () => {
    const elements = Object.keys(PRIMARY_MARK_BY_ELEMENT) as Array<
      keyof typeof PRIMARY_MARK_BY_ELEMENT
    >;
    for (const el of elements) {
      const state = freshV3();
      const result = applyElementImpulse(state, 'p1', el, V3_RULESET);
      expect(result.kind).toBe('mark');
      if (result.kind !== 'mark') continue;
      expect(result.markId).toBe(PRIMARY_MARK_BY_ELEMENT[el]);
    }
  });
});
