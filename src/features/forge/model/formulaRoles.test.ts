import { describe, it, expect } from 'vitest';
import {
  cardMatchesFormulaRoleFilter,
  formulaRoleFromCard,
  isKombinationForgeCard,
} from './formulaRoles';
import type { ForgeCardData } from './types';

const sampleTechnik: ForgeCardData = {
  id: 'v5-technik-durchschuss',
  name: 'Durchschuss',
  type: 'Formula',
  element: 'Neutral',
  stats_json: {},
  effects: ['Rolle: Technik', 'Effekt: Test'],
  image_asset: '',
};

const sampleKombi: ForgeCardData = {
  id: 'kombi-1',
  name: 'Test-Kombi',
  type: 'Formula',
  element: 'Neutral',
  stats_json: {},
  effects: ['Rolle: Kombination', 'Quelle: Combinate'],
  image_asset: 'data:image/png;base64,abc',
};

describe('formulaRoles', () => {
  it('extracts role from effects', () => {
    expect(formulaRoleFromCard(sampleTechnik)).toBe('Technik');
    expect(isKombinationForgeCard(sampleKombi)).toBe(true);
    expect(isKombinationForgeCard(sampleTechnik)).toBe(false);
  });

  it('filters cards by role', () => {
    expect(cardMatchesFormulaRoleFilter(sampleTechnik, 'Technik')).toBe(true);
    expect(cardMatchesFormulaRoleFilter(sampleTechnik, 'Essenz')).toBe(false);
    expect(cardMatchesFormulaRoleFilter(sampleTechnik, 'All')).toBe(true);
    expect(cardMatchesFormulaRoleFilter(sampleTechnik, 'Kombination')).toBe(false);
    expect(cardMatchesFormulaRoleFilter(sampleKombi, 'Kombination')).toBe(true);
    expect(cardMatchesFormulaRoleFilter(sampleKombi, 'Technik')).toBe(false);
  });
});
