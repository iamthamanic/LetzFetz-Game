/**
 * One-off Playwright script to capture game UI states for UI briefing.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = '/Users/halteverbotsocialmacpro/Downloads/LetzFetz-UI-Briefing/01-screenshots';
const BASE = 'http://localhost:4789';

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function shot(name) {
  await page.screenshot({ path: join(OUT, name), fullPage: true });
  console.log('saved', name);
}

async function clickText(text, exact = false) {
  await page.getByRole('button', { name: text, exact }).click({ timeout: 8000 });
}

await page.goto(BASE);
await clickText('Play');
await shot('01-setup.png');
await clickText('Partie starten');
await page.waitForTimeout(500);
await shot('02-board-full-hand.png');
await shot('09-empty-bound-rows.png');

await clickText('Zug starten');
await clickText('Karte ziehen');
await clickText('Nicht binden');
await shot('04-bind-phase.png');

// Bind one card via first clickable hand card in bind phase - skip if already action
try {
  const bindBtn = page.getByRole('button', { name: /Boost|Block|Angriff|ATTACK|BLOCK|BOOST/ }).first();
  await bindBtn.click({ timeout: 2000 });
} catch {
  /* already past bind */
}

// End human turn without attack (twice: action->end, end->bot)
for (let round = 0; round < 8; round++) {
  const haupt = page.getByRole('button', { name: 'Hauptaktion auslassen' });
  if (await haupt.isVisible({ timeout: 1000 }).catch(() => false)) {
    await haupt.click();
    await page.waitForTimeout(300);
  }
  const zugEnd = page.getByRole('button', { name: 'Zug beenden' });
  if (await zugEnd.isVisible({ timeout: 1000 }).catch(() => false)) {
    await zugEnd.click();
    await page.waitForTimeout(300);
  }
  const zugStart = page.getByRole('button', { name: 'Zug starten' });
  if (await zugStart.isVisible({ timeout: 1000 }).catch(() => false)) {
    await zugStart.click();
    await page.waitForTimeout(300);
  }
  const ziehen = page.getByRole('button', { name: 'Karte ziehen' });
  if (await ziehen.isVisible({ timeout: 1000 }).catch(() => false)) {
    await ziehen.click();
    await page.waitForTimeout(300);
  }
  const skipBind = page.getByRole('button', { name: 'Nicht binden' });
  if (await skipBind.isVisible({ timeout: 1000 }).catch(() => false)) {
    await skipBind.click();
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(1200);

  const blockTitle = page.getByText(/blocken/i);
  if (await blockTitle.isVisible({ timeout: 500 }).catch(() => false)) {
    await shot('05-block-prompt.png');
    break;
  }
}

// Attack screenshot attempt
try {
  const attack = page.getByRole('button', { name: /Angriff|ATTACK/ }).first();
  if (await attack.isVisible({ timeout: 2000 })) {
    await attack.click();
    await page.waitForTimeout(500);
    await shot('04-attack-played.png');
  }
} catch {
  /* skip */
}

// Bound cards visible
await shot('03-board-with-bound-cards.png');

// Card forge
await clickText('Edit');
await page.waitForTimeout(800);
await shot('06-card-forge-list.png');
try {
  await page.getByRole('button', { name: /Charakter/i }).first().click();
  await page.waitForTimeout(500);
  const cardItem = page.locator('button').filter({ hasText: /Knuspergnom|Kokabell/i }).first();
  await cardItem.click({ timeout: 5000 });
  await page.waitForTimeout(800);
  await shot('06-card-detail-editor.png');
} catch {
  console.log('skip card detail');
}

// Mobile
await clickText('Play');
await page.waitForTimeout(300);
try {
  await clickText('Partie starten');
} catch {
  /* maybe already in game */
}
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
await shot('07-mobile-board.png');

await browser.close();
console.log('Done.');
