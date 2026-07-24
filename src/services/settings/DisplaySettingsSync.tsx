/**
 * Sync display + a11y settings onto the document.
 * Location: src/services/settings/DisplaySettingsSync.tsx
 */
import { useEffect } from 'react';
import { applyDisplaySettings } from './displayService';
import { useSettings } from './SettingsProvider';

export function DisplaySettingsSync(): null {
  const { settings } = useSettings();

  useEffect(() => {
    applyDisplaySettings(settings.display, settings.a11y);
  }, [settings.display, settings.a11y]);

  return null;
}
