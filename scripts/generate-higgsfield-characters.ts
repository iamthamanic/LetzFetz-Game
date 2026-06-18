/**
 * Batch-generate character + ultimate art via Higgsfield Nano Banana Pro.
 * Usage:
 *   npx tsx scripts/generate-higgsfield-characters.ts --list
 *   npx tsx scripts/generate-higgsfield-characters.ts --key knuspergnom
 *   npx tsx scripts/generate-higgsfield-characters.ts --all
 *
 * Location: scripts/generate-higgsfield-characters.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { CHARACTER_PROMPTS } from '../src/services/cardArt/prompts/characters';
import { ULTIMATE_PROMPTS } from '../src/services/cardArt/prompts/ultimates';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HIGGS = process.env.HIGGSFIELD_BIN || '/Users/halteverbotsocialmacpro/.hermes/node/bin/higgsfield';
const MODEL = process.env.HIGGSFIELD_MODEL || 'nano_banana_flash';
const MAX_RETRIES = 3;

const CHARACTER_IDS = Object.keys(CHARACTER_PROMPTS);

interface CliOptions {
  all: boolean;
  force: boolean;
  key?: string;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { all: false, force: false };
  for (const arg of argv) {
    if (arg === '--all') opts.all = true;
    if (arg === '--force') opts.force = true;
    if (arg.startsWith('--key=')) opts.key = arg.slice('--key='.length);
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

async function generateImage(
  prompt: string,
  refImage?: string,
): Promise<string> {
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
      const output = runHiggsfield(args);
      return extractUrl(output);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const retryable = /502|503|504|timeout|failed|500/i.test(lastError.message);
      if (!retryable || attempt === MAX_RETRIES) throw lastError;
      console.log(`  retry ${attempt}/${MAX_RETRIES} after error…`);
      await new Promise((r) => setTimeout(r, 5000 * attempt));
    }
  }
  throw lastError ?? new Error('generateImage failed');
}

async function generateCharacter(id: string, force: boolean): Promise<string> {
  const out = path.join(ROOT, 'public', 'cards', 'character', `${id}.png`);
  if (!force) {
    try {
      await fs.access(out);
      console.log(`skip  character/${id}.png`);
      return out;
    } catch {
      /* generate */
    }
  }

  console.log(`→ character/${id}`);
  const url = await generateImage(CHARACTER_PROMPTS[id]);
  await downloadUrl(url, out);
  console.log(`  saved ${out}`);
  return out;
}

async function generateUltimate(id: string, charPath: string, force: boolean): Promise<void> {
  const out = path.join(ROOT, 'public', 'cards', 'ultimate', `${id}.png`);
  if (!force) {
    try {
      await fs.access(out);
      console.log(`skip  ultimate/${id}.png`);
      return;
    } catch {
      /* generate */
    }
  }

  console.log(`→ ultimate/${id}`);
  const url = await generateImage(ULTIMATE_PROMPTS[id], charPath);
  await downloadUrl(url, out);
  console.log(`  saved ${out}`);
}

async function main(): Promise<void> {
  if (process.argv.includes('--list')) {
    console.log('Characters:', CHARACTER_IDS.join(', '));
    console.log('Ultimates:', CHARACTER_IDS.map((c) => `ulti-${c}`).join(', '));
    return;
  }

  const opts = parseArgs(process.argv.slice(2));
  const ids = opts.key ? [opts.key] : opts.all ? CHARACTER_IDS : [];
  if (ids.length === 0) {
    throw new Error('Use --all, --key=<characterId>, or --list');
  }

  for (const id of ids) {
    if (!CHARACTER_PROMPTS[id]) throw new Error(`Unknown character: ${id}`);
    const charPath = await generateCharacter(id, opts.force);
    await generateUltimate(`ulti-${id}`, charPath, opts.force);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
