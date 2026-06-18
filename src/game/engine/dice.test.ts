import { describe, it, expect } from 'vitest';
import { diceBonusFromRoll, modifyDieRoll } from '../engine/dice';
import { DEFAULT_RULESET } from '../types';

describe('diceBonusFromRoll', () => {
  it('returns 0 for rolls 1-2', () => {
    expect(diceBonusFromRoll(1, DEFAULT_RULESET)).toBe(0);
    expect(diceBonusFromRoll(2, DEFAULT_RULESET)).toBe(0);
  });

  it('returns 1 for rolls 3-4', () => {
    expect(diceBonusFromRoll(3, DEFAULT_RULESET)).toBe(1);
    expect(diceBonusFromRoll(4, DEFAULT_RULESET)).toBe(1);
  });

  it('returns 2 for rolls 5-6', () => {
    expect(diceBonusFromRoll(5, DEFAULT_RULESET)).toBe(2);
    expect(diceBonusFromRoll(6, DEFAULT_RULESET)).toBe(2);
  });

  it('clamps out-of-range rolls', () => {
    expect(diceBonusFromRoll(0, DEFAULT_RULESET)).toBe(0);
    expect(diceBonusFromRoll(9, DEFAULT_RULESET)).toBe(2);
  });
});

describe('modifyDieRoll', () => {
  it('adds delta and caps at 6', () => {
    expect(modifyDieRoll(4, 1)).toBe(5);
    expect(modifyDieRoll(6, 1)).toBe(6);
  });
});
