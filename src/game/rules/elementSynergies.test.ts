/**
 * Unit tests for rulebook §11 element synergy table.
 * Location: src/game/rules/elementSynergies.test.ts
 */
import { describe, expect, it } from 'vitest';
import { ELEMENT_SYNERGIES, getElementSynergy } from './elementSynergies';

describe('elementSynergies', () => {
  it('defines 2- and 3-card texts for every element', () => {
    const elements = Object.keys(ELEMENT_SYNERGIES);
    expect(elements).toHaveLength(6);
    for (const el of elements) {
      const row = getElementSynergy(el as keyof typeof ELEMENT_SYNERGIES);
      expect(row.at2.length).toBeGreaterThan(8);
      expect(row.at3.length).toBeGreaterThan(8);
    }
  });

  it('matches fire synergy thresholds from rulebook §11', () => {
    const fire = getElementSynergy('fire');
    expect(fire.at2).toMatch(/Angriffswurf/i);
    expect(fire.at3).toMatch(/5–6|5-6/);
  });
});
