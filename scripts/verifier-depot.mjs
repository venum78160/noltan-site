/**
 * Vérification du DÉPÔT (pas seulement de dist/) : le dépôt étant public,
 * chaque fichier suivi par Git est une surface de publication. Ce script
 * échoue si un contenu interdit réapparaît :
 *   - un numéro de version de l'application codé en dur (la seule source est
 *     version.json du dépôt de releases, lu par le navigateur) ;
 *   - une instruction de mise à jour manuelle de la version ;
 *   - une référence aux documents internes déplacés dans le dépôt privé ;
 *   - des coordonnées personnelles hors de src/lib/site.ts (source unique) ;
 *   - des détails internes de l'application (fichiers de clés, anciens chemins).
 * Usage : npm run verifier:depot   (code de sortie ≠ 0 si un problème est trouvé)
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname } from "node:path";

/** Fichiers texte suivis par Git (les binaires sont ignorés). */
const TEXTE = new Set([
  ".md",
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".json",
  ".css",
  ".html",
  ".yml",
  ".yaml",
  ".txt",
  ".svg",
]);

/** Les scripts de scan contiennent eux-mêmes les motifs interdits (ce sont
    leurs règles) : ils sont exclus l'un comme l'autre. */
const EXCLUS = new Set(["scripts/verifier-depot.mjs", "scripts/verifier-publication.mjs"]);

/** Le lockfile et le manifeste contiennent des versions de dépendances (ex. clsx 2.1.x). */
const EXCLUS_VERSIONS = new Set(["package.json", "package-lock.json"]);

/** Coordonnées personnelles : autorisées UNIQUEMENT dans la config centrale
    (elles y alimentent les mentions légales du site — jamais dupliquées ailleurs). */
const FICHIER_LEGAL = "src/lib/site.ts";

const regles = [
  {
    nom: "numéro de version de l'application codé en dur",
    re: /\b\d+\.\d+\.\d+\s*(pour Windows|de Plutus)|version\s*[:=]\s*["']\d+\.\d+\.\d+["']|\bv?2\.1\.\d+\b/,
    // Les tests simulent version.json avec un numéro fictif : autorisé.
    sauf: (f) => EXCLUS_VERSIONS.has(f) || f.startsWith("tests/"),
  },
  {
    nom: "injection de version au build (mécanisme supprimé)",
    re: /__VERSION_APP__/,
  },
  {
    nom: "instruction de mise à jour manuelle de la version",
    re: /mettre à jour\s+`?version`?|version\s+à\s+(saisir|mettre à jour)\s+(à la main|manuellement)/i,
  },
  {
    nom: "référence à un document interne (déplacé dans le dépôt privé)",
    re: /A_VALIDER|VERIFICATIONS\.md|\bCAPTURES\.md/,
  },
  {
    nom: "ancien chemin site/… (arborescence d'avant la migration)",
    re: /\bsite\/(src|scripts|public|dist|controle-visuel)\//,
  },
  {
    nom: "badge « Bêta gratuite » (politique tarifaire non arrêtée)",
    re: /[Bb]êta gratuite/,
  },
  {
    nom: "détail interne de l'application (stockage des clés/jetons)",
    re: /google_token\.json|sauvegarde_cle\.json|licence\.json|src\/core\//,
  },
  {
    nom: "coordonnée personnelle hors de src/lib/site.ts",
    re: /valentin7892|Marly-le-Roi|Leplat|923[\s.]?657[\s.]?431/,
    sauf: (f) => f === FICHIER_LEGAL,
  },
];

const fichiers = execSync("git ls-files", { encoding: "utf-8" }).split("\n").filter(Boolean);

let problemes = 0;
for (const fichier of fichiers) {
  if (EXCLUS.has(fichier)) continue;
  if (!TEXTE.has(extname(fichier).toLowerCase())) continue;
  const contenu = readFileSync(fichier, "utf-8");
  for (const { nom, re, sauf } of regles) {
    if (sauf?.(fichier)) continue;
    const m = contenu.match(re);
    if (m) {
      problemes++;
      console.error(`✗ ${fichier} — ${nom} : « ${m[0].slice(0, 60)} »`);
    }
  }
}

if (problemes === 0) {
  console.log(`✓ dépôt propre : ${fichiers.length} fichiers suivis, aucun contenu interdit.`);
} else {
  console.error(
    `\n${problemes} problème(s) — le dépôt public entier est une surface de publication.`,
  );
  process.exit(1);
}
