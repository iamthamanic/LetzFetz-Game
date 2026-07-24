/**
 * Display settings application — CSS vars / data attrs, never transform:scale.
 * Location: src/services/settings/displayService.ts
 */
import type { A11ySettings, DisplaySettings } from './types';

export interface BrowserFullscreenAdapter {
  isFullscreen: () => boolean;
  requestFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
}

export function createBrowserFullscreenAdapter(): BrowserFullscreenAdapter {
  return {
    isFullscreen: () => {
      if (typeof document === 'undefined') return false;
      return document.fullscreenElement != null;
    },
    requestFullscreen: async () => {
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      if (!root.requestFullscreen) return;
      try {
        await root.requestFullscreen();
      } catch {
        // Permission denied / unsupported — fail soft
      }
    },
    exitFullscreen: async () => {
      if (typeof document === 'undefined') return;
      if (!document.fullscreenElement || !document.exitFullscreen) return;
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    },
  };
}

const defaultFullscreen = createBrowserFullscreenAdapter();

/**
 * Apply UI scale + a11y via CSS custom properties and data attributes.
 * Does not use transform: scale on the document.
 */
export function applyDisplaySettings(
  display: DisplaySettings,
  a11y: A11ySettings,
  fullscreen: BrowserFullscreenAdapter = defaultFullscreen,
): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--lf-ui-scale', String(display.uiScale));
  root.dataset.lfHighContrast = a11y.highContrast ? '1' : '0';
  root.dataset.lfReducedMotion = a11y.reducedMotion ? '1' : '0';

  const wantFs = display.preferFullscreen;
  const isFs = fullscreen.isFullscreen();
  if (wantFs && !isFs) {
    void fullscreen.requestFullscreen();
  } else if (!wantFs && isFs) {
    void fullscreen.exitFullscreen();
  }
}
