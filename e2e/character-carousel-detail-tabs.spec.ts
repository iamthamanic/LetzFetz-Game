/**
 * verify-ui: character carousel detail tabs (Charakter / Info / Ulti).
 * Evidence: ../.qa/evidence/character-carousel-detail-tabs/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { openPlaySetup, selectBotMode } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../../.qa/evidence/character-carousel-detail-tabs');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('Character carousel detail tabs', () => {
  test('center card shows Charakter, Info, and Ulti tabs', async ({ page }) => {
    await openPlaySetup(page);
    await selectBotMode(page);
    await expect(page.getByTestId('character-carousel')).toBeVisible();

    await expect(page.getByTestId('nav-tab-character')).toBeVisible();
    await expect(page.getByTestId('nav-tab-info')).toBeVisible();
    await expect(page.getByTestId('nav-tab-ulti')).toBeVisible();
    await shot(page, '01-tabs-character.png');

    await page.getByTestId('nav-tab-info').click();
    await expect(page.getByTestId('character-detail-info')).toBeVisible();
    await expect(page.getByText('Passiv')).toBeVisible();
    await expect(page.getByText(/Feuer oder Erde bindest/)).toBeVisible();
    await shot(page, '02-tabs-info.png');

    await page.getByTestId('nav-tab-ulti').click();
    await expect(page.getByTestId('character-detail-ulti')).toBeVisible();
    await expect(page.getByTestId('character-detail-ulti-media-ulti-knuspergnom')).toBeVisible();
    await expect(page.getByText('Mit Alles und Scharf')).toBeVisible();
    await expect(page.getByText(/Füge 5 Schaden zu/)).toBeVisible();
    await shot(page, '03-tabs-ulti.png');

    await page.getByRole('button', { name: 'Nächster Charakter' }).click();
    await page.waitForTimeout(400);
    await expect(page.getByTestId('character-select-card-schluckspecht')).toBeVisible();
    await expect(page.getByTestId('nav-tab-character')).toHaveAttribute('aria-current', 'page');
    await shot(page, '04-tab-reset-after-swipe.png');
  });
});
