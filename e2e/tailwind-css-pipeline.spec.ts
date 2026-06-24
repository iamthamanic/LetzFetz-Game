/**
 * verify-ui run: tailwind-css-pipeline — contrast/readability evidence.
 * Evidence: ../.qa/evidence/tailwind-css-pipeline/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { dismissMatchIntroSkip } from './helpers/matchIntro';
import { openPlaySetup, selectBotMode } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../../.qa/evidence/tailwind-css-pipeline');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('Tailwind CSS pipeline — readable UI', () => {
  test('setup, board, and forge sidebar are visually styled', async ({ page }) => {
    await openPlaySetup(page);

    await expect(page.getByText('Gegen Bot')).toBeVisible();
    await expect(page.getByTestId('game-mode-select')).toBeVisible();
    await shot(page, '01-setup-readable.png');

    await selectBotMode(page);
    await expect(page.getByRole('button', { name: 'Partie starten' })).toBeVisible();
    await page.getByRole('button', { name: 'Partie starten' }).click();
    await dismissMatchIntroSkip(page);

    await expect(page.getByText('Gegner-Engine')).toBeVisible();
    await expect(page.getByText('Deine Engine')).toBeVisible();
    await shot(page, '02-board-readable.png');

    await page.getByRole('button', { name: 'Edit' }).click();
    await page.waitForTimeout(400);
    await expect(page.getByText('Charakter')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Neue Karte' })).toBeVisible();
    await shot(page, '03-forge-sidebar-readable.png');
  });
});
