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
import type { AppliedAudioSettings, SoundId, StingerKind } from './types';

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

  isMuted(): boolean {
    return this.applied.muted;
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
    this.howler.applySettings(this.applied);
    this.procedural.applySettings(this.applied);
    applyClashSettings(this.applied);
    this.howler.dispose();
  }
}

/** Singleton — React features import this object only. */
export const audioManager = new AudioManager();
