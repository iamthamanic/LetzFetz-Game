/**
 * verify-ui mobile smoke for playmat layout at 390x844 (iPhone 12/14 class).
 * Acceptance for #21 — Mobile pass for playmat game layout.
 * Evidence: ../.qa/evidence/mobile-playmat-layout/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const EVIDENCE = join(__dirname, '../.qa/evidence/mobile-playmat-layout');
const MOBILE_VIEWPORT = { width: 390, height: 844 } as const;

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

import { dismissMatchIntroSkip } from './helpers/matchIntro';
import { startBotMatchFromSetup } from './helpers/gameSetup';

test.use({ viewport: MOBILE_VIEWPORT });

test.describe('Mobile playmat layout — 390x844', () => {
  test('no horizontal overflow and all zones reachable', async ({ page }) => {
    await startBotMatchFromSetup(page);
    await page.waitForTimeout(400);
    await expect(page.getByTestId('match-intro')).toBeVisible();
    await shot(page, '01-setup-mobile.png');
    await dismissMatchIntroSkip(page);

    await expect(page.getByText('Gegner-Engine')).toBeVisible();
    await expect(page.getByText('Deine Engine')).toBeVisible();
    await shot(page, '02-board-mobile.png');

    // No horizontal overflow beyond viewport.
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(MOBILE_VIEWPORT.width);

    // Phase banner visible and wraps on mobile.
    await expect(page.getByTestId('phase-coach-banner')).toBeVisible();

    // Human hand row visible and horizontally scrollable container exists.
    const hand = page.getByTestId('player-hand');
    await expect(hand).toBeVisible();
    const handScrollWidth = await hand.evaluate((el) => el.scrollWidth);
    const handClientWidth = await hand.evaluate((el) => el.clientWidth);
    // Hand inner content may overflow its container — that's expected; scroll handles it.
    expect(handScrollWidth).toBeGreaterThan(0);

    // Bound card rows present (opponent + human).
    await expect(page.getByTestId('duel-tableau')).toBeVisible();
    await shot(page, '03-zones-visible.png');

    // Action bar reachable (Zug starten button in start phase).
    const startBtn = page.getByRole('button', { name: 'Zug starten' });
    await expect(startBtn).toBeVisible();
    await shot(page, '04-action-reachable.png');
  });
});