import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/*
 * NOTE version de l'application : le site n'en connaît AUCUNE au build.
 * La page de téléchargement lit version.json du dépôt public de releases
 * directement dans le navigateur (src/lib/version.ts) — mise à jour immédiate
 * après chaque release, sans redéploiement du site.
 */
export default defineConfig(() => {
  // "/" par défaut (domaine dédié) ; "/plutus-site/" pour l'aperçu GitHub Pages.
  const base = process.env.SITE_BASE || "/";

  /** Remplace __BASE__ dans les HTML et ajoute noindex sur l'aperçu Pages
      (le référencement attendra le vrai domaine). */
  const metaEtBase: Plugin = {
    name: "plutus-meta-base",
    transformIndexHtml(html) {
      let sortie = html.replaceAll("__BASE__", base);
      if (base !== "/") {
        sortie = sortie.replace(
          "</title>",
          '</title>\n    <meta name="robots" content="noindex" />',
        );
      }
      return sortie;
    },
  };

  return {
    base,
    plugins: [react(), tailwindcss(), metaEtBase],
    resolve: {
      alias: { "@": r("./src") },
    },
    build: {
      rollupOptions: {
        input: {
          accueil: r("./index.html"),
          demo: r("./demo/index.html"),
          telechargement: r("./telechargement/index.html"),
          confidentialite: r("./confidentialite/index.html"),
          mentions: r("./mentions-legales/index.html"),
          quatrecentquatre: r("./404.html"),
        },
      },
    },
  };
});
