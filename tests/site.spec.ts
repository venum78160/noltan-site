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

/** Le script de mesure d'audience (externe) est remplacé par un script vide : jamais de réseau. */
const neutraliserMesure = (page: Page) =>
  page.route(/umami\.is/, (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" }),
  );

/**
 * Remplit et envoie le formulaire avant téléchargement s'il est branché
 * (réception Brevo simulée) ; sans formulaire, le bouton est déjà là.
 */
const debloquerTelechargement = async (page: Page) => {
  // La page attend version.json : formulaire OU bouton, selon la configuration.
  await page.locator('form[data-formulaire="telechargement"], a[download]').first().waitFor();
  const formulaire = page.locator('form[data-formulaire="telechargement"]');
  if ((await formulaire.count()) === 0) return;
  await page.route(/sibforms\.com/, (route) =>
    route.fulfill({ contentType: "application/json", body: '{"success":true}' }),
  );
  await formulaire.locator('input[name="PRENOM"]').fill("Claire");
  await formulaire.locator('input[name="NOM"]').fill("Fontaine");
  await formulaire.locator('input[name="EMAIL"]').fill("claire.fontaine@example.org");
  await formulaire.locator('button[type="submit"]').click();
};

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
    await debloquerTelechargement(page);
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

test.describe("prise de rendez-vous pour la démonstration", () => {
  /** Le script Calendly (externe) est remplacé par un script vide : jamais de réseau. */
  const neutraliserCalendly = (page: Page) =>
    page.route("https://assets.calendly.com/**", (route) =>
      route.fulfill({ contentType: "application/javascript", body: "" }),
    );

  test("le bouton d'action mène au calendrier intégré, ou à un e-mail pré-rempli à défaut", async ({
    page,
  }) => {
    await intercepterVersion(page, "ok");
    await neutraliserCalendly(page);
    await page.goto("/demo/");
    await expect(page.locator("h1").first()).toBeVisible();
    const bouton = page.locator("main a", { hasText: "Demander une démonstration" }).first();
    const href = (await bouton.getAttribute("href")) ?? "";
    const calendrier = page.locator(".calendly-inline-widget");
    if (href.startsWith("mailto:")) {
      // Calendrier non branché : e-mail pré-rempli, et aucun faux calendrier.
      expect(href).toContain("subject=");
      await expect(calendrier).toHaveCount(0);
    } else {
      expect(href).toMatch(/\/demo\/#rdv$/);
      await expect(page.locator("section#rdv")).toBeVisible();
      await expect(calendrier).toHaveAttribute(
        "data-url",
        /^https:\/\/calendly\.com\/[^/?#]+\/[^/?#]+\?/,
      );
      // Lien de secours vers la page Calendly nue, dans un nouvel onglet.
      await expect(page.locator('section#rdv a[href^="https://calendly.com/"]')).toHaveAttribute(
        "target",
        "_blank",
      );
    }
  });

  test("la politique de confidentialité mentionne Calendly si, et seulement si, le calendrier est branché", async ({
    page,
  }) => {
    await intercepterVersion(page, "ok");
    await neutraliserCalendly(page);
    await page.goto("/demo/");
    await expect(page.locator("h1").first()).toBeVisible();
    const branche = (await page.locator(".calendly-inline-widget").count()) > 0;
    await page.goto("/confidentialite/");
    const politique = (await page.locator("main").textContent()) ?? "";
    expect(politique.includes("Calendly"), "politique de confidentialité ↔ calendrier").toBe(
      branche,
    );
  });
});

test.describe("mesure d'audience (sans cookie)", () => {
  test("le script n'est chargé que si la mesure est branchée, et la politique le décrit si, et seulement si, elle l'est", async ({
    page,
  }) => {
    await intercepterVersion(page, "ok");
    await neutraliserMesure(page);
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    const script = page.locator("script[data-website-id]");
    const branchee = (await script.count()) > 0;
    if (branchee) {
      await expect(script).toHaveAttribute("src", /umami/);
      // Ni le poste de développement ni l'aperçu GitHub Pages ne comptent.
      await expect(script).toHaveAttribute("data-domains", /noltan\.fr/);
    }
    await page.goto("/confidentialite/");
    const politique = (await page.locator("main").textContent()) ?? "";
    expect(politique.includes("Mesure d'audience"), "politique ↔ mesure").toBe(branchee);
  });

  test("les gestes clés portent leurs attributs de mesure (inertes sans script)", async ({
    page,
  }) => {
    await intercepterVersion(page, "ok");
    await neutraliserMesure(page);
    await page.goto("/telechargement/");
    await debloquerTelechargement(page);
    const bouton = page.locator(`a[href="${VERSION_FICTIVE.url_exe}"]`);
    await expect(bouton).toHaveAttribute("data-umami-event", "telechargement");
    await expect(bouton).toHaveAttribute("data-umami-event-systeme", /^(windows|macos|autre)$/);
    await expect(bouton).toHaveAttribute("data-umami-event-version", VERSION_FICTIVE.version);
    // Demande de démonstration (menu) et contact (pied de page), avec leur emplacement.
    await expect(page.locator('header a[data-umami-event="demo_clic"]').first()).toHaveAttribute(
      "data-umami-event-emplacement",
      /.+/,
    );
    await expect(page.locator('footer a[href^="mailto:"]')).toHaveAttribute(
      "data-umami-event",
      "contact_email",
    );
  });

  test("les étapes du calendrier sont relayées à la mesure — et seulement depuis calendly.com", async ({
    page,
  }) => {
    await intercepterVersion(page, "ok");
    await neutraliserMesure(page);
    await page.route("https://assets.calendly.com/**", (route) =>
      route.fulfill({ contentType: "application/javascript", body: "" }),
    );
    // Faux script de mesure : enregistre les noms d'événements au lieu de les envoyer.
    await page.addInitScript(() => {
      const appels: string[] = [];
      const w = window as unknown as { __mesure: string[]; umami: unknown };
      w.__mesure = appels;
      w.umami = { track: (nom: string) => appels.push(nom) };
    });
    // Une page servie « depuis calendly.com » (l'origine réelle du widget) qui signale une réservation.
    await page.route("https://calendly.com/**", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<script>parent.postMessage({ event: 'calendly.event_scheduled' }, '*')</script>",
      }),
    );
    await page.goto("/demo/");
    await expect(page.locator("h1").first()).toBeVisible();
    if ((await page.locator("section#rdv").count()) === 0) return; // calendrier non branché
    const lireAppels = () =>
      page.evaluate(() => (window as unknown as { __mesure: string[] }).__mesure);
    await page.evaluate(() => {
      const cadre = document.createElement("iframe");
      cadre.src = "https://calendly.com/test/etape";
      document.body.appendChild(cadre);
    });
    await expect.poll(lireAppels).toContain("rdv_reserve");
    // Le même message émis par la page elle-même (autre origine) est ignoré.
    await page.evaluate(() =>
      window.postMessage({ event: "calendly.date_and_time_selected" }, "*"),
    );
    await page.waitForTimeout(300);
    expect(await lireAppels()).not.toContain("rdv_creneau");
  });
});

test.describe("formulaire avant téléchargement (Brevo)", () => {
  const remplir = async (page: Page) => {
    const formulaire = page.locator('form[data-formulaire="telechargement"]');
    await formulaire.locator('input[name="PRENOM"]').fill("Claire");
    await formulaire.locator('input[name="NOM"]').fill("Fontaine");
    await formulaire.locator('input[name="EMAIL"]').fill("claire.fontaine@example.org");
    await formulaire.locator('button[type="submit"]').click();
  };

  test("le formulaire précède le bouton si, et seulement si, il est branché — et ne bloque jamais le téléchargement", async ({
    page,
  }) => {
    await intercepterVersion(page, "ok");
    await neutraliserMesure(page);
    await page.goto("/telechargement/");
    await page.locator('form[data-formulaire="telechargement"], a[download]').first().waitFor();
    const branche = (await page.locator('form[data-formulaire="telechargement"]').count()) > 0;
    const bouton = page.locator(`a[href="${VERSION_FICTIVE.url_exe}"]`);
    if (branche) {
      // Aucun lien direct avant l'envoi ; l'envoi part vers Brevo avec les champs attendus.
      await expect(bouton).toHaveCount(0);
      let corps = "";
      await page.route(/sibforms\.com/, (route) => {
        corps = route.request().postDataBuffer()?.toString("utf-8") ?? "";
        return route.fulfill({ contentType: "application/json", body: '{"success":true}' });
      });
      await remplir(page);
      await expect(bouton).toBeVisible();
      expect(corps).toContain("claire.fontaine@example.org");
      for (const champ of ["PRENOM", "NOM", "EMAIL", "SOURCE", "email_address_check", "locale"]) {
        expect(corps, `champ ${champ}`).toContain(`name="${champ}"`);
      }
      await expect(page.locator("[data-formulaire-resultat]")).toHaveAttribute(
        "data-formulaire-resultat",
        "envoye",
      );
      // Brevo en panne : le bouton apparaît quand même, et le message le dit.
      await page.unroute(/sibforms\.com/);
      await page.route(/sibforms\.com/, (route) => route.fulfill({ status: 500, body: "" }));
      await page.reload();
      await remplir(page);
      await expect(bouton).toBeVisible();
      await expect(page.locator("[data-formulaire-resultat]")).toHaveAttribute(
        "data-formulaire-resultat",
        "erreur",
      );
    } else {
      await expect(bouton).toBeVisible();
    }
    await page.goto("/confidentialite/");
    const politique = (await page.locator("main").textContent()) ?? "";
    expect(politique.includes("Brevo"), "politique ↔ formulaire").toBe(branche);
  });
});
