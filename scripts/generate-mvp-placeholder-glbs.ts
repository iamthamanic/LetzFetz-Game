/**
 * Placeholder box GLBs with named EMPTY socket nodes for all 36 V3 parts.
 * Location: scripts/generate-mvp-placeholder-glbs.ts
 *
 * Run: npm run generate:mvp-engine-glbs
 *      npm run generate:engine-part-glbs -- --all
 * Output: public/engine-parts/mvp/*.glb + docs/engine-system/specs/*.json
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Document, NodeIO } from '@gltf-transform/core';
import { V3_ENGINE_PARTS_36 } from '../src/game/packs/v3/engineParts36';
import {
  BOX_HALF_BY_SLOT,
  SOCKETS_BY_SLOT,
  SOCKET_TRANSLATIONS,
} from '../src/services/engineAssets/slotSockets';
import type { EnginePartSocketName } from '../src/services/engineAssets/types';
import type { FetzgeraetSlot } from '../src/game/types/cards';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'engine-parts', 'mvp');
const SPECS_DIR = join(ROOT, 'docs', 'engine-system', 'specs');

type Vec3 = [number, number, number];

interface PartGlbSpec {
  fileName: string;
  rootName: string;
  boxHalf: Vec3;
  sockets: ReadonlyArray<{ name: EnginePartSocketName; translation: Vec3 }>;
}

/** Unit cube centred at origin — 8 verts, 12 tris. */
function createBoxMesh(document: Document, name: string, half: Vec3) {
  const [hx, hy, hz] = half;
  const buffer = document.createBuffer();

  const positions = new Float32Array([
    -hx, -hy, hz, hx, -hy, hz, hx, hy, hz, -hx, hy, hz, // front
    -hx, -hy, -hz, -hx, hy, -hz, hx, hy, -hz, hx, -hy, -hz, // back
  ]);

  const indices = new Uint16Array([
    0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // back
    3, 2, 6, 3, 6, 5, // top
    0, 4, 7, 0, 7, 1, // bottom
    1, 7, 6, 1, 6, 2, // right
    0, 3, 5, 0, 5, 4, // left
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
    .setBaseColorFactor([0.55, 0.55, 0.6, 1])
    .setMetallicFactor(0.1)
    .setRoughnessFactor(0.85);

  const prim = document
    .createPrimitive()
    .setAttribute('POSITION', position)
    .setIndices(index)
    .setMaterial(material);

  return document.createMesh(name).addPrimitive(prim);
}

async function writePartGlb(spec: PartGlbSpec): Promise<string> {
  const document = new Document();
  const mesh = createBoxMesh(document, `${spec.rootName}_mesh`, spec.boxHalf);
  const root = document.createNode(spec.rootName).setMesh(mesh);

  for (const socket of spec.sockets) {
    root.addChild(
      document.createNode(socket.name).setTranslation(socket.translation),
    );
  }

  document.createScene(spec.rootName).addChild(root);

  const outPath = join(OUT_DIR, spec.fileName);
  const io = new NodeIO();
  await io.write(outPath, document);
  return outPath;
}

function toGlbSpec(
  id: string,
  slot: FetzgeraetSlot,
): PartGlbSpec {
  const sockets = SOCKETS_BY_SLOT[slot].map((name) => ({
    name,
    translation: [...SOCKET_TRANSLATIONS[name]] as Vec3,
  }));
  const boxHalf = [...BOX_HALF_BY_SLOT[slot]] as Vec3;
  return {
    fileName: `${id}.glb`,
    rootName: id.replace(/^v3-part-/, '').replace(/-/g, '_'),
    boxHalf,
    sockets,
  };
}

interface PartSpecJson {
  id: string;
  name: string;
  slot: FetzgeraetSlot;
  element: string;
  sockets: readonly EnginePartSocketName[];
  modelUrl: string;
  previewUrl: string;
  budgets: {
    maxTriangles: number;
    maxTexturePx: number;
    placeholder: boolean;
  };
  version: number;
}

function writeSpecJson(part: {
  id: string;
  name: string;
  slot: FetzgeraetSlot;
  element: string;
}): string {
  const payload: PartSpecJson = {
    id: part.id,
    name: part.name,
    slot: part.slot,
    element: part.element,
    sockets: SOCKETS_BY_SLOT[part.slot],
    modelUrl: `/engine-parts/mvp/${part.id}.glb`,
    previewUrl: `/cards/engine/${part.id}.png`,
    budgets: {
      maxTriangles: 48,
      maxTexturePx: 0,
      placeholder: true,
    },
    version: 1,
  };
  const outPath = join(SPECS_DIR, `${part.id}.json`);
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return outPath;
}

function wantsAll(argv: string[]): boolean {
  return argv.includes('--all') || argv.includes('--mvp') || argv.length === 0;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (!wantsAll(argv) && argv.some((a) => a.startsWith('-'))) {
    console.error(
      'Usage: npm run generate:engine-part-glbs [-- --all]\nWrites all 36 V3 placeholder GLBs + specs.',
    );
    process.exit(2);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(SPECS_DIR, { recursive: true });

  for (const part of V3_ENGINE_PARTS_36) {
    const glbPath = await writePartGlb(toGlbSpec(part.id, part.slot));
    const specPath = writeSpecJson(part);
    console.log(`wrote ${glbPath}`);
    console.log(`wrote ${specPath}`);
  }

  console.log(`done: ${V3_ENGINE_PARTS_36.length} GLBs + specs`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
