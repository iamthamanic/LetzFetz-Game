/**
 * V6 setup smoke — pack tile visible only behind playable flag.
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

test.describe('V6 setup playable flag', () => {
  test('hides V6 tile by default', async ({ page }) => {
    await openPlaySetup(page);
    await selectBotMode(page);
    await expect(page.getByTestId('game-pack-v5')).toBeVisible();
    await expect(page.getByTestId('game-pack-v6')).toHaveCount(0);
    await shot(page, '01-v6-hidden.png');
  });

  test('shows V6 tile when localStorage flag is set', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('letz-fetz:v6-playable', '1');
    });
    await openPlaySetup(page);
    await selectBotMode(page);
    await expect(page.getByTestId('game-pack-v6')).toBeVisible();
    await page.getByTestId('game-pack-v6').click();
    await expect(page.getByTestId('game-pack-v6')).toHaveAttribute('aria-pressed', 'true');
    await shot(page, '02-v6-visible.png');
  });
});
