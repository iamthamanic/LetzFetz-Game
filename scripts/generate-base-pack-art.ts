/**
 * Batch-generate Letz Fetz base pack illustrations via local Ollama Flux.
 * Usage:
 *   npx tsx scripts/generate-base-pack-art.ts --list
 *   npx tsx scripts/generate-base-pack-art.ts --key knuspergnom
 *   npx tsx scripts/generate-base-pack-art.ts --kind character
 *   npx tsx scripts/generate-base-pack-art.ts --all
 *   npx tsx scripts/generate-base-pack-art.ts --dry-run --all
 *
 * Location: scripts/generate-base-pack-art.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ILLUSTRATION_MANIFEST,
  type IllustrationDef,
  type IllustrationKind,
} from '../src/services/cardArt/manifest';
import { generateOllamaImage } from '../src/services/cardArt/ollamaGenerate';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_CARDS = path.join(ROOT, 'public', 'cards');

interface CliOptions {
  all: boolean;
  dryRun: boolean;
  force: boolean;
  key?: string;
  kind?: IllustrationKind;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { all: false, dryRun: false, force: false };
  for (const arg of argv) {
    if (arg === '--all') opts.all = true;
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--force') opts.force = true;
    else if (arg === '--list') opts.all = false;
    else if (arg.startsWith('--key=')) opts.key = arg.slice('--key='.length);
    else if (arg.startsWith('--kind=')) opts.kind = arg.slice('--kind='.length) as IllustrationKind;
  }
  return opts;
}

function outputPath(def: IllustrationDef): string {
  return path.join(PUBLIC_CARDS, def.kind, `${def.key}.png`);
}

function selectTargets(opts: CliOptions): IllustrationDef[] {
  if (argvHas('--list')) {
    return ILLUSTRATION_MANIFEST;
  }
  if (opts.key) {
    const match = ILLUSTRATION_MANIFEST.filter((item) => item.key === opts.key);
    if (match.length === 0) {
      throw new Error(`Unknown illustration key: ${opts.key}`);
    }
    return match;
  }
  if (opts.kind) {
    return ILLUSTRATION_MANIFEST.filter((item) => item.kind === opts.kind);
  }
  if (opts.all) return ILLUSTRATION_MANIFEST;
  throw new Error('Specify --all, --key=<id>, --kind=<kind>, or --list');
}

function argvHas(flag: string): boolean {
  return process.argv.includes(flag);
}

async function ensureDir(filePath: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  const targets = selectTargets(opts);

  if (argvHas('--list')) {
    console.log(`Illustrations (${ILLUSTRATION_MANIFEST.length} total):\n`);
    for (const item of ILLUSTRATION_MANIFEST) {
      console.log(`  [${item.kind}] ${item.key}`);
    }
    return;
  }

  console.log(`Generating ${targets.length} illustration(s)…`);
  if (opts.dryRun) console.log('DRY RUN — no Ollama calls, no files written.\n');

  let generated = 0;
  let skipped = 0;

  for (const def of targets) {
    const out = outputPath(def);
    const exists = await fs
      .access(out)
      .then(() => true)
      .catch(() => false);

    if (exists && !opts.force) {
      console.log(`skip  ${def.kind}/${def.key}.png (exists, use --force)`);
      skipped += 1;
      continue;
    }

    console.log(`\n→ ${def.kind}/${def.key}`);
    if (opts.dryRun) {
      console.log(`  prompt: ${def.prompt.slice(0, 140)}…`);
      continue;
    }

    const { image, durationMs } = await generateOllamaImage({ prompt: def.prompt });
    await ensureDir(out);
    await fs.writeFile(out, image);
    generated += 1;
    console.log(`  saved ${out} (${image.length} bytes, ${Math.round(durationMs / 1000)}s)`);
  }

  console.log(`\nDone. generated=${generated} skipped=${skipped} total=${targets.length}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
