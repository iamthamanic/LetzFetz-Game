/**
 * Unit tests for V5 formula Combinate catalog.
 * Location: src/features/build/data/formulaCardCatalog.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  loadFormulaCardCatalog,
  resetFormulaCardCatalogCache,
} from './formulaCardCatalog';

describe('formulaCardCatalog', () => {
  it('exports 12+12+12 V5 formula Bausteine', () => {
    resetFormulaCardCatalogCache();
    const catalog = loadFormulaCardCatalog();
    expect(catalog).toHaveLength(36);
    expect(catalog.filter((c) => c.role === 'technik')).toHaveLength(12);
    expect(catalog.filter((c) => c.role === 'essenz')).toHaveLength(12);
    expect(catalog.filter((c) => c.role === 'katalysator')).toHaveLength(12);
  });

  it('assigns card art paths under /cards/formula/', () => {
    resetFormulaCardCatalogCache();
    const durchschuss = loadFormulaCardCatalog().find(
      (c) => c.id === 'v5-technik-durchschuss',
    );
    expect(durchschuss?.imageUrl).toBe('/cards/formula/durchschuss.png');
  });

  it('carries element on Essenz cards only', () => {
    resetFormulaCardCatalogCache();
    const essenz = loadFormulaCardCatalog().find((c) => c.role === 'essenz');
    expect(essenz?.element).toBeTruthy();
    const technik = loadFormulaCardCatalog().find((c) => c.role === 'technik');
    expect(technik?.element).toBeNull();
  });
});
