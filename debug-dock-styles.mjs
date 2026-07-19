import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:4789');
await page.getByRole('button', { name: 'Play' }).click();
await page.getByTestId('game-mode-bot').click();
await page.getByRole('button', { name: 'Partie starten' }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Letz Fetz' }).click();
await page.waitForTimeout(900);
await page.getByTestId('match-intro-arena').getByRole('button', { name: 'Überspringen' }).click();
await page.waitForTimeout(500);
const dock = page.getByTestId('human-plate');
const hand = page.getByTestId('player-hand');
const box = await dock.boundingBox();
const handBox = await hand.boundingBox();
const computed = await dock.evaluate((el) => {
  const s = window.getComputedStyle(el);
  return {
    height: s.height,
    width: s.width,
    top: s.top,
    left: s.left,
    minHeight: s.minHeight,
    maxHeight: s.maxHeight,
    transform: s.transform,
    dataAttr: el.getAttribute('data-character-dock'),
    class: el.className,
  };
});
console.log(JSON.stringify({ box, handBox, computed }, null, 2));
await browser.close();
