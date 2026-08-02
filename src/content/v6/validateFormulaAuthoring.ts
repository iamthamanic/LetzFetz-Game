/**
 * Fail-closed validation for V6 formula authoring catalogs.
 * Location: src/content/v6/validateFormulaAuthoring.ts
 */
import type { V6FormulaAuthoringCatalog } from './schemas/formulaRecipeAuthoring';

export function validateV6FormulaAuthoring(catalog: unknown): string[] {
  const errors: string[] = [];
  if (catalog === null || typeof catalog !== 'object') {
    return ['catalog must be an object'];
  }
  const c = catalog as Record<string, unknown>;
  if (c.version !== 1) {
    errors.push('version must be 1');
  }
  if (!Array.isArray(c.teBases)) {
    errors.push('teBases must be an array');
  } else {
    c.teBases.forEach((row, i) => {
      if (row === null || typeof row !== 'object') {
        errors.push(`teBases[${i}] must be an object`);
        return;
      }
      const r = row as Record<string, unknown>;
      for (const key of ['recipeId', 'techniqueId', 'essenceId'] as const) {
        if (typeof r[key] !== 'string' || r[key].trim() === '') {
          errors.push(`teBases[${i}].${key} is required`);
        }
      }
    });
  }
  if (!Array.isArray(c.catalystTransforms)) {
    errors.push('catalystTransforms must be an array');
  } else {
    c.catalystTransforms.forEach((row, i) => {
      if (row === null || typeof row !== 'object') {
        errors.push(`catalystTransforms[${i}] must be an object`);
        return;
      }
      const r = row as Record<string, unknown>;
      for (const key of ['recipeId', 'catalystId', 'transformId'] as const) {
        if (typeof r[key] !== 'string' || r[key].trim() === '') {
          errors.push(`catalystTransforms[${i}].${key} is required`);
        }
      }
    });
  }
  return errors;
}

export function assertV6FormulaAuthoring(
  catalog: unknown,
): asserts catalog is V6FormulaAuthoringCatalog {
  const errors = validateV6FormulaAuthoring(catalog);
  if (errors.length > 0) {
    throw new Error(`V6_AUTHORING_INVALID:\n- ${errors.join('\n- ')}`);
  }
}
