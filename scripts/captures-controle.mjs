/**
 * Captures de contrôle visuel du SITE (pas du produit) → controle-visuel/
 * (dossier ignoré par Git : ces images servent uniquement au contrôle interne).
 * Prérequis : serveur lancé (npm run dev, port 5173) — ou SITE_URL vers une
 * autre adresse (ex. un npm run preview).
 * Navigateur : Microsoft Edge par défaut ; variable CANAL_NAVIGATEUR pour un
 * autre canal Playwright ("chrome" sur les runners GitHub Actions).
 * Usage : npm run controle
 */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const base = process.env.SITE_URL || "http://localhost:5173";
const outDir = fileURLToPath(new URL("../controle-visuel/", import.meta.url));
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: process.env.CANAL_NAVIGATEUR || "msedge" });

const shot = async (url, w, h, nom, { full = false, avant = null } = {}) => {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(base + url, { waitUntil: "networkidle" });
  if (full) {
    // Fait défiler pour déclencher les chargements différés avant la pleine page.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
  }
  await page.waitForTimeout(700);
  if (avant) await avant(page);
  await page.screenshot({ path: `${outDir}${nom}.png`, fullPage: full });
  await ctx.close();
  console.log("ok", nom);
};

// Accueil complet à tous les formats demandés
await shot("/", 1440, 900, "accueil-1440-complet", { full: true });
await shot("/", 1280, 800, "accueil-1280-complet", { full: true });
await shot("/", 768, 1024, "accueil-768-complet", { full: true });
await shot("/", 390, 844, "accueil-390-complet", { full: true });
await shot("/", 320, 700, "accueil-320-complet", { full: true });

// Heros
await shot("/", 1440, 900, "hero-ordinateur");
await shot("/", 390, 844, "hero-mobile");

// Menu mobile ouvert
await shot("/", 390, 844, "menu-mobile-ouvert", {
  avant: async (page) => {
    await page.click('button[aria-controls="menu-mobile"]');
    await page.waitForTimeout(300);
  },
});

// Page de démonstration
await shot("/demo/", 1280, 800, "demo-ordinateur", { full: true });
await shot("/demo/", 390, 844, "demo-mobile", { full: true });

// Les cinq états du parcours interactif
for (let i = 0; i < 5; i++) {
  await shot("/", 1280, 800, `parcours-etape${i + 1}`, {
    avant: async (page) => {
      await page.locator("#parcours").scrollIntoViewIfNeeded();
      await page.locator("#parcours ol button").nth(i).click();
      await page.waitForTimeout(700);
      await page.locator("#parcours").scrollIntoViewIfNeeded();
    },
  });
}

// Page 404
await shot("/404.html", 1280, 800, "page-404");

await browser.close();
console.log("\nCaptures écrites dans controle-visuel/ (non versionné)");
