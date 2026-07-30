/**
 * Saved VFX Studio building blocks, recipes, and render outputs.
 * Location: src/features/build/vfx/types/assets.ts
 * Design: .qa/design/vfx-studio.md
 */

import {
  assertObject,
  isNonEmptyString,
  parseOptionalPositiveInt,
  parseOptionalString,
  parseRequiredIsoTimestamp,
  parseRequiredPositiveInt,
  parseRequiredString,
} from './parseHelpers';
import { parseVfxAssetStatus, type VfxAssetStatus } from './status';
import { parseRenderOutput, type RenderOutput } from './renderOutput';
import {
  parseTechniqueSocketMap,
  type VfxTechniqueSocketMap,
} from '../sockets/socketMapHelpers';

export const VFX_FORMULA_ROLES = ['technik', 'essenz', 'katalysator'] as const;
export type VfxFormulaRole = (typeof VFX_FORMULA_ROLES)[number];

export const VFX_BUILDING_BLOCK_KINDS = [
  'technique',
  'essence',
  'catalyst',
] as const;
export type VfxBuildingBlockKind = (typeof VFX_BUILDING_BLOCK_KINDS)[number];

export const VFX_DOMAIN_KINDS = [
  ...VFX_BUILDING_BLOCK_KINDS,
  'formulaRecipe',
  'renderOutput',
] as const;
export type VfxDomainKind = (typeof VFX_DOMAIN_KINDS)[number];

export interface VfxAssetMetadata {
  id: string;
  name: string;
  status: VfxAssetStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface TechniqueAsset extends VfxAssetMetadata {
  kind: 'technique';
  role: 'technik';
  badges: ['Formel', 'Technik'];
  imageId: string | null;
  modelId: string | null;
  effectId: string | null;
  /** Named attachment points for VFX (essenceOrigin, impact, …). */
  sockets: VfxTechniqueSocketMap;
}

export type { VfxTechniqueSocketMap } from '../sockets/socketMapHelpers';

export interface EssenceAsset extends VfxAssetMetadata {
  kind: 'essence';
  role: 'essenz';
  badges: ['Formel', 'Essenz'];
  element: string | null;
  imageId: string | null;
  modelId: string | null;
  textureId: string | null;
  effectId: string | null;
}

export interface CatalystAsset extends VfxAssetMetadata {
  kind: 'catalyst';
  role: 'katalysator';
  badges: ['Formel', 'Katalysator'];
  imageId: string | null;
  modelId: string | null;
  effectId: string | null;
}

export interface FormulaRecipe {
  kind: 'formulaRecipe';
  id: string;
  name: string;
  status: VfxAssetStatus;
  version: number;
  techniqueId: string | null;
  essenceId: string | null;
  catalystId: string | null;
  /** Pinned V5 / Studio asset version when the slot is filled. */
  techniqueVersion: number | null;
  essenceVersion: number | null;
  catalystVersion: number | null;
  heroFrame: RenderOutput | null;
  createdAt: string;
  updatedAt: string;
}

export type VfxBuildingBlockAsset = TechniqueAsset | EssenceAsset | CatalystAsset;
export type VfxSavedAsset = VfxBuildingBlockAsset | FormulaRecipe | RenderOutput;

export function isVfxFormulaRole(value: unknown): value is VfxFormulaRole {
  return typeof value === 'string' && (VFX_FORMULA_ROLES as readonly string[]).includes(value);
}

export function isVfxBuildingBlockKind(value: unknown): value is VfxBuildingBlockKind {
  return (
    typeof value === 'string' &&
    (VFX_BUILDING_BLOCK_KINDS as readonly string[]).includes(value)
  );
}

function parseAssetMetadata(
  record: Record<string, unknown>,
  label: string,
): VfxAssetMetadata {
  return {
    id: parseRequiredString(record, 'id'),
    name: parseRequiredString(record, 'name'),
    status: parseVfxAssetStatus(record.status),
    version: parseRequiredPositiveInt(record, 'version'),
    createdAt: parseRequiredIsoTimestamp(record, 'createdAt'),
    updatedAt: parseRequiredIsoTimestamp(record, 'updatedAt'),
  };
}

function parseTechniqueBadges(
  raw: unknown,
): ['Formel', 'Technik'] {
  if (
    !Array.isArray(raw) ||
    raw.length !== 2 ||
    raw[0] !== 'Formel' ||
    raw[1] !== 'Technik'
  ) {
    throw new Error('TechniqueAsset.badges must be ["Formel", "Technik"]');
  }
  return ['Formel', 'Technik'];
}

function parseEssenceBadges(raw: unknown): ['Formel', 'Essenz'] {
  if (
    !Array.isArray(raw) ||
    raw.length !== 2 ||
    raw[0] !== 'Formel' ||
    raw[1] !== 'Essenz'
  ) {
    throw new Error('EssenceAsset.badges must be ["Formel", "Essenz"]');
  }
  return ['Formel', 'Essenz'];
}

function parseCatalystBadges(raw: unknown): ['Formel', 'Katalysator'] {
  if (
    !Array.isArray(raw) ||
    raw.length !== 2 ||
    raw[0] !== 'Formel' ||
    raw[1] !== 'Katalysator'
  ) {
    throw new Error('CatalystAsset.badges must be ["Formel", "Katalysator"]');
  }
  return ['Formel', 'Katalysator'];
}

export function parseTechniqueAsset(raw: unknown): TechniqueAsset {
  const record = assertObject(raw, 'TechniqueAsset');
  if (record.kind !== 'technique') {
    throw new Error('TechniqueAsset.kind must be "technique"');
  }
  if (record.role !== 'technik') {
    throw new Error('TechniqueAsset.role must be "technik"');
  }
  return {
    kind: 'technique',
    role: 'technik',
    badges: parseTechniqueBadges(record.badges),
    imageId: parseOptionalString(record, 'imageId'),
    modelId: parseOptionalString(record, 'modelId'),
    effectId: parseOptionalString(record, 'effectId'),
    sockets: parseTechniqueSocketMap(record.sockets),
    ...parseAssetMetadata(record, 'TechniqueAsset'),
  };
}

export function parseEssenceAsset(raw: unknown): EssenceAsset {
  const record = assertObject(raw, 'EssenceAsset');
  if (record.kind !== 'essence') {
    throw new Error('EssenceAsset.kind must be "essence"');
  }
  if (record.role !== 'essenz') {
    throw new Error('EssenceAsset.role must be "essenz"');
  }
  const element = record.element;
  const parsedElement =
    element === undefined || element === null
      ? null
      : parseRequiredString({ element }, 'element');
  return {
    kind: 'essence',
    role: 'essenz',
    badges: parseEssenceBadges(record.badges),
    element: parsedElement,
    imageId: parseOptionalString(record, 'imageId'),
    modelId: parseOptionalString(record, 'modelId'),
    textureId: parseOptionalString(record, 'textureId'),
    effectId: parseOptionalString(record, 'effectId'),
    ...parseAssetMetadata(record, 'EssenceAsset'),
  };
}

export function parseCatalystAsset(raw: unknown): CatalystAsset {
  const record = assertObject(raw, 'CatalystAsset');
  if (record.kind !== 'catalyst') {
    throw new Error('CatalystAsset.kind must be "catalyst"');
  }
  if (record.role !== 'katalysator') {
    throw new Error('CatalystAsset.role must be "katalysator"');
  }
  return {
    kind: 'catalyst',
    role: 'katalysator',
    badges: parseCatalystBadges(record.badges),
    imageId: parseOptionalString(record, 'imageId'),
    modelId: parseOptionalString(record, 'modelId'),
    effectId: parseOptionalString(record, 'effectId'),
    ...parseAssetMetadata(record, 'CatalystAsset'),
  };
}

export function parseFormulaRecipe(raw: unknown): FormulaRecipe {
  const record = assertObject(raw, 'FormulaRecipe');
  if (record.kind !== 'formulaRecipe') {
    throw new Error('FormulaRecipe.kind must be "formulaRecipe"');
  }
  const heroFrameRaw = record.heroFrame;
  let heroFrame: RenderOutput | null = null;
  if (heroFrameRaw !== undefined && heroFrameRaw !== null) {
    heroFrame = parseRenderOutput(heroFrameRaw);
  }
  return {
    kind: 'formulaRecipe',
    id: parseRequiredString(record, 'id'),
    name: parseRequiredString(record, 'name'),
    status: parseVfxAssetStatus(record.status),
    version: parseRequiredPositiveInt(record, 'version'),
    techniqueId: parseOptionalString(record, 'techniqueId'),
    essenceId: parseOptionalString(record, 'essenceId'),
    catalystId: parseOptionalString(record, 'catalystId'),
    techniqueVersion: parseOptionalPositiveInt(record, 'techniqueVersion'),
    essenceVersion: parseOptionalPositiveInt(record, 'essenceVersion'),
    catalystVersion: parseOptionalPositiveInt(record, 'catalystVersion'),
    heroFrame,
    createdAt: parseRequiredIsoTimestamp(record, 'createdAt'),
    updatedAt: parseRequiredIsoTimestamp(record, 'updatedAt'),
  };
}

export function parseVfxBuildingBlockAsset(raw: unknown): VfxBuildingBlockAsset {
  const record = assertObject(raw, 'VfxBuildingBlockAsset');
  const kind = record.kind;
  if (!isVfxBuildingBlockKind(kind)) {
    throw new Error(
      `VfxBuildingBlockAsset.kind must be one of: ${VFX_BUILDING_BLOCK_KINDS.join(', ')}`,
    );
  }
  switch (kind) {
    case 'technique':
      return parseTechniqueAsset(raw);
    case 'essence':
      return parseEssenceAsset(raw);
    case 'catalyst':
      return parseCatalystAsset(raw);
    default: {
      const _exhaustive: never = kind;
      throw new Error(`Unhandled building block kind: ${String(_exhaustive)}`);
    }
  }
}

export function parseVfxSavedAsset(raw: unknown): VfxSavedAsset {
  const record = assertObject(raw, 'VfxSavedAsset');
  const kind = record.kind;
  if (kind === 'formulaRecipe') return parseFormulaRecipe(raw);
  if (kind === 'renderOutput') return parseRenderOutput(raw);
  if (isVfxBuildingBlockKind(kind)) return parseVfxBuildingBlockAsset(raw);
  throw new Error(
    `VfxSavedAsset.kind must be one of: ${VFX_DOMAIN_KINDS.join(', ')}`,
  );
}

export function isTechniqueAsset(value: unknown): value is TechniqueAsset {
  try {
    parseTechniqueAsset(value);
    return true;
  } catch {
    return false;
  }
}

export function isEssenceAsset(value: unknown): value is EssenceAsset {
  try {
    parseEssenceAsset(value);
    return true;
  } catch {
    return false;
  }
}

export function isCatalystAsset(value: unknown): value is CatalystAsset {
  try {
    parseCatalystAsset(value);
    return true;
  } catch {
    return false;
  }
}

export function isFormulaRecipe(value: unknown): value is FormulaRecipe {
  try {
    parseFormulaRecipe(value);
    return true;
  } catch {
    return false;
  }
}

export function serializeVfxSavedAsset(asset: VfxSavedAsset): VfxSavedAsset {
  return parseVfxSavedAsset(JSON.parse(JSON.stringify(asset)));
}
