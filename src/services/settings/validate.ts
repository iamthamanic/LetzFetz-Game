/**
 * Validate unknown JSON into GameSettings (or null).
 * Location: src/services/settings/validate.ts
 */
import { createDefaultGameSettings } from './defaults';
import {
  GAME_SETTINGS_VERSION,
  type A11ySettings,
  type AudioSettings,
  type DisplaySettings,
  type GameSettings,
  type GameplaySettings,
} from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function clamp01(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function clampScale(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  if (value < 0.75) return 0.75;
  if (value > 1.5) return 1.5;
  return value;
}

function parseAudio(raw: unknown, fallback: AudioSettings): AudioSettings {
  if (!isRecord(raw)) return { ...fallback };
  return {
    muted: typeof raw.muted === 'boolean' ? raw.muted : fallback.muted,
    master: clamp01(raw.master, fallback.master),
    sfx: clamp01(raw.sfx, fallback.sfx),
    ui: clamp01(raw.ui, fallback.ui),
    ambience: clamp01(raw.ambience, fallback.ambience),
    music: clamp01(raw.music, fallback.music),
  };
}

function parseDisplay(raw: unknown, fallback: DisplaySettings): DisplaySettings {
  if (!isRecord(raw)) return { ...fallback };
  return {
    uiScale: clampScale(raw.uiScale, fallback.uiScale),
    preferFullscreen:
      typeof raw.preferFullscreen === 'boolean'
        ? raw.preferFullscreen
        : fallback.preferFullscreen,
  };
}

function parseGameplay(raw: unknown, fallback: GameplaySettings): GameplaySettings {
  if (!isRecord(raw)) return { ...fallback };
  return {
    confirmEndTurn:
      typeof raw.confirmEndTurn === 'boolean'
        ? raw.confirmEndTurn
        : fallback.confirmEndTurn,
  };
}

function parseA11y(raw: unknown, fallback: A11ySettings): A11ySettings {
  if (!isRecord(raw)) return { ...fallback };
  return {
    reducedMotion:
      typeof raw.reducedMotion === 'boolean' ? raw.reducedMotion : fallback.reducedMotion,
    highContrast:
      typeof raw.highContrast === 'boolean' ? raw.highContrast : fallback.highContrast,
  };
}

/**
 * Parse persisted settings. Wrong version or non-object → null (caller uses defaults).
 * Known fields are clamped; unknown keys ignored.
 */
export function validateGameSettings(raw: unknown): GameSettings | null {
  if (!isRecord(raw)) return null;
  if (raw.version !== GAME_SETTINGS_VERSION) return null;

  const defaults = createDefaultGameSettings();
  return {
    version: GAME_SETTINGS_VERSION,
    audio: parseAudio(raw.audio, defaults.audio),
    display: parseDisplay(raw.display, defaults.display),
    gameplay: parseGameplay(raw.gameplay, defaults.gameplay),
    a11y: parseA11y(raw.a11y, defaults.a11y),
  };
}

export function mergeGameSettings(
  base: GameSettings,
  patch: {
    audio?: Partial<AudioSettings>;
    display?: Partial<DisplaySettings>;
    gameplay?: Partial<GameplaySettings>;
    a11y?: Partial<A11ySettings>;
  },
): GameSettings {
  const merged: GameSettings = {
    version: GAME_SETTINGS_VERSION,
    audio: { ...base.audio, ...patch.audio },
    display: { ...base.display, ...patch.display },
    gameplay: { ...base.gameplay, ...patch.gameplay },
    a11y: { ...base.a11y, ...patch.a11y },
  };
  // Re-validate clamps via validate path
  return validateGameSettings(merged) ?? createDefaultGameSettings();
}
