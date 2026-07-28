/**
 * One-shot generator: tiny box GLBs with named EMPTY socket nodes for MVP×3.
 * Location: scripts/generate-mvp-placeholder-glbs.ts
 *
 * Run: npx tsx scripts/generate-mvp-placeholder-glbs.ts
 * Output: public/engine-parts/mvp/*.glb
 */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Document, NodeIO } from '@gltf-transform/core';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'engine-parts', 'mvp');

type Vec3 = [number, number, number];

interface PartGlbSpec {
  fileName: string;
  rootName: string;
  /** Box half-extents (world units). */
  boxHalf: Vec3;
  sockets: ReadonlyArray<{ name: string; translation: Vec3 }>;
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

const PARTS: readonly PartGlbSpec[] = [
  {
    fileName: 'v3-part-water-traeger-01.glb',
    rootName: 'water_traeger_01',
    boxHalf: [0.6, 0.15, 0.25],
    sockets: [
      { name: 'SOCKET_DRIVE', translation: [0, 0.2, 0] },
      { name: 'SOCKET_VFX_REAR', translation: [0, 0, -0.35] },
    ],
  },
  {
    fileName: 'v3-part-shadow-antrieb-01.glb',
    rootName: 'shadow_antrieb_01',
    boxHalf: [0.25, 0.25, 0.35],
    sockets: [
      { name: 'SOCKET_OUTPUT', translation: [0, 0.3, 0] },
      { name: 'SOCKET_VFX_CORE', translation: [0, 0, 0] },
    ],
  },
  {
    fileName: 'v3-part-light-aufsatz-01.glb',
    rootName: 'light_aufsatz_01',
    boxHalf: [0.2, 0.35, 0.2],
    sockets: [{ name: 'SOCKET_ATTACK_ORIGIN', translation: [0, 0.45, 0.1] }],
  },
];

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const part of PARTS) {
    const path = await writePartGlb(part);
    console.log(`wrote ${path}`);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
