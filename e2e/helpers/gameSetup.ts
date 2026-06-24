/**
 * E2E helpers for play setup — mode step then character step.
 * Location: e2e/helpers/gameSetup.ts
 */
import { expect, type Page } from '@playwright/test';

export async function openPlaySetup(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByTestId('game-mode-select')).toBeVisible();
}

export async function selectBotMode(page: Page) {
  await page.getByTestId('game-mode-bot').click();
  await expect(page.getByTestId('character-carousel')).toBeVisible();
}

export async function startBotMatchFromSetup(page: Page) {
  await openPlaySetup(page);
  await selectBotMode(page);
  await page.getByRole('button', { name: 'Partie starten' }).click();
}
