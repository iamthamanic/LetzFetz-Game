/**
 * Unit tests for EngineMaterials (no WebGL).
 * Location: src/components/engine3d/three/EngineMaterials.test.ts
 */
import { describe, expect, it } from 'vitest';
import { BoxGeometry, Mesh, MeshStandardMaterial, Object3D } from 'three';
import {
  applyEngineLook,
  createToonMaterial,
  elementHintFromPartId,
  resolveMaterialClass,
  shouldEnableEngineOutline,
} from './EngineMaterials';

describe('resolveMaterialClass', () => {
  it('maps exact and fuzzy names', () => {
    expect(resolveMaterialClass('MAT_METAL')).toBe('MAT_METAL');
    expect(resolveMaterialClass('Steel_Plate')).toBe('MAT_METAL');
    expect(resolveMaterialClass('weird_xyz')).toBe('MAT_FALLBACK');
    expect(resolveMaterialClass(undefined)).toBe('MAT_FALLBACK');
  });
});

describe('elementHintFromPartId', () => {
  it('parses V3 part ids', () => {
    expect(elementHintFromPartId('v3-part-water-traeger-01')).toBe('water');
    expect(elementHintFromPartId('v3-part-shadow-antrieb-01')).toBe('shadow');
    expect(elementHintFromPartId('other')).toBeNull();
  });
});

describe('createToonMaterial', () => {
  it('sets class name and glass opacity', () => {
    const glass = createToonMaterial('MAT_GLASS');
    expect(glass.name).toBe('MAT_GLASS');
    expect(glass.transparent).toBe(true);
    expect(glass.opacity).toBeLessThan(1);
  });
});

describe('applyEngineLook', () => {
  it('replaces standard materials with toon and optional outline', () => {
    const root = new Object3D();
    const mesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ name: 'MAT_METAL' }));
    root.add(mesh);
    applyEngineLook(root, { outline: true, elementHint: 'fire' });
    expect(mesh.material.type).toBe('MeshToonMaterial');
    expect((mesh.material as { name: string }).name).toBe('MAT_METAL');
    expect(mesh.children.some((c) => c.name === '__engineToonOutline')).toBe(true);
  });

  it('survives meshes without materials', () => {
    const root = new Object3D();
    const mesh = new Mesh(new BoxGeometry(0.5, 0.5, 0.5));
    // three always assigns a default material; clear to simulate odd GLB
    (mesh as { material: unknown }).material = undefined;
    root.add(mesh);
    expect(() => applyEngineLook(root, { outline: false })).not.toThrow();
    expect(mesh.material).toBeTruthy();
  });
});

describe('shouldEnableEngineOutline', () => {
  it('disables when reduced motion', () => {
    expect(shouldEnableEngineOutline(true)).toBe(false);
  });
});
