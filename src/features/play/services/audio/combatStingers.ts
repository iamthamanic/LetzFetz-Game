/**
 * Combat SFX stinger service — Web Audio, mute-aware, autoplay-policy safe.
 * Location: src/features/play/services/audio/combatStingers.ts
 *
 * Generates short procedural stingers (play, block, damage) without needing
 * MP3 assets. The AudioContext is created lazily on the first user gesture,
 * respecting browser autoplay policies.
 *
 * Mute state is read from localStorage key "letz-fetz-muted" (boolean).
 */

const MUTE_STORAGE_KEY = 'letz-fetz-muted';

export type StingerKind = 'play' | 'block' | 'damage';

let ctx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function isMuted(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(MUTE_STORAGE_KEY) === '1';
}

export function setMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MUTE_STORAGE_KEY, muted ? '1' : '0');
}

/** Call this on a user gesture (e.g. first click) to unlock audio. */
export function unlockAudio(): void {
  getAudioContext();
}

interface StingerConfig {
  /** Oscillator type. */
  type: OscillatorType;
  /** Start frequency in Hz. */
  freq: number;
  /** Target frequency at end (for sweeps). */
  endFreq: number;
  /** Duration in seconds. */
  duration: number;
  /** Peak gain (0–1). */
  gain: number;
  /** Optional noise burst layer. */
  noise?: boolean;
}

const STINGER_CONFIGS: Record<StingerKind, StingerConfig> = {
  play: {
    type: 'square',
    freq: 440,
    endFreq: 880,
    duration: 0.12,
    gain: 0.18,
    noise: true,
  },
  block: {
    type: 'sawtooth',
    freq: 220,
    endFreq: 110,
    duration: 0.15,
    gain: 0.16,
  },
  damage: {
    type: 'triangle',
    freq: 160,
    endFreq: 60,
    duration: 0.22,
    gain: 0.22,
    noise: true,
  },
};

function createNoiseBuffer(audioCtx: AudioContext, duration: number): AudioBuffer {
  const sampleRate = audioCtx.sampleRate;
  const length = Math.floor(sampleRate * duration);
  const buffer = audioCtx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }
  return buffer;
}

function playOscillator(
  audioCtx: AudioContext,
  config: StingerConfig,
  destination: AudioNode,
  startTime: number,
): void {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = config.type;
  osc.frequency.setValueAtTime(config.freq, startTime);
  osc.frequency.exponentialRampToValueAtTime(
    Math.max(config.endFreq, 1),
    startTime + config.duration,
  );

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(config.gain, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + config.duration);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(startTime);
  osc.stop(startTime + config.duration + 0.02);
}

function playNoise(
  audioCtx: AudioContext,
  config: StingerConfig,
  destination: AudioNode,
  startTime: number,
): void {
  if (!config.noise) return;
  const buffer = createNoiseBuffer(audioCtx, config.duration * 0.6);
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, startTime);
  filter.frequency.exponentialRampToValueAtTime(200, startTime + config.duration);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(config.gain * 0.5, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + config.duration * 0.6);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(startTime);
}

/** Play a single stinger. No-op if muted or audio unavailable. */
export function playStinger(kind: StingerKind): void {
  if (isMuted()) return;
  const audioCtx = getAudioContext();
  if (!audioCtx) return;

  const config = STINGER_CONFIGS[kind];
  const startTime = audioCtx.currentTime;

  const master = audioCtx.createGain();
  master.gain.setValueAtTime(1, startTime);
  master.connect(audioCtx.destination);

  playOscillator(audioCtx, config, master, startTime);
  playNoise(audioCtx, config, master, startTime);
}

/** Play multiple stingers in sequence. */
export function playStingerSequence(kinds: StingerKind[], intervalMs = 80): void {
  if (isMuted()) return;
  const audioCtx = getAudioContext();
  if (!audioCtx) return;

  kinds.forEach((kind, i) => {
    window.setTimeout(() => playStinger(kind), i * intervalMs);
  });
}