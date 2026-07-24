/**
 * Versioned game settings types (audio, display, gameplay, a11y).
 * Location: src/services/settings/types.ts
 */

export const GAME_SETTINGS_VERSION = 1 as const;

export const SETTINGS_STORAGE_KEY = 'letz-fetz-settings';

/** Legacy mute flag — migrated once into GameSettings.audio.muted then deleted. */
export const LEGACY_MUTE_STORAGE_KEY = 'letz-fetz-muted';

export interface AudioSettings {
  muted: boolean;
  /** 0–1 master gain. */
  master: number;
  /** Category gains 0–1. */
  sfx: number;
  ui: number;
  ambience: number;
  music: number;
}

export interface DisplaySettings {
  /** UI scale factor (e.g. 0.85–1.25); applied via CSS vars, never transform:scale. */
  uiScale: number;
  /** Preferred fullscreen when user toggles in Settings. */
  preferFullscreen: boolean;
}

export interface GameplaySettings {
  /** Confirm before ending turn / conceding — reserved for Settings UI. */
  confirmEndTurn: boolean;
}

export interface A11ySettings {
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface GameSettings {
  version: typeof GAME_SETTINGS_VERSION;
  audio: AudioSettings;
  display: DisplaySettings;
  gameplay: GameplaySettings;
  a11y: A11ySettings;
}

export type GameSettingsPatch = {
  audio?: Partial<AudioSettings>;
  display?: Partial<DisplaySettings>;
  gameplay?: Partial<GameplaySettings>;
  a11y?: Partial<A11ySettings>;
};
