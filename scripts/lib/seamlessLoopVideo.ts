/**
 * FFmpeg post-process: trim AI idle clip and blend tail into head for seamless HTML loop.
 * Location: scripts/lib/seamlessLoopVideo.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export interface SeamlessLoopOptions {
  start: number;
  end: number;
  blendSec: number;
}

export interface FullSlowSeamlessOptions extends SeamlessLoopOptions {
  /** 2 = half speed (doubles output duration). */
  slowFactor: number;
}

export function seamlessLoopOutputDuration(trimDuration: number, slowFactor = 1): number {
  return trimDuration * slowFactor;
}

/** Trim full master span, slow down, blend outer tail→head once for HTML loop. */
export async function applyFullSlowSeamlessLoop(
  inputPath: string,
  outputPath: string,
  options: FullSlowSeamlessOptions,
): Promise<number> {
  const { start, end, blendSec, slowFactor } = options;
  const trimDuration = end - start;
  if (trimDuration <= blendSec + 0.2) {
    throw new Error(`Trim window too short for blend (${trimDuration}s, blend ${blendSec}s)`);
  }

  const outputDuration = trimDuration * slowFactor;
  const mainEnd = outputDuration - blendSec;
  const tailStart = outputDuration - blendSec;
  const tmp = `${outputPath}.seamless.tmp.mp4`;

  const filter = [
    `[0:v]trim=start=${start}:end=${end},setpts=PTS-STARTPTS,setpts=${slowFactor}*PTS,format=yuv420p,split=2[base][base2]`,
    `[base]trim=end=${mainEnd},setpts=PTS-STARTPTS[main]`,
    `[base2]trim=start=${tailStart},setpts=PTS-STARTPTS[tail]`,
    `[base2]trim=end=${blendSec},setpts=PTS-STARTPTS[head]`,
    `[tail][head]xfade=transition=fade:duration=${blendSec}:offset=0[blend]`,
    `[main][blend]concat=n=2:v=1:a=0[out]`,
  ].join(';');

  execFileSync('ffmpeg', [
    '-y',
    '-i',
    inputPath,
    '-filter_complex',
    filter,
    '-map',
    '[out]',
    '-movflags',
    '+faststart',
    '-an',
    tmp,
  ]);

  await fs.rename(tmp, outputPath);
  return outputDuration;
}

/** Trim [start,end] from input, xfade tail→head, write loopable MP4 to outputPath. */
export async function applySeamlessLoopBlend(
  inputPath: string,
  outputPath: string,
  options: SeamlessLoopOptions,
): Promise<number> {
  const { start, end, blendSec } = options;
  const trimDuration = end - start;
  if (trimDuration <= blendSec + 0.2) {
    throw new Error(`Trim window too short for blend (${trimDuration}s, blend ${blendSec}s)`);
  }

  const mainEnd = trimDuration - blendSec;
  const tailStart = trimDuration - blendSec;
  const tmp = `${outputPath}.seamless.tmp.mp4`;

  const filter = [
    `[0:v]trim=start=${start}:end=${end},setpts=PTS-STARTPTS,format=yuv420p,split=2[base][base2]`,
    `[base]trim=end=${mainEnd},setpts=PTS-STARTPTS[main]`,
    `[base2]trim=start=${tailStart},setpts=PTS-STARTPTS[tail]`,
    `[base2]trim=end=${blendSec},setpts=PTS-STARTPTS[head]`,
    `[tail][head]xfade=transition=fade:duration=${blendSec}:offset=0[blend]`,
    `[main][blend]concat=n=2:v=1:a=0[out]`,
  ].join(';');

  execFileSync('ffmpeg', [
    '-y',
    '-i',
    inputPath,
    '-filter_complex',
    filter,
    '-map',
    '[out]',
    '-movflags',
    '+faststart',
    '-an',
    tmp,
  ]);

  await fs.rename(tmp, outputPath);
  return trimDuration;
}
