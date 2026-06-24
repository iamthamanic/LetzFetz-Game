/**
 * verify-ui acceptance run for game-cheatbox.
 * Evidence: ../.qa/evidence/game-cheatbox/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { dismissMatchIntroSkip } from './helpers/matchIntro';
import { selectBotMode } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../../.qa/evidence/game-cheatbox');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

async function startPlaytestMatch(page: import('@playwright/test').Page) {
  await page.goto('/?playtest=1');
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByTestId('game-mode-select')).toBeVisible();
  await selectBotMode(page);
  await page.getByRole('button', { name: 'Partie starten' }).click();
  await dismissMatchIntroSkip(page);
  await expect(page.getByText('Playtest', { exact: true })).toBeVisible();
}

test.describe('Game Cheatbox — playtest panel', () => {
  test('happy path: presets, patches, bot pause, no panel without flag', async ({ page }) => {
    await startPlaytestMatch(page);
    await shot(page, '01-cheatbox-visible.png');

    await page.getByRole('button', { name: 'Block ausstehend' }).click();
    await expect(page.getByText(/Angriff blocken|Herausforderung blocken/i)).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByRole('button', { name: 'Nicht blocken' })).toBeVisible();
    await shot(page, '02-defender-block-preset.png');

    await page.getByRole('button', { name: 'Challenge möglich' }).click();
    const handAttack = page.getByTestId('player-hand').locator('button[data-card-id]').first();
    await handAttack.click();
    await expect(
      page.getByTestId('opponent-engine').locator('[data-card-id].ring-amber-400, [data-card-id][class*="ring-amber"]'),
    ).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: 'Aktionsphase P1' }).click();
    await expect(page.locator('.rounded-full.border-purple-500').filter({ hasText: 'Aktionsphase' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hauptaktion auslassen' })).toBeVisible();

    const phaseSelect = page.locator('select').filter({ has: page.locator('option[value="bind"]') }).first();
    await phaseSelect.selectOption('bind');
    await page.getByRole('button', { name: 'Patch anwenden' }).click();
    await expect(
      page.locator('.rounded-full.border-purple-500').filter({ hasText: 'Bindungsphase' }),
    ).toBeVisible();

    const hpInputs = page.locator('input[type="number"]');
    await hpInputs.nth(0).fill('5');
    await hpInputs.nth(1).fill('5');
    await page.getByRole('button', { name: 'Patch anwenden' }).click();
    await expect(page.getByText('5 LP').first()).toBeVisible();

    await expect(page.getByLabel('Bot pausieren')).toBeChecked();
    await shot(page, '03-bot-paused.png');

    const roundBefore = await page.getByText(/^Runde \d+$/).textContent();
    await phaseSelect.selectOption('action');
    await page.locator('select').filter({ has: page.locator('option[value="p2"]') }).first().selectOption('p2');
    await page.getByRole('button', { name: 'Patch anwenden' }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByText(/^Runde \d+$/)).toHaveText(roundBefore ?? '');
    await expect(
      page.locator('.rounded-full.border-purple-500').filter({ hasText: 'Aktionsphase' }),
    ).toBeVisible();

    await page.getByLabel('Bot pausieren').uncheck();
    await page.waitForTimeout(1500);

    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByText(/V1-Karten|Character|Element/i).first()).toBeVisible({
      timeout: 10000,
    });
    await page.getByRole('button', { name: 'Sandbox' }).click();
    await page.waitForTimeout(300);

    await page.goto('/');
    await page.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByTestId('game-mode-select')).toBeVisible();
    await expect(page.getByText('Playtest', { exact: true })).toHaveCount(0);
  });

  test('edge: no cheatbox on setup screen; invalid hp shows error', async ({ page }) => {
    await page.goto('/?playtest=1');
    await page.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByTestId('game-mode-select')).toBeVisible();
    await selectBotMode(page);
    await expect(page.getByText('Playtest', { exact: true })).toHaveCount(0);

    await page.getByRole('button', { name: 'Partie starten' }).click();
    await dismissMatchIntroSkip(page);

    const hpBefore = await page.getByTestId('human-plate').getByText(/\d+ LP/).textContent();
    await page.locator('input[type="number"]').first().fill('-1');
    await page.getByRole('button', { name: 'Patch anwenden' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByTestId('human-plate').getByText(/\d+ LP/)).toHaveText(hpBefore ?? '');
  });
});
