/**
 * Unit tests for displayService (no real fullscreen required).
 * Location: src/services/settings/displayService.test.ts
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  applyDisplaySettings,
  type BrowserFullscreenAdapter,
} from './displayService';

describe('applyDisplaySettings', () => {
  afterEach(() => {
    document.documentElement.style.removeProperty('--lf-ui-scale');
    delete document.documentElement.dataset.lfHighContrast;
    delete document.documentElement.dataset.lfReducedMotion;
  });

  it('sets CSS var and data attributes without transform scale', () => {
    const fullscreen: BrowserFullscreenAdapter = {
      isFullscreen: () => false,
      requestFullscreen: vi.fn(async () => {}),
      exitFullscreen: vi.fn(async () => {}),
    };

    applyDisplaySettings(
      { uiScale: 1.1, preferFullscreen: false },
      { reducedMotion: true, highContrast: true },
      fullscreen,
    );

    expect(document.documentElement.style.getPropertyValue('--lf-ui-scale')).toBe(
      '1.1',
    );
    expect(document.documentElement.dataset.lfHighContrast).toBe('1');
    expect(document.documentElement.dataset.lfReducedMotion).toBe('1');
    expect(document.documentElement.style.transform).toBe('');
    expect(fullscreen.requestFullscreen).not.toHaveBeenCalled();
  });

  it('requests fullscreen when preferred', async () => {
    const requestFullscreen = vi.fn(async () => {});
    const fullscreen: BrowserFullscreenAdapter = {
      isFullscreen: () => false,
      requestFullscreen,
      exitFullscreen: vi.fn(async () => {}),
    };

    applyDisplaySettings(
      { uiScale: 1, preferFullscreen: true },
      { reducedMotion: false, highContrast: false },
      fullscreen,
    );

    expect(requestFullscreen).toHaveBeenCalled();
  });
});
