#!/usr/bin/env node
/**
 * Asset pipeline: normalize GLB via Blender normalize_part.
 * Location: tools/asset-pipeline/normalize.mjs
 *
 * Exit codes:
 *   0 — GLB normalized (written)
 *   1 — missing GLB / Blender / normalize fail
 *   2 — usage error
 *
 * Default overwrites public/engine-parts/mvp/<id>.glb (use --out or git to keep original).
 * No Meshy / network. Delegates to tools/blender/run.mjs normalize_part.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BLENDER_RUNNER = join(ROOT, 'tools', 'blender', 'run.mjs');

function usage() {
  console.error(`Usage: npm run asset:normalize -- <asset-id> [--out path.glb]

DE: Normalisiert Part-GLB via Blender (Rotation/Scale apply, Mesh-Zentrierung).
EN: Normalizes part GLB via Blender (apply rot/scale, mesh centering).

Overwrite: default writes back to public/engine-parts/mvp/<id>.glb.
  Use --out <path> for an alternate file, or git checkout to restore.

Examples:
  npm run asset:normalize -- v3-part-water-traeger-01
  npm run asset:normalize -- v3-part-water-traeger-01 --out /tmp/water.glb
`);
}

function isSafeAssetId(id) {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id);
}

function main() {
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
    if (outIdx !== -1 && (i === outIdx + 1)) return false;
    return true;
  });
  const unknownFlags = args.filter(
    (a) => a.startsWith('-') && a !== '--out',
  );
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
  const glbPath = join(ROOT, glbRel);
  if (!existsSync(glbPath)) {
    console.error(
      `DE: GLB fehlt — keine Normalize: ${glbRel}\nEN: GLB missing — no normalize: ${glbRel}`,
    );
    process.exit(1);
  }

  if (!existsSync(BLENDER_RUNNER)) {
    console.error(
      'DE: Blender-Runner fehlt (tools/blender/run.mjs).\nEN: Blender runner missing (tools/blender/run.mjs).',
    );
    process.exit(1);
  }

  const blenderExtra = [];
  if (outPath) {
    blenderExtra.push('--out', resolve(outPath));
  }

  console.log(
    `asset:normalize → Blender normalize_part (${assetId}${outPath ? `, out=${outPath}` : ', overwrite source'})`,
  );
  const result = spawnSync(
    process.execPath,
    [BLENDER_RUNNER, 'normalize_part', assetId, ...blenderExtra],
    { stdio: 'inherit', cwd: ROOT },
  );

  if (result.error) {
    console.error(
      `DE: Normalize-Start fehlgeschlagen: ${result.error.message}\nEN: Failed to start normalize: ${result.error.message}`,
    );
    process.exit(1);
  }

  const code = result.status === null ? 1 : result.status;
  if (code !== 0) {
    process.exit(code);
  }

  const destRel = outPath ? outPath : glbRel;
  const destAbs = outPath ? resolve(outPath) : glbPath;
  if (!existsSync(destAbs)) {
    console.error(
      `DE: GLB fehlt nach Normalize: ${destRel}\nEN: GLB missing after normalize: ${destRel}`,
    );
    process.exit(1);
  }

  console.log(
    `asset:normalize OK → ${destRel}\nDE: GLB normalisiert.\nEN: GLB normalized.`,
  );
  process.exit(0);
}

main();
