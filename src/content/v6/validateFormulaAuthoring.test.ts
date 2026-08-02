/**
 * Location: src/content/v6/validateFormulaAuthoring.test.ts
 */
import { describe, expect, it } from 'vitest';
import { EMPTY_V6_FORMULA_AUTHORING } from './schemas/formulaRecipeAuthoring';
import {
  assertV6FormulaAuthoring,
  validateV6FormulaAuthoring,
} from './validateFormulaAuthoring';

describe('validateV6FormulaAuthoring', () => {
  it('accepts empty/minimal catalog', () => {
    expect(validateV6FormulaAuthoring(EMPTY_V6_FORMULA_AUTHORING)).toEqual([]);
    expect(() => assertV6FormulaAuthoring(EMPTY_V6_FORMULA_AUTHORING)).not.toThrow();
  });

  it('fails closed when required keys are missing', () => {
    const errors = validateV6FormulaAuthoring({
      version: 1,
      teBases: [{ techniqueId: 't1', essenceId: 'e1' }],
      catalystTransforms: [],
    });
    expect(errors.some((e) => e.includes('recipeId'))).toBe(true);
    expect(() =>
      assertV6FormulaAuthoring({
        version: 1,
        teBases: [{ techniqueId: 't1', essenceId: 'e1' }],
        catalystTransforms: [],
      }),
    ).toThrow(/V6_AUTHORING_INVALID/);
  });
});
