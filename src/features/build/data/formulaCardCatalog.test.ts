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
  it('exports 9+6+10 V5 formula Bausteine', () => {
    resetFormulaCardCatalogCache();
    const catalog = loadFormulaCardCatalog();
    expect(catalog).toHaveLength(25);
    expect(catalog.filter((c) => c.role === 'technik')).toHaveLength(9);
    expect(catalog.filter((c) => c.role === 'essenz')).toHaveLength(6);
    expect(catalog.filter((c) => c.role === 'katalysator')).toHaveLength(10);
  });

  it('assigns card art paths under /cards/formula/', () => {
    resetFormulaCardCatalogCache();
    const impuls = loadFormulaCardCatalog().find(
      (c) => c.id === 'v5-technik-impulsgeschoss',
    );
    expect(impuls?.name).toBe('Impulsgeschoss');
    expect(impuls?.imageUrl).toBe('/cards/formula/impulsgeschoss.png');
  });

  it('carries element on Essenz cards only', () => {
    resetFormulaCardCatalogCache();
    const essenz = loadFormulaCardCatalog().find((c) => c.role === 'essenz');
    expect(essenz?.element).toBeTruthy();
    const technik = loadFormulaCardCatalog().find((c) => c.role === 'technik');
    expect(technik?.element).toBeNull();
  });
});
