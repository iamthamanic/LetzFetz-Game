/**
 * V6 Slice 0 — ruleset identity + mutual exclusion (INTERNAL).
 * Location: src/game/engine/v6RulesetIdentity.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_RULESET,
  V5_RULESET,
  V6_RULESET,
  assertExclusiveFormulaRuleset,
  isV5FormulaEnabled,
  isV6FormulaEnabled,
  matchRulesetIdentityFrom,
  maxFetzChargeFor,
} from '../types';
import { BASE_PACK } from '../packs/base-pack';
import { createGame } from './createGame';
import { rulesetFromState } from './rulesetFromState';

describe('V6 ruleset identity (INTERNAL)', () => {
  it('exposes V6_RULESET with v6Formula and no v5Formula', () => {
    expect(isV6FormulaEnabled(V6_RULESET)).toBe(true);
    expect(isV5FormulaEnabled(V6_RULESET)).toBe(false);
    expect(V6_RULESET.v3Combat).toBe(true);
    expect(maxFetzChargeFor(V6_RULESET)).toBe(3);
    expect(matchRulesetIdentityFrom(V6_RULESET)).toEqual({
      v3Combat: true,
      v5Formula: false,
      v6Formula: true,
    });
  });

  it('keeps V5_RULESET unchanged (no v6Formula)', () => {
    expect(isV5FormulaEnabled(V5_RULESET)).toBe(true);
    expect(isV6FormulaEnabled(V5_RULESET)).toBe(false);
    expect(isV6FormulaEnabled(DEFAULT_RULESET)).toBe(false);
  });

  it('rejects mixed v5Formula + v6Formula on RulesetConfig', () => {
    expect(() =>
      assertExclusiveFormulaRuleset({
        ...DEFAULT_RULESET,
        v5Formula: true,
        v6Formula: true,
      }),
    ).toThrow(/RULESET_MIX/);
  });

  it('createGame with V6_RULESET sets meta.v6FormulaEnabled only', () => {
    const chars = BASE_PACK.characters;
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: chars[0].id,
      p2CharacterId: chars[1]?.id ?? chars[0].id,
      ruleset: V6_RULESET,
      seed: 42,
    });
    expect(state.meta.v6FormulaEnabled).toBe(true);
    expect(state.meta.v5FormulaEnabled).toBeUndefined();
    const rs = rulesetFromState(state);
    expect(isV6FormulaEnabled(rs)).toBe(true);
    expect(isV5FormulaEnabled(rs)).toBe(false);
  });

  it('createGame with V5_RULESET does not set v6FormulaEnabled', () => {
    const chars = BASE_PACK.characters;
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: chars[0].id,
      p2CharacterId: chars[1]?.id ?? chars[0].id,
      ruleset: V5_RULESET,
      seed: 42,
    });
    expect(state.meta.v5FormulaEnabled).toBe(true);
    expect(state.meta.v6FormulaEnabled).toBeUndefined();
  });

  it('createGame throws on mixed formula flags', () => {
    const chars = BASE_PACK.characters;
    expect(() =>
      createGame({
        pack: BASE_PACK,
        p1CharacterId: chars[0].id,
        p2CharacterId: chars[1]?.id ?? chars[0].id,
        ruleset: { ...V5_RULESET, v6Formula: true },
        seed: 1,
      }),
    ).toThrow(/RULESET_MIX/);
  });

  it('rulesetFromState throws when both meta formula flags are set', () => {
    const chars = BASE_PACK.characters;
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: chars[0].id,
      p2CharacterId: chars[1]?.id ?? chars[0].id,
      ruleset: V5_RULESET,
      seed: 7,
    });
    state.meta.v6FormulaEnabled = true;
    expect(() => rulesetFromState(state)).toThrow(/RULESET_MIX/);
  });
});
