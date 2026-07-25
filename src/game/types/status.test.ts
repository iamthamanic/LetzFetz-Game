/**
 * Unit tests for V3 status / shield types and createGame init (#100).
 * Location: src/game/types/status.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../engine/createGame';
import { BASE_PACK } from '../packs/base-pack';
import {
  DEFAULT_RULESET,
  MAX_SHIELD,
  STATUS_STACK_LIMIT,
  V3_RULESET,
  clampShield,
  clampStatusStacks,
  isStatusId,
  isV3CombatEnabled,
} from './index';

describe('V3 status model', () => {
  it('clamps shield to 0..5', () => {
    expect(clampShield(-1)).toBe(0);
    expect(clampShield(3)).toBe(3);
    expect(clampShield(99)).toBe(MAX_SHIELD);
  });

  it('clamps status stacks to documented limits', () => {
    expect(clampStatusStacks('brennen', 0)).toBe(1);
    expect(clampStatusStacks('brennen', 9)).toBe(STATUS_STACK_LIMIT.brennen);
    expect(clampStatusStacks('durchnaesst', 4)).toBe(1);
    expect(clampStatusStacks('high', 3)).toBe(3);
  });

  it('narrows unknown status ids', () => {
    expect(isStatusId('brennen')).toBe(true);
    expect(isStatusId('not-a-status')).toBe(false);
    expect(isStatusId(1)).toBe(false);
  });

  it('keeps v3Combat off by default', () => {
    expect(isV3CombatEnabled(DEFAULT_RULESET)).toBe(false);
    expect(isV3CombatEnabled(V3_RULESET)).toBe(true);
  });
});

describe('createGame V3 fields', () => {
  it('initializes empty statuses and zero shield', () => {
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 7,
    });
    expect(state.players.p1.statuses).toEqual([]);
    expect(state.players.p2.statuses).toEqual([]);
    expect(state.players.p1.shield).toBe(0);
    expect(state.players.p2.shield).toBe(0);
  });

  it('accepts V3_RULESET without changing opening hands', () => {
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 7,
      ruleset: V3_RULESET,
    });
    expect(state.players.p1.hand).toHaveLength(DEFAULT_RULESET.p1StartingHand);
    expect(state.players.p1.statuses).toEqual([]);
  });
});
