/**
 * Sandbox local-first session — content offline, persist + reset.
 */
import { test, expect } from '@playwright/test';

test.describe('Sandbox local session', () => {
  test('loads pack cards offline, autosaves, resets session', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-tab-arena').click();

    const sandbox = page.getByTestId('sandbox-view');
    await expect(sandbox).toBeVisible();
    await expect(page.getByTestId('sandbox-storage-status')).toBeVisible();
    await expect(sandbox.getByRole('heading', { name: 'Karten-Deck' })).toBeVisible();
    await expect(sandbox.getByRole('heading', { name: 'Knuspergnom' })).toBeVisible({
      timeout: 10000,
    });

    await page.getByRole('button', { name: 'Arena wählen' }).click();
    const arenaOption = page.locator('[data-testid^="sandbox-arena-option-"]').first();
    await expect(arenaOption).toBeVisible();
    await arenaOption.click();

    await expect(page.getByTestId('sandbox-storage-status')).toContainText(/Gespeichert|Speichert/, {
      timeout: 5000,
    });

    await page.reload();
    await page.getByTestId('nav-tab-arena').click();
    await expect(page.getByTestId('sandbox-view')).toBeVisible();
    await expect(sandbox.getByRole('heading', { name: 'Knuspergnom' })).toBeVisible({
      timeout: 10000,
    });

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByTestId('sandbox-reset-session').click();
    await expect(page.getByTestId('sandbox-storage-status')).toContainText(/Gespeichert|Bereit/, {
      timeout: 3000,
    });
  });
});
