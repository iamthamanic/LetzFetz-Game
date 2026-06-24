/**
 * verify-ui: duel board tableau composition.
 * Evidence: ../.qa/evidence/duel-board-tableau/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { dismissMatchIntroSkip } from './helpers/matchIntro';
import { startBotMatchFromSetup } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../../.qa/evidence/duel-board-tableau');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('Duel board playmat', () => {
  test('playmat background, arena badge, character plates', async ({ page }) => {
    await startBotMatchFromSetup(page);
    await dismissMatchIntroSkip(page);

    const board = page.getByTestId('playmat-board');
    await expect(board).toBeVisible();
    await shot(page, '01-playmat-overview.png');

    const badge = page.getByTestId('arena-playmat-badge');
    await expect(badge).toBeVisible();
    await expect(page.getByTestId('arena-playmat')).toBeVisible();
    const badgeBox = await badge.boundingBox();
    expect(badgeBox?.width).toBeGreaterThanOrEqual(120);
    await expect(badge.getByRole('heading', { level: 2 })).toContainText('🏟️');
    await shot(page, '02-arena-badge.png');

    await expect(page.getByTestId('human-plate')).toBeVisible();
    await expect(page.getByTestId('opponent-plate')).toBeVisible();
    await expect(page.getByTestId('human-plate').getByText(/\d+ LP/)).toBeVisible();
    await expect(page.locator('[data-testid^="character-dock-idle-"]').first()).toBeVisible();
    await expect(page.getByTestId('human-engine')).toBeVisible();
    await expect(page.getByTestId('opponent-engine')).toBeVisible();

    const deckPile = page.getByTestId('deck-pile');
    const discardPile = page.getByTestId('discard-pile');
    await expect(deckPile).toBeVisible();
    await expect(discardPile).toBeVisible();
    await expect(page.getByTestId('discard-pile-empty')).toBeVisible();
    const deckCount = await deckPile.getAttribute('data-pile-count');
    expect(Number(deckCount)).toBeGreaterThan(0);
    await expect(deckPile.getByTestId('card-back').first()).toBeVisible();
    await shot(page, '04-deck-discard-piles.png');
  });
});
