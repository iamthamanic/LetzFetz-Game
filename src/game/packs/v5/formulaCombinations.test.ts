/**
 * Tests for Formel combination catalog lookup.
 * Location: src/game/packs/v5/formulaCombinations.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  canonicalizeFormulaComponentName,
  findFormulaCombinationBySlots,
  listFormulaCombinations,
} from './formulaCombinations';

describe('formulaCombinations', () => {
  it('loads 744 combinations', () => {
    expect(listFormulaCombinations()).toHaveLength(744);
  });

  it('canonicalizes legacy component names', () => {
    expect(canonicalizeFormulaComponentName('Fintenschritt')).toBe('Fintenschnitt');
    expect(canonicalizeFormulaComponentName('Überladung')).toBe('Überspannung');
    expect(canonicalizeFormulaComponentName('Doppelecho')).toBe('Echo');
  });

  it('finds TE combo Impulsgeschoss + Wasser', () => {
    const hit = findFormulaCombinationBySlots({
      techniqueName: 'Impulsgeschoss',
      essenceName: 'Wasser',
    });
    expect(hit?.name).toBe('Schwarzwellenstoß');
    expect(hit?.effect).toMatch(/Formelschaden/);
  });

  it('finds unique TEK name for Fintenschnitt + Schatten + Überspannung', () => {
    const hit = findFormulaCombinationBySlots({
      techniqueName: 'Fintenschnitt',
      essenceName: 'Schatten',
      catalystName: 'Überspannung',
    });
    expect(hit?.id).toBe('F0336');
    expect(hit?.name).toBe('Klinge der Seelen');
    expect(hit?.name.includes(' – ')).toBe(false);
    expect(hit?.type).toBe('technique_essence_catalyst');
  });

  it('keeps approved Adrenalinschrei and Impulsgeschoss×Feuer names', () => {
    expect(
      findFormulaCombinationBySlots({
        techniqueName: 'Adrenalinschrei',
        essenceName: 'Schatten',
      })?.name,
    ).toBe('Höllengeflüster');
    expect(
      findFormulaCombinationBySlots({
        techniqueName: 'Impulsgeschoss',
        essenceName: 'Feuer',
      })?.name,
    ).toBe('Branddorn');
    expect(
      findFormulaCombinationBySlots({
        techniqueName: 'Impulsgeschoss',
        essenceName: 'Feuer',
        catalystName: 'Echo',
      })?.name,
    ).toBe('Zwillingsfunke');
  });
});
