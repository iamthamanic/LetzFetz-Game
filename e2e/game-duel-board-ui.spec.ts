/**
 * verify-ui acceptance run for game-duel-board-ui (Sprint 1).
 * Evidence: ../.qa/evidence/game-duel-board-ui/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const EVIDENCE = join(__dirname, '../../.qa/evidence/game-duel-board-ui');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

import { dismissMatchIntroSkip, waitForPlayUiReady } from './helpers/matchIntro';
import { waitForDrawAnimation } from './helpers/drawAnimation';
import { selectBotMode, startBotMatchFromSetup } from './helpers/gameSetup';

async function startMatch(page: import('@playwright/test').Page) {
  await startBotMatchFromSetup(page);
  await dismissMatchIntroSkip(page);
}

async function advanceToBuildPhase(page: import('@playwright/test').Page) {
  await waitForPlayUiReady(page);
  await page.getByRole('button', { name: 'Zug starten' }).click();
  await page.getByRole('button', { name: 'Karte ziehen' }).click();
  await waitForDrawAnimation(page);
  await expect(page.getByRole('button', { name: 'Skip Bau-Phase' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Engine bauen' })).toBeVisible();
}

test.describe('Game Duel Board UI — Sprint 1', () => {
  test('acceptance happy path + edge cases', async ({ page }) => {
    await startBotMatchFromSetup(page);
    await page.waitForTimeout(400);

    await expect(page.getByTestId('match-intro')).toBeVisible();
    await shot(page, '01-setup.png');
    await dismissMatchIntroSkip(page);

    await expect(page.getByText('Gegner-Engine')).toBeVisible();
    await expect(page.getByText('Deine Engine')).toBeVisible();
    await shot(page, '02-board-start.png');

    const emptySlots = page.getByText(/^Slot [1-4]$/);
    await expect(emptySlots).toHaveCount(8);
    await expect(page.getByText('Keine gebauten Karten')).toHaveCount(0);
    await shot(page, '03-bound-slots-empty.png');

    await expect(
      page.locator('.rounded-full.border-purple-500').filter({ hasText: 'Startphase' }),
    ).toBeVisible();

    await expect(page.getByTestId('phase-coach-banner')).toBeVisible();
    await page.getByTestId('phase-bar-current').hover();
    await expect(page.getByTestId('phase-coach-hint')).toBeVisible();
    await expect(page.getByTestId('phase-coach-hint')).toContainText('Starte deinen Zug');

    await expect(page.getByText('LP').first()).toBeVisible();
    await expect(page.getByText(/Hand \d+/).first()).toBeVisible();
    await expect(page.getByTestId('arena-playmat-badge')).toBeVisible();
    await expect(page.getByTestId('arena-playmat-badge').getByRole('heading', { level: 2 })).toContainText('🏟️');
    await expect(page.getByTestId('arena-playmat')).toBeVisible();
    await expect(page.getByTestId('deck-pile')).toBeVisible();
    await expect(page.getByTestId('discard-pile')).toBeVisible();
    await expect(page.getByTestId('human-plate')).toBeVisible();
    await expect(page.getByTestId('opponent-plate')).toBeVisible();

    const handCard = page.getByTestId('player-hand').locator('button[data-card-id]').first();
    await expect(handCard).toBeVisible();
    await expect(handCard).toHaveClass(/w-36/);
    const box = await handCard.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(120);
    expect(box?.height).toBeGreaterThanOrEqual(180);
    await shot(page, '04-hand-playable.png');

    await advanceToBuildPhase(page);
    await shot(page, '05-build-phase.png');
    await page.getByTestId('phase-bar-current').hover();
    await expect(page.getByTestId('phase-coach-hint')).toBeVisible();
    await expect(page.getByTestId('phase-coach-hint')).toContainText('Engine bauen');
    await expect(page.getByText(/Hand \d+ \(verdeckt\)/)).toBeVisible();

    await page.getByRole('button', { name: 'Skip Bau-Phase' }).click();
    await expect(page.getByRole('button', { name: 'Aktion spielen' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hauptaktion auslassen' })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);

    await page.getByRole('button', { name: 'Hauptaktion auslassen' }).click();
    await page.getByRole('button', { name: 'Zug beenden' }).click();
    await page.waitForTimeout(900);
    await expect(page.getByText('Gegner denkt…').or(page.getByText('Am Zug')).first()).toBeVisible({
      timeout: 5000,
    });

    await page.getByRole('button', { name: 'Cards' }).click();
    await expect(page.getByText(/V1-Karten|Character|Element/i).first()).toBeVisible({
      timeout: 10000,
    });
    await page.getByRole('button', { name: 'Sandbox' }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByTestId('game-mode-select')).toBeVisible();
  });

  test('draw phase animates card from deck to hand', async ({ page }) => {
    await startMatch(page);
    await page.getByRole('button', { name: 'Zug starten' }).click();
    await page.getByRole('button', { name: 'Karte ziehen' }).click();
    await expect(page.getByTestId('draw-card-reveal')).toBeVisible({ timeout: 1500 });
    await waitForDrawAnimation(page);
    await expect(page.getByTestId('player-hand').locator('button[data-card-id]').first()).toBeVisible({
      timeout: 3000,
    });
  });

  test('build card fills engine slot', async ({ page }) => {
    await startMatch(page);
    await advanceToBuildPhase(page);

    await page.getByRole('button', { name: 'Engine bauen' }).click();
    const hand = page.getByTestId('player-hand');
    const buildCard = hand.locator('button[data-card-id][data-interaction="build"]').first();
    await expect(buildCard).toBeVisible({ timeout: 5000 });
    await buildCard.click();

    await expect(page.getByRole('button', { name: 'Aktion spielen' })).toBeVisible({
      timeout: 5000,
    });

    const humanEngine = page.getByTestId('human-engine');
    await expect(humanEngine.locator('[data-card-id]')).toHaveCount(1);
    await expect(humanEngine.getByText(/^Slot [1-4]$/)).toHaveCount(3);
    await shot(page, '06-bound-filled.png');
  });

  test('action phase bar shows attack options when attack card selected', async ({ page }) => {
    await startMatch(page);
    await advanceToBuildPhase(page);

    const skipBind = page.getByRole('button', { name: 'Skip Bau-Phase' });
    await skipBind.click();

    await expect(page.getByRole('button', { name: 'Aktion spielen' })).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByTestId('action-phase-bar')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Direkt angreifen' })).toHaveCount(0);

    await page.getByRole('button', { name: 'Aktion spielen' }).click();

    const hand = page.getByTestId('player-hand');
    const attackCard = hand.locator('button[data-card-id][data-interaction="attack"]').first();
    if ((await attackCard.count()) > 0) {
      await attackCard.click();
      await expect(page.getByRole('button', { name: 'Direkt angreifen' })).toBeEnabled({
        timeout: 3000,
      });
      await expect(page.getByTestId('targeting-arrow')).toHaveCount(0);
      await shot(page, '08-action-phase-attack.png');
    }
  });

  test('human block prompt when bot attacks', async ({ page }) => {
    test.setTimeout(90_000);
    await startMatch(page);

    let blockVisible = false;
    for (let round = 0; round < 35 && !blockVisible; round++) {
      const zugStart = page.getByRole('button', { name: 'Zug starten' });
      if (await zugStart.isVisible({ timeout: 800 }).catch(() => false)) {
        await zugStart.click();
      }

      const ziehen = page.getByRole('button', { name: 'Karte ziehen' });
      if (await ziehen.isVisible({ timeout: 800 }).catch(() => false)) {
        await ziehen.click();
        await waitForDrawAnimation(page);
      }

      const skipBind = page.getByRole('button', { name: 'Skip Bau-Phase' });
      if (await skipBind.isVisible({ timeout: 800 }).catch(() => false)) {
        await skipBind.click();
      }

      const haupt = page.getByRole('button', { name: 'Hauptaktion auslassen' });
      if (await haupt.isVisible({ timeout: 800 }).catch(() => false)) {
        await haupt.click();
      }

      const zugEnd = page.getByRole('button', { name: 'Zug beenden' });
      if (await zugEnd.isVisible({ timeout: 800 }).catch(() => false)) {
        await zugEnd.click();
      }

      await page.waitForTimeout(900);

      const blockPanel = page.getByTestId('combat-stage');
      if (await blockPanel.isVisible({ timeout: 800 }).catch(() => false)) {
        blockVisible = true;
        await expect(page.getByRole('button', { name: 'Nicht blocken' })).toBeVisible();
        await expect(page.getByTestId('combat-stage-attack-value')).toBeVisible();
        await expect(page.getByTestId('combat-dice-roll')).toBeVisible();
        await expect(page.getByTestId('combat-dice-bonus')).toBeVisible({ timeout: 2000 });
        await expect(page.locator('[data-card-id]').first()).toBeVisible();
        await shot(page, '07-block-prompt.png');
      }
    }

    expect(blockVisible).toBe(true);
  });
});
