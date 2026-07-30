/**
 * Unit tests for Combinate name suggestion (craft + stems).
 * Location: src/features/build/model/combinateNameSuggest.test.ts
 */
import { describe, expect, it } from 'vitest';
import type { FormulaCatalogCard } from './combinateFormula';
import {
  buildSuggestedCombinationName,
  extractEffectThemes,
  extractNameStems,
} from './combinateNameSuggest';

const catalog: FormulaCatalogCard[] = [
  {
    id: 't-hilfe',
    name: 'Erste-Hilfe-Ritual',
    role: 'technik',
    imageUrl: '',
    element: null,
    stability: 2,
    effectText: 'Heile 1.',
    activationMode: 'instant',
  },
  {
    id: 'e-luft',
    name: 'Druckluftkonzentrat',
    role: 'essenz',
    imageUrl: '',
    element: 'air',
    stability: 3,
    effectText:
      'Der nächste zugehörige Angriff oder Block erhält +1 auf seinen W6-Bonus, maximal +2.',
    activationMode: null,
  },
  {
    id: 't-schuss',
    name: 'Durchschuss',
    role: 'technik',
    imageUrl: '',
    element: null,
    stability: 3,
    effectText: 'Der nächste Angriff ignoriert 1 Schild.',
    activationMode: 'prep_attack',
  },
  {
    id: 'e-beton',
    name: 'Betonkern',
    role: 'essenz',
    imageUrl: '',
    element: 'earth',
    stability: 2,
    effectText: 'Der nächste Angriff erhält +1.',
    activationMode: null,
  },
  {
    id: 'k-zuender',
    name: 'Sofortzünder',
    role: 'katalysator',
    imageUrl: '',
    element: null,
    stability: 1,
    effectText: 'Wirke die Formel sofort.',
    activationMode: null,
  },
];

describe('combinateNameSuggest', () => {
  it('extracts stems without filler words/suffixes', () => {
    expect(extractNameStems('Erste-Hilfe-Ritual')).toEqual(['Hilfe', 'Ritual']);
    expect(extractNameStems('Druckluftkonzentrat')).toEqual(['Druckluft']);
  });

  it('detects effect themes', () => {
    expect(extractEffectThemes('Heile 1.')).toContain('Heil');
    expect(extractEffectThemes('erhält +1 auf seinen W6-Bonus')).toContain('Würfel');
  });

  it('returns null for fewer than 2 slots', () => {
    expect(
      buildSuggestedCombinationName(
        { technik: 't-hilfe', essenz: null, katalysator: null },
        catalog,
      ),
    ).toBeNull();
  });

  it('crafts a blended name instead of joining card titles', () => {
    const name = buildSuggestedCombinationName(
      { technik: 't-hilfe', essenz: 'e-luft', katalysator: null },
      catalog,
    );
    expect(name).toBe('Lufthilfe');
  });

  it('includes katalysator twist when present', () => {
    const name = buildSuggestedCombinationName(
      { technik: 't-schuss', essenz: 'e-beton', katalysator: 'k-zuender' },
      catalog,
    );
    expect(name).toBeTruthy();
    expect(name?.toLowerCase()).toMatch(/zünder|zuender|beton|luft|schlag|durchschuss/);
    expect(name).not.toBe('Durchschuss · Betonkern · Sofortzünder');
  });
});
