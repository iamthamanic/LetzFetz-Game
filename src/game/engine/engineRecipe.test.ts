/**
 * Tests for EngineRecipe domain (#131).
 * Location: src/game/engine/engineRecipe.test.ts
 */
import { describe, expect, it } from 'vitest';
import type { BoundCardInstance, FetzgeraetSlot } from '../types';
import { V2_P100_PACK } from '../packs/v2';
import {
  boundToRecipe,
  createEngineDisplayName,
  createRenderKey,
  validateBoundRecipe,
  validateRecipe,
} from './engineRecipe';
import { ENGINE_RENDER_VERSION } from '../types/engineVisual';

function boundPart(
  defId: string,
  fetzSlot: FetzgeraetSlot,
  instanceId = defId,
): BoundCardInstance {
  return {
    instanceId,
    defId,
    exhausted: false,
    resistanceBonus: 0,
    fetzSlot,
  };
}

function partIdForRole(role: FetzgeraetSlot, index = 0): string {
  const parts = V2_P100_PACK.engineParts ?? [];
  const match = parts.filter((p) => {
    const preferred = p.preferredRole ?? (
      p.preferredTag === 'core'
        ? 'traeger'
        : p.preferredTag === 'mode'
          ? 'antrieb'
          : 'aufsatz'
    );
    return preferred === role;
  });
  const part = match[index] ?? parts[index];
  if (!part) throw new Error(`No engine part for ${role}`);
  return part.id;
}

describe('engineRecipe', () => {
  const traegerId = partIdForRole('traeger');
  const antriebId = partIdForRole('antrieb');
  const aufsatzId = partIdForRole('aufsatz');
  const traegerId2 = partIdForRole('traeger', 1);

  it('empty bound → invalid / empty recipe', () => {
    const recipe = boundToRecipe([]);
    expect(recipe.carrierId).toBeUndefined();
    expect(recipe.driveId).toBeUndefined();
    expect(recipe.attachmentId).toBeUndefined();
    expect(recipe.renderVersion).toBe(ENGINE_RENDER_VERSION);

    const v = validateRecipe(recipe);
    expect(v.ok).toBe(false);
    expect(v.active).toBe(false);
    expect(validateBoundRecipe([]).ok).toBe(false);
  });

  it('only drive → invalid active engine', () => {
    const bound = [boundPart(antriebId, 'antrieb')];
    const recipe = boundToRecipe(bound);
    expect(recipe.carrierId).toBeUndefined();
    expect(recipe.driveId).toBe(antriebId);

    const v = validateRecipe(recipe);
    expect(v.ok).toBe(false);
    expect(v.active).toBe(false);
    expect(v.errors.some((e) => e.includes('Träger'))).toBe(true);
  });

  it('Träger alone → valid partial', () => {
    const bound = [boundPart(traegerId, 'traeger')];
    const recipe = boundToRecipe(bound);
    expect(recipe.carrierId).toBe(traegerId);
    expect(recipe.driveId).toBeUndefined();
    expect(recipe.attachmentId).toBeUndefined();

    const v = validateRecipe(recipe);
    expect(v.ok).toBe(true);
    expect(v.active).toBe(true);
    expect(validateBoundRecipe(bound).ok).toBe(true);
  });

  it('full three → valid', () => {
    const bound = [
      boundPart(traegerId, 'traeger'),
      boundPart(antriebId, 'antrieb'),
      boundPart(aufsatzId, 'aufsatz'),
    ];
    const recipe = boundToRecipe(bound);
    expect(recipe).toMatchObject({
      carrierId: traegerId,
      driveId: antriebId,
      attachmentId: aufsatzId,
    });

    const v = validateBoundRecipe(bound);
    expect(v.ok).toBe(true);
    expect(v.active).toBe(true);
  });

  it('two Träger → invalid', () => {
    const bound = [
      boundPart(traegerId, 'traeger', 'a'),
      boundPart(traegerId2, 'traeger', 'b'),
    ];
    const v = validateBoundRecipe(bound);
    expect(v.ok).toBe(false);
    expect(v.active).toBe(false);
    expect(v.errors.some((e) => e.includes('traeger'))).toBe(true);
  });

  it('createRenderKey stable for same inputs', () => {
    const recipe = boundToRecipe(
      [
        boundPart(traegerId, 'traeger'),
        boundPart(antriebId, 'antrieb'),
      ],
      { cosmeticSeed: 42, renderVersion: 1 },
    );
    const a = createRenderKey(recipe);
    const b = createRenderKey({ ...recipe });
    expect(a).toBe(b);
    expect(a).toContain(traegerId);
    expect(a).toContain('cs42');
  });

  it('skips charge cards via effectiveFetzSlot', () => {
    const bound: BoundCardInstance[] = [
      boundPart(traegerId, 'traeger'),
      {
        instanceId: 'charge',
        defId: 'boost-x',
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'charge',
      },
    ];
    const recipe = boundToRecipe(bound);
    expect(recipe.carrierId).toBe(traegerId);
    expect(recipe.driveId).toBeUndefined();
    expect(recipe.attachmentId).toBeUndefined();
  });

  it('maps legacy phraseSlot core → carrierId', () => {
    const bound: BoundCardInstance[] = [
      {
        instanceId: '1',
        defId: traegerId,
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'core',
      },
    ];
    expect(boundToRecipe(bound).carrierId).toBe(traegerId);
    expect(validateBoundRecipe(bound).ok).toBe(true);
  });

  it('createEngineDisplayName joins pack names', () => {
    const recipe = boundToRecipe([
      boundPart(traegerId, 'traeger'),
      boundPart(antriebId, 'antrieb'),
    ]);
    const name = createEngineDisplayName(V2_P100_PACK, recipe);
    expect(name).toContain(' · ');
    expect(name).not.toBe('Leeres Fetzgerät');
  });
});
