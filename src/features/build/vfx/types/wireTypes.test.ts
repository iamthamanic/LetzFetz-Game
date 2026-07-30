/**
 * Unit tests for VFX Studio React Flow wire types.
 * Location: src/features/build/vfx/types/wireTypes.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  parseEffectAsset,
  parseImageAsset,
  parseModelAsset,
  parseTextureAsset,
  parseVfxWireAsset,
  serializeVfxWireAsset,
  type EffectAsset,
  type ImageAsset,
  type ModelAsset,
  type TextureAsset,
} from './wireTypes';

const sampleImage: ImageAsset = {
  kind: 'image',
  id: 'img-1',
  url: '/vfx-workspace/img-1.png',
  width: 512,
  height: 512,
  mimeType: 'image/png',
};

const sampleModel: ModelAsset = {
  kind: 'model',
  id: 'mdl-1',
  glbUrl: '/vfx-workspace/mdl-1.glb',
  sourceImageId: 'img-1',
};

const sampleTexture: TextureAsset = {
  kind: 'texture',
  id: 'tex-1',
  url: '/vfx-workspace/tex-1.png',
  mapRole: 'baseColor',
};

const sampleEffect: EffectAsset = {
  kind: 'effect',
  id: 'fx-1',
  presetPath: '/vfx/presets/aura-fire.efkefc',
  presetCategory: 'aura',
};

describe('VfxWireAsset parsers', () => {
  it('round-trips ImageAsset through JSON', () => {
    const parsed = parseImageAsset(JSON.parse(JSON.stringify(sampleImage)));
    expect(parsed).toEqual(sampleImage);
    expect(serializeVfxWireAsset(sampleImage)).toEqual(sampleImage);
  });

  it('round-trips ModelAsset with nullable sourceImageId', () => {
    const noSource: ModelAsset = { ...sampleModel, sourceImageId: null };
    expect(parseModelAsset(JSON.parse(JSON.stringify(noSource)))).toEqual(noSource);
  });

  it('round-trips TextureAsset and EffectAsset', () => {
    expect(parseTextureAsset(JSON.parse(JSON.stringify(sampleTexture)))).toEqual(
      sampleTexture,
    );
    expect(parseEffectAsset(JSON.parse(JSON.stringify(sampleEffect)))).toEqual(
      sampleEffect,
    );
  });

  it('discriminates wire assets via parseVfxWireAsset', () => {
    expect(parseVfxWireAsset(sampleImage).kind).toBe('image');
    expect(parseVfxWireAsset(sampleModel).kind).toBe('model');
    expect(parseVfxWireAsset(sampleTexture).kind).toBe('texture');
    expect(parseVfxWireAsset(sampleEffect).kind).toBe('effect');
  });

  it('rejects invalid wire payloads', () => {
    expect(() => parseImageAsset(null)).toThrow(/must be an object/);
    expect(() => parseImageAsset({ kind: 'image' })).toThrow(/id must be/);
    expect(() => parseImageAsset({ ...sampleImage, width: 0 })).toThrow(/width/);
    expect(() =>
      parseTextureAsset({ ...sampleTexture, mapRole: 'specular' }),
    ).toThrow(/mapRole/);
    expect(() =>
      parseEffectAsset({ ...sampleEffect, presetCategory: 'burst' }),
    ).toThrow(/presetCategory/);
    expect(() => parseVfxWireAsset({ kind: 'video' })).toThrow(/kind must be/);
  });
});
