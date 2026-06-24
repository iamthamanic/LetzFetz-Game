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

import { dismissMatchIntroSkip } from './helpers/matchIntro';
import { selectBotMode, startBotMatchFromSetup } from './helpers/gameSetup';

async function startMatch(page: import('@playwright/test').Page) {
  await startBotMatchFromSetup(page);
  await dismissMatchIntroSkip(page);
}

async function advanceToBindPhase(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Zug starten' }).click();
  await page.getByRole('button', { name: 'Karte ziehen' }).click();
  await expect(page.getByRole('button', { name: 'Nicht binden' })).toBeVisible();
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
    await expect(page.getByText('Keine gebundenen Karten')).toHaveCount(0);
    await shot(page, '03-bound-slots-empty.png');

    await expect(
      page.locator('.rounded-full.border-purple-500').filter({ hasText: 'Startphase' }),
    ).toBeVisible();

    await expect(page.getByTestId('phase-coach-banner')).toBeVisible();
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

    await advanceToBindPhase(page);
    await shot(page, '05-bind-phase.png');
    await expect(page.getByTestId('phase-coach-hint')).toContainText('Binde eine Karte');
    await expect(page.getByText(/Hand \d+ \(verdeckt\)/)).toBeVisible();

    await page.getByRole('button', { name: 'Nicht binden' }).click();
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

    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByText(/V1-Karten|Character|Element/i).first()).toBeVisible({
      timeout: 10000,
    });
    await page.getByRole('button', { name: 'Sandbox' }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByTestId('game-mode-select')).toBeVisible();
  });

  test('bind card fills engine slot', async ({ page }) => {
    await startMatch(page);
    await advanceToBindPhase(page);

    const hand = page.getByTestId('player-hand');
    const bindable = hand.locator('button[data-card-id][class*="ring-emerald"]').first();
    const fallback = hand.locator('button[data-card-id]').first();
    if ((await bindable.count()) > 0) {
      await bindable.click();
    } else {
      await fallback.click();
    }

    await expect(page.getByRole('button', { name: 'Hauptaktion auslassen' })).toBeVisible({
      timeout: 5000,
    });

    const humanEngine = page.getByTestId('human-engine');
    await expect(humanEngine.locator('[data-card-id]')).toHaveCount(1);
    await expect(humanEngine.getByText(/^Slot [1-4]$/)).toHaveCount(3);
    await shot(page, '06-bound-filled.png');
  });

  test('human block prompt when bot attacks', async ({ page }) => {
    await startMatch(page);

    let blockVisible = false;
    for (let round = 0; round < 30 && !blockVisible; round++) {
      const zugStart = page.getByRole('button', { name: 'Zug starten' });
      if (await zugStart.isVisible({ timeout: 800 }).catch(() => false)) {
        await zugStart.click();
      }

      const ziehen = page.getByRole('button', { name: 'Karte ziehen' });
      if (await ziehen.isVisible({ timeout: 800 }).catch(() => false)) {
        await ziehen.click();
      }

      const skipBind = page.getByRole('button', { name: 'Nicht binden' });
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

      await page.waitForTimeout(1200);

      const blockPanel = page.getByText(/Angriff blocken|Herausforderung blocken/i);
      if (await blockPanel.isVisible({ timeout: 600 }).catch(() => false)) {
        blockVisible = true;
        await expect(page.getByRole('button', { name: 'Nicht blocken' })).toBeVisible();
        await expect(page.locator('[data-card-id]').first()).toBeVisible();
        await shot(page, '07-block-prompt.png');
      }
    }

    expect(blockVisible).toBe(true);
  });
});
