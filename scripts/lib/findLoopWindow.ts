/**
 * FFmpeg frame extraction + loop-point search for character idle masters.
 * Location: scripts/lib/findLoopWindow.ts
 */
import { execFileSync } from 'node:child_process';
import {
  buildEndTrimCandidates,
  buildLoopCandidates,
  pickBestLoopCandidate,
  scoreLoopWindowRgb,
  type LoopCandidate,
} from '../../src/services/cardArt/loopPointSearch';
import {
  CHARACTER_IDLE_LOOP_SAMPLE_STEP_SEC,
  CHARACTER_IDLE_MASTER_TRIM_START,
  CHARACTER_IDLE_MIN_TRIM_SPAN_SEC,
  characterIdleEndTrimSearchSec,
  characterIdleFullTrimBounds,
  characterIdleLoopBlendSec,
  characterIdleLoopSearchBounds,
  type CharacterIdleLoopSearchBounds,
} from '../../src/services/cardArt/prompts/characterIdleVideos';

const FRAME_WIDTH = 160;
const LOOP_PHASE_OFFSETS = [0, 0.04, 0.08];

function scoreLoopSlot(videoPath: string, start: number, end: number): number {
  const headFrames = LOOP_PHASE_OFFSETS.map((off) =>
    extractFrameRgb(videoPath, start + off),
  );
  const tailFrames = LOOP_PHASE_OFFSETS.map((off) =>
    extractFrameRgb(videoPath, Math.max(start, end - 0.04 - off)),
  );
  return scoreLoopWindowRgb(headFrames, tailFrames);
}

export interface ResolvedLoopTrim {
  start: number;
  end: number;
  score: number;
  targetLoopSec: number;
}

function probeDuration(videoPath: string): number {
  const out = execFileSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      videoPath,
    ],
    { encoding: 'utf8' },
  ).trim();
  const duration = Number.parseFloat(out);
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Invalid video duration for ${videoPath}: ${out}`);
  }
  return duration;
}

function extractFrameRgb(videoPath: string, timeSec: number): Uint8Array {
  const buf = execFileSync(
    'ffmpeg',
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-ss',
      String(timeSec),
      '-i',
      videoPath,
      '-vframes',
      '1',
      '-vf',
      `scale=${FRAME_WIDTH}:-1`,
      '-f',
      'rawvideo',
      '-pix_fmt',
      'rgb24',
      'pipe:1',
    ],
    { maxBuffer: 16 * 1024 * 1024 },
  );
  return new Uint8Array(buf);
}

function resolveSearchBounds(
  videoDuration: number,
  config: CharacterIdleLoopSearchBounds,
  blendSec: number,
): { searchStart: number; searchEnd: number; targetLoopSec: number } {
  const isLegacyShort = videoDuration < config.masterSearchEnd - 2;
  const searchStart = isLegacyShort ? 0.08 : Math.min(config.masterSearchStart, videoDuration - 1);
  const searchEnd = isLegacyShort
    ? videoDuration - 0.08
    : Math.min(config.masterSearchEnd, videoDuration - 0.05);
  const region = searchEnd - searchStart;
  const minLoopSec = isLegacyShort ? 2 : 3;
  // Blend is inside the trim window — do not subtract blend from target length.
  const targetLoopSec = Math.min(
    config.targetLoopSec,
    Math.max(minLoopSec, region - 0.05),
  );
  if (targetLoopSec <= blendSec + 0.2 || region < minLoopSec + 0.15) {
    throw new Error(
      `Video too short for loop search (${videoDuration.toFixed(2)}s, need ~${(targetLoopSec + blendSec + 0.5).toFixed(1)}s)`,
    );
  }
  return { searchStart, searchEnd, targetLoopSec };
}

/** Score candidate windows; return best absolute trim [start,end] in source video. */
export function findBestLoopTrim(
  videoPath: string,
  characterId: string,
): ResolvedLoopTrim {
  const duration = probeDuration(videoPath);
  const config = characterIdleLoopSearchBounds(characterId);
  const blendSec = characterIdleLoopBlendSec(characterId);
  const { searchStart, searchEnd, targetLoopSec } = resolveSearchBounds(
    duration,
    config,
    blendSec,
  );

  const slots = buildLoopCandidates({
    searchStart,
    searchEnd,
    targetLoopSec,
    sampleStepSec: config.sampleStepSec,
  });
  if (slots.length === 0) {
    throw new Error(`No loop candidates in ${searchStart}–${searchEnd}s`);
  }

  const scored: LoopCandidate[] = [];
  for (const slot of slots) {
    scored.push({
      start: slot.start,
      end: slot.end,
      score: scoreLoopSlot(videoPath, slot.start, slot.end),
    });
  }

  const best = pickBestLoopCandidate(scored);
  if (!best) throw new Error('Loop search failed');

  return {
    start: best.start,
    end: best.end,
    score: best.score,
    targetLoopSec,
  };
}

/** Fixed start, search best end in trailing window — keeps long span, optimizes outer seam. */
export function findBestLoopEndTrim(
  videoPath: string,
  characterId: string,
): ResolvedLoopTrim {
  const duration = probeDuration(videoPath);
  const nominal = characterIdleFullTrimBounds(characterId);
  const start = Math.min(CHARACTER_IDLE_MASTER_TRIM_START, duration - CHARACTER_IDLE_MIN_TRIM_SPAN_SEC - 0.1);
  const nominalEnd = Math.min(nominal.end, duration - 0.08);
  const searchSec = characterIdleEndTrimSearchSec(characterId);
  const endMin = Math.max(start + CHARACTER_IDLE_MIN_TRIM_SPAN_SEC, nominalEnd - searchSec);
  const endMax = nominalEnd;

  const slots = buildEndTrimCandidates(
    start,
    endMin,
    endMax,
    CHARACTER_IDLE_LOOP_SAMPLE_STEP_SEC,
    CHARACTER_IDLE_MIN_TRIM_SPAN_SEC,
  );
  if (slots.length === 0) {
    throw new Error(
      `No end-trim candidates for ${characterId} (${duration.toFixed(2)}s, start ${start.toFixed(2)})`,
    );
  }

  const scored: LoopCandidate[] = [];
  for (const slot of slots) {
    scored.push({
      start: slot.start,
      end: slot.end,
      score: scoreLoopSlot(videoPath, slot.start, slot.end),
    });
  }

  const best = pickBestLoopCandidate(scored);
  if (!best) throw new Error('End-trim loop search failed');

  return {
    start: best.start,
    end: best.end,
    score: best.score,
    targetLoopSec: best.end - best.start,
  };
}
