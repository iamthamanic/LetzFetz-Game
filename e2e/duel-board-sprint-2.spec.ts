/**
 * verify-ui: duel board sprint 2 (grunge cards, declutter, match intro).
 * Evidence: ../.qa/evidence/duel-board-sprint-2/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { dismissMatchIntroFull } from './helpers/matchIntro';
import { startBotMatchFromSetup } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../../.qa/evidence/duel-board-sprint-2');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('Duel board sprint 2', () => {
  test('match intro, decluttered board, grunge hand cards', async ({ page }) => {
    await startBotMatchFromSetup(page);

    await expect(page.getByTestId('match-intro-vs')).toBeVisible();
    await expect(page.getByText('VS')).toBeVisible();
    await shot(page, '01-match-intro.png');

    await dismissMatchIntroFull(page);

    await expect(page.getByText('Gegner-Engine')).toBeVisible();
    await expect(page.getByText(/Hand \d+ \(verdeckt\)/)).toBeVisible();
    await shot(page, '02-board-decluttered.png');

    const handCard = page.getByTestId('player-hand').locator('button[data-card-id]').first();
    await expect(handCard).toBeVisible();
    await expect(handCard).toHaveClass(/w-36/);
    await shot(page, '03-hand-grunge.png');
  });
});
