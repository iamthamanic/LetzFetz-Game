/**
 * Default GameSettings factory.
 * Location: src/services/settings/defaults.ts
 */
import { GAME_SETTINGS_VERSION, type GameSettings } from './types';

export function createDefaultGameSettings(): GameSettings {
  return {
    version: GAME_SETTINGS_VERSION,
    audio: {
      muted: false,
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
