import { expect, type Page, test } from "@playwright/test";

/**
 * Tests de navigation minimaux du site public. Objectif : détecter une page
 * cassée, un menu inopérant, un débordement horizontal ou une page de
 * téléchargement qui n'exploite pas correctement version.json — sans jeu de
 * captures visuelles à chaque commit.
 */

const pagesPrincipales = [
  { chemin: "/", h1: /espace de travail|Noltan/i },
  { chemin: "/demo/", h1: /Voir Noltan fonctionner/i },
  { chemin: "/telechargement/", h1: /Installez Noltan/i },
  { chemin: "/mentions-legales/", h1: /Mentions légales/i },
  { chemin: "/confidentialite/", h1: /confidentialité/i },
];

/** version.json fictif servi aux tests (jamais le réseau réel). */
const VERSION_FICTIVE = {
  version: "9.9.9",
  url: "https://github.com/venum78160/Noltan/releases/tag/v9.9.9",
  url_exe: "https://github.com/venum78160/Noltan/releases/download/v9.9.9/Noltan-Installation.exe",
  notes: "Notes de test.",
};

const intercepterVersion = (page: Page, reponse: "ok" | "echec" | "invalide") =>
  page.route("**/version.json", (route) => {
    if (reponse === "echec") return route.abort("failed");
    if (reponse === "invalide")
      return route.fulfill({ contentType: "application/json", body: '{"version":"???"}' });
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(VERSION_FICTIVE),
    });
  });

for (const { chemin, h1 } of pagesPrincipales) {
  test(`la page ${chemin} répond et affiche son titre`, async ({ page }) => {
    await intercepterVersion(page, "ok");
    const reponse = await page.goto(chemin);
    expect(reponse?.status()).toBe(200);
    await expect(page.locator("h1").first()).toHaveText(h1);
  });
}

test("la page 404 est servie", async ({ page }) => {
  const reponse = await page.goto("/404.html");
  expect(reponse?.status()).toBe(200);
  await expect(page.locator("h1").first()).toBeVisible();
});

test("les liens internes de la page d'accueil répondent", async ({ page, request }) => {
  await intercepterVersion(page, "ok");
  await page.goto("/");
  const liens = await page
    .locator('a[href^="/"]')
    .evaluateAll((as) => Array.from(new Set(as.map((a) => (a as HTMLAnchorElement).pathname))));
  expect(liens.length).toBeGreaterThan(3);
  for (const lien of liens) {
    const reponse = await request.get(lien);
    expect(reponse.status(), `lien interne cassé : ${lien}`).toBeLessThan(400);
  }
});

test("le favicon est un fichier réel que Google peut lire (jamais une data URI)", async ({
  page,
  request,
}) => {
  await intercepterVersion(page, "ok");
  await page.goto("/");
  const hrefs = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll((ls) => ls.map((l) => (l as HTMLLinkElement).getAttribute("href") ?? ""));
  expect(hrefs.length).toBeGreaterThanOrEqual(2);
  for (const href of hrefs) {
    // Google n'explore pas une data URI et ne prend pas le SVG en charge :
    // sans fichier image réel, le résultat s'affiche avec un globe générique.
    expect(href, "favicon inline").toMatch(/^\/.+\.(ico|png)$/);
    const reponse = await request.get(href);
    expect(reponse.status(), `favicon absent : ${href}`).toBe(200);
    expect(reponse.headers()["content-type"], href).toMatch(/^image\//);
  }
  // Repli historique des navigateurs et de Google : /favicon.ico à la racine.
  expect((await request.get("/favicon.ico")).status()).toBe(200);
});

test.describe("mobile (390 px)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("le menu mobile s'ouvre et mène aux pages", async ({ page }) => {
    await intercepterVersion(page, "ok");
    await page.goto("/");
    const bouton = page.locator('button[aria-controls="menu-mobile"]');
    await expect(bouton).toBeVisible();
    await bouton.click();
    const menu = page.locator("#menu-mobile");
    await expect(menu).toBeVisible();
    await expect(menu.locator("a").first()).toBeVisible();
  });

  test("aucun débordement horizontal sur les pages principales", async ({ page }) => {
    await intercepterVersion(page, "ok");
    for (const { chemin } of pagesPrincipales) {
      await page.goto(chemin);
      const deborde = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(deborde, `débordement horizontal sur ${chemin}`).toBe(false);
    }
  });
});

test.describe("page de téléchargement — version.json", () => {
  test("numéro et lien proviennent du même objet version.json", async ({ page }) => {
    await intercepterVersion(page, "ok");
    await page.goto("/telechargement/");
    const bouton = page.locator(`a[href="${VERSION_FICTIVE.url_exe}"]`);
    await expect(bouton).toBeVisible();
    await expect(bouton).toContainText(`Télécharger Noltan ${VERSION_FICTIVE.version}`);
    await expect(page.locator("h1 ~ p").first()).toContainText(VERSION_FICTIVE.version);
    await expect(page.getByText("Notes de test.")).toBeVisible();
    await expect(page.locator(`a[href="${VERSION_FICTIVE.url}"]`)).toBeVisible();
  });

  test("version.json indisponible : message honnête, aucun numéro, lien releases", async ({
    page,
  }) => {
    await intercepterVersion(page, "echec");
    await page.goto("/telechargement/");
    await expect(page.getByText(/n'a pas abouti/)).toBeVisible();
    await expect(
      page.locator('a[href="https://github.com/venum78160/Noltan/releases/latest"]'),
    ).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/Version \d+\.\d+\.\d+/);
  });

  test("version.json invalide : traité comme indisponible (jamais affiché tel quel)", async ({
    page,
  }) => {
    await intercepterVersion(page, "invalide");
    await page.goto("/telechargement/");
    await expect(page.getByText(/n'a pas abouti/)).toBeVisible();
    await expect(page.locator("main")).not.toContainText("???");
  });
});
