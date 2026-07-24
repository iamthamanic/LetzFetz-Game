/**
 * React provider for GameSettings — hydrate, update, reset, persist.
 * Location: src/services/settings/SettingsProvider.tsx
 */
import React, { createContext, useContext, useState } from 'react';
import { createDefaultGameSettings } from './defaults';
import { loadGameSettings, saveGameSettings } from './storage';
import type { GameSettings, GameSettingsPatch } from './types';
import { mergeGameSettings } from './validate';

export interface SettingsContextValue {
  settings: GameSettings;
  updateSettings: (patch: GameSettingsPatch) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(() => loadGameSettings());

  const updateSettings = (patch: GameSettingsPatch): void => {
    setSettings((prev) => {
      const next = mergeGameSettings(prev, patch);
      saveGameSettings(next);
      return next;
    });
  };

  const resetSettings = (): void => {
    const next = createDefaultGameSettings();
    saveGameSettings(next);
    setSettings(next);
  };

  const value: SettingsContextValue = {
    settings,
    updateSettings,
    resetSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
