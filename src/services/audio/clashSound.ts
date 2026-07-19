/**
 * Match-intro clash gong — preloaded MP3, Web Audio scheduled to the impact frame.
 * Location: src/services/audio/clashSound.ts
 *
 * Impact peak must stay locked to MatchIntro CSS keyframes (introCardCrash* 85%).
 * Gong attack peak sits slightly after sample start — compensated in schedule.
 */
import { isMuted } from './combatStingers';

export const CLASH_SOUND_URL = '/sounds/card-clash.mp3';

/** Fraction of CRASH_MS when cards collide (matches introCardCrashLeft/Right 85%, linear). */
export const CLASH_IMPACT_FRACTION = 0.85;

/**
 * Offset so the gong's perceived strike (not silence/ramp) lands on the visual hit.
 * Positive = start sample this many seconds BEFORE the visual impact.
 */
export const CLASH_GONG_ATTACK_LEAD_SEC = 0.03;

let audioCtx: AudioContext | null = null;
let clashBuffer: AudioBuffer | null = null;
let loadPromise: Promise<AudioBuffer | null> | null = null;

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
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = 0.85;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(Math.max(when, ctx.currentTime));
}

/**
 * Schedule the gong so its attack lands on the visual impact.
 * @param delaySec Seconds from now until the visual collision frame.
 */
export function playClashSoundAt(delaySec: number): void {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;

  const when = ctx.currentTime + Math.max(0, delaySec - CLASH_GONG_ATTACK_LEAD_SEC);

  if (clashBuffer) {
    startGong(ctx, clashBuffer, when);
    return;
  }

  void preloadClashSound().then((buf) => {
    if (!buf) return;
    // If decode was slow, play ASAP rather than late.
    const lateWhen = Math.max(ctx.currentTime, when);
    startGong(ctx, buf, lateWhen);
  });
}

/** Immediate play (fallback). Prefer playClashSoundAt for sync. */
export function playClashSound(): void {
  playClashSoundAt(0);
}
