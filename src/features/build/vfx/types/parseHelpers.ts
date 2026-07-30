/**
 * Shared unknown→typed narrowing helpers for VFX Studio contracts.
 * Location: src/features/build/vfx/types/parseHelpers.ts
 */

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function parseRequiredString(
  record: Record<string, unknown>,
  key: string,
): string {
  const value = record[key];
  if (!isNonEmptyString(value)) {
    throw new Error(`${key} must be a non-empty string`);
  }
  return value;
}

export function parseOptionalString(
  record: Record<string, unknown>,
  key: string,
): string | null {
  const value = record[key];
  if (value === undefined || value === null) return null;
  if (!isNonEmptyString(value)) {
    throw new Error(`${key} must be a non-empty string when present`);
  }
  return value;
}

export function parseRequiredNumber(
  record: Record<string, unknown>,
  key: string,
): number {
  const value = record[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${key} must be a finite number`);
  }
  return value;
}

export function parseRequiredPositiveInt(
  record: Record<string, unknown>,
  key: string,
): number {
  const value = parseRequiredNumber(record, key);
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${key} must be a positive integer`);
  }
  return value;
}

export function parseOptionalPositiveInt(
  record: Record<string, unknown>,
  key: string,
): number | null {
  const value = record[key];
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    throw new Error(`${key} must be a positive integer when present`);
  }
  return value;
}

export function parseRequiredIsoTimestamp(
  record: Record<string, unknown>,
  key: string,
): string {
  const value = parseRequiredString(record, key);
  if (Number.isNaN(Date.parse(value))) {
    throw new Error(`${key} must be an ISO timestamp`);
  }
  return value;
}

export function assertObject(raw: unknown, label: string): Record<string, unknown> {
  if (!isRecord(raw)) {
    throw new Error(`${label} must be an object`);
  }
  return raw;
}
