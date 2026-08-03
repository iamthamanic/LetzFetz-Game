/**
 * V5 E2E / verify-ui — solo formula match smoke (#233).
 * Evidence: ../.qa/evidence/v5-e2e-verify-ui/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { selectBotMode } from './helpers/gameSetup';
import { waitForPlayUiReady } from './helpers/matchIntro';

const EVIDENCE = join(__dirname, '../.qa/evidence/v5-e2e-verify-ui');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

async function dismissIntroForV5(page: import('@playwright/test').Page) {
  await expect(page.getByTestId('match-intro')).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: 'Letz Fetz' }).click();
  const arena = page.getByTestId('match-intro-arena');
  await expect(arena).toBeVisible({ timeout: 30000 });
  await arena.getByRole('button', { name: 'Überspringen' }).click();
  await waitForPlayUiReady(page);
}

test.describe('V5 E2E — Formel match smoke', () => {
  test('start V5 match, Formel bauen, Direktangriff', async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto('/?playtest=1');
    await page.getByTestId('main-menu-play').click();
    await expect(page.getByTestId('game-mode-select')).toBeVisible();
    await selectBotMode(page);

    await page.getByTestId('game-setup-settings').click();
    await expect(page.getByTestId('game-setup-settings-modal')).toBeVisible();
    await page.getByTestId('game-pack-v5').click();
    await expect(page.getByTestId('game-pack-v5')).toHaveAttribute('aria-pressed', 'true');
    await page.getByTestId('game-settings-apply').click();
    await shot(page, '01-setup-v5.png');

    await page.getByRole('button', { name: 'Partie starten' }).click();
    await dismissIntroForV5(page);

    await expect(page.getByTestId('playmat-board')).toHaveAttribute('data-v5-formula', 'true', {
      timeout: 15000,
    });
    await expect(page.getByTestId('human-formula-rig')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('opponent-formula-rig')).toBeVisible();
    await expect(page.getByTestId('board-engine-live-zone')).toHaveCount(0);
    await expect(page.getByTestId('board-engine-live-empty')).toHaveCount(0);
    await shot(page, '02-board-formula-rig.png');

    await page.getByLabel('Bot pausieren').check();

    await page.getByTestId('playtest-v5-formula-ready').click();
    await expect(page.getByTestId('build-phase-bar')).toBeVisible({ timeout: 10000 });
    await shot(page, '03-formula-ready.png');

    // Collapse playtest overlay (intercepts hand clicks at bottom-right).
    await page.evaluate(() => {
      const btn = document.querySelector(
        'div.pointer-events-auto.absolute.bottom-3.right-3 button[aria-expanded="true"]',
      );
      if (btn instanceof HTMLElement) btn.click();
    });

    await page.getByTestId('build-phase-start').click();
    const formulaCard = page
      .getByTestId('player-hand')
      .locator('[data-card-id="v5-technik-durchschuss"]')
      .first();
    await expect(formulaCard).toBeVisible({ timeout: 8000 });
    await formulaCard.click();

    await expect(
      page.getByTestId('human-formula-rig').locator('[data-formula-slot="technik"]'),
    ).toContainText(/Durchschuss/);
    await shot(page, '04-after-formula-build.png');

    const skipFormel = page.getByTestId('build-phase-skip');
    if (await skipFormel.isVisible().catch(() => false)) {
      const cancelBuild = page.getByTestId('build-phase-cancel');
      if (await cancelBuild.isVisible().catch(() => false)) {
        await cancelBuild.click();
      }
      await skipFormel.click();
    }
    await expect(page.getByRole('button', { name: 'Aktion spielen' })).toBeVisible({
      timeout: 8000,
    });

    await page.getByRole('button', { name: 'Aktion spielen' }).click();
    const attackCard = page.getByTestId('player-hand').getByRole('button', {
      name: /Feuer 6 Angriff/,
    });
    await expect(attackCard).toBeVisible({ timeout: 8000 });
    await attackCard.click();
    await expect(page.getByRole('button', { name: 'Direkt angreifen' })).toBeVisible({
      timeout: 5000,
    });
    await page.getByRole('button', { name: 'Direkt angreifen' }).click();
    await shot(page, '05-after-direct-attack.png');

    // Match still running or combat/bot response — smoke complete.
    await expect(page.getByTestId('human-formula-rig')).toBeVisible();
  });
});
