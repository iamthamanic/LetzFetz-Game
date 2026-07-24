import { test, expect } from '@playwright/test';

test.describe('settings mute / volume / persist / reset', () => {
  test('mute, slider, persist across reload, reset', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('main-menu-settings').click();
    await expect(page.getByTestId('settings-view')).toBeVisible();
    await expect(page.getByTestId('settings-section-audio')).toBeVisible();
    await expect(page.getByTestId('settings-section-display')).toBeVisible();
    await expect(page.getByTestId('settings-section-a11y')).toBeVisible();

    const mute = page.getByTestId('settings-mute');
    await mute.check();
    await expect(mute).toBeChecked();

    const master = page.getByTestId('settings-volume-master');
    await master.fill('0.4');
    await expect(master).toHaveValue('0.4');

    await page.reload();
    await page.getByTestId('main-menu-settings').click();
    await expect(page.getByTestId('settings-mute')).toBeChecked();
    await expect(page.getByTestId('settings-volume-master')).toHaveValue('0.4');

    page.on('dialog', (dialog) => dialog.accept());
    await page.getByTestId('settings-reset').click();
    await expect(page.getByTestId('settings-mute')).not.toBeChecked();
    await expect(page.getByTestId('settings-volume-master')).toHaveValue('1');
  });
});
