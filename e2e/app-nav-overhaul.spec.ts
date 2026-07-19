/**
 * verify-ui: app navigation overhaul.
 * Evidence: ../.qa/evidence/app-nav-overhaul/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const EVIDENCE = join(__dirname, '../../.qa/evidence/app-nav-overhaul');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: false });
}

test.describe('App nav overhaul', () => {
  test('header, tabs, notes ghost, play active glow', async ({ page }) => {
    await page.goto('/');

    const header = page.getByTestId('app-header');
    await expect(header).toBeVisible();
    await expect(page.getByTestId('app-brand')).toBeVisible();
    await expect(page.getByRole('img', { name: 'Letz Fetz' })).toBeVisible();
    await expect(page.getByTestId('app-nav')).toBeVisible();

    await shot(page, '01-header-menu.png');

    const playTab = page.getByTestId('nav-tab-play');
    await playTab.click();
    await expect(playTab).toHaveAttribute('aria-current', 'page');
    await expect(playTab).toHaveClass(/ring-emerald/);
    await shot(page, '02-header-play-active.png');

    await expect(page.getByRole('button', { name: 'Notizen öffnen' })).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.getByTestId('nav-tab-play')).toBeVisible();
    await expect(page.getByTestId('nav-tab-forge')).toBeVisible();
    await shot(page, '03-header-mobile.png');
  });
});
