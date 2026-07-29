/**
 * Visual regression: MVP trio assembly (Wasser + Schatten + Licht).
 * Issue #192 · Evidence: ../.qa/evidence/fetz-3d-visual-regression-mvp/
 *
 * Baseline update (after intentional look/asset/`ENGINE_RENDER_VERSION` change):
 *   npm run test:e2e:visual-mvp:update
 *
 * Fail conditions:
 * - Pixel diff above maxDiffPixelRatio → test FAIL
 * - Neither canvas nor WebGL fallback → test FAIL
 * - WebGL unavailable → test.skip (explicit; not a silent green pixel pass)
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  enableMvpLiveEngine,
  openPlaytestMatchReady,
  prepareDeterministicEngineVisual,
  waitForMvpSnapshotWarmup,
} from './helpers/engineMvpVisual';

const EVIDENCE = join(
  __dirname,
  '../.qa/evidence/fetz-3d-visual-regression-mvp',
);

/** Soft threshold for GPU AA / driver variance; still catches montage/material breaks. */
const MAX_DIFF_PIXEL_RATIO = 0.04;

test.describe('Fetzgerät 3D — MVP trio visual regression', () => {
  test('board Live-3D MVP assembly matches baseline', async ({ page }) => {
    test.setTimeout(90_000);

    await openPlaytestMatchReady(page);
    await prepareDeterministicEngineVisual(page);

    const mode = await enableMvpLiveEngine(page);
    if (mode === 'missing') {
      throw new Error(
        'MVP Live-3D zone mounted neither canvas nor WebGL fallback',
      );
    }
    if (mode === 'no-webgl') {
      test.skip(
        true,
        'Headless WebGL unavailable — visual regression skipped (not a green pixel pass)',
      );
      return;
    }

    await waitForMvpSnapshotWarmup(page);

    const canvasHost = page.getByTestId('engine-preview-canvas');
    await expect(canvasHost).toBeVisible();

    mkdirSync(EVIDENCE, { recursive: true });
    await canvasHost.screenshot({
      path: join(EVIDENCE, 'mvp-trio-assembly.png'),
    });

    await expect(canvasHost).toHaveScreenshot('mvp-trio-assembly.png', {
      maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO,
      animations: 'disabled',
      caret: 'hide',
    });
  });
});
