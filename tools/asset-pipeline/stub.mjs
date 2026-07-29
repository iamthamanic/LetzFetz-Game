#!/usr/bin/env node
/**
 * Shared stub runner for Brief §18 asset CLI commands (YAGNI — no fake AI).
 * Location: tools/asset-pipeline/stub.mjs
 *
 * Exit codes (same contract as validate):
 *   0 — stub acknowledged (paths printed; no network)
 *   1 — reserved for future real failure
 *   2 — usage / unknown flags / unsafe id
 *
 * Usage: node tools/asset-pipeline/stub.mjs <command> [--] [<asset-id>]
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** @typedef {{ id: boolean, titleDe: string, titleEn: string, next?: string }} StubDef */

/** @type {Record<string, StubDef>} */
const COMMANDS = {
  spec: {
    id: true,
    titleDe: 'Spec-Stub — schreibt/prüft Spec-JSON (noch nicht implementiert).',
    titleEn: 'Spec stub — write/check spec JSON (not implemented yet).',
    next: 'docs/engine-system/specs/<id>.json',
  },
  concept: {
    id: true,
    titleDe: 'Concept-Stub — Konzeptbilder (keine KI in diesem Slice).',
    titleEn: 'Concept stub — concept art (no AI in this slice).',
    next: 'docs/engine-system/concepts/<id>/',
  },
  multiview: {
    id: true,
    titleDe: 'Multiview-Stub — Ortho-Ansichten (noch nicht implementiert).',
    titleEn: 'Multiview stub — ortho views (not implemented yet).',
    next: 'docs/engine-system/concepts/<id>/multiview/',
  },
  model: {
    id: true,
    titleDe: 'Model — nutze npm run asset:model (Meshy opt-in), nicht diesen Stub.',
    titleEn: 'Model — use npm run asset:model (Meshy opt-in), not this stub.',
    next: 'docs/engine-system/raw/<id>/model.glb',
  },
  // normalize / optimize are real runners (see normalize.mjs / optimize.mjs) — #190
  publish: {
    id: true,
    titleDe: 'Publish-Stub — Registry/Manifest-Update (noch nicht implementiert).',
    titleEn: 'Publish stub — registry/manifest update (not implemented yet).',
    next: 'src/services/engineAssets/partRegistry.ts',
  },
  'assets-validate': {
    id: false,
    titleDe: 'Batch-Validate-Stub — alle Specs/GLBs (noch nicht implementiert).',
    titleEn: 'Batch validate stub — all specs/GLBs (not implemented yet).',
    next: 'docs/engine-system/specs/*.json',
  },
  'assets-previews': {
    id: false,
    titleDe: 'Batch-Preview-Stub — alle Karten-PNGs (noch nicht implementiert).',
    titleEn: 'Batch preview stub — all card PNGs (not implemented yet).',
    next: 'public/cards/engine/*.png',
  },
  'assets-registry': {
    id: false,
    titleDe: 'Registry-Report-Stub — Part-Registry dump (noch nicht implementiert).',
    titleEn: 'Registry report stub — part registry dump (not implemented yet).',
    next: 'src/services/engineAssets/',
  },
  'assets-report': {
    id: false,
    titleDe: 'Pipeline-Report-Stub — Statusübersicht (noch nicht implementiert).',
    titleEn: 'Pipeline report stub — status overview (not implemented yet).',
    next: 'docs/engine-system/asset-pipeline.md',
  },
};

function isSafeAssetId(id) {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(id);
}

function usage(command) {
  const def = COMMANDS[command];
  if (!def) {
    console.error(`Unknown stub command: ${command ?? '(missing)'}

Known: ${Object.keys(COMMANDS).join(', ')}
`);
    return;
  }
  if (def.id) {
    console.error(`Usage: npm run asset:${command} -- <asset-id>

DE: ${def.titleDe}
EN: ${def.titleEn}

Expected path: ${def.next ?? '—'}
`);
  } else {
    const npmName = command.replace(/^assets-/, 'assets:');
    console.error(`Usage: npm run ${npmName}

DE: ${def.titleDe}
EN: ${def.titleEn}

Expected path: ${def.next ?? '—'}
`);
  }
}

function main(argv) {
  const args = argv.slice(2).filter((a) => a !== '--');
  const command = args[0];
  if (!command || !COMMANDS[command]) {
    usage(command);
    process.exit(2);
  }
  const def = COMMANDS[command];
  const rest = args.slice(1);

  for (const flag of rest.filter((a) => a.startsWith('-'))) {
    console.error(`Unknown flag: ${flag}`);
    usage(command);
    process.exit(2);
  }

  /** @type {string | null} */
  let assetId = null;
  if (def.id) {
    assetId = rest[0] ?? null;
    if (!assetId) {
      usage(command);
      process.exit(2);
    }
    if (!isSafeAssetId(assetId)) {
      console.error(`Unsafe asset id: ${assetId}`);
      usage(command);
      process.exit(2);
    }
    if (rest.length > 1) {
      console.error(`Unexpected extra args: ${rest.slice(1).join(' ')}`);
      usage(command);
      process.exit(2);
    }
  } else if (rest.length > 0) {
    console.error(`Unexpected args: ${rest.join(' ')}`);
    usage(command);
    process.exit(2);
  }

  const label = command.startsWith('assets-')
    ? command.replace(/^assets-/, 'assets:')
    : `asset:${command}`;
  const pathHint = (def.next ?? '').replaceAll('<id>', assetId ?? '<id>');
  console.log(`STUB  ${label}${assetId ? ` ${assetId}` : ''}`);
  console.log(`DE    ${def.titleDe}`);
  console.log(`EN    ${def.titleEn}`);
  console.log(`PATH  ${join(ROOT, pathHint)}`);
  console.log('EXIT  0 (stub — no network, no writes)');
  process.exit(0);
}

main(process.argv);
