/**
 * Fail-closed validation for V6 formula authoring catalogs.
 * Location: src/content/v6/validateFormulaAuthoring.ts
 */
import type { V6FormulaAuthoringCatalog } from './schemas/formulaRecipeAuthoring';
import {
  V6_SLICE1_CATALYST_IDS,
  V6_SLICE1_ESSENCE_IDS,
  V6_SLICE1_TECHNIQUE_IDS,
} from './slice1Ids';

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim() !== '';
}

function validatePrimary(
  primary: unknown,
  path: string,
  errors: string[],
): void {
  if (primary === null || typeof primary !== 'object') {
    errors.push(`${path}.primary must be an object`);
    return;
  }
  const p = primary as Record<string, unknown>;
  if (!isNonEmptyString(p.kind)) errors.push(`${path}.primary.kind is required`);
  if (typeof p.value !== 'number' || !Number.isFinite(p.value)) {
    errors.push(`${path}.primary.value must be a number`);
  }
  if (p.target !== 'opponent' && p.target !== 'self') {
    errors.push(`${path}.primary.target must be opponent|self`);
  }
}

export function validateV6FormulaAuthoring(catalog: unknown): string[] {
  const errors: string[] = [];
  if (catalog === null || typeof catalog !== 'object') {
    return ['catalog must be an object'];
  }
  const c = catalog as Record<string, unknown>;
  if (c.version !== 1) {
    errors.push('version must be 1');
  }
  if (c.slice !== 'slice1') {
    errors.push('slice must be "slice1" for current authoring gate');
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
      for (const key of ['recipeId', 'techniqueId', 'essenceId', 'name'] as const) {
        if (!isNonEmptyString(r[key])) {
          errors.push(`teBases[${i}].${key} is required`);
        }
      }
      validatePrimary(r.primary, `teBases[${i}]`, errors);
    });
  }

  if (!Array.isArray(c.tkBases)) {
    errors.push('tkBases must be an array');
  } else {
    c.tkBases.forEach((row, i) => {
      if (row === null || typeof row !== 'object') {
        errors.push(`tkBases[${i}] must be an object`);
        return;
      }
      const r = row as Record<string, unknown>;
      for (const key of ['recipeId', 'techniqueId', 'catalystId', 'name'] as const) {
        if (!isNonEmptyString(r[key])) {
          errors.push(`tkBases[${i}].${key} is required`);
        }
      }
      validatePrimary(r.primary, `tkBases[${i}]`, errors);
    });
  }

  if (!Array.isArray(c.ekBases)) {
    errors.push('ekBases must be an array');
  } else {
    c.ekBases.forEach((row, i) => {
      if (row === null || typeof row !== 'object') {
        errors.push(`ekBases[${i}] must be an object`);
        return;
      }
      const r = row as Record<string, unknown>;
      for (const key of ['recipeId', 'essenceId', 'catalystId', 'name'] as const) {
        if (!isNonEmptyString(r[key])) {
          errors.push(`ekBases[${i}].${key} is required`);
        }
      }
      validatePrimary(r.primary, `ekBases[${i}]`, errors);
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
        // recipeId optional on transforms (catalyst-global); keep transformId+catalystId
        void key;
      }
      if (!isNonEmptyString(r.transformId)) {
        errors.push(`catalystTransforms[${i}].transformId is required`);
      }
      if (!isNonEmptyString(r.catalystId)) {
        errors.push(`catalystTransforms[${i}].catalystId is required`);
      }
      if (typeof r.primaryDelta !== 'number' || !Number.isFinite(r.primaryDelta)) {
        errors.push(`catalystTransforms[${i}].primaryDelta must be a number`);
      }
      if (!isNonEmptyString(r.summary)) {
        errors.push(`catalystTransforms[${i}].summary is required`);
      }
    });
  }

  return errors;
}

/** Fail closed if Slice-1 matrix coverage is incomplete. */
export function validateV6Slice1Completeness(catalog: V6FormulaAuthoringCatalog): string[] {
  const errors: string[] = [];
  const teKeys = new Set(catalog.teBases.map((r) => `${r.techniqueId}::${r.essenceId}`));
  for (const t of V6_SLICE1_TECHNIQUE_IDS) {
    for (const e of V6_SLICE1_ESSENCE_IDS) {
      const key = `${t}::${e}`;
      if (!teKeys.has(key)) errors.push(`missing TE base for ${key}`);
    }
  }

  const tkKeys = new Set(catalog.tkBases.map((r) => `${r.techniqueId}::${r.catalystId}`));
  for (const t of V6_SLICE1_TECHNIQUE_IDS) {
    for (const c of V6_SLICE1_CATALYST_IDS) {
      const key = `${t}::${c}`;
      if (!tkKeys.has(key)) errors.push(`missing TK base for ${key}`);
    }
  }

  const ekKeys = new Set(catalog.ekBases.map((r) => `${r.essenceId}::${r.catalystId}`));
  for (const e of V6_SLICE1_ESSENCE_IDS) {
    for (const c of V6_SLICE1_CATALYST_IDS) {
      const key = `${e}::${c}`;
      if (!ekKeys.has(key)) errors.push(`missing EK base for ${key}`);
    }
  }

  const catIds = new Set(catalog.catalystTransforms.map((t) => t.catalystId));
  for (const c of V6_SLICE1_CATALYST_IDS) {
    if (!catIds.has(c)) errors.push(`missing catalyst transform for ${c}`);
  }

  const expectedTe = V6_SLICE1_TECHNIQUE_IDS.length * V6_SLICE1_ESSENCE_IDS.length;
  const expectedTk = V6_SLICE1_TECHNIQUE_IDS.length * V6_SLICE1_CATALYST_IDS.length;
  const expectedEk = V6_SLICE1_ESSENCE_IDS.length * V6_SLICE1_CATALYST_IDS.length;
  if (catalog.teBases.length !== expectedTe) {
    errors.push(`teBases length ${catalog.teBases.length} !== ${expectedTe}`);
  }
  if (catalog.tkBases.length !== expectedTk) {
    errors.push(`tkBases length ${catalog.tkBases.length} !== ${expectedTk}`);
  }
  if (catalog.ekBases.length !== expectedEk) {
    errors.push(`ekBases length ${catalog.ekBases.length} !== ${expectedEk}`);
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
  const typed = catalog as V6FormulaAuthoringCatalog;
  const completeness = validateV6Slice1Completeness(typed);
  if (completeness.length > 0) {
    throw new Error(`V6_SLICE1_INCOMPLETE:\n- ${completeness.join('\n- ')}`);
  }
}
