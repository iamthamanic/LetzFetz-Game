/**
 * E2E: open Playtest match and enable MVP Live-3D board zone.
 * Location: e2e/helpers/engineMvpVisual.ts
 */
import { expect, type Page } from '@playwright/test';
import { selectBotMode } from './gameSetup';
import { waitForPlayUiReady } from './matchIntro';

/**
 * Dismiss match intro through arena (crash → initiative → arena → continue).
 * Arena appears only after winner hold (~4.6s without reduced motion); wait on
 * the arena testid (event-driven), not a short fixed sleep.
 */
async function dismissMatchIntroForVisual(page: Page): Promise<void> {
  await expect(page.getByTestId('match-intro')).toBeVisible({ timeout: 10_000 });
  await page.getByRole('button', { name: 'Letz Fetz' }).click();
  const arena = page.getByTestId('match-intro-arena');
  await expect(arena).toBeVisible({ timeout: 20_000 });
  await arena.getByRole('button', { name: /überspringen|weiter/i }).click();
  await waitForPlayUiReady(page);
}

/** Playtest → bot match → dismiss intros → ready for cheatbox. */
export async function openPlaytestMatchReady(page: Page): Promise<void> {
  await page.goto('/?playtest=1');
  await page.getByTestId('main-menu-play').click();
  await expect(page.getByTestId('game-mode-select')).toBeVisible();
  await selectBotMode(page);
  await page.getByRole('button', { name: 'Partie starten' }).click();
  await dismissMatchIntroForVisual(page);
  await expect(page.getByText('Playtest', { exact: true })).toBeVisible({
    timeout: 20_000,
  });
}

/**
 * Force reduced motion so WeaponAssembler uses assembled pose (deterministic).
 * Call only after match intro — applying earlier changes crash/initiative timing.
 */
export async function prepareDeterministicEngineVisual(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
}

/** Enable cheatbox MVP Live-3D; returns whether WebGL canvas mounted. */
export async function enableMvpLiveEngine(
  page: Page,
): Promise<'canvas' | 'no-webgl' | 'missing'> {
  const toggle = page.getByTestId('playtest-engine-3d-mvp');
  await expect(toggle).toBeVisible();
  await toggle.locator('input[type="checkbox"]').check();

  const zone = page.getByTestId('board-engine-live-zone');
  await expect(zone).toBeVisible({ timeout: 10_000 });

  const canvas = page.getByTestId('engine-preview-canvas');
  const noWebgl = page.getByTestId('engine-preview-no-webgl');

  const hasCanvas = await canvas.isVisible().catch(() => false);
  if (hasCanvas) return 'canvas';
  const hasFallback = await noWebgl.isVisible().catch(() => false);
  if (hasFallback) return 'no-webgl';
  return 'missing';
}

/**
 * Wait until board warmup status reports a snapshot attempt (event-driven).
 * Reduced-motion warmup is short; status proves models reached capture path.
 */
export async function waitForMvpSnapshotWarmup(page: Page): Promise<void> {
  const zone = page.getByTestId('board-engine-live-zone');
  await expect(zone.getByRole('status')).toContainText(/Snapshot/, {
    timeout: 15_000,
  });
}
