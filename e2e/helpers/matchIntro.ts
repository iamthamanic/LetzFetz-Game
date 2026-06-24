/**
 * Dismiss match intro: Letz Fetz → crash → arena video → board.
 * Location: e2e/helpers/matchIntro.ts
 */
import { expect, type Page } from '@playwright/test';

const CRASH_MS = 900;

/** Full intro path including arena video beat. */
export async function dismissMatchIntroFull(page: Page) {
  await expect(page.getByTestId('match-intro')).toBeVisible();
  await page.getByRole('button', { name: 'Letz Fetz' }).click();
  await expect(page.getByTestId('match-intro-arena')).toBeVisible({ timeout: 3000 });
  await page.getByTestId('match-intro-arena').getByRole('button', { name: 'Überspringen' }).click();
  await expect(page.getByTestId('opening-deal-done')).toBeVisible({ timeout: 3000 });
}

/** Fast path: Letz Fetz crash then skip arena video. */
export async function dismissMatchIntroSkip(page: Page) {
  await expect(page.getByTestId('match-intro')).toBeVisible();
  await page.getByRole('button', { name: 'Letz Fetz' }).click();
  await page.waitForTimeout(CRASH_MS);
  await expect(page.getByTestId('match-intro-arena')).toBeVisible({ timeout: 3000 });
  await page.getByTestId('match-intro-arena').getByRole('button', { name: 'Überspringen' }).click();
  await expect(page.getByTestId('opening-deal-done')).toBeVisible({ timeout: 3000 });
}
