/**
 * Distinctive low-poly GLBs for production batches A/B/C.
 * Location: scripts/generate-batch-glbs.ts
 *
 *   npm run generate:batch-a-engine-glbs  → --batch=A
 *   npm run generate:batch-b-engine-glbs  → --batch=B
 *   npm run generate:batch-c-engine-glbs  → --batch=C
 *
 * Pilots excluded: water-traeger-01, shadow-antrieb-01, light-aufsatz-01.
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
type Element =
  | 'fire'
  | 'water'
  | 'earth'
  | 'air'
  | 'light'
  | 'shadow';
type BatchId = 'A' | 'B' | 'C';

interface BatchPart {
  id: string;
  name: string;
  slot: FetzgeraetSlot;
  element: Element;
  color: Vec4;
  kind: Kind;
  variant: 1 | 2;
  batch: BatchId;
}

const COLORS: Record<Element, Vec4> = {
  fire: [0.9, 0.35, 0.12, 1],
  water: [0.2, 0.5, 0.8, 1],
  earth: [0.55, 0.42, 0.22, 1],
  air: [0.7, 0.85, 0.95, 1],
  light: [0.95, 0.9, 0.45, 1],
  shadow: [0.35, 0.2, 0.55, 1],
};

const DE_SLOT: Record<FetzgeraetSlot, string> = {
  traeger: 'Träger',
  antrieb: 'Antrieb',
  aufsatz: 'Aufsatz',
};

const DE_ELEMENT: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  light: 'Licht',
  shadow: 'Schatten',
};

function part(
  element: Element,
  slot: FetzgeraetSlot,
  n: 1 | 2,
  batch: BatchId,
  color: Vec4 = COLORS[element],
): BatchPart {
  const kind: Kind =
    slot === 'traeger' ? 'carrier' : slot === 'antrieb' ? 'drive' : 'attachment';
  return {
    id: `v3-part-${element}-${slot}-0${n}`,
    name: `${DE_ELEMENT[element]}-${DE_SLOT[slot]} 0${n}`,
    slot,
    element,
    color,
    kind,
    variant: n,
    batch,
  };
}

function allSlots(element: Element, batch: BatchId): BatchPart[] {
  const slots: FetzgeraetSlot[] = ['traeger', 'antrieb', 'aufsatz'];
  const out: BatchPart[] = [];
  for (const slot of slots) {
    out.push(part(element, slot, 1, batch));
    out.push(part(element, slot, 2, batch));
  }
  return out;
}

/** Batch A: fire ×6 + remaining water (no pilot water-traeger-01). */
const BATCH_A: BatchPart[] = [
  ...allSlots('fire', 'A'),
  part('water', 'traeger', 2, 'A', [0.18, 0.48, 0.78, 1]),
  part('water', 'antrieb', 1, 'A'),
  part('water', 'antrieb', 2, 'A', [0.15, 0.45, 0.75, 1]),
  part('water', 'aufsatz', 1, 'A'),
  part('water', 'aufsatz', 2, 'A', [0.22, 0.55, 0.88, 1]),
];

/** Batch B: earth ×6 + air ×6. */
const BATCH_B: BatchPart[] = [...allSlots('earth', 'B'), ...allSlots('air', 'B')];

/** Batch C: remaining light + shadow (exclude pilots). */
const BATCH_C: BatchPart[] = [
  part('light', 'traeger', 1, 'C'),
  part('light', 'traeger', 2, 'C', [0.98, 0.92, 0.55, 1]),
  part('light', 'antrieb', 1, 'C'),
  part('light', 'antrieb', 2, 'C', [0.92, 0.88, 0.4, 1]),
  part('light', 'aufsatz', 2, 'C', [1, 0.95, 0.5, 1]),
  part('shadow', 'traeger', 1, 'C'),
  part('shadow', 'traeger', 2, 'C', [0.3, 0.15, 0.5, 1]),
  part('shadow', 'antrieb', 2, 'C', [0.4, 0.22, 0.6, 1]),
  part('shadow', 'aufsatz', 1, 'C'),
  part('shadow', 'aufsatz', 2, 'C', [0.28, 0.18, 0.48, 1]),
];

const BY_BATCH: Record<BatchId, BatchPart[]> = {
  A: BATCH_A,
  B: BATCH_B,
  C: BATCH_C,
};

const MAX_TRIANGLES = 256;

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
    positions.push(Math.cos(a) * radius, -halfH, Math.sin(a) * radius);
    positions.push(
      Math.cos(a) * radius * taperTop,
      halfH,
      Math.sin(a) * radius * taperTop,
    );
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
  return document
    .createMesh(name)
    .addPrimitive(
      document
        .createPrimitive()
        .setAttribute('POSITION', position)
        .setIndices(index)
        .setMaterial(material),
    );
}

function createSpikeMesh(
  document: Document,
  name: string,
  color: Vec4,
  variant: 1 | 2,
) {
  const buffer = document.createBuffer();
  const hx = variant === 1 ? 0.18 : 0.22;
  const tipY = variant === 1 ? 0.55 : 0.48;
  const positions = new Float32Array([
    -hx, 0.05, -hx, hx, 0.05, -hx, hx, 0.05, hx, -hx, 0.05, hx, 0, tipY, 0, -hx,
    0, -hx, hx, 0, -hx, hx, 0, hx, -hx, 0, hx,
  ]);
  const indices = new Uint16Array([
    0, 1, 4, 1, 2, 4, 2, 3, 4, 3, 0, 4, 5, 8, 7, 5, 7, 6, 0, 5, 6, 0, 6, 1, 1, 6,
    7, 1, 7, 2, 2, 7, 8, 2, 8, 3, 3, 8, 5, 3, 5, 0,
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
  return document
    .createMesh(name)
    .addPrimitive(
      document
        .createPrimitive()
        .setAttribute('POSITION', position)
        .setIndices(index)
        .setMaterial(material),
    );
}

async function writeGlb(partDef: BatchPart): Promise<string> {
  const document = new Document();
  const rootName = partDef.id.replace(/^v3-part-/, '').replace(/-/g, '_');
  let mesh;
  if (partDef.kind === 'carrier') {
    mesh = createPrismMesh(
      document,
      `${rootName}_mesh`,
      partDef.variant === 1 ? 0.55 : 0.5,
      0.12,
      partDef.variant === 1 ? 8 : 6,
      partDef.color,
      partDef.variant === 1 ? 0.85 : 0.7,
    );
  } else if (partDef.kind === 'drive') {
    mesh = createPrismMesh(
      document,
      `${rootName}_mesh`,
      partDef.variant === 1 ? 0.28 : 0.32,
      partDef.variant === 1 ? 0.32 : 0.28,
      partDef.variant === 1 ? 6 : 5,
      partDef.color,
      partDef.variant === 1 ? 0.55 : 0.7,
    );
  } else {
    mesh = createSpikeMesh(
      document,
      `${rootName}_mesh`,
      partDef.color,
      partDef.variant,
    );
  }
  const root = document.createNode(rootName).setMesh(mesh);
  for (const socketName of SOCKETS_BY_SLOT[partDef.slot]) {
    const t = SOCKET_TRANSLATIONS[socketName as EnginePartSocketName];
    root.addChild(document.createNode(socketName).setTranslation([...t] as Vec3));
  }
  document.createScene(rootName).addChild(root);
  const outPath = join(OUT_DIR, `${partDef.id}.glb`);
  await new NodeIO().write(outPath, document);
  return outPath;
}

function writeSpec(partDef: BatchPart): string {
  const payload = {
    id: partDef.id,
    name: partDef.name,
    slot: partDef.slot,
    element: partDef.element,
    sockets: SOCKETS_BY_SLOT[partDef.slot],
    modelUrl: `/engine-parts/mvp/${partDef.id}.glb`,
    previewUrl: `/cards/engine/${partDef.id}.png`,
    budgets: {
      maxTriangles: MAX_TRIANGLES,
      maxTexturePx: 0,
      placeholder: false,
    },
    version: 2,
    batch: partDef.batch,
  };
  const outPath = join(SPECS_DIR, `${partDef.id}.json`);
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return outPath;
}

function parseBatch(argv: string[]): BatchId {
  const flag = argv.find((a) => a.startsWith('--batch='));
  const raw = (flag?.slice('--batch='.length) ?? argv[0] ?? 'A').toUpperCase();
  if (raw === 'A' || raw === 'B' || raw === 'C') return raw;
  console.error('Usage: npx tsx scripts/generate-batch-glbs.ts --batch=A|B|C');
  process.exit(2);
}

async function main(): Promise<void> {
  const batch = parseBatch(process.argv.slice(2));
  const parts = BY_BATCH[batch];
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(SPECS_DIR, { recursive: true });
  for (const p of parts) {
    console.log(`wrote ${await writeGlb(p)}`);
    console.log(`wrote ${writeSpec(p)}`);
  }
  console.log(`done: Batch ${batch} — ${parts.length} GLBs + specs`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
