/**
 * Tests for selectAdapters + pair-reaction display DTOs (#191).
 * Location: src/game/engine/adapterPairDisplay.test.ts
 */
import { describe, expect, it } from 'vitest';
import type { BoundCardInstance, FetzgeraetSlot } from '../types';
import { DEFAULT_RULESET, V3_RULESET } from '../types';
import { V3_PACK } from '../packs/v3';
import { ENGINE_RENDER_VERSION, type EngineRecipe } from '../types/engineVisual';
import {
  resolvePairReactions,
  selectAdapters,
  selectAdaptersFromBound,
} from './adapterPairDisplay';

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

function emptyRecipe(partial: Partial<EngineRecipe> = {}): EngineRecipe {
  return {
    cosmeticSeed: 0,
    renderVersion: ENGINE_RENDER_VERSION,
    ...partial,
  };
}

describe('selectAdapters', () => {
  it('empty recipe → []', () => {
    expect(selectAdapters(emptyRecipe(), V3_PACK)).toEqual([]);
  });

  it('Träger alone → no adapters', () => {
    expect(
      selectAdapters(emptyRecipe({ carrierId: 'v3-part-fire-traeger-01' }), V3_PACK),
    ).toEqual([]);
  });

  it('Träger + Antrieb → drive adapter with drive element', () => {
    const adapters = selectAdapters(
      emptyRecipe({
        carrierId: 'v3-part-fire-traeger-01',
        driveId: 'v3-part-water-antrieb-01',
      }),
      V3_PACK,
    );
    expect(adapters).toHaveLength(1);
    expect(adapters[0]).toMatchObject({
      kind: 'drive',
      fromSlot: 'traeger',
      toSlot: 'antrieb',
      element: 'water',
      labelDe: 'Adapter Antrieb',
    });
  });

  it('full trio → drive + attachment adapters', () => {
    const adapters = selectAdapters(
      emptyRecipe({
        carrierId: 'v3-part-fire-traeger-01',
        driveId: 'v3-part-fire-antrieb-01',
        attachmentId: 'v3-part-fire-aufsatz-01',
      }),
      V3_PACK,
    );
    expect(adapters.map((a) => a.kind)).toEqual(['drive', 'attachment']);
    expect(adapters[1]?.fromSlot).toBe('antrieb');
    expect(adapters[1]?.element).toBe('fire');
  });

  it('selectAdaptersFromBound mirrors recipe path', () => {
    const bound = [
      boundPart('v3-part-water-traeger-01', 'traeger'),
      boundPart('v3-part-water-antrieb-01', 'antrieb'),
    ];
    expect(selectAdaptersFromBound(bound, V3_PACK)).toEqual(
      selectAdapters(
        emptyRecipe({
          carrierId: 'v3-part-water-traeger-01',
          driveId: 'v3-part-water-antrieb-01',
        }),
        V3_PACK,
      ),
    );
  });
});

describe('resolvePairReactions', () => {
  it('V1 / default ruleset → []', () => {
    const bound = [
      boundPart('v3-part-fire-traeger-01', 'traeger'),
      boundPart('v3-part-fire-antrieb-01', 'antrieb'),
    ];
    expect(resolvePairReactions(bound, V3_PACK, DEFAULT_RULESET)).toEqual([]);
  });

  it('incomplete (one part) under V3 → []', () => {
    const bound = [boundPart('v3-part-fire-traeger-01', 'traeger')];
    expect(resolvePairReactions(bound, V3_PACK, V3_RULESET)).toEqual([]);
  });

  it('two same element under V3 → pair DTO only', () => {
    const bound = [
      boundPart('v3-part-fire-traeger-01', 'traeger'),
      boundPart('v3-part-fire-antrieb-01', 'antrieb'),
    ];
    const dtos = resolvePairReactions(bound, V3_PACK, V3_RULESET);
    expect(dtos).toHaveLength(1);
    expect(dtos[0]).toMatchObject({
      element: 'fire',
      tier: 2,
      titleDe: 'Feuer-Paarresonanz',
    });
    expect(dtos[0]?.textDe.length).toBeGreaterThan(10);
  });

  it('three same element under V3 → pair + full DTOs', () => {
    const bound = [
      boundPart('v3-part-water-traeger-01', 'traeger'),
      boundPart('v3-part-water-antrieb-01', 'antrieb'),
      boundPart('v3-part-water-aufsatz-01', 'aufsatz'),
    ];
    const dtos = resolvePairReactions(bound, V3_PACK, V3_RULESET);
    expect(dtos.map((d) => d.tier)).toEqual([2, 3]);
    expect(dtos.every((d) => d.element === 'water')).toBe(true);
    expect(dtos[1]?.titleDe).toContain('Volle');
  });
});
