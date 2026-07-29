/**
 * Sync SettingsProvider audio slice into AudioManager.
 * Location: src/services/audio/AudioSettingsSync.tsx
 *
 * useLayoutEffect so mute/volumes apply before MusicBedSync's useEffect playMusic.
 */
import { useLayoutEffect } from 'react';
import { useSettings } from '../settings/SettingsProvider';
import { audioManager } from './audioManager';

export function AudioSettingsSync(): null {
  const { settings } = useSettings();

  useLayoutEffect(() => {
    audioManager.applySettings(settings.audio);
  }, [settings.audio]);

  return null;
}
