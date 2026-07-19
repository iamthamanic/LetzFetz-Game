/**
 * Wait for draw-phase card reveal/fly animation to finish.
 * Location: e2e/helpers/drawAnimation.ts
 */
import { expect, type Page } from '@playwright/test';

export async function waitForDrawAnimation(page: Page) {
  await expect(page.getByTestId('draw-card-reveal')).toHaveCount(0, { timeout: 8000 });
  await expect(page.getByTestId('draw-card-fly')).toHaveCount(0, { timeout: 2000 });
}
