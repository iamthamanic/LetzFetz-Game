/**
 * verify-ui: procedural SVG card name plates.
 * Evidence: ../.qa/evidence/card-name-plate-svg/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { openPlaySetup, selectBotMode } from './helpers/gameSetup';

const EVIDENCE = join(__dirname, '../../.qa/evidence/card-name-plate-svg');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('Card name plate SVG', () => {
  test('character carousel + forge preview show readable name badges', async ({ page }) => {
    await openPlaySetup(page);
    await selectBotMode(page);

    const knusperCard = page.getByTestId('character-select-card-knuspergnom');
    await expect(knusperCard).toBeVisible();
    await knusperCard.scrollIntoViewIfNeeded();
    await shot(page, '02-knuspergnom-parchment.png');

    const namePlate = knusperCard.locator('.lf-card-nameplate');
    await expect(namePlate).toBeVisible();
    await expect(namePlate.locator('.lf-card-nameplate__raster')).toBeVisible();
    await expect(namePlate.locator('img')).toHaveAttribute('alt', 'Knuspergnom');

    const glitchOutside = await knusperCard.evaluate((card) => {
      const plate = card.querySelector('.lf-card-nameplate');
      if (!plate) return true;
      const cardBox = card.getBoundingClientRect();
      const img = plate.querySelector('.lf-card-nameplate__raster');
      if (!img) return true;
      const box = img.getBoundingClientRect();
      return box.left < cardBox.left - 8 || box.right > cardBox.right + 8;
    });
    expect(glitchOutside).toBe(false);

    await page.getByRole('button', { name: 'Nächster Charakter' }).click();
    await page.waitForTimeout(350);
    const pillendoktora = page.getByTestId('character-select-card-pillendoktora');
    await expect(pillendoktora).toBeVisible();
    await pillendoktora.scrollIntoViewIfNeeded();
    await shot(page, '01-pillendoktora-svg-badge.png');

    await page.getByRole('button', { name: 'Cards' }).click();
    await expect(page.getByTestId('card-library')).toBeVisible({ timeout: 10000 });
    await page.getByRole('tab', { name: /Charakter/i }).click();
    await page.getByRole('button', { name: /Knuspergnom/i }).first().click();
    await expect(page.getByText(/Vorschau/i)).toBeVisible({ timeout: 10000 });

    const forgePreview = page.locator('.lf-card-nameplate').first();
    await expect(forgePreview).toBeVisible();
    await shot(page, '03-forge-preview.png');
  });
});
