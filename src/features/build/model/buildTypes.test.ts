/**
 * Unit tests for part element normalization + asset history resolution.
 * Location: src/features/build/model/buildTypes.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  normalizePartElement,
  resolvePartAssets,
  type MeshyCatalogPart,
} from './buildTypes';

describe('normalizePartElement', () => {
  it('maps English and German element names', () => {
    expect(normalizePartElement('shadow')).toBe('shadow');
    expect(normalizePartElement('Schatten')).toBe('shadow');
    expect(normalizePartElement('feuer')).toBe('fire');
    expect(normalizePartElement('Licht')).toBe('light');
  });

  it('returns null for unknown or empty', () => {
    expect(normalizePartElement(null)).toBeNull();
    expect(normalizePartElement('')).toBeNull();
    expect(normalizePartElement('plasma')).toBeNull();
  });
});

function stubPart(overrides: Partial<MeshyCatalogPart> = {}): MeshyCatalogPart {
  return {
    id: 'stub',
    name: 'Stub',
    role: 'essenz',
    masterUrl: '/m2.png',
    glbUrl: null,
    element: null,
    currentMasterUrl: '/m2.png',
    currentMasterVersion: 2,
    approvedMasterVersion: 1,
    modelVersion: null,
    sourceMasterVersion: null,
    sourceMultiviewVersion: null,
    pairStatus: '2d-only',
    pairLabelDe: 'Nur 2D · v2',
    masters: [
      { version: 1, url: '/m1.png', approved: true, labelDe: '2D v1' },
      { version: 2, url: '/m2.png', approved: false, labelDe: '2D v2' },
    ],
    models: [],
    ...overrides,
  };
}

describe('resolvePartAssets', () => {
  it('labels 2d-only parts and falls back to approved master', () => {
    const resolved = resolvePartAssets(stubPart(), {
      masterVersion: null,
      modelVersion: null,
      view: '3d',
    });
    expect(resolved.view).toBe('2d');
    expect(resolved.glbUrl).toBeNull();
    expect(resolved.masterUrl).toBe('/m1.png');
    expect(resolved.statusLabelDe).toBe('Nur 2D · v1');
  });

  it('selects explicit 2D and 3D versions', () => {
    const part = stubPart({
      pairStatus: 'matched',
      pairLabelDe: '2D v1 ↔ 3D v2',
      modelVersion: 2,
      sourceMasterVersion: 1,
      glbUrl: '/v2.glb',
      models: [
        {
          version: 1,
          glbUrl: '/v1.glb',
          previewUrl: null,
          sourceMasterVersion: 1,
          labelDe: '3D v1',
        },
        {
          version: 2,
          glbUrl: '/v2.glb',
          previewUrl: '/p2.png',
          sourceMasterVersion: 1,
          labelDe: '3D v2',
        },
      ],
    });
    const resolved = resolvePartAssets(part, {
      masterVersion: 2,
      modelVersion: 1,
      view: '3d',
    });
    expect(resolved.view).toBe('3d');
    expect(resolved.masterUrl).toBe('/m2.png');
    expect(resolved.glbUrl).toBe('/v1.glb');
    expect(resolved.modelVersion).toBe(1);
    expect(resolved.statusLabelDe).toContain('3D v1');
  });
});
