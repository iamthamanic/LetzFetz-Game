/**
 * Location: src/content/v6/validateFormulaAuthoring.test.ts
 */
import { describe, expect, it } from 'vitest';
import { V6_FORMULA_AUTHORING_SLICE1 } from './formulaAuthoring.slice1';
import { EMPTY_V6_FORMULA_AUTHORING } from './schemas/formulaRecipeAuthoring';
import {
  assertV6FormulaAuthoring,
  validateV6FormulaAuthoring,
  validateV6Slice1Completeness,
} from './validateFormulaAuthoring';

describe('validateV6FormulaAuthoring', () => {
  it('accepts Slice-1 catalog structurally', () => {
    expect(validateV6FormulaAuthoring(V6_FORMULA_AUTHORING_SLICE1)).toEqual([]);
    expect(() => assertV6FormulaAuthoring(V6_FORMULA_AUTHORING_SLICE1)).not.toThrow();
  });

  it('rejects empty catalog under Slice-1 completeness gate', () => {
    expect(validateV6FormulaAuthoring(EMPTY_V6_FORMULA_AUTHORING)).toEqual([]);
    expect(validateV6Slice1Completeness(EMPTY_V6_FORMULA_AUTHORING).length).toBeGreaterThan(0);
    expect(() => assertV6FormulaAuthoring(EMPTY_V6_FORMULA_AUTHORING)).toThrow(
      /V6_SLICE1_INCOMPLETE/,
    );
  });

  it('fails closed when required keys are missing', () => {
    const errors = validateV6FormulaAuthoring({
      version: 1,
      slice: 'slice1',
      teBases: [{ techniqueId: 't1', essenceId: 'e1' }],
      tkBases: [],
      ekBases: [],
      catalystTransforms: [],
    });
    expect(errors.some((e) => e.includes('recipeId'))).toBe(true);
    expect(() =>
      assertV6FormulaAuthoring({
        version: 1,
        slice: 'slice1',
        teBases: [{ techniqueId: 't1', essenceId: 'e1' }],
        tkBases: [],
        ekBases: [],
        catalystTransforms: [],
      }),
    ).toThrow(/V6_AUTHORING_INVALID/);
  });

  it('covers full Slice-1 TE/TK/EK matrix + 10 catalyst transforms (6 supported / 4 unsupported matrix)', () => {
    expect(V6_FORMULA_AUTHORING_SLICE1.teBases).toHaveLength(60);
    expect(V6_FORMULA_AUTHORING_SLICE1.tkBases).toHaveLength(100);
    expect(V6_FORMULA_AUTHORING_SLICE1.ekBases).toHaveLength(60);
    expect(V6_FORMULA_AUTHORING_SLICE1.catalystTransforms).toHaveLength(10);
    expect(
      V6_FORMULA_AUTHORING_SLICE1.catalystTransforms.filter((t) => t.availability === 'supported'),
    ).toHaveLength(6);
    expect(
      V6_FORMULA_AUTHORING_SLICE1.catalystTransforms.filter((t) => t.availability === 'unsupported'),
    ).toHaveLength(4);
    expect(validateV6Slice1Completeness(V6_FORMULA_AUTHORING_SLICE1)).toEqual([]);
  });

  it('rejects stub placeholders and TK/EK machine labels in copy', () => {
    const bad = {
      ...V6_FORMULA_AUTHORING_SLICE1,
      tkBases: [
        {
          ...V6_FORMULA_AUTHORING_SLICE1.tkBases[0],
          name: 'TK impulsgeschoss+ueberladung',
        },
      ],
      catalystTransforms: [
        {
          ...V6_FORMULA_AUTHORING_SLICE1.catalystTransforms[0],
          summary: 'Primär +2 (Slice-1 stub).',
        },
      ],
    };
    const errors = validateV6FormulaAuthoring(bad);
    expect(errors.some((e) => e.includes('German display name'))).toBe(true);
    expect(errors.some((e) => e.includes('stub placeholders'))).toBe(true);
  });

  it('ships standalone German TK/EK names without stub rider copy', () => {
    for (const row of V6_FORMULA_AUTHORING_SLICE1.tkBases) {
      expect(row.name).not.toMatch(/^TK /);
      expect(row.name).not.toContain('·');
      expect(row.name.length).toBeGreaterThan(3);
    }
    for (const row of V6_FORMULA_AUTHORING_SLICE1.ekBases) {
      expect(row.name).not.toMatch(/^EK /);
      expect(row.name).not.toContain('·');
      expect(row.name.length).toBeGreaterThan(3);
    }
    const wasser = V6_FORMULA_AUTHORING_SLICE1.teBases.find(
      (r) => r.essenceId === 'v6-essenz-wasser',
    );
    expect(wasser?.rider?.summary).toBeDefined();
    expect(wasser?.rider?.summary).not.toMatch(/stub/i);
  });

  it('rejects TK/EK · compound labels', () => {
    const bad = {
      ...V6_FORMULA_AUTHORING_SLICE1,
      tkBases: [
        {
          ...V6_FORMULA_AUTHORING_SLICE1.tkBases[0],
          name: 'Impuls · Überladung',
        },
      ],
    };
    const errors = validateV6FormulaAuthoring(bad);
    expect(errors.some((e) => e.includes('standalone German name'))).toBe(true);
  });
});
