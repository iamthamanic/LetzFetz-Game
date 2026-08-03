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

  it('covers full Slice-1 TE/TK/EK matrix + 4 catalyst transforms', () => {
    expect(V6_FORMULA_AUTHORING_SLICE1.teBases).toHaveLength(9);
    expect(V6_FORMULA_AUTHORING_SLICE1.tkBases).toHaveLength(12);
    expect(V6_FORMULA_AUTHORING_SLICE1.ekBases).toHaveLength(12);
    expect(V6_FORMULA_AUTHORING_SLICE1.catalystTransforms).toHaveLength(4);
    expect(validateV6Slice1Completeness(V6_FORMULA_AUTHORING_SLICE1)).toEqual([]);
  });
});
