/**
 * Batch-generate all 48 card illustrations via Higgsfield Nano Banana.
 * Usage:
 *   npx tsx scripts/generate-higgsfield-all.ts --list
 *   npx tsx scripts/generate-higgsfield-all.ts --all --force
 *   npx tsx scripts/generate-higgsfield-all.ts --kind=element --force
 *   npx tsx scripts/generate-higgsfield-all.ts --skip=knuspergnom,ulti-knuspergnom --all --force
 *
 * Location: scripts/generate-higgsfield-all.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import {
  ILLUSTRATION_MANIFEST,
  type IllustrationDef,
  type IllustrationKind,
} from '../src/services/cardArt/manifest';
import { ultimateCharacterId } from '../src/services/cardArt/prompts/ultimates';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HIGGS = process.env.HIGGSFIELD_BIN || '/Users/halteverbotsocialmacpro/.hermes/node/bin/higgsfield';
const MODEL = process.env.HIGGSFIELD_MODEL || 'nano_banana_flash';
const MAX_RETRIES = 3;

interface CliOptions {
  all: boolean;
  force: boolean;
  kind?: IllustrationKind;
  key?: string;
  skip: Set<string>;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { all: false, force: false, skip: new Set() };
  for (const arg of argv) {
    if (arg === '--all') opts.all = true;
    if (arg === '--force') opts.force = true;
    if (arg.startsWith('--kind=')) opts.kind = arg.slice('--kind='.length) as IllustrationKind;
    if (arg.startsWith('--key=')) opts.key = arg.slice('--key='.length);
    if (arg.startsWith('--skip=')) {
      for (const k of arg.slice('--skip='.length).split(',')) {
        if (k.trim()) opts.skip.add(k.trim());
      }
    }
  }
  return opts;
}

function runHiggsfield(args: string[]): string {
  return execFileSync(HIGGS, args, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  }).trim();
}

function extractUrl(output: string): string {
  const match = output.match(/https:\/\/[^\s"'<>]+/);
  if (!match) throw new Error(`No result URL in output:\n${output.slice(0, 400)}`);
  return match[0].replace(/[)\],]+$/, '');
}

async function downloadUrl(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
}

function outputPath(def: IllustrationDef): string {
  return path.join(ROOT, 'public', 'cards', def.kind, `${def.key}.png`);
}

function characterRefPath(charId: string): string {
  return path.join(ROOT, 'public', 'cards', 'character', `${charId}.png`);
}

async function generateImage(prompt: string, refImage?: string): Promise<string> {
  const args = [
    'generate',
    'create',
    MODEL,
    '--prompt',
    prompt,
    '--aspect_ratio',
    '3:4',
    '--resolution',
    '2k',
    '--wait',
    '--wait-timeout',
    '20m',
  ];
  if (refImage) args.push('--image', refImage);

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return extractUrl(runHiggsfield(args));
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const retryable = /502|503|504|500|timeout|failed/i.test(lastError.message);
      if (!retryable || attempt === MAX_RETRIES) throw lastError;
      console.log(`  retry ${attempt}/${MAX_RETRIES}…`);
      await new Promise((r) => setTimeout(r, 5000 * attempt));
    }
  }
  throw lastError ?? new Error('generateImage failed');
}

function sortForGeneration(items: IllustrationDef[]): IllustrationDef[] {
  const order: IllustrationKind[] = ['character', 'ultimate', 'element', 'glitch', 'arena'];
  return [...items].sort(
    (a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || a.key.localeCompare(b.key),
  );
}

function selectTargets(opts: CliOptions): IllustrationDef[] {
  if (process.argv.includes('--list')) return ILLUSTRATION_MANIFEST;
  if (opts.key) {
    const match = ILLUSTRATION_MANIFEST.filter((i) => i.key === opts.key);
    if (!match.length) throw new Error(`Unknown key: ${opts.key}`);
    return match;
  }
  if (opts.kind) return ILLUSTRATION_MANIFEST.filter((i) => i.kind === opts.kind);
  if (opts.all) return ILLUSTRATION_MANIFEST;
  throw new Error('Use --all, --key=, --kind=, or --list');
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  const targets = sortForGeneration(selectTargets(opts));

  if (process.argv.includes('--list')) {
    console.log(`Illustrations (${ILLUSTRATION_MANIFEST.length}):\n`);
    for (const item of targets) console.log(`  [${item.kind}] ${item.key}`);
    return;
  }

  console.log(`Higgsfield batch: ${targets.length} target(s), model=${MODEL}`);
  if (opts.skip.size) console.log(`Skipping: ${[...opts.skip].join(', ')}`);

  let generated = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const def of targets) {
    if (opts.skip.has(def.key)) {
      console.log(`skip  ${def.kind}/${def.key} (--skip)`);
      skipped += 1;
      continue;
    }

    const out = outputPath(def);
    if (!opts.force) {
      try {
        await fs.access(out);
        console.log(`skip  ${def.kind}/${def.key}.png (exists)`);
        skipped += 1;
        continue;
      } catch {
        /* generate */
      }
    }

    let refImage: string | undefined;
    if (def.kind === 'ultimate') {
      const charId = ultimateCharacterId(def.key);
      if (charId) {
        const ref = characterRefPath(charId);
        try {
          await fs.access(ref);
          refImage = ref;
        } catch {
          console.error(`FAIL  ${def.kind}/${def.key} — missing character ref: ${ref}`);
          failed.push(def.key);
          continue;
        }
      }
    }

    console.log(`\n→ ${def.kind}/${def.key}`);
    try {
      const url = await generateImage(def.prompt, refImage);
      await downloadUrl(url, out);
      generated += 1;
      console.log(`  saved ${out}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`FAIL  ${def.kind}/${def.key} — ${msg.split('\n')[0]}`);
      failed.push(def.key);
    }
  }

  console.log(`\nDone. generated=${generated} skipped=${skipped} failed=${failed.length} total=${targets.length}`);
  if (failed.length) {
    console.log(`Failed keys: ${failed.join(', ')}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
