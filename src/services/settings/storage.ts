/**
 * Load / save GameSettings; migrate legacy mute once.
 * Location: src/services/settings/storage.ts
 */
import { createDefaultGameSettings } from './defaults';
import {
  LEGACY_MUTE_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
  type GameSettings,
} from './types';
import { validateGameSettings } from './validate';

export type SettingsSaveResult = { ok: true } | { ok: false; error: string };

function readLegacyMuted(): boolean | null {
  try {
    const raw = localStorage.getItem(LEGACY_MUTE_STORAGE_KEY);
    if (raw === null) return null;
    if (raw === '1') return true;
    if (raw === '0') return false;
    return null;
  } catch {
    return null;
  }
}

function removeLegacyMuteKey(): void {
  try {
    localStorage.removeItem(LEGACY_MUTE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Load settings. Migrates `letz-fetz-muted` into audio.muted once, persists
 * the new record, then deletes the legacy key.
 */
export function loadGameSettings(): GameSettings {
  const defaults = createDefaultGameSettings();

  let stored: GameSettings | null = null;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw !== null) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw) as unknown;
      } catch {
        parsed = null;
      }
      stored = validateGameSettings(parsed);
    }
  } catch {
    stored = null;
  }

  const legacyMuted = readLegacyMuted();
  if (stored === null && legacyMuted === null) {
    return defaults;
  }

  const base = stored ?? defaults;
  if (legacyMuted === null) {
    return base;
  }

  const migrated: GameSettings = {
    ...base,
    audio: { ...base.audio, muted: legacyMuted },
  };
  saveGameSettings(migrated);
  removeLegacyMuteKey();
  return migrated;
}

export function saveGameSettings(settings: GameSettings): SettingsSaveResult {
  const validated = validateGameSettings(settings);
  if (!validated) {
    return { ok: false, error: 'invalid settings' };
  }
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(validated));
    return { ok: true };
  } catch {
    return { ok: false, error: 'Speichern fehlgeschlagen' };
  }
}

export function clearGameSettings(): void {
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  } catch {
    // ignore
  }
}
