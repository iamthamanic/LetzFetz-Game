/**
 * Shared audio types — sound IDs and categories.
 * Location: src/services/audio/types.ts
 *
 * IDs match tools/audio-forge/sound-manifest.json (first wave).
 */

export type AudioCategory = 'sfx' | 'ui' | 'ambience' | 'music';

/** Typed sound IDs — UI never hardcodes public audio paths. */
export type SoundId =
  | 'card.draw'
  | 'card.play'
  | 'card.discard'
  | 'card.reveal'
  | 'card.destroy'
  | 'card.shuffle'
  | 'card.clash'
  | 'dice.roll'
  | 'dice.settle'
  | 'combat.attack'
  | 'combat.block'
  | 'combat.damage.light'
  | 'combat.damage.heavy'
  | 'combat.critical'
  | 'ability.ready'
  | 'ability.activate'
  | 'ability.corrupt'
  | 'round.start'
  | 'round.end'
  | 'match.victory'
  | 'match.defeat'
  | 'ui.click'
  | 'ui.confirm'
  | 'ui.cancel'
  | 'ui.error'
  | 'ui.invalid'
  | 'ui.modal.open'
  | 'ui.modal.close'
  | 'ambience.arena.default'
  | 'music.menu.main'
  | 'music.match.default';

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
