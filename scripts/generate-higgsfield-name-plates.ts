/**
 * Regenerate character name plate PNGs via Higgsfield GPT Image 2 (reference-driven).
 * Usage:
 *   npx tsx scripts/generate-higgsfield-name-plates.ts --list
 *   npx tsx scripts/generate-higgsfield-name-plates.ts --key knuspergnom
 *   npx tsx scripts/generate-higgsfield-name-plates.ts --all
 *
 * Location: scripts/generate-higgsfield-name-plates.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPO = path.resolve(ROOT, '..');
const ASSETS_UI = path.join(REPO, 'assets_ui');
const HIGGS = process.env.HIGGSFIELD_BIN || '/Users/halteverbotsocialmacpro/.hermes/node/bin/higgsfield';
const MODEL = process.env.HIGGSFIELD_NAMEPLATE_MODEL || 'gpt_image_2';
const MAX_RETRIES = 3;

interface NamePlateJob {
  id: string;
  refFile: string;
  displayName: string;
}

const NAME_PLATES: NamePlateJob[] = [
  { id: 'knuspergnom', refFile: 'TEXT_KNUSPERGNOM.png', displayName: 'KNUSPERGNOM' },
  { id: 'kokabell', refFile: 'TEXT_KOKABELL.png', displayName: 'KOKABELL' },
  { id: 'schluckspecht', refFile: 'TEXT_SCHLUCKSPECHT.png', displayName: 'SCHLUCKSPECHT' },
  {
    id: 'stiernackenkommando',
    refFile: 'TEXT_STIERNACKENKOMMANDO.png',
    displayName: 'STIERNACKENKOMMANDO',
  },
  { id: 'dripministerin', refFile: 'TEXT_DRIPMINISTERIN.png', displayName: 'DRIPMINISTERIN' },
  { id: 'pillendoktora', refFile: 'TEXT_PILLENDOKTORA.png', displayName: 'PILLENDOKTORA' },
  { id: 'mysterium', refFile: 'TEXT_Das Mysterium.png', displayName: 'DAS MYSTERIUM' },
];

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

function buildPrompt(displayName: string): string {
  return (
    `Recreate the attached reference card name badge EXACTLY: same composition, proportions, red explosive starburst splatter behind text, ` +
    `black jagged stamp frame with light scratch outline, beige parchment-grain distressed letters spelling "${displayName}", ` +
    `cyan and magenta glitch bars on outer edges, paint drips and speckles. ` +
    `Match the reference style precisely — grunge trading card typography badge. ` +
    `CRITICAL OUTPUT: isolated graphic on fully transparent background, PNG with alpha channel, ` +
    `no black canvas, no solid background color, no floor shadow, transparent pixels outside the badge artwork only.`
  );
}

async function downloadUrl(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
}

async function keyBlackCanvas(srcPath: string, destPath: string): Promise<void> {
  const script = path.join(ROOT, 'scripts', 'key-name-plates-alpha.py');
  execFileSync('python3', [script, srcPath, destPath], { encoding: 'utf8' });
}

async function generateNamePlate(job: NamePlateJob, force: boolean): Promise<void> {
  const out = path.join(ROOT, 'public', 'cards', 'text', `${job.id}.png`);
  const raw = path.join(ROOT, 'build', 'name-plates-raw', `${job.id}.png`);
  const ref = path.join(ASSETS_UI, job.refFile);

  if (!force) {
    try {
      await fs.access(out);
      console.log(`skip  cards/text/${job.id}.png`);
      return;
    } catch {
      /* generate */
    }
  }

  try {
    await fs.access(ref);
  } catch {
    throw new Error(`Missing reference: ${ref}`);
  }

  console.log(`→ cards/text/${job.id}.png (ref: ${job.refFile})`);
  const prompt = buildPrompt(job.displayName);
  const args = [
    'generate',
    'create',
    MODEL,
    '--prompt',
    prompt,
    '--image',
    ref,
    '--aspect_ratio',
    '16:9',
    '--resolution',
    '2k',
    '--quality',
    'high',
    '--wait',
    '--wait-timeout',
    '25m',
  ];

  let lastError: Error | null = null;
  let url = '';
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      url = extractUrl(runHiggsfield(args));
      break;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const retryable = /502|503|504|timeout|failed|500/i.test(lastError.message);
      if (!retryable || attempt === MAX_RETRIES) throw lastError;
      console.log(`  retry ${attempt}/${MAX_RETRIES}…`);
      await new Promise((r) => setTimeout(r, 5000 * attempt));
    }
  }

  await downloadUrl(url, raw);
  console.log(`  downloaded raw → ${raw}`);
  await keyBlackCanvas(raw, out);
  console.log(`  saved ${out}`);
}

async function main(): Promise<void> {
  if (process.argv.includes('--list')) {
    console.log(NAME_PLATES.map((j) => j.id).join(', '));
    return;
  }

  const opts = parseArgs(process.argv.slice(2));
  const jobs = opts.key
    ? NAME_PLATES.filter((j) => j.id === opts.key)
    : opts.all
      ? NAME_PLATES
      : [];

  if (jobs.length === 0) {
    throw new Error('Use --all, --key=<characterId>, or --list');
  }

  for (const job of jobs) {
    await generateNamePlate(job, opts.force);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
