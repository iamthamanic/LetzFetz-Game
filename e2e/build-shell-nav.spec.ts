/**
 * Build workbench shell — nav mounts BuildView (Combinate | Development).
 */
import { test, expect } from '@playwright/test';

test.describe('Build shell nav', () => {
  test('Build tab opens workbench with Combinate and Development', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-tab-build').click();

    const build = page.getByTestId('build-view');
    await expect(build).toBeVisible();
    await expect(page.getByTestId('nav-tab-combine')).toBeVisible();
    await expect(page.getByTestId('nav-tab-development')).toBeVisible();
  });
});
