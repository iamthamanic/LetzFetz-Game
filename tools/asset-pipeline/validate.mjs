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
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** MVP registry ids from ADR #132 (keep in sync with partRegistry). */
const MVP_IDS = new Set([
  'v3-part-water-traeger-01',
  'v3-part-shadow-antrieb-01',
  'v3-part-light-aufsatz-01',
]);

function usage() {
  console.error(`Usage: npm run asset:validate -- <asset-id>

DE: Stub-Validierung für ein Fetzgerät-Part (GLB/Preview). Kein Meshy.
EN: Stub validation for one engine part asset id. No Meshy / network.

Examples:
  npm run asset:validate -- v3-part-water-traeger-01
`);
}

function main() {
  const assetId = process.argv[2];
  if (!assetId || assetId.startsWith('-')) {
    usage();
    process.exit(2);
  }

  const glbPath = join(ROOT, 'public', 'engine-parts', 'mvp', `${assetId}.glb`);
  const previewPath = join(ROOT, 'public', 'cards', 'engine', `${assetId}.png`);
  const specPath = join(ROOT, 'docs', 'engine-system', 'specs', `${assetId}.json`);

  const inMvp = MVP_IDS.has(assetId);
  const glbOk = existsSync(glbPath);
  const previewOk = existsSync(previewPath);
  const specOk = existsSync(specPath);

  console.log(`asset:validate (stub)
DE: Status für „${assetId}"
EN: Status for "${assetId}"

  registryMVP: ${inMvp ? 'yes' : 'no (not in MVP×3 set)'}
  glb:         ${glbOk ? `ok → ${glbPath}` : 'missing (ok for stub)'}
  previewPNG:  ${previewOk ? `ok → ${previewPath}` : 'missing (optional)'}
  specJSON:    ${specOk ? `ok → ${specPath}` : 'missing (optional)'}

DE: Stub exit 0 — echte Socket-/Budget-Checks folgen.
EN: Stub exit 0 — real socket/budget checks are a follow-up.
`);

  process.exit(0);
}

main();
