/**
 * Unit tests for Meshy catalog pairing helpers.
 * Location: src/features/build/data/meshyPartCatalog.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  catalogPartFromSources,
  parseVersionMetaFromStates,
  resolvePartPairing,
} from './meshyPartCatalog';
import { mapSpecSlotToRole } from '../model/buildTypes';

describe('mapSpecSlotToRole', () => {
  it('maps English and German slot names', () => {
    expect(mapSpecSlotToRole('drive')).toBe('essenz');
    expect(mapSpecSlotToRole('carrier')).toBe('technik');
    expect(mapSpecSlotToRole('attachment')).toBe('katalysator');
    expect(mapSpecSlotToRole('Antrieb')).toBe('essenz');
    expect(mapSpecSlotToRole('träger')).toBe('technik');
    expect(mapSpecSlotToRole('technik')).toBe('technik');
    expect(mapSpecSlotToRole('essenz')).toBe('essenz');
    expect(mapSpecSlotToRole('katalysator')).toBe('katalysator');
    expect(mapSpecSlotToRole('unknown')).toBeNull();
  });
});

describe('resolvePartPairing', () => {
  it('marks 2d-only when no glb', () => {
    expect(
      resolvePartPairing({
        hasGlb: false,
        currentMasterVersion: 2,
        approvedMasterVersion: 1,
        modelVersion: null,
        sourceMasterVersion: null,
      }),
    ).toEqual({ pairStatus: '2d-only', pairLabelDe: 'Nur 2D · v2' });
  });

  it('marks matched when source master aligns', () => {
    expect(
      resolvePartPairing({
        hasGlb: true,
        currentMasterVersion: 1,
        approvedMasterVersion: 1,
        modelVersion: 2,
        sourceMasterVersion: 1,
      }),
    ).toEqual({ pairStatus: 'matched', pairLabelDe: '2D v1 ↔ 3D v2' });
  });

  it('marks stale when current master is ahead of 3D source', () => {
    expect(
      resolvePartPairing({
        hasGlb: true,
        currentMasterVersion: 2,
        approvedMasterVersion: 1,
        modelVersion: 2,
        sourceMasterVersion: 1,
      }).pairStatus,
    ).toBe('stale');
  });
});

describe('parseVersionMetaFromStates', () => {
  it('reads sourceMasterVersion from matching model candidate', () => {
    const meta = parseVersionMetaFromStates(
      { master: { currentVersion: 2, approvedVersion: 1 } },
      {
        model: {
          currentVersion: 2,
          candidates: [{ version: 2, sourceMasterVersion: 1, sourceMultiviewVersion: 1 }],
        },
      },
    );
    expect(meta).toEqual({
      currentMasterVersion: 2,
      approvedMasterVersion: 1,
      modelVersion: 2,
      sourceMasterVersion: 1,
      sourceMultiviewVersion: 1,
      modelSourceByVersion: { 2: 1 },
    });
  });
});

describe('catalogPartFromSources', () => {
  it('requires a displayable master and valid slot', () => {
    expect(
      catalogPartFromSources({
        id: 'shadow-suction-chamber',
        spec: { id: 'shadow-suction-chamber', name: 'Sogkammer', slot: 'drive' },
        currentMasterUrl: undefined,
        approvedMasterUrl: undefined,
        glbUrl: '/x.glb',
      }),
    ).toBeNull();

    expect(
      catalogPartFromSources({
        id: 'shadow-suction-chamber',
        spec: { id: 'shadow-suction-chamber', name: 'Sogkammer', slot: 'nope' },
        currentMasterUrl: '/m.png',
        approvedMasterUrl: undefined,
        glbUrl: undefined,
      }),
    ).toBeNull();
  });

  it('prefers approved master when a GLB is present', () => {
    const part = catalogPartFromSources({
      id: 'shadow-suction-chamber',
      spec: {
        id: 'shadow-suction-chamber',
        name: 'Sogkammer',
        slot: 'drive',
        element: 'shadow',
      },
      currentMasterUrl: '/current.png',
      approvedMasterUrl: '/approved.png',
      glbUrl: '/m.glb',
      versions: {
        currentMasterVersion: 2,
        approvedMasterVersion: 1,
        modelVersion: 2,
        sourceMasterVersion: 1,
        sourceMultiviewVersion: 1,
        modelSourceByVersion: { 2: 1 },
      },
      masters: [
        { version: 1, url: '/v1.png', approved: true, labelDe: '2D v1' },
        { version: 2, url: '/v2.png', approved: false, labelDe: '2D v2' },
      ],
      models: [
        {
          version: 2,
          glbUrl: '/m.glb',
          previewUrl: null,
          sourceMasterVersion: 1,
          labelDe: '3D v2',
        },
      ],
    });
    expect(part?.masterUrl).toBe('/approved.png');
    expect(part?.currentMasterUrl).toBe('/current.png');
    expect(part?.pairStatus).toBe('stale');
    expect(part?.pairLabelDe).toContain('v2');
    expect(part?.glbUrl).toBe('/m.glb');
    expect(part?.element).toBe('shadow');
    expect(part?.masters).toHaveLength(2);
    expect(part?.models).toHaveLength(1);
  });
});
