import { test, expect } from '@playwright/test';

test('app loads with navigation tabs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('main-menu')).toBeVisible();
  await expect(page.getByTestId('nav-tab-play')).toBeVisible();
  await expect(page.getByTestId('nav-tab-forge')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cards' }).first()).toBeVisible();
  await expect(page.getByTestId('nav-tab-arena')).toBeVisible();
});
