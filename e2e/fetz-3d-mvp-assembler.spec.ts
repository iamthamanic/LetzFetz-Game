/**
 * verify-ui: Fetzgerät 3D MVP assembler (issues #130–#134).
 * Evidence: ../.qa/evidence/fetz-3d-mvp/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { selectBotMode } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../../.qa/evidence/fetz-3d-mvp');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('Fetzgerät 3D MVP — assembler panel', () => {
  test('cheatbox opens 3D panel, canvas or WebGL fallback, snapshot stub', async ({
    page,
  }) => {
    await page.goto('/?playtest=1');
    await page.getByTestId('main-menu-play').click();
    await expect(page.getByTestId('game-mode-select')).toBeVisible();
    await selectBotMode(page);
    await page.getByRole('button', { name: 'Partie starten' }).click();

    await expect(page.getByTestId('match-intro')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('match-intro').getByRole('button', { name: 'Letz Fetz' }).click();
    const arena = page.getByTestId('match-intro-arena');
    await expect(arena).toBeVisible({ timeout: 30000 });
    await arena.getByRole('button', { name: 'Überspringen' }).click();
    await expect(page.getByText('Playtest', { exact: true })).toBeVisible({ timeout: 20000 });
    await shot(page, '01-playtest-match.png');

    const toggle = page.getByTestId('playtest-engine-3d-mvp');
    await expect(toggle).toBeVisible();
    await toggle.locator('input[type="checkbox"]').check();

    const panel = page.getByTestId('engine-preview-panel');
    await expect(panel).toBeVisible({ timeout: 10000 });
    await expect(panel.getByText('Fetzgerät 3D')).toBeVisible();
    await shot(page, '02-engine-preview-panel.png');

    const canvas = page.getByTestId('engine-preview-canvas');
    const noWebgl = page.getByTestId('engine-preview-no-webgl');
    const hasCanvas = await canvas.isVisible().catch(() => false);
    const hasFallback = await noWebgl.isVisible().catch(() => false);
    expect(hasCanvas || hasFallback).toBeTruthy();

    await page.getByTestId('engine-snapshot-cache-btn').click();
    await expect(panel.getByRole('status')).toBeVisible({ timeout: 5000 });
    await shot(page, '03-snapshot-cached.png');

    await panel.getByRole('button', { name: '3D-Vorschau schließen' }).click();
    await expect(panel).toHaveCount(0);
  });
});
