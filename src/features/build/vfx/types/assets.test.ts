/**
 * Unit tests for VFX Studio saved assets and recipes.
 * Location: src/features/build/vfx/types/assets.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  parseCatalystAsset,
  parseEssenceAsset,
  parseFormulaRecipe,
  parseTechniqueAsset,
  parseVfxSavedAsset,
  serializeVfxSavedAsset,
  type CatalystAsset,
  type EssenceAsset,
  type FormulaRecipe,
  type TechniqueAsset,
} from './assets';
import { createDefaultSocketMap } from '../sockets/socketMapHelpers';
import { parseRenderOutput, type RenderOutput } from './renderOutput';

const TS = '2026-07-30T12:00:00.000Z';

const sampleTechnique: TechniqueAsset = {
  kind: 'technique',
  role: 'technik',
  badges: ['Formel', 'Technik'],
  id: 'tech-drill',
  name: 'Durchschuss',
  status: 'READY',
  version: 2,
  createdAt: TS,
  updatedAt: TS,
  imageId: 'img-1',
  modelId: 'mdl-1',
  effectId: null,
  sockets: createDefaultSocketMap(),
};

const sampleEssence: EssenceAsset = {
  kind: 'essence',
  role: 'essenz',
  badges: ['Formel', 'Essenz'],
  id: 'ess-fire',
  name: 'Glut',
  status: 'REVIEW_REQUIRED',
  version: 1,
  createdAt: TS,
  updatedAt: TS,
  element: 'fire',
  imageId: 'img-2',
  modelId: null,
  textureId: 'tex-1',
  effectId: 'fx-1',
};

const sampleCatalyst: CatalystAsset = {
  kind: 'catalyst',
  role: 'katalysator',
  badges: ['Formel', 'Katalysator'],
  id: 'cat-echo',
  name: 'Echo',
  status: 'DRAFT',
  version: 1,
  createdAt: TS,
  updatedAt: TS,
  imageId: null,
  modelId: null,
  effectId: null,
};

const sampleRender: RenderOutput = {
  kind: 'renderOutput',
  id: 'render-1',
  url: '/vfx-workspace/render-1.png',
  format: 'png',
  width: 1024,
  height: 1024,
  capturedAt: TS,
};

const sampleRecipe: FormulaRecipe = {
  kind: 'formulaRecipe',
  id: 'recipe-1',
  name: 'Feuerbohrer',
  status: 'OUTDATED',
  version: 3,
  techniqueId: 'tech-drill',
  essenceId: 'ess-fire',
  catalystId: 'cat-echo',
  techniqueVersion: 2,
  essenceVersion: 1,
  catalystVersion: 1,
  heroFrame: sampleRender,
  createdAt: TS,
  updatedAt: TS,
};

describe('VfxSavedAsset parsers', () => {
  it('round-trips TechniqueAsset', () => {
    const parsed = parseTechniqueAsset(JSON.parse(JSON.stringify(sampleTechnique)));
    expect(parsed).toEqual(sampleTechnique);
    expect(serializeVfxSavedAsset(sampleTechnique)).toEqual(sampleTechnique);
  });

  it('parses TechniqueAsset without sockets using defaults', () => {
    const { sockets: _sockets, ...legacy } = sampleTechnique;
    const parsed = parseTechniqueAsset(JSON.parse(JSON.stringify(legacy)));
    expect(parsed.sockets).toEqual(createDefaultSocketMap());
  });

  it('round-trips EssenceAsset and CatalystAsset', () => {
    expect(parseEssenceAsset(JSON.parse(JSON.stringify(sampleEssence)))).toEqual(
      sampleEssence,
    );
    expect(parseCatalystAsset(JSON.parse(JSON.stringify(sampleCatalyst)))).toEqual(
      sampleCatalyst,
    );
  });

  it('round-trips FormulaRecipe with nested RenderOutput', () => {
    const parsed = parseFormulaRecipe(JSON.parse(JSON.stringify(sampleRecipe)));
    expect(parsed).toEqual(sampleRecipe);
    expect(parsed.heroFrame).toEqual(sampleRender);
  });

  it('parses FormulaRecipe without hero frame', () => {
    const bare: FormulaRecipe = { ...sampleRecipe, heroFrame: null, status: 'READY' };
    expect(parseFormulaRecipe(JSON.parse(JSON.stringify(bare)))).toEqual(bare);
  });

  it('discriminates saved assets via parseVfxSavedAsset', () => {
    expect(parseVfxSavedAsset(sampleTechnique).kind).toBe('technique');
    expect(parseVfxSavedAsset(sampleEssence).kind).toBe('essence');
    expect(parseVfxSavedAsset(sampleCatalyst).kind).toBe('catalyst');
    expect(parseVfxSavedAsset(sampleRecipe).kind).toBe('formulaRecipe');
    expect(parseVfxSavedAsset(sampleRender).kind).toBe('renderOutput');
  });

  it('rejects invalid building blocks and recipes', () => {
    expect(() => parseTechniqueAsset({ kind: 'technique', role: 'essenz' })).toThrow(
      /role must be "technik"/,
    );
    expect(() =>
      parseEssenceAsset({ ...sampleEssence, badges: ['Formel', 'Technik'] }),
    ).toThrow(/badges must be/);
    expect(() => parseFormulaRecipe({
      kind: 'formulaRecipe',
      id: 'x',
      name: 'Bad',
      status: 'BOGUS',
      version: 1,
      techniqueId: null,
      essenceId: null,
      catalystId: null,
      techniqueVersion: null,
      essenceVersion: null,
      catalystVersion: null,
      heroFrame: null,
      createdAt: TS,
      updatedAt: TS,
    })).toThrow(/status must be/);
    expect(() => parseRenderOutput({ kind: 'renderOutput', format: 'jpg' })).toThrow(
      /format must be/,
    );
    expect(() => parseVfxSavedAsset({ kind: 'unknown' })).toThrow(/kind must be/);
  });
});
