/**
 * verify-ui: Vollblock / Auto-Reaktion combat feedback toasts (#150).
 * Evidence: ../.qa/evidence/v3-vollblock-reaction-feedback/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { selectBotMode } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../.qa/evidence/v3-vollblock-reaction-feedback');

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

test.describe('V3 Vollblock / reaction feedback UI', () => {
  test('cheatbox demo shows Vollblock and Auto-Reaktion toasts', async ({ page }) => {
    await startPlaytestMatch(page);

    await page.getByTestId('playtest-combat-feedback-demo').click();

    await expect(page.getByTestId('combat-feedback-toasts')).toBeVisible({ timeout: 10000 });
    const vollblock = page.getByTestId('combat-feedback-vollblock');
    await expect(vollblock).toBeVisible();
    await expect(vollblock).toContainText('Vollblock');
    await shot(page, '01-vollblock-toast.png');

    const autoReaction = page.getByTestId('combat-feedback-auto-reaction');
    await expect(autoReaction).toBeVisible();
    await expect(autoReaction).toContainText('Auto-Reaktion');
    await expect(autoReaction).toContainText('Dampf');
    await shot(page, '02-auto-reaction-toast.png');
  });
});
