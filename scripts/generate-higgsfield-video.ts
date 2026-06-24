/**
 * Generate short card-play videos from existing PNG art via Higgsfield Seedance 2.0.
 * Usage:
 *   npx tsx scripts/generate-higgsfield-video.ts --key=arena-club
 *   npx tsx scripts/generate-higgsfield-video.ts --key=arena-club --force
 *   npx tsx scripts/generate-higgsfield-video.ts --list
 *
 * Location: scripts/generate-higgsfield-video.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import {
  cardVideoKindForId,
  cardVideoPrompt,
  cardVideoStartPath,
  cardVideoEndPath,
  CARD_VIDEO_PROMPTS,
  CARD_VIDEO_DURATION,
} from '../src/services/cardArt/prompts/cardVideos';
import { getIllustrationDef, illustrationPublicPath } from '../src/services/cardArt/manifest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HIGGS = process.env.HIGGSFIELD_BIN || '/Users/halteverbotsocialmacpro/.hermes/node/bin/higgsfield';
const MODEL = process.env.HIGGSFIELD_VIDEO_MODEL || 'seedance_2_0';
const DEFAULT_DURATION = Number(process.env.HIGGSFIELD_VIDEO_DURATION || '4');
const MAX_RETRIES = 3;

interface CliOptions {
  force: boolean;
  key?: string;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { force: false };
  for (const arg of argv) {
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

function publicImagePath(publicPath: string): string {
  return path.join(ROOT, 'public', publicPath.replace(/^\//, ''));
}

function defaultImagePath(cardId: string): string {
  const def = getIllustrationDef(cardId);
  if (!def) throw new Error(`Unknown card id: ${cardId}`);
  return path.join(ROOT, 'public', illustrationPublicPath(cardId, def.kind).slice(1));
}

function videoPath(cardId: string): string {
  const kind = cardVideoKindForId(cardId);
  if (!kind) throw new Error(`Card id has no video kind: ${cardId}`);
  return path.join(ROOT, 'public', 'videos', kind, `${cardId}.mp4`);
}

async function generateVideo(
  prompt: string,
  startImage: string,
  duration: number,
  endImage?: string,
): Promise<string> {
  const args = [
    'generate',
    'create',
    MODEL,
    '--prompt',
    prompt,
    '--start-image',
    startImage,
    '--duration',
    String(duration),
    '--aspect_ratio',
    '3:4',
    '--resolution',
    '720p',
    '--genre',
    'action',
    '--wait',
    '--wait-timeout',
    '20m',
  ];
  if (endImage) args.push('--end-image', endImage);

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
  throw lastError ?? new Error('generateVideo failed');
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  if (process.argv.includes('--list')) {
    console.log('Card videos with motion prompts:\n');
    for (const key of Object.keys(CARD_VIDEO_PROMPTS).sort()) {
      console.log(`  ${key}`);
    }
    return;
  }

  if (!opts.key) {
    throw new Error('Use --key=<card-id> or --list');
  }

  const prompt = cardVideoPrompt(opts.key);
  if (!prompt) {
    throw new Error(`No video prompt for ${opts.key}. Add it to cardVideos.ts first.`);
  }

  const startOverride = cardVideoStartPath(opts.key);
  const endOverride = cardVideoEndPath(opts.key);
  const startImg = startOverride ? publicImagePath(startOverride) : defaultImagePath(opts.key);
  const endImg = endOverride ? publicImagePath(endOverride) : undefined;
  const out = videoPath(opts.key);

  try {
    await fs.access(startImg);
  } catch {
    throw new Error(`Missing start frame: ${startImg}`);
  }
  if (endImg) {
    try {
      await fs.access(endImg);
    } catch {
      throw new Error(`Missing end frame: ${endImg}`);
    }
  }

  if (!opts.force) {
    try {
      await fs.access(out);
      console.log(`skip  ${opts.key}.mp4 (exists, use --force)`);
      return;
    } catch {
      /* generate */
    }
  }

  const duration = CARD_VIDEO_DURATION[opts.key] ?? DEFAULT_DURATION;
  console.log(
    `Higgsfield video: ${opts.key}, model=${MODEL}, duration=${duration}s` +
      (endImg ? ' (character→ultimate morph)' : ''),
  );
  const url = await generateVideo(prompt, startImg, duration, endImg);
  await downloadUrl(url, out);
  console.log(`saved ${out}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
