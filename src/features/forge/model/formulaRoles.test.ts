import { describe, it, expect } from 'vitest';
import {
  cardMatchesFormulaRoleFilter,
  formulaRoleFromCard,
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

describe('formulaRoles', () => {
  it('extracts role from effects', () => {
    expect(formulaRoleFromCard(sampleTechnik)).toBe('Technik');
  });

  it('filters cards by role', () => {
    expect(cardMatchesFormulaRoleFilter(sampleTechnik, 'Technik')).toBe(true);
    expect(cardMatchesFormulaRoleFilter(sampleTechnik, 'Essenz')).toBe(false);
    expect(cardMatchesFormulaRoleFilter(sampleTechnik, 'All')).toBe(true);
    expect(cardMatchesFormulaRoleFilter(sampleTechnik, 'Kombination')).toBe(false);
  });
});
