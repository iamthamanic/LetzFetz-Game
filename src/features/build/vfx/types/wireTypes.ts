/**
 * React Flow wire payloads between VFX Studio pipeline nodes.
 * Location: src/features/build/vfx/types/wireTypes.ts
 */

import {
  assertObject,
  isNonEmptyString,
  parseRequiredPositiveInt,
  parseRequiredString,
  parseOptionalString,
} from './parseHelpers';

export const VFX_WIRE_KINDS = ['image', 'model', 'texture', 'effect'] as const;
export type VfxWireKind = (typeof VFX_WIRE_KINDS)[number];

export const VFX_TEXTURE_MAP_ROLES = [
  'baseColor',
  'normal',
  'emissive',
  'orm',
] as const;
export type VfxTextureMapRole = (typeof VFX_TEXTURE_MAP_ROLES)[number];

export const VFX_EFFECT_PRESET_CATEGORIES = [
  'aura',
  'trail',
  'impact',
  'ambient',
] as const;
export type VfxEffectPresetCategory = (typeof VFX_EFFECT_PRESET_CATEGORIES)[number];

export interface ImageAsset {
  kind: 'image';
  id: string;
  url: string;
  width: number;
  height: number;
  mimeType: string;
}

export interface ModelAsset {
  kind: 'model';
  id: string;
  glbUrl: string;
  sourceImageId: string | null;
}

export interface TextureAsset {
  kind: 'texture';
  id: string;
  url: string;
  mapRole: VfxTextureMapRole;
}

export interface EffectAsset {
  kind: 'effect';
  id: string;
  presetPath: string;
  presetCategory: VfxEffectPresetCategory;
}

export type VfxWireAsset = ImageAsset | ModelAsset | TextureAsset | EffectAsset;

export function isVfxWireKind(value: unknown): value is VfxWireKind {
  return typeof value === 'string' && (VFX_WIRE_KINDS as readonly string[]).includes(value);
}

export function isVfxTextureMapRole(value: unknown): value is VfxTextureMapRole {
  return (
    typeof value === 'string' &&
    (VFX_TEXTURE_MAP_ROLES as readonly string[]).includes(value)
  );
}

export function isVfxEffectPresetCategory(
  value: unknown,
): value is VfxEffectPresetCategory {
  return (
    typeof value === 'string' &&
    (VFX_EFFECT_PRESET_CATEGORIES as readonly string[]).includes(value)
  );
}

export function parseImageAsset(raw: unknown): ImageAsset {
  const record = assertObject(raw, 'ImageAsset');
  if (record.kind !== 'image') {
    throw new Error('ImageAsset.kind must be "image"');
  }
  return {
    kind: 'image',
    id: parseRequiredString(record, 'id'),
    url: parseRequiredString(record, 'url'),
    width: parseRequiredPositiveInt(record, 'width'),
    height: parseRequiredPositiveInt(record, 'height'),
    mimeType: parseRequiredString(record, 'mimeType'),
  };
}

export function parseModelAsset(raw: unknown): ModelAsset {
  const record = assertObject(raw, 'ModelAsset');
  if (record.kind !== 'model') {
    throw new Error('ModelAsset.kind must be "model"');
  }
  return {
    kind: 'model',
    id: parseRequiredString(record, 'id'),
    glbUrl: parseRequiredString(record, 'glbUrl'),
    sourceImageId: parseOptionalString(record, 'sourceImageId'),
  };
}

export function parseTextureAsset(raw: unknown): TextureAsset {
  const record = assertObject(raw, 'TextureAsset');
  if (record.kind !== 'texture') {
    throw new Error('TextureAsset.kind must be "texture"');
  }
  const mapRole = record.mapRole;
  if (!isVfxTextureMapRole(mapRole)) {
    throw new Error(
      `TextureAsset.mapRole must be one of: ${VFX_TEXTURE_MAP_ROLES.join(', ')}`,
    );
  }
  return {
    kind: 'texture',
    id: parseRequiredString(record, 'id'),
    url: parseRequiredString(record, 'url'),
    mapRole,
  };
}

export function parseEffectAsset(raw: unknown): EffectAsset {
  const record = assertObject(raw, 'EffectAsset');
  if (record.kind !== 'effect') {
    throw new Error('EffectAsset.kind must be "effect"');
  }
  const presetCategory = record.presetCategory;
  if (!isVfxEffectPresetCategory(presetCategory)) {
    throw new Error(
      `EffectAsset.presetCategory must be one of: ${VFX_EFFECT_PRESET_CATEGORIES.join(', ')}`,
    );
  }
  return {
    kind: 'effect',
    id: parseRequiredString(record, 'id'),
    presetPath: parseRequiredString(record, 'presetPath'),
    presetCategory,
  };
}

/** Discriminate and parse any VFX wire asset from unknown JSON. */
export function parseVfxWireAsset(raw: unknown): VfxWireAsset {
  const record = assertObject(raw, 'VfxWireAsset');
  const kind = record.kind;
  if (!isVfxWireKind(kind)) {
    throw new Error(
      `VfxWireAsset.kind must be one of: ${VFX_WIRE_KINDS.join(', ')}`,
    );
  }
  switch (kind) {
    case 'image':
      return parseImageAsset(raw);
    case 'model':
      return parseModelAsset(raw);
    case 'texture':
      return parseTextureAsset(raw);
    case 'effect':
      return parseEffectAsset(raw);
    default: {
      const _exhaustive: never = kind;
      throw new Error(`Unhandled wire kind: ${String(_exhaustive)}`);
    }
  }
}

export function isImageAsset(value: unknown): value is ImageAsset {
  if (!isNonEmptyString((value as ImageAsset | undefined)?.kind)) return false;
  try {
    parseImageAsset(value);
    return true;
  } catch {
    return false;
  }
}

export function isModelAsset(value: unknown): value is ModelAsset {
  try {
    parseModelAsset(value);
    return true;
  } catch {
    return false;
  }
}

export function isTextureAsset(value: unknown): value is TextureAsset {
  try {
    parseTextureAsset(value);
    return true;
  } catch {
    return false;
  }
}

export function isEffectAsset(value: unknown): value is EffectAsset {
  try {
    parseEffectAsset(value);
    return true;
  } catch {
    return false;
  }
}

export function isVfxWireAsset(value: unknown): value is VfxWireAsset {
  try {
    parseVfxWireAsset(value);
    return true;
  } catch {
    return false;
  }
}

/** Round-trip helper for worker ↔ studio persistence. */
export function serializeVfxWireAsset(asset: VfxWireAsset): VfxWireAsset {
  return parseVfxWireAsset(JSON.parse(JSON.stringify(asset)));
}
