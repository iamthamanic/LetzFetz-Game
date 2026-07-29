/**
 * Unit tests for Play setup pack → ruleset mapping.
 * Location: src/features/play/setup/resolveGamePackChoice.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  BASE_PACK,
  V2_P100_PACK,
  P100_RULESET,
  V3_RULESET,
  V5_PACK,
  V5_PACK_RULESET,
} from '../../../game';
import { resolveGamePackChoice } from './resolveGamePackChoice';

describe('resolveGamePackChoice', () => {
  it('maps v5 to V5_PACK + V5_PACK_RULESET as playtest default', () => {
    const resolved = resolveGamePackChoice('v5');
    expect(resolved.pack).toBe(V5_PACK);
    expect(resolved.ruleset).toBe(V5_PACK_RULESET);
    expect(resolved.ruleset?.v5Formula).toBe(true);
    expect(resolved.ruleset?.startingHp).toBe(20);
    expect(resolved.playtestHpCap).toBe(20);
  });

  it('maps base to BASE_PACK without custom ruleset', () => {
    expect(resolveGamePackChoice('base')).toEqual({
      pack: BASE_PACK,
      ruleset: undefined,
      playtestHpCap: undefined,
    });
  });

  it('maps p100 to V2_P100_PACK + P100_RULESET', () => {
    expect(resolveGamePackChoice('p100')).toEqual({
      pack: V2_P100_PACK,
      ruleset: P100_RULESET,
      playtestHpCap: 30,
    });
  });

  it('maps v3 to BASE_PACK + V3_RULESET (rules-on-base)', () => {
    const resolved = resolveGamePackChoice('v3');
    expect(resolved.pack).toBe(BASE_PACK);
    expect(resolved.ruleset).toBe(V3_RULESET);
    expect(resolved.ruleset?.v3Combat).toBe(true);
    expect(resolved.ruleset?.startingHp).toBe(20);
    expect(resolved.playtestHpCap).toBeUndefined();
  });
});
