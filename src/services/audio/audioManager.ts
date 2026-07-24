/**
 * AudioManager — sole public audio API for React and features.
 * Location: src/services/audio/audioManager.ts
 *
 * Howler and procedural adapters stay internal. No Howler imports in UI.
 */
import type { AudioSettings } from '../settings/types';
import {
  applyClashSettings,
  playClashSound,
  playClashSoundAt,
  preloadClashSound,
} from './clashSound';
import { HowlerAudioAdapter } from './howlerAudioAdapter';
import { ProceduralAudioAdapter } from './proceduralAudioAdapter';
import type {
  AppliedAudioSettings,
  AudioCategory,
  SoundId,
  StingerKind,
} from './types';
import { effectiveVolume } from './types';

function toApplied(audio: AudioSettings): AppliedAudioSettings {
  return {
    muted: audio.muted,
    master: audio.master,
    sfx: audio.sfx,
    ui: audio.ui,
    ambience: audio.ambience,
    music: audio.music,
  };
}

class AudioManager {
  private howler = new HowlerAudioAdapter();
  private procedural = new ProceduralAudioAdapter();
  private cooldowns = new Map<SoundId, number>();
  private applied: AppliedAudioSettings = {
    muted: false,
    master: 1,
    sfx: 1,
    ui: 1,
    ambience: 0.6,
    music: 0.7,
  };

  applySettings(audio: AudioSettings): void {
    this.applied = toApplied(audio);
    this.howler.applySettings(this.applied);
    this.procedural.applySettings(this.applied);
    applyClashSettings(this.applied);
  }

  unlock(): void {
    this.howler.unlock();
    this.procedural.unlock();
  }

  play(id: SoundId): void {
    if (id === 'card.clash') {
      playClashSound();
      return;
    }
    if (id === 'combat.attack') {
      this.procedural.playStinger('play');
      return;
    }
    if (id === 'combat.block') {
      this.procedural.playStinger('block');
      return;
    }
    if (id === 'combat.damage.light') {
      this.procedural.playStinger('damage');
      return;
    }
    this.howler.play(id);
  }

  /**
   * Play with per-ID cooldown to avoid spam (rapid steps / invalid retries).
   * @returns false when suppressed by cooldown
   */
  playWithCooldown(id: SoundId, cooldownMs = 140): boolean {
    const now =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    const last = this.cooldowns.get(id) ?? Number.NEGATIVE_INFINITY;
    if (now - last < cooldownMs) return false;
    this.cooldowns.set(id, now);
    this.play(id);
    return true;
  }

  playStinger(kind: StingerKind): void {
    this.procedural.playStinger(kind);
  }

  playStingerSequence(kinds: StingerKind[], intervalMs = 80): void {
    this.procedural.playStingerSequence(kinds, intervalMs);
  }

  preloadClash(): Promise<AudioBuffer | null> {
    return preloadClashSound();
  }

  playClashAt(delaySec: number): void {
    playClashSoundAt(delaySec);
  }

  /**
   * Looped music bed (one primary instance). Same id → no restart.
   * Fade/crossfade when switching menu ↔ match.
   */
  playMusic(id: SoundId, fadeMs = 700): void {
    this.howler.playMusic(id, fadeMs);
  }

  stopMusic(fadeMs = 700): void {
    this.howler.stopMusic(fadeMs);
  }

  currentMusicId(): SoundId | null {
    return this.howler.currentMusicId();
  }

  isMuted(): boolean {
    return this.applied.muted;
  }

  /** Effective gain for HTMLMediaElement / video mute sync. */
  effectiveVolumeFor(category: AudioCategory, baseVolume = 1): number {
    return effectiveVolume(this.applied, category, baseVolume);
  }

  /** Test helper. */
  _resetForTests(): void {
    this.applied = {
      muted: false,
      master: 1,
      sfx: 1,
      ui: 1,
      ambience: 0.6,
      music: 0.7,
    };
    this.cooldowns.clear();
    this.howler.applySettings(this.applied);
    this.procedural.applySettings(this.applied);
    applyClashSettings(this.applied);
    this.howler.dispose();
  }
}

/** Singleton — React features import this object only. */
export const audioManager = new AudioManager();
