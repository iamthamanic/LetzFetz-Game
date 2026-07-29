#!/usr/bin/env node
/**
 * Asset pipeline: render GLB → public/cards/engine/<id>.png via Blender.
 * Location: tools/asset-pipeline/preview.mjs
 *
 * Exit codes:
 *   0 — preview PNG written (or already present and reused without --force)
 *   1 — missing GLB / Blender / render fail
 *   2 — usage error
 *
 * No Meshy / network. Delegates to tools/blender/run.mjs render_preview.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BLENDER_RUNNER = join(ROOT, 'tools', 'blender', 'run.mjs');

function usage() {
  console.error(`Usage: npm run asset:preview -- <asset-id> [--force]

DE: Rendert Karten-Preview PNG via Blender (feste Kamera).
EN: Renders card preview PNG via Blender (fixed camera).

Examples:
  npm run asset:preview -- v3-part-water-traeger-01
  npm run asset:preview -- v3-part-water-traeger-01 --force
`);
}

function isSafeAssetId(id) {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id);
}

function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--');
  const force = args.includes('--force');
  const assetId = args.find((a) => !a.startsWith('-'));

  if (!assetId) {
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
  const previewRel = `public/cards/engine/${assetId}.png`;
  const glbPath = join(ROOT, glbRel);

  if (!existsSync(glbPath)) {
    console.error(
      `DE: GLB fehlt — keine Preview: ${glbRel}\nEN: GLB missing — no preview: ${glbRel}`,
    );
    process.exit(1);
  }

  if (!existsSync(BLENDER_RUNNER)) {
    console.error(
      'DE: Blender-Runner fehlt (tools/blender/run.mjs).\nEN: Blender runner missing (tools/blender/run.mjs).',
    );
    process.exit(1);
  }

  console.log(`asset:preview → Blender render_preview (${assetId}${force ? ', force' : ''})`);
  const result = spawnSync(
    process.execPath,
    [BLENDER_RUNNER, 'render_preview', assetId, ...(force ? ['--force'] : [])],
    { stdio: 'inherit', cwd: ROOT },
  );

  if (result.error) {
    console.error(
      `DE: Preview-Start fehlgeschlagen: ${result.error.message}\nEN: Failed to start preview: ${result.error.message}`,
    );
    process.exit(1);
  }

  const code = result.status === null ? 1 : result.status;
  if (code !== 0) {
    process.exit(code);
  }

  const previewOk = existsSync(join(ROOT, previewRel));
  if (!previewOk) {
    console.error(
      `DE: Preview-PNG fehlt nach Render: ${previewRel}\nEN: Preview PNG missing after render: ${previewRel}`,
    );
    process.exit(1);
  }

  console.log(
    `asset:preview OK → ${previewRel}\nDE: Karten-Art bereit.\nEN: Card art ready.`,
  );
  process.exit(0);
}

main();
