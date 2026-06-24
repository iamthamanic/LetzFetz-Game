/**
 * Wait for draw-phase card fly animation to finish.
 * Location: e2e/helpers/drawAnimation.ts
 */
import { expect, type Page } from '@playwright/test';

export async function waitForDrawAnimation(page: Page) {
  await expect(page.getByTestId('draw-card-fly')).toHaveCount(0, { timeout: 3000 });
}
