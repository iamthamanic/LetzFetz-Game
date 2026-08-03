/**
 * V6 setup after Play-Default cutover (#353).
 * Evidence: ../.qa/evidence/v6-setup-flag/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { openPlaySetup, selectBotMode } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../../.qa/evidence/v6-setup-flag');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('V6 setup Play-Default cutover', () => {
  test('shows V6 as default and V5 as Legacy', async ({ page }) => {
    await openPlaySetup(page);
    await selectBotMode(page);
    await page.getByTestId('game-setup-settings').click();
    await expect(page.getByTestId('game-setup-settings-modal')).toBeVisible();
    await expect(page.getByTestId('game-pack-v6')).toBeVisible();
    await expect(page.getByTestId('game-pack-v5')).toBeVisible();
    await expect(page.getByTestId('game-pack-v6')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('game-pack-v5')).toContainText('Legacy');
    await expect(page.getByTestId('game-setup-v6-default-hint')).toBeVisible();
    await shot(page, '01-v6-default.png');
  });

  test('allows selecting V5 Legacy', async ({ page }) => {
    await openPlaySetup(page);
    await selectBotMode(page);
    await page.getByTestId('game-setup-settings').click();
    await expect(page.getByTestId('game-setup-settings-modal')).toBeVisible();
    const v5 = page.getByTestId('game-pack-v5');
    await expect(v5).toContainText('Legacy');
    await expect(v5).toContainText('Legacy / Regression');
    await v5.click();
    await expect(v5).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('game-pack-v6')).toHaveAttribute('aria-pressed', 'false');
    await page.getByTestId('game-settings-apply').click();
    await expect(page.getByTestId('game-setup-pack-summary')).toContainText('V5 Formel (Legacy)');
    await shot(page, '02-v5-legacy.png');
  });
});

