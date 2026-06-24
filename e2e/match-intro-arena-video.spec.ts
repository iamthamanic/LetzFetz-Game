/**
 * verify-ui: MatchIntro arena video teaser (Sprint 3).
 * Evidence: ../.qa/evidence/match-intro-arena-video/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { dismissMatchIntroFull } from './helpers/matchIntro';
import { startBotMatchFromSetup } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../../.qa/evidence/match-intro-arena-video');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('MatchIntro arena reveal — Sprint 3', () => {
  test('VS beat, arena teaser with mutation, board entry', async ({ page }) => {
    await startBotMatchFromSetup(page);

    await expect(page.getByTestId('match-intro-vs')).toBeVisible();
    await expect(page.getByText('VS')).toBeVisible();
    await shot(page, '01-vs-beat.png');

    await page.getByRole('button', { name: 'Letz Fetz' }).click();
    await expect(page.getByTestId('match-intro-arena')).toBeVisible({ timeout: 3000 });

    const teaser = page.getByTestId('arena-teaser-video').or(page.getByTestId('arena-teaser-fallback'));
    await expect(teaser).toBeVisible();

    const introArena = page.getByTestId('match-intro-arena');
    const mutation = introArena.getByTestId('arena-mutation');
    const noVariant = introArena.getByText('Keine W6-Variante');
    await expect(mutation.or(noVariant)).toBeVisible();
    await shot(page, '02-arena-teaser.png');

    await introArena.getByRole('button', { name: 'Überspringen' }).click();
    await page.waitForTimeout(600);

    await expect(page.getByText('Gegner-Engine')).toBeVisible();
    await shot(page, '03-board-after-dismiss.png');
  });

  test('Letz Fetz then skip reaches board', async ({ page }) => {
    await startBotMatchFromSetup(page);
    await page.getByRole('button', { name: 'Letz Fetz' }).click();
    await expect(page.getByTestId('match-intro-arena')).toBeVisible({ timeout: 3000 });
    await page.getByTestId('match-intro-arena').getByRole('button', { name: 'Überspringen' }).click();
    await expect(page.getByText('Deine Engine')).toBeVisible();
  });
});
