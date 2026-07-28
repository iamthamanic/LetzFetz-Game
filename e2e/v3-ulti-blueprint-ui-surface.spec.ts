/**
 * verify-ui: V3 Ulti/Blueprint hook chips in Play coach/HUD (#149).
 * Evidence: ../.qa/evidence/v3-ulti-blueprint-ui-surface/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { selectBotMode } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../.qa/evidence/v3-ulti-blueprint-ui-surface');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

async function startPlaytestMatch(page: import('@playwright/test').Page) {
  await page.goto('/?playtest=1');
  await page.getByTestId('main-menu-play').click();
  await expect(page.getByTestId('game-mode-select')).toBeVisible();
  await selectBotMode(page);
  await page.getByRole('button', { name: 'Partie starten' }).click();

  await expect(page.getByTestId('match-intro')).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: 'Letz Fetz' }).click();
  const arena = page.getByTestId('match-intro-arena');
  await expect(arena).toBeVisible({ timeout: 30000 });
  await arena.getByRole('button', { name: 'Überspringen' }).click();
  await expect(page.getByText('Playtest', { exact: true })).toBeVisible({ timeout: 20000 });
}

test.describe('V3 Ulti/Blueprint HUD surface', () => {
  test('cheatbox demo shows German hook chips on coach banner', async ({ page }) => {
    await startPlaytestMatch(page);

    await page.getByTestId('playtest-v3-hooks-demo').click();

    const chips = page.getByTestId('v3-hook-chips');
    await expect(chips).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('v3-hook-chip-ulti-ready')).toContainText('Ulti bereit');
    await expect(page.getByTestId('v3-hook-chip-double-reaction')).toContainText('Doppelreaktion');
    await expect(page.getByTestId('v3-hook-chip-dampf-dichter-nebel')).toContainText(
      'Dampf → Dichter Nebel',
    );
    await expect(page.getByTestId('v3-hook-chip-mark-preserve')).toContainText('Markenerhalt');
    await expect(page.getByTestId('v3-hook-chip-transformed')).toContainText('Transformiert');

    await shot(page, '01-v3-hook-chips.png');
  });
});
