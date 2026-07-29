/**
 * Central toon materials + optional edge outline for Fetzgerät GLBs.
 * Location: src/components/engine3d/three/EngineMaterials.ts
 * Gameplay never reads these names (ADR D6).
 */
import {
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshToonMaterial,
  type Material,
  type Object3D,
} from 'three';

/** Semantic classes from asset-specification / Brief §11. */
export type EngineMaterialClass =
  | 'MAT_METAL'
  | 'MAT_RUBBER'
  | 'MAT_GLASS'
  | 'MAT_WOOD'
  | 'MAT_CONCRETE'
  | 'MAT_CERAMIC'
  | 'MAT_ELEMENT_CORE'
  | 'MAT_EMISSION'
  | 'MAT_FALLBACK';

export type EngineElementHint =
  | 'fire'
  | 'water'
  | 'earth'
  | 'air'
  | 'light'
  | 'shadow';

const TOON_COLORS: Record<EngineMaterialClass, string> = {
  MAT_METAL: '#9ca3af',
  MAT_RUBBER: '#292524',
  MAT_GLASS: '#a5f3fc',
  MAT_WOOD: '#a16207',
  MAT_CONCRETE: '#78716c',
  MAT_CERAMIC: '#e7e5e4',
  MAT_ELEMENT_CORE: '#fbbf24',
  MAT_EMISSION: '#fde68a',
  MAT_FALLBACK: '#a8a29e',
};

const ELEMENT_TINT: Record<EngineElementHint, string> = {
  fire: '#f97316',
  water: '#38bdf8',
  earth: '#a3a3a3',
  air: '#d4d4d8',
  light: '#fef08a',
  shadow: '#44403c',
};

const OUTLINE_NAME = '__engineToonOutline';

export interface ApplyEngineLookOptions {
  /** Soft element tint on MAT_ELEMENT_CORE / fallback when known. */
  elementHint?: EngineElementHint | null;
  /** Edge outline (off for reduced-motion / low-end). */
  outline?: boolean;
}

/** Map glTF material name → semantic class; unknown → MAT_FALLBACK. */
export function resolveMaterialClass(materialName: string | undefined): EngineMaterialClass {
  if (!materialName) return 'MAT_FALLBACK';
  const upper = materialName.toUpperCase();
  const known: EngineMaterialClass[] = [
    'MAT_METAL',
    'MAT_RUBBER',
    'MAT_GLASS',
    'MAT_WOOD',
    'MAT_CONCRETE',
    'MAT_CERAMIC',
    'MAT_ELEMENT_CORE',
    'MAT_EMISSION',
  ];
  for (const key of known) {
    if (upper.includes(key) || upper.startsWith(key.replace('MAT_', ''))) {
      return key;
    }
  }
  if (/metal|steel|iron/i.test(materialName)) return 'MAT_METAL';
  if (/rubber|hose/i.test(materialName)) return 'MAT_RUBBER';
  if (/glass|transp/i.test(materialName)) return 'MAT_GLASS';
  if (/wood|timber/i.test(materialName)) return 'MAT_WOOD';
  if (/concrete|stone/i.test(materialName)) return 'MAT_CONCRETE';
  if (/ceramic|porcelain/i.test(materialName)) return 'MAT_CERAMIC';
  if (/emiss|glow|light/i.test(materialName)) return 'MAT_EMISSION';
  if (/core|element/i.test(materialName)) return 'MAT_ELEMENT_CORE';
  return 'MAT_FALLBACK';
}

/** Parse element from part id (`v3-part-water-traeger-01`). Cosmetic only. */
export function elementHintFromPartId(partId: string): EngineElementHint | null {
  const match = /^v3-part-(fire|water|earth|air|light|shadow)-/i.exec(partId);
  if (!match?.[1]) return null;
  return match[1].toLowerCase() as EngineElementHint;
}

function hexToColor(hex: string): Color {
  return new Color(hex);
}

/** Build a MeshToonMaterial for a semantic class (+ optional element tint). */
export function createToonMaterial(
  materialClass: EngineMaterialClass,
  elementHint?: EngineElementHint | null,
): MeshToonMaterial {
  let hex = TOON_COLORS[materialClass];
  if (
    elementHint &&
    (materialClass === 'MAT_ELEMENT_CORE' ||
      materialClass === 'MAT_EMISSION' ||
      materialClass === 'MAT_FALLBACK')
  ) {
    hex = ELEMENT_TINT[elementHint];
  }
  const mat = new MeshToonMaterial({
    color: hexToColor(hex),
    transparent: materialClass === 'MAT_GLASS',
    opacity: materialClass === 'MAT_GLASS' ? 0.65 : 1,
  });
  if (materialClass === 'MAT_EMISSION') {
    mat.emissive = hexToColor(hex);
    mat.emissiveIntensity = 0.45;
  }
  mat.name = materialClass;
  mat.userData.engineMaterialClass = materialClass;
  return mat;
}

function isMesh(node: Object3D): node is Mesh {
  return (node as Mesh).isMesh === true;
}

function replaceMaterial(
  source: Material,
  elementHint?: EngineElementHint | null,
): MeshToonMaterial {
  const cls = resolveMaterialClass(source.name);
  return createToonMaterial(cls, elementHint);
}

function stripPreviousOutlines(root: Object3D): void {
  const toRemove: Object3D[] = [];
  root.traverse((node) => {
    if (node.name === OUTLINE_NAME) toRemove.push(node);
  });
  for (const node of toRemove) {
    node.parent?.remove(node);
    if (node instanceof LineSegments) {
      node.geometry.dispose();
      const mat = node.material;
      if (!Array.isArray(mat)) mat.dispose();
    }
  }
}

function addEdgeOutline(mesh: Mesh): void {
  const existing = mesh.children.find((c) => c.name === OUTLINE_NAME);
  if (existing) return;
  const edges = new EdgesGeometry(mesh.geometry, 40);
  const lines = new LineSegments(
    edges,
    new LineBasicMaterial({ color: 0x0c0a09, transparent: true, opacity: 0.85 }),
  );
  lines.name = OUTLINE_NAME;
  lines.renderOrder = 2;
  mesh.add(lines);
}

/**
 * Remap every mesh material on a cloned part scene to central toon materials.
 * Safe on unknown materials (fallback toon). Does not throw.
 */
export function applyEngineLook(root: Object3D, options: ApplyEngineLookOptions = {}): void {
  const { elementHint = null, outline = true } = options;
  stripPreviousOutlines(root);

  root.traverse((node) => {
    if (!isMesh(node)) return;
    try {
      const current = node.material;
      if (Array.isArray(current)) {
        node.material = current.map((m) => replaceMaterial(m, elementHint));
      } else if (current) {
        node.material = replaceMaterial(current, elementHint);
      } else {
        node.material = createToonMaterial('MAT_FALLBACK', elementHint);
      }
      if (outline) addEdgeOutline(node);
    } catch {
      node.material = createToonMaterial('MAT_FALLBACK', elementHint);
    }
  });
}

/** Whether outline should run (motion + coarse hardware budget). */
export function shouldEnableEngineOutline(reducedMotion: boolean): boolean {
  if (reducedMotion) return false;
  if (typeof navigator === 'undefined') return true;
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === 'number' && cores > 0 && cores <= 2) return false;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof memory === 'number' && memory > 0 && memory <= 2) return false;
  return true;
}
