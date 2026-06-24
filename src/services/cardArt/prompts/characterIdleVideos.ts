/**
 * Subtle idle-loop motion prompts — image-to-video from character PNG (Seedance 2.0).
 * Master 12–15s → adaptive end trim → slow-mo → score-based outer seam blend.
 * Location: src/services/cardArt/prompts/characterIdleVideos.ts
 */
import { CHARACTER_PROMPTS } from './characters';

const IDLE_STYLE =
  'Comic book graphic novel cel style, bold black ink outlines, exact same character and colors as start image. ' +
  'Locked camera, fixed framing — no pan, no zoom, no orbit, no push-in, no shake, no cut. ' +
  'Seamless loop-ready motion: one subtle idle action only — slow breathing, slight shoulder sway, tiny hand or fabric micro-movement. ' +
  'Occasional slow blink. End frame matches start frame in pose and composition. NO new objects. ' +
  'No large weight shifts, no directed travel across frame.';

const KNUSPERGNOM_IDLE_STYLE =
  'Comic book graphic novel cel style, bold black ink outlines, exact same character and colors as start image. ' +
  'Locked camera, fixed framing — no pan, no zoom, no orbit, no push-in, no shake, no cut. ' +
  'Seamless loop-ready motion: ONE complete slow 360-degree rotation of the döner spit over the entire clip duration at constant speed, ' +
  'end spit angle exactly matches start angle. Character body: slow breathing and minimal shoulder sway only, one slow blink. ' +
  'Very subtle flame flicker on spit. NO body rotation, NO travel across frame.';

/** Higgsfield Seedance master generation length (seconds). */
export const CHARACTER_IDLE_MASTER_DURATION = 12;

/** Playback slow-down after bake (2 = half speed, doubles visible duration). */
export const CHARACTER_IDLE_PLAYBACK_SLOW_FACTOR = 2;

/** Trim AI warm-up at master start (seconds). */
export const CHARACTER_IDLE_MASTER_TRIM_START = 0.35;

/** Trim unstable frames at master end when not using adaptive search (seconds). */
export const CHARACTER_IDLE_MASTER_TRIM_END_PAD = 0.35;

/** Search last N seconds before nominal end for best loop seam (fine-tune only). */
export const CHARACTER_IDLE_END_TRIM_SEARCH_SEC = 1.2;

/** Minimum master span after trim (seconds). */
export const CHARACTER_IDLE_MIN_TRIM_SPAN_SEC = 8;

/** FFmpeg tail→head blend at the outer loop seam (seconds) — base; score may increase. */
export const CHARACTER_IDLE_LOOP_BLEND_SEC = 0.65;

export const CHARACTER_IDLE_LOOP_BLEND_MAX_SEC = 1.1;

/** Mean RGB diff above this → log regen warning after bake. */
export const CHARACTER_IDLE_LOOP_SCORE_WARN = 35;

/** Characters that need loop-first master regen when score stays high. */
export const CHARACTER_IDLE_REGEN_IDS = [
  'knuspergnom',
  'pillendoktora',
  'stiernackenkommando',
  'dripministerin',
] as const;

/** UI dual-buffer crossfade for non-baked clips (seconds). */
export const CHARACTER_IDLE_LOOP_CROSSFADE_SEC = 0.42;

/** @deprecated Window search — full-master slow path does not use per-char targets. */
export const CHARACTER_IDLE_TARGET_LOOP_SEC = 6;

/** @deprecated Window search — full-master slow path ignores per-char targets. */
export const CHARACTER_IDLE_TARGET_LOOP: Record<string, number> = {};

/** @deprecated Window search bounds — kept for findLoopWindow tests/tools. */
export const CHARACTER_IDLE_MASTER_SEARCH_START = 1;

/** @deprecated Window search bounds. */
export const CHARACTER_IDLE_MASTER_SEARCH_TAIL_PAD = 1;

/** End-trim search step (seconds). */
export const CHARACTER_IDLE_LOOP_SAMPLE_STEP_SEC = 0.08;

export interface CharacterIdleLoopWindow {
  start: number;
  end: number;
  crossfade?: number;
  bakedSeamless?: boolean;
}

export interface CharacterIdleLoopSearchBounds {
  masterSearchStart: number;
  masterSearchEnd: number;
  targetLoopSec: number;
  sampleStepSec: number;
}

export const CHARACTER_IDLE_VIDEO_IDS = Object.keys(CHARACTER_PROMPTS);

export const CHARACTER_IDLE_PROMPTS: Record<string, string> = {
  knuspergnom:
    `${KNUSPERGNOM_IDLE_STYLE} Tiny döner dwarf holds spit steady while spit rotates once over full clip.`,
  schluckspecht:
    `${IDLE_STYLE} Cool specht bird character idle: slow breathing, coat hem sways slightly, free hand micro-gesture, soft gentle glow on small vial.`,
  stiernackenkommando:
    `${IDLE_STYLE} Match reference image exactly. Comic fantasy character idle: slow symmetric breathing, shoulders rise and fall evenly, ` +
    'fabric strap micro-sway only, arms stay in same pose — no arm direction changes.',
  kokabell:
    `${IDLE_STYLE} Match reference image exactly. Comic angel character idle: gentle hover bob, slow breathing, tiny glitter drift, soft wing shimmer.`,
  pillendoktora:
    `${IDLE_STYLE} Match reference image exactly. Comic scientist character idle: slow breathing, subtle hair drift in place, ` +
    'tiny floating particles with slow cyclic motion — no arm gestures, no glasses adjustment, no pose changes.',
  dripministerin:
    `${IDLE_STYLE} Elegant fantasy woman character idle: slow breathing with gentle symmetric wing flex as the only large motion, ` +
    'hair and fabric follow the same slow rhythm, single soft orb pulse matching breath — no travel, no independent effects.',
  mysterium:
    `${IDLE_STYLE} Splinter ghost entity idle: shards drift slowly, mouths blink, phantom breathe pulse, subtle portal flicker.`,
};

/** Per-character master duration (15s for hair/fabric-heavy). */
export const CHARACTER_IDLE_DURATION: Record<string, number> = {
  knuspergnom: CHARACTER_IDLE_MASTER_DURATION,
  schluckspecht: CHARACTER_IDLE_MASTER_DURATION,
  stiernackenkommando: CHARACTER_IDLE_MASTER_DURATION,
  kokabell: 15,
  pillendoktora: 15,
  dripministerin: 15,
  mysterium: CHARACTER_IDLE_MASTER_DURATION,
};

export function characterIdleVideoPrompt(characterId: string): string | null {
  return CHARACTER_IDLE_PROMPTS[characterId] ?? null;
}

export function isCharacterIdleVideoId(characterId: string): boolean {
  return characterId in CHARACTER_IDLE_PROMPTS;
}

export function characterIdleMasterDuration(characterId: string): number {
  return CHARACTER_IDLE_DURATION[characterId] ?? CHARACTER_IDLE_MASTER_DURATION;
}

export function characterIdleMasterSearchEnd(characterId: string): number {
  return characterIdleMasterDuration(characterId) - 1;
}

export function characterIdleLoopBlendSec(_characterId?: string, score?: number): number {
  if (score === undefined) return CHARACTER_IDLE_LOOP_BLEND_SEC;
  return characterIdleLoopBlendForScore(score);
}

/** Longer blend when tail↔head frames diverge more (mean RGB diff). */
export function characterIdleLoopBlendForScore(score: number): number {
  if (score <= 18) return CHARACTER_IDLE_LOOP_BLEND_SEC;
  if (score <= 28) return 0.85;
  if (score <= 38) return 1.0;
  return CHARACTER_IDLE_LOOP_BLEND_MAX_SEC;
}

export function characterIdlePlaybackSlowFactor(_characterId?: string): number {
  return CHARACTER_IDLE_PLAYBACK_SLOW_FACTOR;
}

export function characterIdleEndTrimSearchSec(_characterId?: string): number {
  return CHARACTER_IDLE_END_TRIM_SEARCH_SEC;
}

/** Nominal full trim before adaptive end search. */
export function characterIdleFullTrimBounds(characterId: string): { start: number; end: number } {
  const master = characterIdleMasterDuration(characterId);
  return {
    start: CHARACTER_IDLE_MASTER_TRIM_START,
    end: master - CHARACTER_IDLE_MASTER_TRIM_END_PAD,
  };
}

/** Expected baked MP4 duration: nominal full trim × slow factor. */
export function characterIdleBakedDurationSec(characterId: string): number {
  const { start, end } = characterIdleFullTrimBounds(characterId);
  return (end - start) * CHARACTER_IDLE_PLAYBACK_SLOW_FACTOR;
}

/** @deprecated Use characterIdleFullTrimBounds — window search fallback only. */
export function characterIdleTargetLoopSec(characterId: string): number {
  const { start, end } = characterIdleFullTrimBounds(characterId);
  return end - start;
}

/** @deprecated Window search — full-master slow path does not use this. */
export function characterIdleLoopSearchBounds(characterId: string): CharacterIdleLoopSearchBounds {
  const { start, end } = characterIdleFullTrimBounds(characterId);
  const span = end - start;
  return {
    masterSearchStart: start,
    masterSearchEnd: end,
    targetLoopSec: span,
    sampleStepSec: CHARACTER_IDLE_LOOP_SAMPLE_STEP_SEC,
  };
}

export function characterIdlePlaybackOffsetSec(_characterId: string): number {
  return 0.02;
}

/** Playback window for baked full-master slow exports. */
export function characterIdleLoopWindow(characterId: string): CharacterIdleLoopWindow | null {
  if (!isCharacterIdleVideoId(characterId)) return null;
  const bakedSec = characterIdleBakedDurationSec(characterId);
  return {
    start: 0.02,
    end: bakedSec - 0.04,
    bakedSeamless: true,
  };
}

export function characterIdleStartFramePublicPath(characterId: string): string {
  return `/cards/character/${characterId}.png`;
}

export function isCharacterIdleRegenCandidate(characterId: string): boolean {
  return (CHARACTER_IDLE_REGEN_IDS as readonly string[]).includes(characterId);
}
