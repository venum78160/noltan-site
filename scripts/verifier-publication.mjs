/**
 * Vérification pré-déploiement : recherche dans dist/ tout élément qui ne doit
 * jamais être publié (secrets, chemins locaux, marques internes, restes de dev).
 * Usage : npm run verifier   (échoue avec un code ≠ 0 si un problème est trouvé)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));

/** Motifs interdits dans les fichiers texte publiés. */
const MOTIFS = [
  // La marque du cabinet pilote (le NOM de l'éditeur « Valentin L'Hotellier »
  // reste, lui, une mention légale obligatoire et autorisée).
  { re: /L['’]Hotellier\s*·\s*Patrimoine/i, pourquoi: "marque du cabinet pilote" },
  { re: /Bêta gratuite/i, pourquoi: "badge bêta non validé" },
  { re: /AIza[0-9A-Za-z_-]{20,}/, pourquoi: "clé d'API Google" },
  { re: /client_secret/i, pourquoi: "secret OAuth" },
  { re: /-----BEGIN [A-Z ]*PRIVATE KEY/, pourquoi: "clé privée" },
  { re: /sk-[A-Za-z0-9]{20,}/, pourquoi: "clé d'API" },
  { re: /C:\\Users\\/i, pourquoi: "chemin local Windows" },
  { re: /plutus-sandbox/i, pourquoi: "référence au bac à sable" },
  { re: /scratchpad/i, pourquoi: "référence au dossier temporaire de session" },
  { re: /localhost:\d+|127\.0\.0\.1/, pourquoi: "adresse de développement" },
  // Volontairement sensible à la casse : les placeholders internes sont en
  // majuscules (« À COMPLÉTER »), le texte marketing peut dire « à compléter ».
  { re: /TODO|FIXME|À COMPLÉTER|A COMPLETER/, pourquoi: "note interne / placeholder" },
];

/** Extensions texte à inspecter (les images/woff2 sont ignorées). */
const TEXTE = new Set([".html", ".js", ".css", ".txt", ".xml", ".json", ".svg", ".webmanifest"]);

let problemes = 0;
const parcourir = (dir) => {
  for (const nom of readdirSync(dir)) {
    const chemin = join(dir, nom);
    if (statSync(chemin).isDirectory()) {
      parcourir(chemin);
      continue;
    }
    if (!TEXTE.has(extname(nom).toLowerCase())) continue;
    const contenu = readFileSync(chemin, "utf-8");
    for (const { re, pourquoi } of MOTIFS) {
      const m = contenu.match(re);
      if (m) {
        problemes++;
        console.error(
          `✗ ${chemin.replace(dist, "dist/")} — ${pourquoi} : « ${m[0].slice(0, 60)} »`,
        );
      }
    }
  }
};

parcourir(dist);
if (problemes === 0) {
  console.log(
    "✓ dist/ est propre : aucun secret, chemin local, marque interne ou placeholder détecté.",
  );
} else {
  console.error(`\n${problemes} problème(s) — corriger avant tout déploiement.`);
  process.exit(1);
}
