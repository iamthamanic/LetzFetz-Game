/**
 * Generate distinctive low-poly pilot GLBs for the MVP trio (not unit boxes).
 * Location: scripts/generate-pilot-real-glbs.ts
 *
 * Run: npm run generate:pilot-engine-glbs
 * Parts: water-traeger-01, shadow-antrieb-01, light-aufsatz-01
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

const PILOT_PARTS = [
  {
    id: 'v3-part-water-traeger-01',
    name: 'Wasser-Träger 01',
    slot: 'traeger' as FetzgeraetSlot,
    element: 'water',
    color: [0.25, 0.55, 0.85, 1] as Vec4,
    kind: 'carrier' as const,
  },
  {
    id: 'v3-part-shadow-antrieb-01',
    name: 'Schatten-Antrieb 01',
    slot: 'antrieb' as FetzgeraetSlot,
    element: 'shadow',
    color: [0.35, 0.2, 0.55, 1] as Vec4,
    kind: 'drive' as const,
  },
  {
    id: 'v3-part-light-aufsatz-01',
    name: 'Licht-Aufsatz 01',
    slot: 'aufsatz' as FetzgeraetSlot,
    element: 'light',
    color: [0.95, 0.9, 0.45, 1] as Vec4,
    kind: 'attachment' as const,
  },
] as const;

const PILOT_MAX_TRIANGLES = 256;

/** Extruded N-gon prism (top + bottom + sides). */
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

  // bottom fan (y=-halfH), top fan (y=+halfH)
  const bottomCenter = positions.length / 3;
  positions.push(0, -halfH, 0);
  const topCenter = positions.length / 3;
  positions.push(0, halfH, 0);

  for (let i = 0; i < sides; i++) {
    const i0 = i * 2;
    const i1 = ((i + 1) % sides) * 2;
    // bottom
    indices.push(bottomCenter, i1, i0);
    // top
    indices.push(topCenter, i0 + 1, i1 + 1);
    // side quad → 2 tris
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

/** Pointy spike (pyramid) for Aufsatz silhouette. */
function createSpikeMesh(document: Document, name: string, color: Vec4) {
  const buffer = document.createBuffer();
  // square base + tip
  const hx = 0.18;
  const hy = 0.05;
  const tipY = 0.55;
  const positions = new Float32Array([
    -hx, hy, -hx, hx, hy, -hx, hx, hy, hx, -hx, hy, hx, // base y=hy
    0, tipY, 0, // tip
    -hx, 0, -hx, hx, 0, -hx, hx, 0, hx, -hx, 0, hx, // bottom
  ]);
  const indices = new Uint16Array([
    // sides to tip
    0, 1, 4, 1, 2, 4, 2, 3, 4, 3, 0, 4,
    // base bottom
    5, 8, 7, 5, 7, 6,
    // connect base ring to bottom
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

async function writePilotGlb(part: (typeof PILOT_PARTS)[number]): Promise<string> {
  const document = new Document();
  const rootName = part.id.replace(/^v3-part-/, '').replace(/-/g, '_');
  let mesh;
  if (part.kind === 'carrier') {
    // Elongated octagon chassis — not a unit box
    mesh = createPrismMesh(document, `${rootName}_mesh`, 0.55, 0.12, 8, part.color, 0.85);
  } else if (part.kind === 'drive') {
    // Tapered hex drive core
    mesh = createPrismMesh(document, `${rootName}_mesh`, 0.28, 0.32, 6, part.color, 0.55);
  } else {
    mesh = createSpikeMesh(document, `${rootName}_mesh`, part.color);
  }

  const root = document.createNode(rootName).setMesh(mesh);
  for (const socketName of SOCKETS_BY_SLOT[part.slot]) {
    const t = SOCKET_TRANSLATIONS[socketName as EnginePartSocketName];
    root.addChild(
      document.createNode(socketName).setTranslation([...t] as Vec3),
    );
  }
  document.createScene(rootName).addChild(root);

  const outPath = join(OUT_DIR, `${part.id}.glb`);
  await new NodeIO().write(outPath, document);
  return outPath;
}

function writePilotSpec(part: (typeof PILOT_PARTS)[number]): string {
  const payload = {
    id: part.id,
    name: part.name,
    slot: part.slot,
    element: part.element,
    sockets: SOCKETS_BY_SLOT[part.slot],
    modelUrl: `/engine-parts/mvp/${part.id}.glb`,
    previewUrl: `/cards/engine/${part.id}.png`,
    budgets: {
      maxTriangles: PILOT_MAX_TRIANGLES,
      maxTexturePx: 0,
      placeholder: false,
    },
    version: 2,
    pilot: true,
  };
  const outPath = join(SPECS_DIR, `${part.id}.json`);
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return outPath;
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(SPECS_DIR, { recursive: true });

  for (const part of PILOT_PARTS) {
    const glb = await writePilotGlb(part);
    const spec = writePilotSpec(part);
    console.log(`wrote ${glb}`);
    console.log(`wrote ${spec}`);
  }
  console.log(`done: ${PILOT_PARTS.length} pilot GLBs + specs (placeholder=false)`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
