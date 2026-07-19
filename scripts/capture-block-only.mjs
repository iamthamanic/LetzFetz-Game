/**
 * Poll for block prompt after starting game — human as defender.
 */
import { chromium } from 'playwright';
import { join } from 'node:path';

const OUT = '/Users/halteverbotsocialmacpro/Downloads/LetzFetz-UI-Briefing/01-screenshots';
const page = (await chromium.launch({ headless: true })).newPage({ viewport: { width: 1440, height: 900 } });
const p = await page;

await p.goto('http://localhost:4789/');
await p.getByRole('button', { name: 'Play' }).click();
await p.getByRole('button', { name: 'Partie starten' }).click();

for (let i = 0; i < 120; i++) {
  if (await p.getByText(/blocken/i).isVisible({ timeout: 200 }).catch(() => false)) {
    await p.screenshot({ path: join(OUT, '05-block-prompt.png'), fullPage: true });
    console.log('saved 05-block-prompt.png at iteration', i);
    process.exit(0);
  }

  // Human turn helpers
  for (const label of ['Zug starten', 'Karte ziehen', 'Nicht binden', 'Hauptaktion auslassen', 'Zug beenden']) {
    const b = p.getByRole('button', { name: label });
    if (await b.isVisible({ timeout: 150 }).catch(() => false)) {
      await b.click().catch(() => {});
    }
  }

  // Human block response if visible
  const passBlock = p.getByRole('button', { name: 'Nicht blocken' });
  if (await passBlock.isVisible({ timeout: 150 }).catch(() => false)) {
    await p.screenshot({ path: join(OUT, '05-block-prompt.png'), fullPage: true });
    console.log('saved 05-block-prompt.png (with pass button)');
    process.exit(0);
  }

  await p.waitForTimeout(800);
}

console.log('block not found');
await (await p.context()).browser()?.close();
