/**
 * Generate character idle loop videos from character PNG via Higgsfield Seedance 2.0.
 * Pipeline: 12–15s master → adaptive end trim → 2× slow-mo → score-based outer blend.
 *
 * Usage:
 *   npx tsx scripts/generate-character-idle-video.ts --key=knuspergnom
 *   npx tsx scripts/generate-character-idle-video.ts --all --force
 *   npx tsx scripts/generate-character-idle-video.ts --key=knuspergnom --seamless-only
 *
 * Location: scripts/generate-character-idle-video.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import {
  CHARACTER_IDLE_DURATION,
  CHARACTER_IDLE_PROMPTS,
  CHARACTER_IDLE_REGEN_IDS,
  CHARACTER_IDLE_VIDEO_IDS,
  CHARACTER_IDLE_LOOP_SCORE_WARN,
  characterIdleLoopBlendSec,
  characterIdleMasterDuration,
  characterIdlePlaybackSlowFactor,
  characterIdleStartFramePublicPath,
  characterIdleVideoPrompt,
  isCharacterIdleRegenCandidate,
} from '../src/services/cardArt/prompts/characterIdleVideos';
import { findBestLoopEndTrim } from './lib/findLoopWindow';
import { applyFullSlowSeamlessLoop } from './lib/seamlessLoopVideo';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HIGGS = process.env.HIGGSFIELD_BIN || '/Users/halteverbotsocialmacpro/.hermes/node/bin/higgsfield';
const MODEL = process.env.HIGGSFIELD_VIDEO_MODEL || 'seedance_2_0';
const DEFAULT_DURATION = Number(process.env.HIGGSFIELD_IDLE_DURATION || '12');
const MAX_RETRIES = 3;

interface CliOptions {
  force: boolean;
  key?: string;
  all: boolean;
  seamlessOnly: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { force: false, all: false, seamlessOnly: false };
  for (const arg of argv) {
    if (arg === '--force') opts.force = true;
    if (arg === '--all') opts.all = true;
    if (arg === '--seamless-only') opts.seamlessOnly = true;
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

function startImagePath(characterId: string): string {
  return path.join(ROOT, 'public', characterIdleStartFramePublicPath(characterId).slice(1));
}

function outputVideoPath(characterId: string): string {
  return path.join(ROOT, 'public', 'videos', 'character', `${characterId}.mp4`);
}

async function generateIdleVideo(
  prompt: string,
  startImage: string,
  duration: number,
  loopEndImage?: string,
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
    '--wait',
    '--wait-timeout',
    '25m',
  ];
  if (loopEndImage) args.push('--end-image', loopEndImage);

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
  throw lastError ?? new Error('generateIdleVideo failed');
}

function masterBackupPath(videoPath: string): string {
  return `${videoPath}.master.mp4`;
}

async function resolveBakeSource(videoPath: string): Promise<string> {
  const backup = masterBackupPath(videoPath);
  try {
    await fs.access(backup);
    return backup;
  } catch {
    return videoPath;
  }
}

function resolveAdaptiveTrim(
  characterId: string,
  sourcePath: string,
): { start: number; end: number; score: number } {
  const trim = findBestLoopEndTrim(sourcePath, characterId);
  return { start: trim.start, end: trim.end, score: trim.score };
}

async function bakeSeamlessLoop(
  characterId: string,
  outputPath: string,
  sourcePath?: string,
): Promise<void> {
  const src = sourcePath ?? (await resolveBakeSource(outputPath));
  const trim = resolveAdaptiveTrim(characterId, src);
  const blend = characterIdleLoopBlendSec(characterId, trim.score);
  const slowFactor = characterIdlePlaybackSlowFactor(characterId);
  const span = trim.end - trim.start;
  console.log(
    `  adaptive trim ${trim.start.toFixed(2)}–${trim.end.toFixed(2)}s (${span.toFixed(2)}s) ` +
      `score ${trim.score.toFixed(2)}, blend ${blend}s → slow ×${slowFactor} → ~${(span * slowFactor).toFixed(2)}s`,
  );
  if (trim.score > CHARACTER_IDLE_LOOP_SCORE_WARN && isCharacterIdleRegenCandidate(characterId)) {
    console.log(
      `  ⚠ high loop score — consider: npx tsx scripts/generate-character-idle-video.ts --key=${characterId} --force`,
    );
  }
  const outDuration = await applyFullSlowSeamlessLoop(src, outputPath, {
    start: trim.start,
    end: trim.end,
    blendSec: blend,
    slowFactor,
  });
  console.log(`  baked ${outDuration.toFixed(2)}s adaptive slow loop`);
}

async function seamlessOne(characterId: string): Promise<void> {
  const out = outputVideoPath(characterId);
  try {
    await fs.access(out);
  } catch {
    throw new Error(`Missing video: ${out}`);
  }
  const src = await resolveBakeSource(out);
  console.log(`seamless-only: ${characterId} (source: ${path.basename(src)})`);
  await bakeSeamlessLoop(characterId, out, src);
}

async function generateOne(characterId: string, force: boolean): Promise<void> {
  const prompt = characterIdleVideoPrompt(characterId);
  if (!prompt) throw new Error(`No idle prompt for ${characterId}`);

  const startImg = startImagePath(characterId);
  const out = outputVideoPath(characterId);

  try {
    await fs.access(startImg);
  } catch {
    throw new Error(`Missing start frame PNG: ${startImg}`);
  }

  if (!force) {
    try {
      await fs.access(out);
      console.log(`skip  ${characterId}.mp4 (exists, use --force)`);
      return;
    } catch {
      /* generate */
    }
  }

  const duration = characterIdleMasterDuration(characterId) ?? CHARACTER_IDLE_DURATION[characterId] ?? DEFAULT_DURATION;
  console.log(
    `Higgsfield idle: ${characterId}, model=${MODEL}, master=${duration}s, start=${startImg}` +
      (process.env.HIGGSFIELD_IDLE_LOOP_END !== '0' ? ' (end frame = start PNG)' : ''),
  );
  const useLoopEnd = process.env.HIGGSFIELD_IDLE_LOOP_END !== '0';
  const url = await generateIdleVideo(
    prompt,
    startImg,
    duration,
    useLoopEnd ? startImg : undefined,
  );
  await downloadUrl(url, out);
  await fs.copyFile(out, masterBackupPath(out));
  console.log(`  master saved ${masterBackupPath(out)}`);
  await bakeSeamlessLoop(characterId, out, out);
  console.log(`saved ${out}`);
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  if (process.argv.includes('--list')) {
    console.log('Character idle videos (PNG → 12–15s master → adaptive slow loop):\n');
    for (const id of CHARACTER_IDLE_VIDEO_IDS) {
      const dur = characterIdleMasterDuration(id);
      const regen = isCharacterIdleRegenCandidate(id) ? ' [loop-first prompt]' : '';
      console.log(`  ${id} (${dur}s master)${regen}`);
    }
    console.log(`\nRegen candidates: ${CHARACTER_IDLE_REGEN_IDS.join(', ')}`);
    return;
  }

  if (opts.seamlessOnly) {
    if (opts.all) {
      for (const id of CHARACTER_IDLE_VIDEO_IDS) {
        await seamlessOne(id);
      }
      return;
    }
    if (!opts.key) throw new Error('Use --key=<character-id> or --all with --seamless-only');
    await seamlessOne(opts.key);
    return;
  }

  if (opts.all) {
    for (const id of CHARACTER_IDLE_VIDEO_IDS) {
      await generateOne(id, opts.force);
    }
    return;
  }

  if (!opts.key) {
    throw new Error('Use --key=<character-id>, --all, or --list');
  }

  await generateOne(opts.key, opts.force);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
