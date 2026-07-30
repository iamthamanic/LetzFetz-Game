/**
 * Unit tests for Combinate save helpers.
 * Location: src/features/build/model/combinateSave.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  buildFormulaRecipeFromSlots,
  captureCanvasHeroFrame,
  createCombinationId,
  V5_FORMULA_COMPONENT_VERSION,
} from './combinateSave';

describe('combinateSave', () => {
  it('createCombinationId returns kombi-prefixed id', () => {
    expect(createCombinationId()).toMatch(/^kombi-/);
  });

  it('buildFormulaRecipeFromSlots requires at least two slots', () => {
    expect(
      buildFormulaRecipeFromSlots({
        slots: { technik: 't1', essenz: null, katalysator: null },
        name: 'Solo',
        heroFrame: null,
      }),
    ).toBeNull();

    const recipe = buildFormulaRecipeFromSlots({
      slots: { technik: 't1', essenz: 'e1', katalysator: null },
      name: ' Duo ',
      heroFrame: null,
    });
    expect(recipe).not.toBeNull();
    expect(recipe?.name).toBe('Duo');
    expect(recipe?.techniqueId).toBe('t1');
    expect(recipe?.essenceId).toBe('e1');
    expect(recipe?.catalystId).toBeNull();
    expect(recipe?.techniqueVersion).toBe(V5_FORMULA_COMPONENT_VERSION);
    expect(recipe?.essenceVersion).toBe(V5_FORMULA_COMPONENT_VERSION);
    expect(recipe?.catalystVersion).toBeNull();
    expect(recipe?.status).toBe('READY');
  });

  it('preserves existing id and createdAt on update', () => {
    const createdAt = '2026-07-30T10:00:00.000Z';
    const recipe = buildFormulaRecipeFromSlots({
      slots: { technik: 't1', essenz: null, katalysator: 'k1' },
      name: 'Updated',
      heroFrame: null,
      existingId: 'kombi-fixed',
      existingCreatedAt: createdAt,
    });
    expect(recipe?.id).toBe('kombi-fixed');
    expect(recipe?.createdAt).toBe(createdAt);
    expect(recipe?.updatedAt).not.toBe(createdAt);
  });

  it('captureCanvasHeroFrame returns png data url render output', () => {
    const canvas = {
      width: 64,
      height: 48,
      toDataURL: () => 'data:image/png;base64,abc',
    } as unknown as HTMLCanvasElement;

    const frame = captureCanvasHeroFrame(canvas);
    expect(frame).not.toBeNull();
    expect(frame?.format).toBe('png');
    expect(frame?.url.startsWith('data:image/png')).toBe(true);
    expect(frame?.width).toBe(64);
    expect(frame?.height).toBe(48);
  });

  it('captureCanvasHeroFrame returns null when capture fails', () => {
    const canvas = {
      width: 64,
      height: 48,
      toDataURL: () => {
        throw new Error('tainted');
      },
    } as unknown as HTMLCanvasElement;
    expect(captureCanvasHeroFrame(canvas)).toBeNull();
    expect(captureCanvasHeroFrame(null)).toBeNull();
  });
});
