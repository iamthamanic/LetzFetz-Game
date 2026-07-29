/**
 * Generate distinctive low-poly GLBs for Batch A (fire + remaining water).
 * Location: scripts/generate-batch-a-glbs.ts
 *
 * Run: npm run generate:batch-a-engine-glbs
 * Excludes pilot `v3-part-water-traeger-01` (use generate:pilot-engine-glbs).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Document, NodeIO } from '@gltf-transform/core';
import {
  SOCKETS_BY_SLOT,
  SOCKET_TRANSLATIONS,
} from '../src/services/engineAssets/slotSockets';
import type { EnginePartSocketName } from '../src/services/engineAssets/types';
import type { FetzgeraetSlot } from '../src/game/types/cards';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'engine-parts', 'mvp');
const SPECS_DIR = join(ROOT, 'docs', 'engine-system', 'specs');

type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];

type Kind = 'carrier' | 'drive' | 'attachment';

interface BatchPart {
  id: string;
  name: string;
  slot: FetzgeraetSlot;
  element: 'fire' | 'water';
  color: Vec4;
  kind: Kind;
  /** Slight silhouette variance between 01/02. */
  variant: 1 | 2;
}

const FIRE: Vec4 = [0.9, 0.35, 0.12, 1];
const WATER: Vec4 = [0.2, 0.5, 0.8, 1];

const BATCH_A: BatchPart[] = [
  // Fire × 6
  {
    id: 'v3-part-fire-traeger-01',
    name: 'Feuer-Träger 01',
    slot: 'traeger',
    element: 'fire',
    color: FIRE,
    kind: 'carrier',
    variant: 1,
  },
  {
    id: 'v3-part-fire-traeger-02',
    name: 'Feuer-Träger 02',
    slot: 'traeger',
    element: 'fire',
    color: [0.85, 0.28, 0.1, 1],
    kind: 'carrier',
    variant: 2,
  },
  {
    id: 'v3-part-fire-antrieb-01',
    name: 'Feuer-Antrieb 01',
    slot: 'antrieb',
    element: 'fire',
    color: FIRE,
    kind: 'drive',
    variant: 1,
  },
  {
    id: 'v3-part-fire-antrieb-02',
    name: 'Feuer-Antrieb 02',
    slot: 'antrieb',
    element: 'fire',
    color: [0.95, 0.4, 0.15, 1],
    kind: 'drive',
    variant: 2,
  },
  {
    id: 'v3-part-fire-aufsatz-01',
    name: 'Feuer-Aufsatz 01',
    slot: 'aufsatz',
    element: 'fire',
    color: FIRE,
    kind: 'attachment',
    variant: 1,
  },
  {
    id: 'v3-part-fire-aufsatz-02',
    name: 'Feuer-Aufsatz 02',
    slot: 'aufsatz',
    element: 'fire',
    color: [1, 0.45, 0.2, 1],
    kind: 'attachment',
    variant: 2,
  },
  // Remaining water (exclude pilot water-traeger-01)
  {
    id: 'v3-part-water-traeger-02',
    name: 'Wasser-Träger 02',
    slot: 'traeger',
    element: 'water',
    color: [0.18, 0.48, 0.78, 1],
    kind: 'carrier',
    variant: 2,
  },
  {
    id: 'v3-part-water-antrieb-01',
    name: 'Wasser-Antrieb 01',
    slot: 'antrieb',
    element: 'water',
    color: WATER,
    kind: 'drive',
    variant: 1,
  },
  {
    id: 'v3-part-water-antrieb-02',
    name: 'Wasser-Antrieb 02',
    slot: 'antrieb',
    element: 'water',
    color: [0.15, 0.45, 0.75, 1],
    kind: 'drive',
    variant: 2,
  },
  {
    id: 'v3-part-water-aufsatz-01',
    name: 'Wasser-Aufsatz 01',
    slot: 'aufsatz',
    element: 'water',
    color: WATER,
    kind: 'attachment',
    variant: 1,
  },
  {
    id: 'v3-part-water-aufsatz-02',
    name: 'Wasser-Aufsatz 02',
    slot: 'aufsatz',
    element: 'water',
    color: [0.22, 0.55, 0.88, 1],
    kind: 'attachment',
    variant: 2,
  },
];

const BATCH_MAX_TRIANGLES = 256;

function createPrismMesh(
  document: Document,
  name: string,
  radius: number,
  halfH: number,
  sides: number,
  color: Vec4,
  taperTop = 1,
) {
  const buffer = document.createBuffer();
  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    positions.push(c * radius, -halfH, s * radius);
    positions.push(c * radius * taperTop, halfH, s * radius * taperTop);
  }

  const bottomCenter = positions.length / 3;
  positions.push(0, -halfH, 0);
  const topCenter = positions.length / 3;
  positions.push(0, halfH, 0);

  for (let i = 0; i < sides; i++) {
    const i0 = i * 2;
    const i1 = ((i + 1) % sides) * 2;
    indices.push(bottomCenter, i1, i0);
    indices.push(topCenter, i0 + 1, i1 + 1);
    indices.push(i0, i1, i0 + 1);
    indices.push(i1, i1 + 1, i0 + 1);
  }

  const position = document
    .createAccessor()
    .setType('VEC3')
    .setArray(new Float32Array(positions))
    .setBuffer(buffer);
  const index = document
    .createAccessor()
    .setType('SCALAR')
    .setArray(new Uint16Array(indices))
    .setBuffer(buffer);
  const material = document
    .createMaterial(`${name}Mat`)
    .setBaseColorFactor(color)
    .setMetallicFactor(0.2)
    .setRoughnessFactor(0.65);
  const prim = document
    .createPrimitive()
    .setAttribute('POSITION', position)
    .setIndices(index)
    .setMaterial(material);
  return document.createMesh(name).addPrimitive(prim);
}

function createSpikeMesh(
  document: Document,
  name: string,
  color: Vec4,
  variant: 1 | 2,
) {
  const buffer = document.createBuffer();
  const hx = variant === 1 ? 0.18 : 0.22;
  const hy = 0.05;
  const tipY = variant === 1 ? 0.55 : 0.48;
  const positions = new Float32Array([
    -hx, hy, -hx, hx, hy, -hx, hx, hy, hx, -hx, hy, hx,
    0, tipY, 0,
    -hx, 0, -hx, hx, 0, -hx, hx, 0, hx, -hx, 0, hx,
  ]);
  const indices = new Uint16Array([
    0, 1, 4, 1, 2, 4, 2, 3, 4, 3, 0, 4,
    5, 8, 7, 5, 7, 6,
    0, 5, 6, 0, 6, 1, 1, 6, 7, 1, 7, 2, 2, 7, 8, 2, 8, 3, 3, 8, 5, 3, 5, 0,
  ]);
  const position = document
    .createAccessor()
    .setType('VEC3')
    .setArray(positions)
    .setBuffer(buffer);
  const index = document
    .createAccessor()
    .setType('SCALAR')
    .setArray(indices)
    .setBuffer(buffer);
  const material = document
    .createMaterial(`${name}Mat`)
    .setBaseColorFactor(color)
    .setMetallicFactor(0.35)
    .setRoughnessFactor(0.4);
  const prim = document
    .createPrimitive()
    .setAttribute('POSITION', position)
    .setIndices(index)
    .setMaterial(material);
  return document.createMesh(name).addPrimitive(prim);
}

async function writeGlb(part: BatchPart): Promise<string> {
  const document = new Document();
  const rootName = part.id.replace(/^v3-part-/, '').replace(/-/g, '_');
  let mesh;
  if (part.kind === 'carrier') {
    const sides = part.variant === 1 ? 8 : 6;
    const radius = part.variant === 1 ? 0.55 : 0.5;
    mesh = createPrismMesh(
      document,
      `${rootName}_mesh`,
      radius,
      0.12,
      sides,
      part.color,
      part.variant === 1 ? 0.85 : 0.7,
    );
  } else if (part.kind === 'drive') {
    const sides = part.variant === 1 ? 6 : 5;
    mesh = createPrismMesh(
      document,
      `${rootName}_mesh`,
      part.variant === 1 ? 0.28 : 0.32,
      part.variant === 1 ? 0.32 : 0.28,
      sides,
      part.color,
      part.variant === 1 ? 0.55 : 0.7,
    );
  } else {
    mesh = createSpikeMesh(document, `${rootName}_mesh`, part.color, part.variant);
  }

  const root = document.createNode(rootName).setMesh(mesh);
  for (const socketName of SOCKETS_BY_SLOT[part.slot]) {
    const t = SOCKET_TRANSLATIONS[socketName as EnginePartSocketName];
    root.addChild(document.createNode(socketName).setTranslation([...t] as Vec3));
  }
  document.createScene(rootName).addChild(root);

  const outPath = join(OUT_DIR, `${part.id}.glb`);
  await new NodeIO().write(outPath, document);
  return outPath;
}

function writeSpec(part: BatchPart): string {
  const payload = {
    id: part.id,
    name: part.name,
    slot: part.slot,
    element: part.element,
    sockets: SOCKETS_BY_SLOT[part.slot],
    modelUrl: `/engine-parts/mvp/${part.id}.glb`,
    previewUrl: `/cards/engine/${part.id}.png`,
    budgets: {
      maxTriangles: BATCH_MAX_TRIANGLES,
      maxTexturePx: 0,
      placeholder: false,
    },
    version: 2,
    batch: 'A',
  };
  const outPath = join(SPECS_DIR, `${part.id}.json`);
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return outPath;
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(SPECS_DIR, { recursive: true });

  for (const part of BATCH_A) {
    const glb = await writeGlb(part);
    const spec = writeSpec(part);
    console.log(`wrote ${glb}`);
    console.log(`wrote ${spec}`);
  }
  console.log(`done: ${BATCH_A.length} Batch-A GLBs + specs (placeholder=false)`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
