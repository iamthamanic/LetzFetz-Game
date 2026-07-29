#!/usr/bin/env node
/**
 * Asset pipeline: optimize GLB via @gltf-transform/core (repack) + byte budget.
 * Location: tools/asset-pipeline/optimize.mjs
 *
 * Exit codes:
 *   0 — GLB rewritten within budget
 *   1 — missing GLB / I/O fail / over maxBytes
 *   2 — usage error
 *
 * YAGNI: no Draco/meshopt CLI yet — core repack only. Heavy compress = later.
 * Default overwrites public/engine-parts/mvp/<id>.glb (use --out or git).
 * No Meshy / network.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SPECS_DIR = join(ROOT, 'docs', 'engine-system', 'specs');
const DEFAULT_MAX_BYTES = 512 * 1024;

function usage() {
  console.error(`Usage: npm run asset:optimize -- <asset-id> [--out path.glb]

DE: Packt GLB neu (gltf-transform) und prüft Byte-Budget aus Spec.
EN: Repacks GLB (gltf-transform) and checks byte budget from spec.

Overwrite: default writes back to public/engine-parts/mvp/<id>.glb.
  Use --out <path> for an alternate file, or git checkout to restore.
  Draco/meshopt compression is out of scope (add @gltf-transform/functions later).

Examples:
  npm run asset:optimize -- v3-part-water-traeger-01
  npm run asset:optimize -- v3-part-water-traeger-01 --out /tmp/water-opt.glb
`);
}

function isSafeAssetId(id) {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id);
}

/**
 * @param {unknown} value
 * @returns {value is { budgets?: { maxBytes?: number } }}
 */
function isPartSpec(value) {
  return value !== null && typeof value === 'object';
}

/**
 * @param {string} assetId
 * @returns {number}
 */
function maxBytesFor(assetId) {
  const specPath = join(SPECS_DIR, `${assetId}.json`);
  if (!existsSync(specPath)) return DEFAULT_MAX_BYTES;
  try {
    const raw = JSON.parse(readFileSync(specPath, 'utf8'));
    if (!isPartSpec(raw)) return DEFAULT_MAX_BYTES;
    const mb = raw.budgets?.maxBytes;
    return typeof mb === 'number' && mb > 0 ? mb : DEFAULT_MAX_BYTES;
  } catch {
    return DEFAULT_MAX_BYTES;
  }
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--');
  const outIdx = args.indexOf('--out');
  /** @type {string | null} */
  let outPath = null;
  if (outIdx !== -1) {
    outPath = args[outIdx + 1] ?? null;
    if (!outPath || outPath.startsWith('-')) {
      console.error('DE: --out braucht einen Pfad.\nEN: --out requires a path.');
      usage();
      process.exit(2);
    }
  }

  const positional = args.filter((a, i) => {
    if (a.startsWith('-')) return false;
    if (outIdx !== -1 && i === outIdx + 1) return false;
    return true;
  });
  const unknownFlags = args.filter((a) => a.startsWith('-') && a !== '--out');
  if (unknownFlags.length > 0) {
    console.error(`Unknown flag: ${unknownFlags[0]}`);
    usage();
    process.exit(2);
  }

  const assetId = positional[0];
  if (!assetId) {
    usage();
    process.exit(2);
  }
  if (positional.length > 1) {
    console.error(`Unexpected extra args: ${positional.slice(1).join(' ')}`);
    usage();
    process.exit(2);
  }
  if (!isSafeAssetId(assetId)) {
    console.error(
      'DE: Ungültige Asset-ID (nur Buchstaben, Ziffern, ._- ; kein Pfad).\nEN: Invalid asset id (no path separators or ..).',
    );
    process.exit(2);
  }

  const glbRel = `public/engine-parts/mvp/${assetId}.glb`;
  const srcPath = join(ROOT, glbRel);
  if (!existsSync(srcPath)) {
    console.error(
      `DE: GLB fehlt — keine Optimize: ${glbRel}\nEN: GLB missing — no optimize: ${glbRel}`,
    );
    process.exit(1);
  }

  const destPath = outPath ? resolve(outPath) : srcPath;
  const destRel = outPath ? outPath : glbRel;
  const before = statSync(srcPath).size;
  const maxBytes = maxBytesFor(assetId);

  console.log(
    `asset:optimize → gltf-transform repack (${assetId}, ${before} B → budget ${maxBytes} B)`,
  );

  try {
    const io = new NodeIO();
    const document = await io.read(srcPath);
    await io.write(destPath, document);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `DE: Optimize fehlgeschlagen: ${message}\nEN: Optimize failed: ${message}`,
    );
    process.exit(1);
  }

  if (!existsSync(destPath)) {
    console.error(
      `DE: GLB fehlt nach Optimize: ${destRel}\nEN: GLB missing after optimize: ${destRel}`,
    );
    process.exit(1);
  }

  const after = statSync(destPath).size;
  console.log(
    `asset:optimize wrote ${destRel} (${before} → ${after} B, Δ ${after - before})`,
  );

  if (after > maxBytes) {
    console.error(
      `DE: Über Byte-Budget: ${after} > ${maxBytes} (Spec maxBytes oder Default 512 KiB).\n` +
        `EN: Over byte budget: ${after} > ${maxBytes} (spec maxBytes or default 512 KiB).`,
    );
    process.exit(1);
  }

  console.log(
    `asset:optimize OK → ${destRel}\nDE: GLB neu gepackt, innerhalb Budget.\nEN: GLB repacked, within budget.`,
  );
  process.exit(0);
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(
    `DE: Optimize unerwartet: ${message}\nEN: Unexpected optimize error: ${message}`,
  );
  process.exit(1);
});
