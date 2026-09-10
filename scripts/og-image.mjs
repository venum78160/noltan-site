/**
 * Génère public/og.png (1200 × 630), l'image de partage Open Graph / Twitter,
 * depuis scripts/og-image.html — même marque, mêmes polices et teintes que le
 * site. À relancer quand le nom, la promesse ou le domaine changent, puis
 * vérifier l'image et la committer (le site la sert telle quelle).
 * Navigateur : Microsoft Edge par défaut ; variable CANAL_NAVIGATEUR pour un
 * autre canal Playwright.
 * Usage : npm run og
 */
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const modele = new URL("./og-image.html", import.meta.url).href;
const sortie = fileURLToPath(new URL("../public/og.png", import.meta.url));

const browser = await chromium.launch({ channel: process.env.CANAL_NAVIGATEUR || "msedge" });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto(modele, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: sortie, type: "png" });
await browser.close();
console.log(`✓ image de partage écrite : ${sortie}`);
