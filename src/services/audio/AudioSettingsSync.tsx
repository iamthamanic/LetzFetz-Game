/**
 * Sync SettingsProvider audio slice into AudioManager.
 * Location: src/services/audio/AudioSettingsSync.tsx
 */
import { useEffect } from 'react';
import { useSettings } from '../settings/SettingsProvider';
import { audioManager } from './audioManager';

export function AudioSettingsSync(): null {
  const { settings } = useSettings();

  useEffect(() => {
    audioManager.applySettings(settings.audio);
  }, [settings.audio]);

  return null;
}
