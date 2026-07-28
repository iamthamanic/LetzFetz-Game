#!/usr/bin/env node
/**
 * Asset pipeline stub: preview / snapshot hint for a part or recipe key.
 * Location: tools/asset-pipeline/preview.mjs
 *
 * Exit codes:
 *   0 — stub preview report printed
 *   2 — usage error
 *
 * Does not launch a browser or WebGL. Follow-up: offline snapshot render.
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function usage() {
  console.error(`Usage: npm run asset:preview -- <asset-id>

DE: Stub-Vorschau — zeigt erwartete Pfade / Render-Key-Hinweis.
EN: Stub preview — prints expected paths / render-key hint. No WebGL.

Examples:
  npm run asset:preview -- v3-part-water-traeger-01
`);
}

function main() {
  const assetId = process.argv[2];
  if (!assetId || assetId.startsWith('-')) {
    usage();
    process.exit(2);
  }

  const glbRel = `public/engine-parts/mvp/${assetId}.glb`;
  const previewRel = `public/cards/engine/${assetId}.png`;
  const glbOk = existsSync(join(ROOT, glbRel));
  const previewOk = existsSync(join(ROOT, previewRel));

  console.log(`asset:preview (stub)
DE: Vorschau-Stub für „${assetId}"
EN: Preview stub for "${assetId}"

  model:   ${glbOk ? `found ${glbRel}` : `not found (${glbRel})`}
  preview: ${previewOk ? `found ${previewRel}` : `not found (${previewRel})`}

DE: Live-Snapshot: Play → Fetzgerät 3D → „Snapshot cachen" (In-Memory).
EN: Live snapshot: Play → Engine 3D panel → "Snapshot cachen" (in-memory).
DE: Headless WebGL-Capture ist Follow-up; Cache keyed by createRenderKey.
EN: Headless WebGL capture is a follow-up; cache keyed by createRenderKey.

Stub exit 0.
`);

  process.exit(0);
}

main();
