/**
 * Build workbench shell — nav mounts BuildView (Combinate; VFX Studio unwired).
 */
import { test, expect } from '@playwright/test';

test.describe('Build shell nav', () => {
  test('Build tab opens Combinate workbench without VFX Studio', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-tab-build').click();

    const build = page.getByTestId('build-view');
    await expect(build).toBeVisible();
    await expect(page.getByTestId('nav-tab-combine')).toBeVisible();
    await expect(page.getByTestId('nav-tab-development')).toHaveCount(0);
    await expect(page.getByTestId('nav-tab-playtest')).toHaveCount(0);
  });
});
