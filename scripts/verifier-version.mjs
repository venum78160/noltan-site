/**
 * Vérifie que la chaîne de téléchargement publique fonctionne :
 *   1. version.json du dépôt de releases est accessible et VALIDE
 *      (mêmes règles que le navigateur : semver strict, URLs https vers le
 *      dépôt public de releases, .exe pour url_exe) ;
 *   2. l'installeur pointé par url_exe répond réellement (HEAD suivi de
 *      redirections).
 *
 * Usage :
 *   npm run verifier:version              → BLOQUANT (déploiement officiel)
 *   node scripts/verifier-version.mjs --tolerant
 *                                         → simple avertissement (CI de PR,
 *                                           où un aléa réseau ne doit pas
 *                                           bloquer une relecture de code)
 * La page de téléchargement fait sa propre récupération côté navigateur avec
 * un repli honnête ; ce script garantit en plus qu'on ne PUBLIE jamais le site
 * sans avoir contrôlé la chaîne complète.
 */
const URL_VERSION_JSON = "https://raw.githubusercontent.com/venum78160/Noltan/main/version.json";
const tolerant = process.argv.includes("--tolerant");

function echec(message) {
  if (tolerant) {
    console.warn(`::warning::${message} (mode tolérant : la CI continue)`);
    process.exit(0);
  }
  console.error(`✗ ${message}`);
  process.exit(1);
}

function urlSure(valeur) {
  if (typeof valeur !== "string") return null;
  let u;
  try {
    u = new URL(valeur);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" || u.hostname !== "github.com") return null;
  // « Plutus » : ancien nom du dépôt de releases (avant le 10/09/2026) — les
  // releases publiées sous ce nom gardent leurs URL (GitHub redirige). À
  // retirer après la première release publiée sous le nom Noltan.
  if (!/^\/venum78160\/(Noltan|Plutus)\//.test(u.pathname)) return null;
  return u.href;
}

let donnees;
try {
  const reponse = await fetch(URL_VERSION_JSON, { signal: AbortSignal.timeout(10000) });
  if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
  donnees = await reponse.json();
} catch (e) {
  echec(`version.json inaccessible ou illisible : ${String(e)}`);
}

const version = typeof donnees?.version === "string" ? donnees.version.trim() : "";
if (!/^\d+\.\d+\.\d+$/.test(version)) echec(`champ « version » invalide : « ${version} »`);

const urlExe = urlSure(donnees.url_exe);
if (!urlExe?.endsWith(".exe")) echec(`champ « url_exe » invalide : « ${donnees.url_exe} »`);

if (donnees.url !== undefined && !urlSure(donnees.url)) {
  echec(`champ « url » invalide : « ${donnees.url} »`);
}

try {
  const tete = await fetch(urlExe, { method: "HEAD", signal: AbortSignal.timeout(20000) });
  if (!tete.ok) throw new Error(`HTTP ${tete.status}`);
  const taille = Number(tete.headers.get("content-length") || 0);
  console.log(
    `✓ version.json valide — version ${version}, installeur joignable (${Math.round(taille / 1024 / 1024)} Mo).`,
  );
} catch (e) {
  echec(`installeur injoignable à ${urlExe} : ${String(e)}`);
}
