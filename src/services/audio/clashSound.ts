/**
 * Match-intro clash gong — sample-accurate Web Audio schedule.
 * Location: src/services/audio/clashSound.ts
 *
 * Impact peak must stay locked to MatchIntro CSS keyframes (introCardCrash* 85%).
 * File path comes from the sound registry (typed id `card.clash`) — never hardcode in UI.
 */
import { resolveSoundUrl } from './soundRegistry';
import type { AppliedAudioSettings } from './types';
import { effectiveVolume } from './types';

function clashPublicUrl(): string {
  const url = resolveSoundUrl('card.clash');
  if (!url) {
    throw new Error('card.clash missing from sound registry');
  }
  return url;
}

/** Resolved public URL for `card.clash` (migrated under /audio/). */
export const CLASH_SOUND_URL = clashPublicUrl();

/** Fraction of CRASH_MS when cards collide (matches introCardCrashLeft/Right 85%, linear). */
export const CLASH_IMPACT_FRACTION = 0.85;

/**
 * Offset so the gong's perceived strike lands on the visual hit.
 * Positive = start sample this many seconds BEFORE the visual impact.
 */
export const CLASH_GONG_ATTACK_LEAD_SEC = 0.03;

let audioCtx: AudioContext | null = null;
let clashBuffer: AudioBuffer | null = null;
let loadPromise: Promise<AudioBuffer | null> | null = null;
let settings: AppliedAudioSettings = {
  muted: false,
  master: 1,
  sfx: 1,
  ui: 1,
  ambience: 0.6,
  music: 0.7,
};

export function applyClashSettings(next: AppliedAudioSettings): void {
  settings = next;
}

/** Resume clash AudioContext after a user gesture (separate from Howler/procedural). */
export function unlockClashAudio(): void {
  getCtx();
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

async function fetchClashBuffer(ctx: AudioContext): Promise<AudioBuffer | null> {
  try {
    const res = await fetch(CLASH_SOUND_URL, { cache: 'force-cache' });
    if (!res.ok) return null;
    const data = await res.arrayBuffer();
    return await ctx.decodeAudioData(data.slice(0));
  } catch {
    return null;
  }
}

/** Prefetch + decode on a user gesture so scheduling is sample-accurate. */
export function preloadClashSound(): Promise<AudioBuffer | null> {
  const ctx = getCtx();
  if (!ctx) return Promise.resolve(null);
  if (clashBuffer) return Promise.resolve(clashBuffer);
  if (!loadPromise) {
    loadPromise = fetchClashBuffer(ctx).then((buf) => {
      clashBuffer = buf;
      return buf;
    });
  }
  return loadPromise;
}

function startGong(ctx: AudioContext, buffer: AudioBuffer, when: number): void {
  const volume = effectiveVolume(settings, 'sfx', 0.85);
  if (volume <= 0) return;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(Math.max(when, ctx.currentTime));
}

/**
 * Schedule the gong so its attack lands on the visual impact.
 * @param delaySec Seconds from now until the visual collision frame.
 */
export function playClashSoundAt(delaySec: number): void {
  if (effectiveVolume(settings, 'sfx', 1) <= 0) return;
  const ctx = getCtx();
  if (!ctx) return;

  const when = ctx.currentTime + Math.max(0, delaySec - CLASH_GONG_ATTACK_LEAD_SEC);

  if (clashBuffer) {
    startGong(ctx, clashBuffer, when);
    return;
  }

  void preloadClashSound().then((buf) => {
    if (!buf) return;
    const lateWhen = Math.max(ctx.currentTime, when);
    startGong(ctx, buf, lateWhen);
  });
}

export function playClashSound(): void {
  playClashSoundAt(0);
}
