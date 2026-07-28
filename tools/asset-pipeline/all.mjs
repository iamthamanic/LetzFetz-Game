#!/usr/bin/env node
/**
 * Asset pipeline stub: run validate + preview for one asset id.
 * Location: tools/asset-pipeline/all.mjs
 *
 * Exit codes: 0 ok, 2 usage, 1 if a child stub fails (future).
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

function usage() {
  console.error(`Usage: npm run asset:all -- <asset-id>

DE: Führt asset:validate und asset:preview Stub nacheinander aus.
EN: Runs asset:validate and asset:preview stubs in sequence.
`);
}

function main() {
  const assetId = process.argv[2];
  if (!assetId || assetId.startsWith('-')) {
    usage();
    process.exit(2);
  }

  for (const script of ['validate.mjs', 'preview.mjs']) {
    const result = spawnSync(process.execPath, [join(HERE, script), assetId], {
      stdio: 'inherit',
    });
    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }

  console.log('asset:all (stub) — done / fertig. Exit 0.');
  process.exit(0);
}

main();
