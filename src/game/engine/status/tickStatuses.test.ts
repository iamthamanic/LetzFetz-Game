/**
 * Tests for V3 status ticks + §18 conflicts (#106).
 * Location: src/game/engine/status/tickStatuses.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { BASE_PACK } from '../../packs/base-pack';
import { V3_RULESET } from '../../types';
import { applyStatus, getStatus } from './applyStatus';
import {
  canManipulateDice,
  consumeNebelIfPresent,
  consumeVerpeiltIfPresent,
  tickBrennenAfterMainAction,
  tickStatusesEndOfTurn,
  tryConsumeFokusReroll,
} from './tickStatuses';

function freshV3() {
  return createGame({
    pack: BASE_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed: 33,
    ruleset: V3_RULESET,
  });
}

describe('status ticks', () => {
  it('Brennen after main action: 1 damage and −1 stack', () => {
    let state = freshV3();
    const hp = state.players.p1.hp;
    state = applyStatus(state, 'p1', 'brennen', 2);
    state = tickBrennenAfterMainAction(state, 'p1', V3_RULESET);
    expect(state.players.p1.hp).toBe(hp - 1);
    expect(getStatus(state, 'p1', 'brennen')?.stacks).toBe(1);
  });

  it('Gift EOT: damage equal to stacks then −1', () => {
    let state = freshV3();
    const hp = state.players.p1.hp;
    state = applyStatus(state, 'p1', 'gift', 3);
    state = tickStatusesEndOfTurn(state, 'p1', V3_RULESET);
    expect(state.players.p1.hp).toBe(hp - 3);
    expect(getStatus(state, 'p1', 'gift')?.stacks).toBe(2);
  });
});

describe('§18 conflicts', () => {
  it('Geblendet blocks Fokus reroll; Fokus remains', () => {
    let state = freshV3();
    state = applyStatus(state, 'p1', 'geblendet', 1);
    state = applyStatus(state, 'p1', 'fokus', 1);
    expect(canManipulateDice(state, 'p1')).toBe(false);
    const result = tryConsumeFokusReroll(state, 'p1');
    expect(result.granted).toBe(false);
    expect(getStatus(result.state, 'p1', 'fokus')).toBeTruthy();
  });

  it('Nebel consumes and flags ignore element+secondary', () => {
    let state = freshV3();
    state = applyStatus(state, 'p1', 'nebel', 1);
    const result = consumeNebelIfPresent(state, 'p1');
    expect(result.ignoreElementAndSecondary).toBe(true);
    expect(getStatus(result.state, 'p1', 'nebel')).toBeUndefined();
  });

  it('Verpeilt consumes and flags ignore secondary only', () => {
    let state = freshV3();
    state = applyStatus(state, 'p1', 'verpeilt', 1);
    const result = consumeVerpeiltIfPresent(state, 'p1');
    expect(result.ignoreSecondary).toBe(true);
    expect(getStatus(result.state, 'p1', 'verpeilt')).toBeUndefined();
  });
});
