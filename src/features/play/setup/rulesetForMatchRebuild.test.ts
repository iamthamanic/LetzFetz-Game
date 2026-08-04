/**
 * rulesetForMatchRebuild — V6 must win over V3 when both meta flags are set.
 * Location: src/features/play/setup/rulesetForMatchRebuild.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  BASE_PACK,
  V5_PACK,
  V5_PACK_RULESET,
  V6_CORE_PACK,
  V6_PACK_RULESET,
  V3_RULESET,
  createGame,
  createEmptyMeta,
} from '../../../game';
import { rulesetForMatchRebuild } from './rulesetForMatchRebuild';

describe('rulesetForMatchRebuild', () => {
  it('prefers V6 when v6FormulaEnabled and v3CombatEnabled are both set', () => {
    const state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1].id,
      ruleset: V6_PACK_RULESET,
      seed: 1,
    });
    expect(state.meta.v6FormulaEnabled).toBe(true);
    expect(state.meta.v3CombatEnabled).toBe(true);

    const ruleset = rulesetForMatchRebuild(state, V6_CORE_PACK);
    expect(ruleset?.v6Formula).toBe(true);
    expect(ruleset?.v5Formula).toBe(false);
  });

  it('keeps V5 when only v5FormulaEnabled', () => {
    const state = createGame({
      pack: V5_PACK,
      p1CharacterId: V5_PACK.characters[0].id,
      p2CharacterId: V5_PACK.characters[1]?.id ?? V5_PACK.characters[0].id,
      ruleset: V5_PACK_RULESET,
      seed: 2,
    });
    const ruleset = rulesetForMatchRebuild(state, V5_PACK);
    expect(ruleset).toBe(V5_PACK_RULESET);
  });

  it('keeps V3 when only v3CombatEnabled (no formula flags)', () => {
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: BASE_PACK.characters[0].id,
      p2CharacterId: BASE_PACK.characters[1]?.id ?? BASE_PACK.characters[0].id,
      ruleset: V3_RULESET,
      seed: 3,
    });
    expect(state.meta.v6FormulaEnabled).toBeUndefined();
    expect(state.meta.v5FormulaEnabled).toBeUndefined();
    expect(state.meta.v3CombatEnabled).toBe(true);

    const ruleset = rulesetForMatchRebuild(state, BASE_PACK);
    expect(ruleset).toBe(V3_RULESET);
  });

  it('returns undefined for plain V1 base', () => {
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: BASE_PACK.characters[0].id,
      p2CharacterId: BASE_PACK.characters[1]?.id ?? BASE_PACK.characters[0].id,
      seed: 4,
    });
    expect(rulesetForMatchRebuild(state, BASE_PACK)).toBeUndefined();
  });

  it('does not treat a forged v3-only meta as V6', () => {
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: BASE_PACK.characters[0].id,
      p2CharacterId: BASE_PACK.characters[1]?.id ?? BASE_PACK.characters[0].id,
      seed: 5,
    });
    state.meta = { ...createEmptyMeta(), v3CombatEnabled: true };
    expect(rulesetForMatchRebuild(state, BASE_PACK)).toBe(V3_RULESET);
  });
});
