/**
 * verify-ui acceptance for V3 play path (status chips + reaction modal).
 * Evidence: ../.qa/evidence/v3-e2e-verify-ui/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { selectBotMode } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../.qa/evidence/v3-e2e-verify-ui');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

/** Start solo playtest match; dismiss intro through arena skip. */
async function startPlaytestMatch(page: import('@playwright/test').Page) {
  await page.goto('/?playtest=1');
  await page.getByTestId('main-menu-play').click();
  await expect(page.getByTestId('game-mode-select')).toBeVisible();
  await selectBotMode(page);
  await page.getByRole('button', { name: 'Partie starten' }).click();

  await expect(page.getByTestId('match-intro')).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: 'Letz Fetz' }).click();
  // Crash → initiative → winner → arena (can take several seconds)
  const arena = page.getByTestId('match-intro-arena');
  await expect(arena).toBeVisible({ timeout: 30000 });
  await arena.getByRole('button', { name: 'Überspringen' }).click();
  await expect(page.getByText('Playtest', { exact: true })).toBeVisible({ timeout: 20000 });
}

test.describe('V3 E2E — status chips + reaction modal', () => {
  test('V3 Demo shows chips and mandatory reaction modal', async ({ page }) => {
    await startPlaytestMatch(page);

    await page.getByTestId('playtest-v3-on').click();
    await expect(page.getByText(/V3 Kampf · an/)).toBeVisible();
    await shot(page, '01-v3-enabled.png');

    await page.getByTestId('playtest-v3-demo').click();
    await expect(page.getByTestId('status-chips-p1').first()).toContainText('Brennen');
    await expect(page.getByTestId('reaction-pick-modal')).toBeVisible();
    await expect(page.getByTestId('reaction-pick-inferno')).toBeVisible();
    await expect(page.getByTestId('reaction-pick-dampf')).toBeVisible();
    await shot(page, '02-reaction-modal.png');

    // Escape must not dismiss (mandatory choice)
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('reaction-pick-modal')).toBeVisible();

    await page.getByTestId('reaction-pick-dampf').click();
    await expect(page.getByTestId('reaction-pick-modal')).toHaveCount(0);
    await shot(page, '03-after-pick.png');
  });

  test('V3 off leaves default UI without reaction demo requirement', async ({ page }) => {
    await startPlaytestMatch(page);
    await page.getByTestId('playtest-v3-off').click();
    await expect(page.getByText(/V3 Kampf · aus/)).toBeVisible();
    await expect(page.getByTestId('reaction-pick-modal')).toHaveCount(0);
  });
});
