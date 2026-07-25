/**
 * verify-ui: Card Forge single-column form + sticky preview.
 * Evidence: ../.qa/evidence/card-forge-single-column-editor/
 */
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const EVIDENCE = join(__dirname, '../../.qa/evidence/card-forge-single-column-editor');
const SLUG = 'card-forge-single-column-editor';

function shot(page: import('@playwright/test').Page, name: string) {
  mkdirSync(EVIDENCE, { recursive: true });
  return page.screenshot({ path: join(EVIDENCE, name), fullPage: true });
}

async function openForgeWithCharacter(page: import('@playwright/test').Page, name: string) {
  await page.goto('/');
  await page.getByTestId('main-menu-forge').click();
  const library = page.getByTestId('card-library');
  await expect(library).toBeVisible({ timeout: 15_000 });
  await expect(library.getByText(/Basis-Pack|Base Pack/i)).toBeVisible();
  await page.getByRole('tab', { name: /Charakter/i }).click();
  const cardBtn = library.locator('[data-testid^="card-library-item-"]').filter({ hasText: name }).first();
  await cardBtn.scrollIntoViewIfNeeded();
  await cardBtn.click();
  await expect(page.getByTestId('card-library-hover-preview')).toBeVisible({ timeout: 10_000 });
  await page.getByTestId('card-library-preview-edit').click();
  await expect(page.getByTestId('card-forge-preview')).toBeVisible({ timeout: 10_000 });
}

test.describe('Card Forge single-column editor', () => {
  test('desktop: preview right, sticky, single-column form', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await openForgeWithCharacter(page, 'Knuspergnom');

    await expect(page.getByText('Vorschau')).toBeVisible();
    await expect(page.getByText('Base-Pack V1 — Texte sind fest')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Bild & Notizen speichern' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Notizen', exact: true })).toBeVisible();

    const layout = await page.evaluate(() => {
      const preview = document.querySelector('[data-testid="card-forge-preview"]');
      const panel = document.querySelector('[data-testid="card-forge-preview"]')?.parentElement?.querySelector('.rounded-lg.border');
      const nameLabel = Array.from(document.querySelectorAll('label')).find((l) =>
        l.textContent?.includes('Name'),
      );
      if (!preview || !nameLabel || !panel) return null;
      const pBox = preview.getBoundingClientRect();
      const panelBox = panel.getBoundingClientRect();
      const nameBox = nameLabel.getBoundingClientRect();
      const kindLabel = Array.from(document.querySelectorAll('label')).find((l) =>
        l.textContent?.includes('Kartenart'),
      );
      const kindBox = kindLabel?.getBoundingClientRect();
      return {
        previewRightOfPanel: pBox.left >= panelBox.right - 24,
        sameRow: Math.abs(pBox.top - panelBox.top) < 80,
        fieldsStacked: kindBox ? kindBox.top > nameBox.bottom - 4 : true,
      };
    });

    expect(layout).not.toBeNull();
    expect(layout!.fieldsStacked).toBe(true);
    expect(layout!.previewRightOfPanel).toBe(true);
    expect(layout!.sameRow).toBe(true);

    const previewBefore = await page.getByTestId('card-forge-preview').boundingBox();
    const scrollArea = page.locator('.flex-1.overflow-y-auto').last();
    await scrollArea.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(200);
    const previewAfter = await page.getByTestId('card-forge-preview').boundingBox();
    expect(previewBefore).not.toBeNull();
    expect(previewAfter).not.toBeNull();
    expect(Math.abs(previewAfter!.y - previewBefore!.y)).toBeLessThan(8);

    await shot(page, '01-forge-desktop-preview-sticky.png');
  });

  test('mobile: preview above form panel', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await openForgeWithCharacter(page, 'Knuspergnom');
    await page.setViewportSize({ width: 390, height: 844 });

    const layout = await page.evaluate(() => {
      const preview = document.querySelector('[data-testid="card-forge-preview"]');
      const nameLabel = Array.from(document.querySelectorAll('label')).find((l) =>
        l.textContent?.includes('Name'),
      );
      if (!preview || !nameLabel) return null;
      return preview.getBoundingClientRect().top < nameLabel.getBoundingClientRect().top;
    });

    expect(layout).toBe(true);
    await shot(page, '02-forge-mobile-preview-top.png');
  });

  test('element cards: single-column stats + library regression', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.getByTestId('main-menu-forge').click();
    await expect(page.getByTestId('card-library')).toBeVisible({ timeout: 15_000 });

    await page.getByRole('tab', { name: /Element/i }).click();
    await page.getByTestId('card-library').locator('[data-testid^="card-library-item-"]').first().click();
    await expect(page.getByTestId('card-library-hover-preview')).toBeVisible();
    await page.getByTestId('card-library-preview-edit').click();
    await expect(page.getByTestId('card-forge-preview')).toBeVisible();

    const stacked = await page.evaluate(() => {
      const wert = Array.from(document.querySelectorAll('label')).find((l) =>
        l.textContent?.includes('Wert'),
      );
      const typ = Array.from(document.querySelectorAll('label')).find((l) =>
        l.textContent?.includes('Typ'),
      );
      if (!wert || !typ) return null;
      const wertBox = wert.getBoundingClientRect();
      const typBox = typ.getBoundingClientRect();
      return typBox.left > wertBox.right - 20 && Math.abs(typBox.top - wertBox.top) < 8;
    });
    expect(stacked).toBe(true);

    await page.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByTestId('game-mode-select')).toBeVisible();
    await shot(page, '03-forge-play-nav-regression.png');
  });
});
