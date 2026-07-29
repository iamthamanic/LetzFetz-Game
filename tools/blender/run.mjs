#!/usr/bin/env node
/**
 * Node runner for tools/blender/*.py — finds Blender CLI or exits with DE/EN help.
 * Location: tools/blender/run.mjs
 *
 * Usage: npm run asset:blender -- <script> <asset-id> [--force|--out path]
 * Scripts: validate_sockets | normalize_part | render_preview
 *
 * Exit: Blender exit code | 1 missing blender / fail | 2 usage
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BLENDER_DIR = join(ROOT, 'tools', 'blender');

const SCRIPTS = {
  validate_sockets: 'validate_sockets.py',
  normalize_part: 'normalize_part.py',
  render_preview: 'render_preview.py',
};

function usage() {
  console.error(`Usage: npm run asset:blender -- <script> <asset-id> [args]

Scripts:
  validate_sockets   Check SOCKET_* nodes vs docs/engine-system/specs/<id>.json
  normalize_part     Apply transforms / center meshes; rewrite GLB
  render_preview     Fixed camera PNG → public/cards/engine/<id>.png

DE: Benötigt Blender CLI auf PATH (oder BLENDER_BIN).
EN: Requires Blender CLI on PATH (or BLENDER_BIN).

Examples:
  npm run asset:blender -- validate_sockets v3-part-water-traeger-01
  npm run asset:blender -- render_preview v3-part-water-traeger-01 --force
`);
}

function isSafeAssetId(id) {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id);
}

function resolveBlenderBin() {
  if (process.env.BLENDER_BIN && existsSync(process.env.BLENDER_BIN)) {
    return process.env.BLENDER_BIN;
  }
  const which = spawnSync('which', ['blender'], { encoding: 'utf8' });
  if (which.status === 0 && which.stdout.trim()) {
    return which.stdout.trim();
  }
  // macOS app bundle common path
  const mac =
    '/Applications/Blender.app/Contents/MacOS/Blender';
  if (existsSync(mac)) return mac;
  return null;
}

function main() {
  const scriptKey = process.argv[2];
  const assetId = process.argv[3];
  const extra = process.argv.slice(4);

  if (!scriptKey || scriptKey.startsWith('-') || !(scriptKey in SCRIPTS)) {
    usage();
    process.exit(2);
  }
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

  const blender = resolveBlenderBin();
  if (!blender) {
    console.error(
      'DE: Blender CLI nicht gefunden. Installiere Blender und stelle sicher, dass `blender` auf dem PATH liegt, oder setze BLENDER_BIN.\n' +
        'EN: Blender CLI not found. Install Blender and ensure `blender` is on PATH, or set BLENDER_BIN.\n' +
        'DE: Docs: docs/engine-system/asset-pipeline.md (Blender CLI).\n' +
        'EN: Docs: docs/engine-system/asset-pipeline.md (Blender CLI).',
    );
    process.exit(1);
  }

  const scriptPath = join(BLENDER_DIR, SCRIPTS[scriptKey]);
  if (!existsSync(scriptPath)) {
    console.error(`DE: Skript fehlt: ${scriptPath}\nEN: Script missing: ${scriptPath}`);
    process.exit(1);
  }

  const args = ['-b', '-P', scriptPath, '--', assetId, ...extra];
  console.log(`Running: ${blender} ${args.join(' ')}`);
  const result = spawnSync(blender, args, { stdio: 'inherit', cwd: ROOT });
  if (result.error) {
    console.error(
      `DE: Blender-Start fehlgeschlagen: ${result.error.message}\nEN: Failed to start Blender: ${result.error.message}`,
    );
    process.exit(1);
  }
  process.exit(result.status === null ? 1 : result.status);
}

main();
