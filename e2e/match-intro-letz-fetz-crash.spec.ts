/**
 * verify-ui: MatchIntro Letz Fetz crash → arena video.
 * Evidence: ../.qa/evidence/match-intro-letz-fetz-crash/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { dismissMatchIntroSkip } from './helpers/matchIntro';
import { startBotMatchFromSetup } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../../.qa/evidence/match-intro-letz-fetz-crash');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('MatchIntro Letz Fetz crash', () => {
  test('Letz Fetz crash, arena video with skip, board entry', async ({ page }) => {
    await startBotMatchFromSetup(page);

    await expect(page.getByTestId('match-intro-vs')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Letz Fetz' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Arena enthüllen' })).toHaveCount(0);
    await shot(page, '01-vs-letz-fetz.png');

    await page.getByRole('button', { name: 'Letz Fetz' }).click();
    await expect(page.getByTestId('match-intro-crash')).toBeVisible();
    await shot(page, '02-crash-beat.png');

    await expect(page.getByTestId('match-intro-arena')).toBeVisible({ timeout: 3000 });
    const teaser = page.getByTestId('arena-teaser-video').or(page.getByTestId('arena-teaser-fallback'));
    await expect(teaser).toBeVisible();

    const introArena = page.getByTestId('match-intro-arena');
    await expect(introArena.getByRole('button', { name: 'Überspringen' })).toBeVisible();
    await shot(page, '03-arena-skip.png');

    await introArena.getByRole('button', { name: 'Überspringen' }).click();
    await expect(page.getByText('Gegner-Engine')).toBeVisible();
    await shot(page, '04-board-after-skip.png');
  });

  test('dismissMatchIntroSkip helper reaches board', async ({ page }) => {
    await startBotMatchFromSetup(page);
    await dismissMatchIntroSkip(page);
    await expect(page.getByText('Deine Engine')).toBeVisible();
  });
});

test.describe('MatchIntro Letz Fetz crash — reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('Letz Fetz skips crash beat', async ({ page }) => {
    await startBotMatchFromSetup(page);
    await page.getByRole('button', { name: 'Letz Fetz' }).click();
    await expect(page.getByTestId('match-intro-crash')).toHaveCount(0);
    await expect(page.getByTestId('match-intro-arena')).toBeVisible({ timeout: 2000 });
    await shot(page, '05-reduced-motion-arena.png');
  });
});
