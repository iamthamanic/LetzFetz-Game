/**
 * Unit tests for GameSettings defaults, validate, load/save, mute migration.
 * Location: src/services/settings/settings.test.ts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultGameSettings, isDevAudioMutedByDefault } from './defaults';
import {
  clearGameSettings,
  loadGameSettings,
  saveGameSettings,
} from './storage';
import {
  GAME_SETTINGS_VERSION,
  LEGACY_MUTE_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
} from './types';
import { mergeGameSettings, validateGameSettings } from './validate';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
}

describe('GameSettings', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('createDefaultGameSettings returns versioned defaults (muted in DEV)', () => {
    const d = createDefaultGameSettings();
    expect(d.version).toBe(GAME_SETTINGS_VERSION);
    // Vite DEV / Vitest: fresh settings start muted so local work stays quiet.
    expect(d.audio.muted).toBe(import.meta.env.DEV === true);
    expect(d.audio.master).toBe(1);
    expect(d.display.uiScale).toBe(1);
  });

  it('isDevAudioMutedByDefault tracks import.meta.env.DEV', () => {
    expect(isDevAudioMutedByDefault()).toBe(import.meta.env.DEV === true);
  });

  it('validateGameSettings accepts a valid record', () => {
    const d = createDefaultGameSettings();
    expect(validateGameSettings(d)).toEqual(d);
  });

  it('validateGameSettings rejects wrong version and non-objects', () => {
    expect(validateGameSettings(null)).toBeNull();
    expect(validateGameSettings('x')).toBeNull();
    expect(validateGameSettings({ version: 999, audio: {} })).toBeNull();
  });

  it('validateGameSettings clamps out-of-range volumes', () => {
    const raw = {
      ...createDefaultGameSettings(),
      audio: {
        muted: true,
        master: 2,
        sfx: -1,
        ui: 0.5,
        ambience: 0.5,
        music: 0.5,
      },
    };
    const v = validateGameSettings(raw);
    expect(v?.audio.master).toBe(1);
    expect(v?.audio.sfx).toBe(0);
    expect(v?.audio.muted).toBe(true);
  });

  it('save and load round-trip', () => {
    const settings = createDefaultGameSettings();
    settings.audio.muted = true;
    settings.audio.sfx = 0.4;
    expect(saveGameSettings(settings).ok).toBe(true);
    const loaded = loadGameSettings();
    expect(loaded.audio.muted).toBe(true);
    expect(loaded.audio.sfx).toBe(0.4);
  });

  it('load returns defaults when storage empty', () => {
    const loaded = loadGameSettings();
    expect(loaded).toEqual(createDefaultGameSettings());
    expect(loaded.audio.muted).toBe(isDevAudioMutedByDefault());
  });

  it('load returns defaults on corrupt JSON', () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, '{not-json');
    expect(loadGameSettings()).toEqual(createDefaultGameSettings());
  });

  it('migrates legacy mute once and deletes old key', () => {
    localStorage.setItem(LEGACY_MUTE_STORAGE_KEY, '1');
    const loaded = loadGameSettings();
    expect(loaded.audio.muted).toBe(true);
    expect(localStorage.getItem(LEGACY_MUTE_STORAGE_KEY)).toBeNull();
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).audio.muted).toBe(true);

    // Second load does not re-introduce legacy key
    const again = loadGameSettings();
    expect(again.audio.muted).toBe(true);
    expect(localStorage.getItem(LEGACY_MUTE_STORAGE_KEY)).toBeNull();
  });

  it('migrates legacy mute 0 over defaults', () => {
    localStorage.setItem(LEGACY_MUTE_STORAGE_KEY, '0');
    expect(loadGameSettings().audio.muted).toBe(false);
    expect(localStorage.getItem(LEGACY_MUTE_STORAGE_KEY)).toBeNull();
  });

  it('persisted unmuted settings win over DEV mute default', () => {
    const settings = createDefaultGameSettings();
    settings.audio.muted = false;
    expect(saveGameSettings(settings).ok).toBe(true);
    expect(loadGameSettings().audio.muted).toBe(false);
  });

  it('legacy mute overlays existing stored settings then deletes key', () => {
    const base = createDefaultGameSettings();
    base.audio.master = 0.3;
    saveGameSettings(base);
    localStorage.setItem(LEGACY_MUTE_STORAGE_KEY, '1');
    const loaded = loadGameSettings();
    expect(loaded.audio.muted).toBe(true);
    expect(loaded.audio.master).toBe(0.3);
    expect(localStorage.getItem(LEGACY_MUTE_STORAGE_KEY)).toBeNull();
  });

  it('mergeGameSettings patches nested audio', () => {
    const base = createDefaultGameSettings();
    const next = mergeGameSettings(base, { audio: { muted: true, sfx: 0.2 } });
    expect(next.audio.muted).toBe(true);
    expect(next.audio.sfx).toBe(0.2);
    expect(next.audio.master).toBe(1);
  });

  it('clearGameSettings removes storage key', () => {
    saveGameSettings(createDefaultGameSettings());
    clearGameSettings();
    expect(localStorage.getItem(SETTINGS_STORAGE_KEY)).toBeNull();
  });

  it('save fails soft when localStorage throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    });
    const result = saveGameSettings(createDefaultGameSettings());
    expect(result.ok).toBe(false);
  });
});
