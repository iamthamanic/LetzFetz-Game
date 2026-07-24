/**
 * Howler adapter — file-based one-shots (no React imports).
 * Location: src/services/audio/howlerAudioAdapter.ts
 */
import { Howl, Howler } from 'howler';
import { getSoundEntry } from './soundRegistry';
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
  const entry = getSoundEntry(id);
  if (!entry?.publicUrl) return null;
  return {
    src: [entry.publicUrl],
    category: entry.category,
    baseVolume: entry.baseVolume,
  };
}

interface LoadedHowl {
  howl: Howl;
  category: AudioCategory;
  baseVolume: number;
}

export class HowlerAudioAdapter {
  private sounds = new Map<SoundId, LoadedHowl>();
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
  }

  unlock(): void {
    if (typeof window === 'undefined') return;
    // Howler unlocks on first play; touching volume forces context init when available.
    Howler.volume(this.settings.muted ? 0 : this.settings.master);
  }

  play(id: SoundId): void {
    if (this.settings.muted) return;
    const meta = howlerSource(id);
    if (!meta) return;

    let entry = this.sounds.get(id);
    if (!entry) {
      const howl = new Howl({
        src: meta.src,
        volume: effectiveVolume(this.settings, meta.category, meta.baseVolume),
        html5: false,
        preload: true,
      });
      entry = { howl, category: meta.category, baseVolume: meta.baseVolume };
      this.sounds.set(id, entry);
    }

    entry.howl.volume(
      effectiveVolume(this.settings, entry.category, entry.baseVolume),
    );
    entry.howl.play();
  }

  /** Test helper — clear cached Howls. */
  dispose(): void {
    for (const entry of this.sounds.values()) {
      entry.howl.unload();
    }
    this.sounds.clear();
  }
}
