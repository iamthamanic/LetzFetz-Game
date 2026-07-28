/**
 * verify-ui: Elementimpuls keyword on cards + combat stage copy (#148).
 * Evidence: ../.qa/evidence/v3-impulse-keyword-ui/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { selectBotMode } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../.qa/evidence/v3-impulse-keyword-ui');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

async function startPlaytestMatch(page: import('@playwright/test').Page) {
  await page.goto('/?playtest=1');
  await page.getByTestId('main-menu-play').click();
  await expect(page.getByTestId('game-mode-select')).toBeVisible();
  await selectBotMode(page);
  await page.getByRole('button', { name: 'Partie starten' }).click();

  await expect(page.getByTestId('match-intro')).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: 'Letz Fetz' }).click();
  const arena = page.getByTestId('match-intro-arena');
  await expect(arena).toBeVisible({ timeout: 30000 });
  await arena.getByRole('button', { name: 'Überspringen' }).click();
  await expect(page.getByText('Playtest', { exact: true })).toBeVisible({ timeout: 20000 });
}

test.describe('V3 Elementimpuls keyword UI', () => {
  test('shows Elementimpuls chip and combat stage impulse copy', async ({ page }) => {
    await startPlaytestMatch(page);

    await page.getByRole('button', { name: 'Block ausstehend' }).click();
    await expect(page.getByTestId('combat-stage')).toBeVisible({ timeout: 10000 });

    const stageImpulse = page.getByTestId('combat-stage-impulse');
    await expect(stageImpulse).toBeVisible();
    await expect(stageImpulse).toContainText('Elementimpuls');

    const chip = page.getByTestId('card-elementimpuls-chip').first();
    await expect(chip).toBeVisible();
    await expect(chip).toContainText('Elementimpuls');

    await shot(page, '01-card-elementimpuls-chip.png');
    await shot(page, '02-combat-impulse-copy.png');
  });
});
