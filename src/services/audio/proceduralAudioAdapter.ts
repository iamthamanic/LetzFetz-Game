/**
 * Procedural Web Audio stingers (combat SFX without MP3 assets).
 * Location: src/services/audio/proceduralAudioAdapter.ts
 */
import type { AppliedAudioSettings, StingerKind } from './types';
import { effectiveVolume } from './types';

interface StingerConfig {
  type: OscillatorType;
  freq: number;
  endFreq: number;
  duration: number;
  gain: number;
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

export class ProceduralAudioAdapter {
  private ctx: AudioContext | null = null;
  private settings: AppliedAudioSettings = {
    muted: false,
    master: 1,
    sfx: 1,
    ui: 1,
    ambience: 0.6,
    music: 0.7,
  };

  applySettings(settings: AppliedAudioSettings): void {
    this.settings = settings;
  }

  unlock(): void {
    this.getAudioContext();
  }

  playStinger(kind: StingerKind): void {
    const volume = effectiveVolume(this.settings, 'sfx', 1);
    if (volume <= 0) return;
    const audioCtx = this.getAudioContext();
    if (!audioCtx) return;

    const config = STINGER_CONFIGS[kind];
    const startTime = audioCtx.currentTime;
    const master = audioCtx.createGain();
    master.gain.setValueAtTime(volume, startTime);
    master.connect(audioCtx.destination);

    this.playOscillator(audioCtx, config, master, startTime);
    this.playNoise(audioCtx, config, master, startTime);
  }

  playStingerSequence(kinds: StingerKind[], intervalMs = 80): void {
    if (typeof window === 'undefined') return;
    if (effectiveVolume(this.settings, 'sfx', 1) <= 0) return;
    kinds.forEach((kind, i) => {
      window.setTimeout(() => this.playStinger(kind), i * intervalMs);
    });
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private createNoiseBuffer(audioCtx: AudioContext, duration: number): AudioBuffer {
    const sampleRate = audioCtx.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }
    return buffer;
  }

  private playOscillator(
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

  private playNoise(
    audioCtx: AudioContext,
    config: StingerConfig,
    destination: AudioNode,
    startTime: number,
  ): void {
    if (!config.noise) return;
    const buffer = this.createNoiseBuffer(audioCtx, config.duration * 0.6);
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
}
