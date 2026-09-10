import { SITE } from "@/lib/site";

/**
 * Récupération de la version publiée, CÔTÉ NAVIGATEUR, depuis version.json du
 * dépôt public de releases — la même source que la bannière de mise à jour de
 * l'application. Le numéro affiché et le lien de téléchargement proviennent du
 * MÊME objet JSON : ils ne peuvent pas se désynchroniser.
 *
 * En cas d'échec (réseau, JSON invalide, contenu inattendu), la fonction rend
 * null : la page affiche alors un repli honnête (pas de numéro, lien vers la
 * page des releases) — jamais une ancienne version présentée comme actuelle.
 */
export interface InfosVersion {
  /** Numéro semver strict, ex. "1.2.3". */
  version: string;
  /** Lien direct de l'installeur (.exe) — champ url_exe de version.json. */
  urlExe: string;
  /** Page de la release — champ url de version.json. */
  urlRelease: string;
  /** Notes de version (texte brut, éventuellement vide). */
  notes: string;
}

/** N'accepte qu'une URL https pointant vers le dépôt public de releases. */
function urlSure(valeur: unknown): string | null {
  if (typeof valeur !== "string") return null;
  let u: URL;
  try {
    u = new URL(valeur);
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  if (u.hostname !== "github.com") return null;
  // « Plutus » : ancien nom du dépôt de releases (avant le 10/09/2026) — les
  // releases publiées sous ce nom gardent leurs URL (GitHub redirige). À
  // retirer après la première release publiée sous le nom Noltan.
  if (!/^\/venum78160\/(Noltan|Plutus)\//.test(u.pathname)) return null;
  return u.href;
}

export async function recupererVersion(delaiMs = 6000): Promise<InfosVersion | null> {
  const controleur = new AbortController();
  const minuteur = setTimeout(() => controleur.abort(), delaiMs);
  try {
    const reponse = await fetch(SITE.urlVersionJson, {
      signal: controleur.signal,
      cache: "no-store",
    });
    if (!reponse.ok) return null;
    const donnees: unknown = await reponse.json();
    if (typeof donnees !== "object" || donnees === null) return null;
    const brut = donnees as Record<string, unknown>;

    const version = typeof brut.version === "string" ? brut.version.trim() : "";
    if (!/^\d+\.\d+\.\d+$/.test(version)) return null;

    const urlExe = urlSure(brut.url_exe);
    if (!urlExe?.endsWith(".exe")) return null;

    // La page de release est facultative : à défaut, la page générale des releases.
    const urlRelease = urlSure(brut.url) ?? SITE.urlReleases;

    // Notes : texte brut uniquement (rendu via React, jamais injecté en HTML).
    const notes = typeof brut.notes === "string" ? brut.notes.trim().slice(0, 400) : "";

    return { version, urlExe, urlRelease, notes };
  } catch {
    return null;
  } finally {
    clearTimeout(minuteur);
  }
}
