/**
 * Full game walkthrough documentation test.
 * Runs a match in playtest mode with the bot paused, then advances through
 * every phase and captures what the UI actually shows.
 * Evidence: ../.qa/evidence/full-game-walkthrough/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const EVIDENCE = join(__dirname, '../.qa/evidence/full-game-walkthrough');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

async function logState(page: import('@playwright/test').Page, label: string) {
  const phase = await page.getByTestId('phase-coach-banner').textContent().catch(() => 'n/a');
  const hint = await page.getByTestId('phase-coach-hint').textContent().catch(() => 'n/a');
  const actions = await page.locator('[data-testid="duel-tableau"] button, header button').allTextContents();
  const humanHp = await page.getByTestId('human-plate').textContent().catch(() => 'n/a');
  const botHp = await page.getByTestId('opponent-plate').textContent().catch(() => 'n/a');
  // eslint-disable-next-line no-console
  console.log(`\n--- ${label} ---`);
  // eslint-disable-next-line no-console
  console.log({ phase: phase?.slice(0, 200), hint: hint?.slice(0, 200), humanHp: humanHp?.slice(0, 80), botHp: botHp?.slice(0, 80), actions: actions.filter(Boolean).map((t) => t.trim()).slice(0, 20) });
}

test.describe('Full game walkthrough documentation', () => {
  test('document every phase of a match with bot paused', async ({ page }) => {
    await page.goto('/?playtest=1');
    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
    await shot(page, '01-home.png');

    await page.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByTestId('game-mode-select')).toBeVisible();
    await shot(page, '02-mode-select.png');

    await page.getByTestId('game-mode-bot').click();
    await expect(page.getByTestId('character-carousel')).toBeVisible();
    await shot(page, '03-character-carousel.png');

    // Pick Pillendoktora (third in base pack list). Just click start.
    await page.getByRole('button', { name: 'Partie starten' }).click();
    await page.waitForTimeout(400);
    await expect(page.getByTestId('match-intro')).toBeVisible();
    await shot(page, '04-match-intro-vs.png');

    await page.getByRole('button', { name: 'Letz Fetz' }).click();
    await page.waitForTimeout(900);
    await expect(page.getByTestId('match-intro-arena')).toBeVisible();
    await shot(page, '05-match-intro-arena.png');

    await page.getByTestId('match-intro-arena').getByRole('button', { name: 'Überspringen' }).click();
    await expect(page.getByTestId('opening-deal-done')).toBeVisible({ timeout: 3000 });
    await shot(page, '06-board-after-opening-deal.png');
    await logState(page, 'After opening deal');

    // Pause bot via playtest cheatbox.
    await page.getByLabel('Bot pausieren').check();
    await shot(page, '07-bot-paused.png');

    // Phase: start
    await expect(page.getByRole('button', { name: 'Zug starten' })).toBeVisible();
    await logState(page, 'Phase: start');
    await shot(page, '08-phase-start.png');

    await page.getByRole('button', { name: 'Zug starten' }).click();

    // Phase: draw
    await expect(page.getByRole('button', { name: 'Karte ziehen' })).toBeVisible();
    await logState(page, 'Phase: draw');
    await shot(page, '09-phase-draw.png');

    await page.getByRole('button', { name: 'Karte ziehen' }).click();
    await page.waitForTimeout(800);

    // Phase: bind
    await expect(page.getByRole('button', { name: 'Nicht binden' })).toBeVisible({ timeout: 5000 });
    await logState(page, 'Phase: bind');
    await shot(page, '10-phase-bind.png');

    // Try to bind first bindable card by clicking it.
    const bindableCards = page.locator('[data-interaction="bind"]').first();
    if (await bindableCards.count() > 0) {
      await bindableCards.click();
      await page.waitForTimeout(600);
      await expect(page.getByTestId('bind-target-pill')).toBeVisible();
      await shot(page, '11-bind-pending.png');
      // Cancel bind selection.
      const cancelBtn = page.getByRole('button', { name: 'Auswahl abbrechen' });
      if (await cancelBtn.count() > 0) await cancelBtn.click();
    } else {
      await shot(page, '11-no-bindable-card.png');
    }

    // Skip bind.
    const skipBindBtn = page.getByRole('button', { name: 'Nicht binden' });
    if (await skipBindBtn.count() > 0 && (await skipBindBtn.isVisible())) {
      await skipBindBtn.click();
    }

    // Phase: action
    await page.waitForTimeout(300);
    await logState(page, 'Phase: action');
    await shot(page, '12-phase-action.png');

    // Try to play an attack card.
    const attackCard = page.locator('[data-interaction="attack"]').first();
    if (await attackCard.count() > 0) {
      await attackCard.click();
      await page.waitForTimeout(400);
      await logState(page, 'After selecting attack card');
      await shot(page, '13-attack-selected.png');
      await expect(page.getByTestId('targeting-arrow')).toBeVisible();

      const directAttackBtn = page.getByRole('button', { name: 'Direkt angreifen' });
      if (await directAttackBtn.count() > 0) {
        await directAttackBtn.click();
        await expect(page.getByTestId('attack-card-fly')).toBeVisible({ timeout: 800 }).catch(() => {});
        await page.waitForTimeout(1200);
        await logState(page, 'After direct attack');
        await shot(page, '14-after-direct-attack.png');
      } else {
        await shot(page, '14-no-direct-attack-button.png');
      }
    } else {
      await shot(page, '13-no-attack-card.png');
    }

    // If a block prompt appeared, capture it.
    const blockStage = page.getByTestId('combat-stage');
    if (await blockStage.isVisible().catch(() => false)) {
      await expect(page.getByTestId('combat-stage-vs')).toBeVisible();
      await expect(page.getByTestId('combat-stage-defender-value')).toBeVisible();
      await logState(page, 'Combat stage / block prompt');
      await shot(page, '15-combat-stage.png');
    }

    // Mobile compact character docks should not overlap the hand row.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const humanPlate = page.getByTestId('human-plate');
    const playerHand = page.getByTestId('player-hand');
    if (await humanPlate.isVisible() && await playerHand.isVisible()) {
      const plateBox = await humanPlate.boundingBox();
      const handBox = await playerHand.boundingBox();
      if (plateBox && handBox) {
        const overlap = Math.min(plateBox.y + plateBox.height, handBox.y + handBox.height) - Math.max(plateBox.y, handBox.y);
        expect(overlap).toBeLessThan(20);
      }
      await expect(humanPlate).toHaveAttribute('data-dock-variant', 'compact');
    }
    await shot(page, '15b-mobile-compact-docks.png');
    await page.setViewportSize({ width: 1280, height: 720 });

    // Phase: end
    await page.waitForTimeout(300);
    const finishBtn = page.getByRole('button', { name: 'Zug beenden' });
    if (await finishBtn.count() > 0 && (await finishBtn.isVisible())) {
      await logState(page, 'Phase: end');
      await shot(page, '16-phase-end.png');
      await finishBtn.click();
    }

    // Bot turn: unpause briefly to let bot act, then pause again.
    await page.getByLabel('Bot pausieren').uncheck();
    await page.waitForTimeout(2500);
    await page.getByLabel('Bot pausieren').check();
    await logState(page, 'After bot turn');
    await shot(page, '17-after-bot-turn.png');

    // Another player turn.
    await page.getByRole('button', { name: 'Zug starten' }).click();
    await page.getByRole('button', { name: 'Karte ziehen' }).click();
    await page.waitForTimeout(800);
    await logState(page, 'Player turn 2 after draw');
    await shot(page, '18-player-turn-2.png');
  });
});
