/**
 * App Store–sized screenshots (1179 × 2556, iPhone 6.1" at 3x, no device frame) for the Devpost submission.
 * Needs the dev server running (npx expo start --web) and Google Chrome installed.
 *   node scripts/screenshots.mjs            → writes submission/screenshots/*.png
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const BASE = process.env.BASE ?? 'http://localhost:8081';
const OUT = 'submission/screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
const pause = (ms) => page.waitForTimeout(ms);
// Scroll the app, not the playground preview: park the pointer over the page header first
async function scrollBy(dy) {
  await page.mouse.move(196, 140);
  await page.mouse.wheel(0, dy);
  await pause(900);
}

async function shot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`✓ ${OUT}/${name}.png`);
}

async function open(path, wait = 2500) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  await pause(wait);
}

async function ask(prompt) {
  await page.getByText('Ask Teardown', { exact: true }).first().click();
  await pause(500);
  const input = page.getByPlaceholder(/Ask about/);
  await input.fill(prompt);
  await input.press('Enter');
  await pause(2200);
}

// 1. Home
await open('/');
await shot('01-home');

// 2. Curated story
await open('/t/instagram');
await shot('02-instagram-story');

// 3. System map with a request flow playing
await open('/t/instagram?tab=system');
await page.getByText('You post a photo').first().click();
await pause(3800);
await shot('03-system-flow');

// 4. Agent answers a question and drives the map
await open('/t/instagram?tab=story');
await ask('What database does Instagram use?');
const expand = page.getByLabel('Resize');
if (await expand.count()) await expand.first().click();
await pause(800);
await shot('04-agent-answer');

// 5. Instant teardown of a real site with live scan evidence
await open('/');
await page.getByPlaceholder(/instagram\.com/).fill('https://www.mobile.txst.edu/');
await page.getByPlaceholder(/instagram\.com/).press('Enter');
await pause(7000);
await open('/t/mobile-txst?tab=stack', 3500);
await scrollBy(380);
await shot('06-instant-live-scan');

// 6. The real page rebuilt as a playground
await open('/t/mobile-txst?tab=play', 4000);
await scrollBy(560);
await shot('07-real-page-playground');

// 7. Agent edits the rebuilt page, then close the chat so the change is visible
await ask('rename the headline to Hello Bobcats');
await pause(1200);
await shot('05-agent-edits-playground');
await page.getByLabel('Close').first().click();
await pause(600);
await scrollBy(560);
await shot('08-playground-after-agent');

// 8. Career roadmap: pick a path on home, then the Roadmap tab
await open('/');
await page.getByText('Cybersecurity', { exact: true }).first().click();
await pause(1200);
await open('/t/instagram?tab=roadmap', 3500);
await scrollBy(300);
await shot('09-career-roadmap');

await browser.close();
