/**
 * Shared audio types — sound IDs and categories.
 * Location: src/services/audio/types.ts
 */

export type AudioCategory = 'sfx' | 'ui' | 'ambience' | 'music';

/** Typed sound IDs (manifest expands later). */
export type SoundId =
  | 'card.clash'
  | 'combat.attack'
  | 'combat.block'
  | 'combat.damage.light'
  | 'ui.click'
  | 'ui.error';

export type StingerKind = 'play' | 'block' | 'damage';

export interface AppliedAudioSettings {
  muted: boolean;
  master: number;
  sfx: number;
  ui: number;
  ambience: number;
  music: number;
}

export function effectiveVolume(
  settings: AppliedAudioSettings,
  category: AudioCategory,
  baseVolume = 1,
): number {
  if (settings.muted) return 0;
  const categoryGain = settings[category];
  const product = settings.master * categoryGain * baseVolume;
  if (product <= 0) return 0;
  if (product >= 1) return 1;
  return product;
}
