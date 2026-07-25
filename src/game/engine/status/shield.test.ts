/**
 * Tests for V3 damage/shield pipeline (#102).
 * Location: src/game/engine/status/shield.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { BASE_PACK } from '../../packs/base-pack';
import { DEFAULT_RULESET, V3_RULESET } from '../../types';
import { setShield } from './applyStatus';
import { applyDamageThroughShield, isCombatFullBlock, isCombatHit } from './shield';
import { getStatus } from './applyStatus';
import { applyElementImpulse } from './elementImpulse';

function freshV3() {
  return createGame({
    pack: BASE_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed: 3,
    ruleset: V3_RULESET,
  });
}

describe('applyDamageThroughShield', () => {
  it('absorbs damage into shield before HP under V3', () => {
    let state = freshV3();
    state = setShield(state, 'p2', 3);
    const result = applyDamageThroughShield(state, 'p2', 5, V3_RULESET);
    expect(result.shieldAbsorbed).toBe(3);
    expect(result.hpDamage).toBe(2);
    expect(result.state.players.p2.shield).toBe(0);
    expect(result.state.players.p2.hp).toBe(18);
    expect(result.isHit).toBe(true);
    expect(result.isFullBlock).toBe(false);
  });

  it('keeps Treffer when shield absorbs all post-block damage', () => {
    let state = freshV3();
    state = setShield(state, 'p2', 5);
    const result = applyDamageThroughShield(state, 'p2', 4, V3_RULESET);
    expect(result.hpDamage).toBe(0);
    expect(result.isHit).toBe(true);
    expect(result.isFullBlock).toBe(false);
  });

  it('does not use shield under V1 defaults', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      seed: 2,
      ruleset: DEFAULT_RULESET,
    });
    state = setShield(state, 'p2', 5);
    const result = applyDamageThroughShield(state, 'p2', 4, DEFAULT_RULESET);
    expect(result.shieldAbsorbed).toBe(0);
    expect(result.hpDamage).toBe(4);
    expect(result.state.players.p2.shield).toBe(5);
  });

  it('classifies hit vs full block from post-block damage', () => {
    expect(isCombatHit(1)).toBe(true);
    expect(isCombatFullBlock(0)).toBe(true);
  });

  it('allows hit impulse after partial shield absorb', () => {
    let state = freshV3();
    state = setShield(state, 'p2', 2);
    const pipeline = applyDamageThroughShield(state, 'p2', 3, V3_RULESET);
    expect(pipeline.isHit).toBe(true);
    const impulse = applyElementImpulse(pipeline.state, 'p2', 'fire', V3_RULESET);
    expect(impulse.kind).toBe('mark');
    if (impulse.kind === 'mark') {
      expect(getStatus(impulse.state, 'p2', 'brennen')?.stacks).toBe(1);
    }
  });
});
