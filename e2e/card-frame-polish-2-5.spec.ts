/**
 * verify-ui: card frame polish 2.5 (hand a11y — still valid after tableau).
 * Evidence: ../.qa/evidence/card-frame-polish-2-5/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { dismissMatchIntroSkip } from './helpers/matchIntro';
import { startBotMatchFromSetup } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../../.qa/evidence/card-frame-polish-2-5');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('Card frame polish 2.5', () => {
  test('hand buttons in startphase, arena playmat badge, md grunge', async ({ page }) => {
    await startBotMatchFromSetup(page);
    await dismissMatchIntroSkip(page);

    const handCard = page.getByTestId('player-hand').locator('button[data-card-id]').first();
    await expect(handCard).toBeVisible();
    await expect(handCard).toBeDisabled();
    await shot(page, '01-hand-buttons-startphase.png');

    const badge = page.getByTestId('arena-playmat-badge');
    await expect(badge).toBeVisible();
    const badgeBox = await badge.boundingBox();
    expect(badgeBox?.width).toBeGreaterThanOrEqual(120);
    await expect(badge.getByRole('heading', { level: 2 })).toContainText('🏟️');
    await shot(page, '02-arena-badge.png');

    await expect(handCard).toHaveClass(/w-36/);
    await shot(page, '03-hand-grunge-md.png');
  });
});
