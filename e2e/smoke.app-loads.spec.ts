import { test, expect } from '@playwright/test';

test('app loads with navigation tabs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sandbox' })).toBeVisible();
});
