#!/usr/bin/env node
/**
 * Asset pipeline stub: validate a Fetzgerät part asset id.
 * Location: tools/asset-pipeline/validate.mjs
 *
 * Exit codes (audio-forge style):
 *   0 — stub validation reported (known or unknown id)
 *   2 — usage error (missing id)
 *
 * No Meshy / network. Follow-up: real GLB socket + budget checks.
 */
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SPECS_DIR = join(ROOT, 'docs', 'engine-system', 'specs');

/** Known registry ids = committed spec stubs (derived from V3_ENGINE_PARTS_36). */
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

function usage() {
  console.error(`Usage: npm run asset:validate -- <asset-id>

DE: Stub-Validierung für ein Fetzgerät-Part (GLB/Preview). Kein Meshy.
EN: Stub validation for one engine part asset id. No Meshy / network.

Examples:
  npm run asset:validate -- v3-part-water-traeger-01
`);
}

/** Reject path traversal / separators — asset ids are single path segments. */
function isSafeAssetId(id) {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id);
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
  const glbPath = join(ROOT, 'public', 'engine-parts', 'mvp', `${assetId}.glb`);
  const previewPath = join(ROOT, 'public', 'cards', 'engine', `${assetId}.png`);
  const specPath = join(SPECS_DIR, `${assetId}.json`);

  const inRegistry = registered.has(assetId);
  const glbOk = existsSync(glbPath);
  const previewOk = existsSync(previewPath);
  const specOk = existsSync(specPath);

  console.log(`asset:validate (stub)
DE: Status für „${assetId}"
EN: Status for "${assetId}"

  registrySpec: ${inRegistry ? 'yes' : `no (not in ${registered.size} specs)`}
  glb:          ${glbOk ? `ok → ${glbPath}` : 'missing (ok for stub)'}
  previewPNG:   ${previewOk ? `ok → ${previewPath}` : 'missing (optional)'}
  specJSON:     ${specOk ? `ok → ${specPath}` : 'missing (optional)'}

DE: Stub exit 0 — echte Socket-/Budget-Checks folgen.
EN: Stub exit 0 — real socket/budget checks are a follow-up.
`);

  process.exit(0);
}

main();
