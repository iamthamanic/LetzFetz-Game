/**
 * Mobile WebGL perf measure for Engine Live-3D (issue #193).
 * Writes metrics JSON under docs/engine-system/ (committed report companion).
 * Viewport: iPhone 12/14 class 390×844.
 */
import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  enableMvpLiveEngine,
  openPlaytestMatchReady,
  prepareDeterministicEngineVisual,
  waitForMvpSnapshotWarmup,
} from './helpers/engineMvpVisual';

const METRICS_DIR = join(__dirname, '../docs/engine-system');
const METRICS_PATH = join(METRICS_DIR, 'mobile-perf-metrics.json');

/** iPhone 12/14 class — Chromium only (no WebKit install required). */
test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

test.describe('Fetzgerät 3D — mobile perf measure', () => {
  test('records FPS, load ms, canvas count for MVP Live-3D', async ({ page }) => {
    test.setTimeout(120_000);

    await openPlaytestMatchReady(page);
    await page.evaluate(() => {
      window.localStorage.setItem('lf-engine-perf', '1');
    });
    await prepareDeterministicEngineVisual(page);

    const loadStarted = Date.now();
    const mode = await enableMvpLiveEngine(page);

    if (mode === 'missing') {
      throw new Error('MVP Live-3D zone mounted neither canvas nor WebGL fallback');
    }

    if (mode === 'no-webgl') {
      const metrics = {
        measuredAt: new Date().toISOString(),
        viewport: { width: 390, height: 844 },
        webgl: false,
        canvasCount: await page.locator('canvas').count(),
        loadMs: null as number | null,
        fpsAvg: null as number | null,
        fpsMin: null as number | null,
        frames: 0,
        reducedMotion: true,
        note: 'WebGL unavailable — German fallback path; no FPS sample',
      };
      mkdirSync(METRICS_DIR, { recursive: true });
      writeFileSync(METRICS_PATH, `${JSON.stringify(metrics, null, 2)}\n`);
      test.skip(true, 'Headless WebGL unavailable — metrics note written, FPS skipped');
      return;
    }

    await waitForMvpSnapshotWarmup(page);
    const loadMs = Date.now() - loadStarted;

    await expect(page.getByTestId('engine-perf-hud')).toBeVisible({ timeout: 5_000 });

    const sample = await page.evaluate(async () => {
      const durationMs = 2000;
      const timestamps: number[] = [];
      const start = performance.now();
      await new Promise<void>((resolve) => {
        const frame = (t: number) => {
          timestamps.push(t);
          if (t - start < durationMs) {
            requestAnimationFrame(frame);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(frame);
      });
      const deltas: number[] = [];
      for (let i = 1; i < timestamps.length; i += 1) {
        deltas.push(timestamps[i]! - timestamps[i - 1]!);
      }
      const avgDelta =
        deltas.length > 0
          ? deltas.reduce((a, b) => a + b, 0) / deltas.length
          : 0;
      const fpsAvg = avgDelta > 0 ? 1000 / avgDelta : 0;
      const maxDelta = deltas.length > 0 ? Math.max(...deltas) : 0;
      const fpsMin = maxDelta > 0 ? 1000 / maxDelta : 0;
      return {
        fpsAvg: Math.round(fpsAvg * 10) / 10,
        fpsMin: Math.round(fpsMin * 10) / 10,
        frames: timestamps.length,
        canvasCount: document.querySelectorAll('canvas').length,
      };
    });

    expect(sample.canvasCount).toBeLessThanOrEqual(1);

    const metrics = {
      measuredAt: new Date().toISOString(),
      viewport: { width: 390, height: 844 },
      deviceProfile: 'Chromium mobile emulation 390×844 (isMobile+touch)',
      webgl: true,
      canvasCount: sample.canvasCount,
      loadMs,
      fpsAvg: sample.fpsAvg,
      fpsMin: sample.fpsMin,
      frames: sample.frames,
      reducedMotion: true,
      recipe: 'MVP_DEMO_RECIPE',
      note: 'Emulated mobile GPU via desktop Chromium — treat as relative budget signal, not device ground truth',
    };

    mkdirSync(METRICS_DIR, { recursive: true });
    writeFileSync(METRICS_PATH, `${JSON.stringify(metrics, null, 2)}\n`);

    expect(sample.fpsAvg).toBeGreaterThan(15);
  });
});
