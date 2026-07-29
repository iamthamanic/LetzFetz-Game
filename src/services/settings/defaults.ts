/**
 * Default GameSettings factory.
 * Location: src/services/settings/defaults.ts
 *
 * In Vite DEV, audio starts muted so local playtests are not blasted by BGM.
 * Persisted localStorage settings always win over these defaults.
 */
import { GAME_SETTINGS_VERSION, type GameSettings } from './types';

/** Fresh/missing settings: mute in development only. */
export function isDevAudioMutedByDefault(): boolean {
  return import.meta.env.DEV === true;
}

export function createDefaultGameSettings(): GameSettings {
  return {
    version: GAME_SETTINGS_VERSION,
    audio: {
      muted: isDevAudioMutedByDefault(),
      master: 1,
      sfx: 1,
      ui: 1,
      ambience: 0.6,
      music: 0.7,
    },
    display: {
      uiScale: 1,
      preferFullscreen: false,
    },
    gameplay: {
      confirmEndTurn: false,
    },
    a11y: {
      reducedMotion: false,
      highContrast: false,
    },
  };
}
