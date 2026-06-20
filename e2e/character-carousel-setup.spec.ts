/**
 * verify-ui: character carousel setup.
 * Evidence: ../.qa/evidence/character-carousel-setup/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { dismissMatchIntroSkip } from './helpers/matchIntro';

const EVIDENCE = join(__dirname, '../../.qa/evidence/character-carousel-setup');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('Character carousel setup', () => {
  test('pick character via carousel and start match', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Spielen' }).click();

    await expect(page.getByTestId('character-carousel')).toBeVisible();
    await expect(page.locator('select')).toHaveCount(0);
    await expect(page.getByText('Solo gegen Bot')).toBeVisible();
    await shot(page, '01-carousel-default.png');

    await page.getByRole('button', { name: 'Nächster Charakter' }).click();
    await page.waitForTimeout(400);
    await shot(page, '02-carousel-other-character.png');

    await page.getByRole('button', { name: 'Partie starten' }).click();
    await dismissMatchIntroSkip(page);

    await expect(page.getByText('Deine Engine')).toBeVisible();
    await shot(page, '03-match-started.png');
  });
});
