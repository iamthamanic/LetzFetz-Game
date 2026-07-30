/**
 * Engine smoke: mono Inferno + mixed Dampf under V3 (acceptance companion).
 * Location: src/game/engine/status/v3E2eSmoke.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { BASE_PACK } from '../../packs/base-pack';
import { V3_RULESET } from '../../types';
import { applyStatus, getStatus } from './applyStatus';
import { resolveImpulseReactions } from './reactionChoice';
import { rulesetFromState } from '../rulesetFromState';

function freshV3() {
  return createGame({
    pack: BASE_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed: 113,
    ruleset: V3_RULESET,
  });
}

describe('V3 E2E engine smoke', () => {
  it('persists v3CombatEnabled on createGame + rulesetFromState', () => {
    const state = freshV3();
    expect(state.meta.v3CombatEnabled).toBe(true);
    expect(rulesetFromState(state).v3Combat).toBe(true);
  });

  it('mono Überhitzt smoke', () => {
    let state = freshV3();
    const hp = state.players.p2.hp;
    state = applyStatus(state, 'p2', 'brennen', 2);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'brennen')?.stacks).toBe(1);
    expect(state.players.p2.hp).toBe(hp - 1);
  });

  it('mixed Dampf smoke', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'nebel')).toBeTruthy();
  });
});
