/**
 * Unit tests for Combinate formula helpers.
 * Location: src/features/build/model/combinateFormula.test.ts
 */
import { describe, expect, it } from 'vitest';
import { buildCombinationLabel, countFilledSlots } from './combinateFormula';

describe('combinateFormula helpers', () => {
  it('returns null for 0–1 filled slots', () => {
    expect(
      buildCombinationLabel({ technik: null, essenz: null, katalysator: null }),
    ).toBeNull();
    expect(
      buildCombinationLabel({
        technik: 'v5-technik-durchschuss',
        essenz: null,
        katalysator: null,
      }),
    ).toBeNull();
  });

  it('lists only filled roles in combination label', () => {
    expect(
      buildCombinationLabel({
        technik: 'a',
        essenz: 'b',
        katalysator: null,
      }),
    ).toBe('Kombination aus Technik Essenz');
    expect(
      buildCombinationLabel({
        technik: null,
        essenz: 'b',
        katalysator: 'c',
      }),
    ).toBe('Kombination aus Essenz Katalysator');
    expect(
      buildCombinationLabel({
        technik: 'a',
        essenz: 'b',
        katalysator: 'c',
      }),
    ).toBe('Kombination aus Technik Essenz Katalysator');
  });

  it('counts filled slots', () => {
    expect(
      countFilledSlots({ technik: 'a', essenz: null, katalysator: 'c' }),
    ).toBe(2);
  });
});
