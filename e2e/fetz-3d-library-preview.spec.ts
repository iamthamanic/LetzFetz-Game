/**
 * verify-ui: Forge Library Engine 3D preview (#145).
 * Evidence: ../.qa/evidence/fetz-3d-library-preview/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const EVIDENCE = join(__dirname, '../../.qa/evidence/fetz-3d-library-preview');

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

test.describe('Fetzgerät 3D — Library detail preview', () => {
  test('Forge Library Fetzgerät card shows shared 3D canvas or WebGL fallback', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByTestId('main-menu-forge').click();
    const library = page.getByTestId('card-library');
    await expect(library).toBeVisible({ timeout: 15_000 });

    await page.getByRole('tab', { name: /Fetzgerät/i }).click();
    await expect(library.locator('[data-testid^="card-library-item-"]').first()).toBeVisible({
      timeout: 10_000,
    });

    await library.getByRole('textbox', { name: 'Karten suchen' }).fill('v3-part-water-traeger-01');
    const cardBtn = library.locator('[data-testid="card-library-item-v3-part-water-traeger-01"]');
    await expect(cardBtn).toBeVisible({ timeout: 10_000 });
    await cardBtn.click();

    await expect(page.getByTestId('card-library-hover-preview')).toBeVisible({ timeout: 10_000 });
    const enginePane = page.getByTestId('card-library-engine-3d');
    await expect(enginePane).toBeVisible();
    await expect(enginePane.getByText('3D-Vorschau')).toBeVisible();

    const canvas = page.getByTestId('engine-preview-canvas');
    const noWebgl = page.getByTestId('engine-preview-no-webgl');
    const hasCanvas = await canvas.isVisible().catch(() => false);
    const hasFallback = await noWebgl.isVisible().catch(() => false);
    expect(hasCanvas || hasFallback).toBeTruthy();

    await shot(page, '01-library-engine-3d.png');
  });
});
