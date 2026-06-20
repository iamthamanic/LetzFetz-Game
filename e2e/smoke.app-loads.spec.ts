import { test, expect } from '@playwright/test';

test('app loads with navigation tabs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Spielen' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Bearbeiten' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sandbox' })).toBeVisible();
});
