/**
 * Howler adapter — file-based one-shots + single looped music bed.
 * Location: src/services/audio/howlerAudioAdapter.ts
 *
 * One primary music Howl — never restart the same id on re-render.
 */
import { Howl, Howler } from 'howler';
import { getSoundEntry, resolveSoundUrl } from './soundRegistry';
import type { AppliedAudioSettings, AudioCategory, SoundId } from './types';
import { effectiveVolume } from './types';

/**
 * Howler plays file-backed registry entries.
 * `card.clash` stays on the Web Audio scheduler for sample-accurate intro sync.
 */
function howlerSource(
  id: SoundId,
): { src: string[]; category: AudioCategory; baseVolume: number } | null {
  if (id === 'card.clash') return null;
  const url = resolveSoundUrl(id);
  const entry = getSoundEntry(id);
  if (!url || !entry) return null;
  return {
    src: [url],
    category: entry.category,
    baseVolume: entry.baseVolume,
  };
}

interface LoadedHowl {
  howl: Howl;
  category: AudioCategory;
  baseVolume: number;
}

const DEFAULT_MUSIC_FADE_MS = 700;

export class HowlerAudioAdapter {
  private sounds = new Map<SoundId, LoadedHowl>();
  private musicHowl: Howl | null = null;
  private musicId: SoundId | null = null;
  private musicBaseVolume = 0.7;
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
    Howler.mute(settings.muted);
    Howler.volume(settings.muted ? 0 : settings.master);
    for (const entry of this.sounds.values()) {
      entry.howl.volume(
        effectiveVolume(settings, entry.category, entry.baseVolume),
      );
    }
    this.applyMusicVolume();
    // Unmute / volume restore after autoplay block — retry if bed exists but silent.
    if (!settings.muted) {
      this.retryMusicPlayback();
    }
  }

  /**
   * Resume Web Audio + retry HTML5 music after a user gesture.
   * playMusic often runs on mount (before gesture) and is blocked by autoplay;
   * unlock alone used to only set volume and never call play() again.
   */
  unlock(): void {
    if (typeof window === 'undefined') return;
    try {
      const ctx = Howler.ctx;
      if (ctx && ctx.state === 'suspended') {
        void ctx.resume();
      }
    } catch {
      // jsdom / missing AudioContext
    }
    Howler.mute(this.settings.muted);
    Howler.volume(this.settings.muted ? 0 : this.settings.master);
    this.retryMusicPlayback();
  }

  /** Restart looped bed if autoplay (or suspend) left it silent. */
  private retryMusicPlayback(): void {
    if (!this.musicHowl || !this.musicId || this.settings.muted) return;
    try {
      if (!this.musicHowl.playing()) {
        this.musicHowl.play();
      }
      this.applyMusicVolume();
    } catch {
      // Autoplay / decode — fail soft.
    }
  }

  play(id: SoundId): void {
    if (this.settings.muted) return;
    const meta = howlerSource(id);
    if (!meta) return;

    let entry = this.sounds.get(id);
    if (!entry) {
      let howl: Howl;
      try {
        howl = new Howl({
          src: meta.src,
          volume: effectiveVolume(this.settings, meta.category, meta.baseVolume),
          html5: false,
          preload: true,
        });
      } catch {
        return;
      }
      entry = { howl, category: meta.category, baseVolume: meta.baseVolume };
      this.sounds.set(id, entry);
    }

    try {
      entry.howl.volume(
        effectiveVolume(this.settings, entry.category, entry.baseVolume),
      );
      entry.howl.play();
    } catch {
      // Fail soft without a sound card / Web Audio.
    }
  }

  /**
   * Single looped music bed. Same id while already playing → no restart.
   * Switching ids fades out then fades in.
   */
  playMusic(id: SoundId, fadeMs = DEFAULT_MUSIC_FADE_MS): void {
    const meta = howlerSource(id);
    if (!meta || meta.category !== 'music') return;

    if (this.musicId === id && this.musicHowl) {
      this.musicBaseVolume = meta.baseVolume;
      this.applyMusicVolume();
      if (!this.musicHowl.playing()) {
        this.musicHowl.play();
      }
      return;
    }

    const startNext = () => {
      this.unloadMusic();
      this.musicId = id;
      this.musicBaseVolume = meta.baseVolume;
      const target = effectiveVolume(
        this.settings,
        'music',
        this.musicBaseVolume,
      );
      let howl: Howl;
      try {
        howl = new Howl({
          src: meta.src,
          loop: true,
          html5: true,
          preload: true,
          volume: 0,
        });
      } catch {
        // jsdom / missing audio backend — keep id for settings sync, no playback.
        this.musicHowl = null;
        return;
      }
      this.musicHowl = howl;
      try {
        howl.play();
        if (this.settings.muted || target <= 0) {
          howl.volume(0);
          return;
        }
        howl.fade(0, target, Math.max(0, fadeMs));
      } catch {
        // Autoplay / decode failures — fail soft.
      }
    };

    if (this.musicHowl && this.musicHowl.playing()) {
      const current = this.musicHowl;
      const fromVol = current.volume();
      current.fade(fromVol, 0, Math.max(0, fadeMs));
      window.setTimeout(() => {
        if (this.musicHowl === current) {
          startNext();
        }
      }, Math.max(0, fadeMs));
      return;
    }

    startNext();
  }

  stopMusic(fadeMs = DEFAULT_MUSIC_FADE_MS): void {
    if (!this.musicHowl) {
      this.musicId = null;
      return;
    }
    const current = this.musicHowl;
    let fromVol = 0;
    try {
      fromVol = current.volume();
    } catch {
      this.unloadMusic();
      return;
    }
    if (fadeMs <= 0 || fromVol <= 0) {
      this.unloadMusic();
      return;
    }
    try {
      current.fade(fromVol, 0, fadeMs);
    } catch {
      this.unloadMusic();
      return;
    }
    window.setTimeout(() => {
      if (this.musicHowl === current) {
        this.unloadMusic();
      }
    }, fadeMs);
  }

  currentMusicId(): SoundId | null {
    return this.musicId;
  }

  private applyMusicVolume(): void {
    if (!this.musicHowl) return;
    const target = effectiveVolume(
      this.settings,
      'music',
      this.musicBaseVolume,
    );
    this.musicHowl.volume(this.settings.muted ? 0 : target);
  }

  private unloadMusic(): void {
    if (this.musicHowl) {
      try {
        this.musicHowl.stop();
      } catch {
        // ignore
      }
      try {
        this.musicHowl.unload();
      } catch {
        // jsdom Howler teardown can throw
      }
    }
    this.musicHowl = null;
    this.musicId = null;
  }

  /** Test helper — clear cached Howls. */
  dispose(): void {
    this.unloadMusic();
    for (const entry of this.sounds.values()) {
      try {
        entry.howl.unload();
      } catch {
        // ignore
      }
    }
    this.sounds.clear();
  }
}
