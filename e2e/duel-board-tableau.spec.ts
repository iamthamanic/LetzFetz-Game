/**
 * verify-ui: duel board tableau composition.
 * Evidence: ../.qa/evidence/duel-board-tableau/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { dismissMatchIntroSkip } from './helpers/matchIntro';

const EVIDENCE = join(__dirname, '../../.qa/evidence/duel-board-tableau');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('Duel board tableau', () => {
  test('arena card sidebar, character plates, themed backdrop', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Spielen' }).click();
    await page.getByRole('button', { name: 'Partie starten' }).click();
    await dismissMatchIntroSkip(page);

    const tableau = page.getByTestId('duel-tableau');
    await expect(tableau).toBeVisible();
    await shot(page, '01-tableau-overview.png');

    const arena = page.getByTestId('arena-center');
    await expect(arena).toBeVisible();
    await expect(page.getByTestId('arena-backdrop')).toBeVisible();
    const arenaBox = await arena.boundingBox();
    expect(arenaBox?.width).toBeGreaterThanOrEqual(200);
    await expect(arena.getByRole('heading', { level: 2 })).toContainText('🏟️');
    await shot(page, '02-arena-sidebar.png');

    await expect(page.getByTestId('human-plate')).toBeVisible();
    await expect(page.getByTestId('opponent-plate')).toBeVisible();
    await expect(page.getByTestId('human-engine')).toBeVisible();
    await expect(page.getByTestId('opponent-engine')).toBeVisible();
    await shot(page, '03-character-plates.png');
  });
});
