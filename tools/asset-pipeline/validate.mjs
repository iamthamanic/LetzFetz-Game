#!/usr/bin/env node
/**
 * Asset pipeline: validate a Fetzgerät part GLB (sockets + budgets).
 * Location: tools/asset-pipeline/validate.mjs
 *
 * Exit codes (audio-forge style):
 *   0 — validation passed
 *   1 — validation failed (missing GLB / sockets / over budget / unknown id)
 *   2 — usage error (missing/invalid id)
 *
 * No Meshy / network.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SPECS_DIR = join(ROOT, 'docs', 'engine-system', 'specs');
const GLB_DIR = join(ROOT, 'public', 'engine-parts', 'mvp');

/** Default when spec omits budgets (production-ish ceiling). */
const DEFAULT_MAX_TRIANGLES = 12_000;
const DEFAULT_MAX_BYTES = 512 * 1024;

function usage() {
  console.error(`Usage: npm run asset:validate -- <asset-id>

DE: Validiert Fetzgerät-Part (GLB-Existenz, Socket-Nodes, Budget).
EN: Validates engine part asset (GLB exists, socket nodes, budgets).

Examples:
  npm run asset:validate -- v3-part-water-traeger-01
`);
}

/** Reject path traversal / separators — asset ids are single path segments. */
function isSafeAssetId(id) {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id);
}

/**
 * @param {unknown} value
 * @returns {value is { id: string, slot?: string, sockets?: string[], budgets?: { maxTriangles?: number, maxBytes?: number } }}
 */
function isPartSpec(value) {
  if (value === null || typeof value !== 'object') return false;
  if (!('id' in value) || typeof value.id !== 'string') return false;
  return true;
}

/**
 * Parse GLB binary → glTF JSON + triangle estimate from mesh indices.
 * @param {Buffer} buf
 * @returns {{ nodeNames: string[], triangleCount: number } | { error: string }}
 */
function parseGlb(buf) {
  if (buf.length < 20) return { error: 'GLB too short' };
  const magic = buf.toString('utf8', 0, 4);
  if (magic !== 'glTF') return { error: 'Not a GLB (missing glTF magic)' };
  const version = buf.readUInt32LE(4);
  if (version !== 2) return { error: `Unsupported GLB version ${version}` };

  let offset = 12;
  /** @type {Record<string, unknown> | null} */
  let gltf = null;

  while (offset + 8 <= buf.length) {
    const chunkLength = buf.readUInt32LE(offset);
    const chunkType = buf.toString('utf8', offset + 4, offset + 8);
    offset += 8;
    if (offset + chunkLength > buf.length) {
      return { error: 'GLB chunk truncated' };
    }
    const chunk = buf.subarray(offset, offset + chunkLength);
    offset += chunkLength;
    // Pad to 4-byte alignment
    if (chunkLength % 4 !== 0) {
      offset += 4 - (chunkLength % 4);
    }
    if (chunkType === 'JSON') {
      try {
        const parsed = JSON.parse(chunk.toString('utf8'));
        if (parsed !== null && typeof parsed === 'object') {
          gltf = /** @type {Record<string, unknown>} */ (parsed);
        }
      } catch {
        return { error: 'GLB JSON chunk invalid' };
      }
    }
  }

  if (!gltf) return { error: 'GLB missing JSON chunk' };

  const nodes = Array.isArray(gltf.nodes) ? gltf.nodes : [];
  const nodeNames = nodes
    .map((n) =>
      n !== null && typeof n === 'object' && 'name' in n && typeof n.name === 'string'
        ? n.name
        : '',
    )
    .filter(Boolean);

  const accessors = Array.isArray(gltf.accessors) ? gltf.accessors : [];
  const meshes = Array.isArray(gltf.meshes) ? gltf.meshes : [];
  let triangleCount = 0;

  for (const mesh of meshes) {
    if (mesh === null || typeof mesh !== 'object') continue;
    const prims = 'primitives' in mesh && Array.isArray(mesh.primitives) ? mesh.primitives : [];
    for (const prim of prims) {
      if (prim === null || typeof prim !== 'object') continue;
      if ('indices' in prim && typeof prim.indices === 'number') {
        const acc = accessors[prim.indices];
        if (acc !== null && typeof acc === 'object' && 'count' in acc && typeof acc.count === 'number') {
          triangleCount += Math.floor(acc.count / 3);
          continue;
        }
      }
      const attrs =
        'attributes' in prim && prim.attributes !== null && typeof prim.attributes === 'object'
          ? /** @type {Record<string, unknown>} */ (prim.attributes)
          : null;
      if (attrs && typeof attrs.POSITION === 'number') {
        const acc = accessors[attrs.POSITION];
        if (acc !== null && typeof acc === 'object' && 'count' in acc && typeof acc.count === 'number') {
          triangleCount += Math.floor(acc.count / 3);
        }
      }
    }
  }

  return { nodeNames, triangleCount };
}

function loadRegisteredIds() {
  try {
    return new Set(
      readdirSync(SPECS_DIR)
        .filter((f) => f.endsWith('.json'))
        .map((f) => f.replace(/\.json$/, '')),
    );
  } catch {
    return new Set();
  }
}

/**
 * @param {string} assetId
 * @returns {{ ok: true, spec: ReturnType<typeof isPartSpec> extends never ? never : object } | { ok: false, reason: string }}
 */
function loadSpec(assetId) {
  const specPath = join(SPECS_DIR, `${assetId}.json`);
  if (!existsSync(specPath)) {
    return { ok: false, reason: `spec missing → ${specPath}` };
  }
  try {
    const raw = JSON.parse(readFileSync(specPath, 'utf8'));
    if (!isPartSpec(raw)) {
      return { ok: false, reason: 'spec JSON shape invalid (need id)' };
    }
    return { ok: true, spec: raw };
  } catch {
    return { ok: false, reason: 'spec JSON parse failed' };
  }
}

function main() {
  const assetId = process.argv[2];
  if (!assetId || assetId.startsWith('-')) {
    usage();
    process.exit(2);
  }
  if (!isSafeAssetId(assetId)) {
    console.error(
      'DE: Ungültige Asset-ID (nur Buchstaben, Ziffern, ._- ; kein Pfad).\nEN: Invalid asset id (no path separators or ..).',
    );
    process.exit(2);
  }

  const registered = loadRegisteredIds();
  const glbPath = join(GLB_DIR, `${assetId}.glb`);
  const previewPath = join(ROOT, 'public', 'cards', 'engine', `${assetId}.png`);
  const specPath = join(SPECS_DIR, `${assetId}.json`);

  /** @type {string[]} */
  const failures = [];

  if (!registered.has(assetId)) {
    failures.push(
      `registrySpec: no (not in ${registered.size} specs) — unknown asset id`,
    );
  }

  const specResult = loadSpec(assetId);
  /** @type {string[]} */
  let requiredSockets = [];
  let maxTriangles = DEFAULT_MAX_TRIANGLES;
  let maxBytes = DEFAULT_MAX_BYTES;

  if (!specResult.ok) {
    failures.push(`specJSON: ${specResult.reason}`);
  } else {
    const spec = specResult.spec;
    if (Array.isArray(spec.sockets)) {
      requiredSockets = spec.sockets.filter((s) => typeof s === 'string');
    }
    const budgets =
      spec.budgets !== null && typeof spec.budgets === 'object' ? spec.budgets : null;
    if (budgets && typeof budgets.maxTriangles === 'number' && budgets.maxTriangles > 0) {
      maxTriangles = budgets.maxTriangles;
    }
    if (budgets && typeof budgets.maxBytes === 'number' && budgets.maxBytes > 0) {
      maxBytes = budgets.maxBytes;
    }
  }

  const glbOk = existsSync(glbPath);
  const previewOk = existsSync(previewPath);
  const specOk = existsSync(specPath);

  let nodeNames = [];
  let triangleCount = 0;
  let byteSize = 0;

  if (!glbOk) {
    failures.push(`glb: missing → ${glbPath}`);
  } else {
    byteSize = statSync(glbPath).size;
    if (byteSize > maxBytes) {
      failures.push(`glb: ${byteSize} bytes > maxBytes ${maxBytes}`);
    }
    const parsed = parseGlb(readFileSync(glbPath));
    if ('error' in parsed) {
      failures.push(`glb: parse failed — ${parsed.error}`);
    } else {
      nodeNames = parsed.nodeNames;
      triangleCount = parsed.triangleCount;
      const nameSet = new Set(nodeNames);
      const missing = requiredSockets.filter((s) => !nameSet.has(s));
      if (missing.length > 0) {
        failures.push(`sockets: missing ${missing.join(', ')}`);
      }
      if (triangleCount > maxTriangles) {
        failures.push(`triangles: ${triangleCount} > maxTriangles ${maxTriangles}`);
      }
    }
  }

  const passed = failures.length === 0;
  const statusLine = passed ? 'PASS' : 'FAIL';

  console.log(`asset:validate (${statusLine})
DE: Status für „${assetId}"
EN: Status for "${assetId}"

  registrySpec: ${registered.has(assetId) ? 'yes' : `no (not in ${registered.size} specs)`}
  glb:          ${glbOk ? `ok → ${glbPath} (${byteSize} bytes)` : 'missing'}
  previewPNG:   ${previewOk ? `ok → ${previewPath}` : 'missing (optional)'}
  specJSON:     ${specOk ? `ok → ${specPath}` : 'missing'}
  sockets:      required [${requiredSockets.join(', ') || '(none)'}]
                found    [${nodeNames.filter((n) => n.startsWith('SOCKET_')).join(', ') || '(none)'}]
  triangles:    ${triangleCount} / max ${maxTriangles}
  maxBytes:     ${maxBytes}
`);

  if (!passed) {
    console.error('DE: Validierung fehlgeschlagen:');
    console.error('EN: Validation failed:');
    for (const f of failures) {
      console.error(`  - ${f}`);
    }
    process.exit(1);
  }

  console.log(
    'DE: Validierung OK — Sockets und Budgets innerhalb der Limits.\nEN: Validation OK — sockets and budgets within limits.',
  );
  process.exit(0);
}

main();
