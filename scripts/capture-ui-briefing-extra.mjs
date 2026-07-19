/**
 * Capture block prompt and attack states for UI briefing.
 */
import { chromium } from 'playwright';
import { join } from 'node:path';

const OUT = '/Users/halteverbotsocialmacpro/Downloads/LetzFetz-UI-Briefing/01-screenshots';
const BASE = 'http://localhost:4789';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function advanceHumanTurn() {
  for (const label of ['Zug starten', 'Karte ziehen', 'Nicht binden']) {
    const b = page.getByRole('button', { name: label });
    if (await b.isVisible({ timeout: 800 }).catch(() => false)) {
      await b.click();
      await page.waitForTimeout(250);
    }
  }
  const haupt = page.getByRole('button', { name: 'Hauptaktion auslassen' });
  if (await haupt.isVisible({ timeout: 800 }).catch(() => false)) {
    await haupt.click();
    await page.waitForTimeout(250);
  }
  const zugEnd = page.getByRole('button', { name: 'Zug beenden' });
  if (await zugEnd.isVisible({ timeout: 800 }).catch(() => false)) {
    await zugEnd.click();
    await page.waitForTimeout(250);
  }
}

await page.goto(BASE);
await page.getByRole('button', { name: 'Play' }).click();
await page.getByRole('button', { name: 'Partie starten' }).click();
await page.waitForTimeout(600);

let gotBlock = false;
for (let i = 0; i < 25; i++) {
  if (await page.getByText(/blocken/i).isVisible({ timeout: 400 }).catch(() => false)) {
    await page.screenshot({ path: join(OUT, '05-block-prompt.png'), fullPage: true });
    console.log('saved 05-block-prompt.png');
    gotBlock = true;
    break;
  }
  await advanceHumanTurn();
  await page.waitForTimeout(1400);
}

if (!gotBlock) {
  console.log('block prompt not reached in 25 rounds');
}

// Attack from human when possible
await page.goto(BASE);
await page.getByRole('button', { name: 'Play' }).click();
await page.getByRole('button', { name: 'Partie starten' }).click();
await page.waitForTimeout(500);
await page.getByRole('button', { name: 'Zug starten' }).click();
await page.getByRole('button', { name: 'Karte ziehen' }).click();
await page.getByRole('button', { name: 'Nicht binden' }).click();
const attack = page.getByRole('button', { name: /Angriff|ATTACK/ }).first();
if (await attack.isVisible({ timeout: 3000 }).catch(() => false)) {
  await attack.click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(OUT, '04-attack-played.png'), fullPage: true });
  console.log('saved 04-attack-played.png');
}

// Win screen — fast-forward many turns
await page.goto(BASE);
await page.getByRole('button', { name: 'Play' }).click();
await page.getByRole('button', { name: 'Partie starten' }).click();
await page.waitForTimeout(500);
for (let i = 0; i < 80; i++) {
  if (await page.getByText(/gewinnst|gewinnt/i).isVisible({ timeout: 300 }).catch(() => false)) {
    await page.screenshot({ path: join(OUT, '08-win-lose.png'), fullPage: true });
    console.log('saved 08-win-lose.png');
    break;
  }
  // spam attacks when possible else end turn
  const attackBtn = page.getByRole('button', { name: /Angriff|ATTACK/ }).first();
  if (await attackBtn.isVisible({ timeout: 300 }).catch(() => false)) {
    await attackBtn.click().catch(() => {});
    await page.waitForTimeout(900);
  } else {
    await advanceHumanTurn();
    await page.waitForTimeout(900);
  }
}

await browser.close();
console.log('Done extra captures.');
