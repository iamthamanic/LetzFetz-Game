/**
 * Unit tests for Combinate formula helpers.
 * Location: src/features/build/model/combinateFormula.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  buildCombinationLabel,
  countFilledSlots,
  shouldReplaceCombinationName,
  type FormulaCatalogCard,
} from './combinateFormula';
import { buildSuggestedCombinationName } from './combinateNameSuggest';

const catalog: FormulaCatalogCard[] = [
  {
    id: 't1',
    name: 'Durchschuss',
    role: 'technik',
    imageUrl: '',
    element: null,
    stability: 1,
    effectText: '',
    activationMode: 'instant',
  },
  {
    id: 'e1',
    name: 'Betonkern',
    role: 'essenz',
    imageUrl: '',
    element: 'earth',
    stability: 1,
    effectText: '',
    activationMode: null,
  },
  {
    id: 'k1',
    name: 'Sofortzünder',
    role: 'katalysator',
    imageUrl: '',
    element: null,
    stability: 1,
    effectText: '',
    activationMode: null,
  },
];

describe('combinateFormula helpers', () => {
  it('returns null for 0–1 filled slots', () => {
    expect(
      buildCombinationLabel({ technik: null, essenz: null, katalysator: null }),
    ).toBeNull();
    expect(
      buildCombinationLabel({
        technik: 'v5-technik-impulsgeschoss',
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
    ).toBe('Kombination aus Technik + Essenz');
    expect(
      buildCombinationLabel({
        technik: null,
        essenz: 'b',
        katalysator: 'c',
      }),
    ).toBe('Kombination aus Essenz + Katalysator');
    expect(
      buildCombinationLabel({
        technik: 'a',
        essenz: 'b',
        katalysator: 'c',
      }),
    ).toBe('Kombination aus Technik + Essenz + Katalysator');
  });
  it('counts filled slots', () => {
    expect(
      countFilledSlots({ technik: 'a', essenz: null, katalysator: 'c' }),
    ).toBe(2);
  });

  it('suggests a crafted name from cards + effects', () => {
    const two = buildSuggestedCombinationName(
      { technik: null, essenz: 'e1', katalysator: 'k1' },
      catalog,
    );
    expect(two).toBeTruthy();
    expect(two).not.toBe('Betonkern · Sofortzünder');

    const three = buildSuggestedCombinationName(
      { technik: 't1', essenz: 'e1', katalysator: 'k1' },
      catalog,
    );
    expect(three).toBeTruthy();
    expect(three).not.toBe('Durchschuss · Betonkern · Sofortzünder');

    expect(
      buildSuggestedCombinationName(
        { technik: 't1', essenz: null, katalysator: null },
        catalog,
      ),
    ).toBeNull();
  });

  it('only auto-replaces default or previous suggestion', () => {
    expect(shouldReplaceCombinationName('Meine Formel', null)).toBe(true);
    expect(shouldReplaceCombinationName('', 'Betonkern · Sofortzünder')).toBe(true);
    expect(
      shouldReplaceCombinationName('Betonkern · Sofortzünder', 'Betonkern · Sofortzünder'),
    ).toBe(true);
    expect(shouldReplaceCombinationName('Mein Custom', 'Betonkern · Sofortzünder')).toBe(
      false,
    );
  });
});
