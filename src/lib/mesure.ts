import { MESURE_ACTIVE, SITE } from "@/lib/site";

/**
 * Mesure d'audience sans cookie (Umami) — l'unique auteur de tout ce qui est
 * compté sur le site.
 *
 * - Le script n'est chargé que si `SITE.idMesure` est renseigné : une valeur
 *   commande tout, comme le calendrier. Rien n'est déposé ni lu sur l'appareil
 *   du visiteur, l'adresse IP n'est pas conservée, aucun bandeau n'est requis.
 * - Les gestes à un clic se déclarent par attributs (`attributsMesure`) sur
 *   les liens et boutons : le script les compte lui-même et, pour un lien qui
 *   navigue dans le même onglet, attend la fin de l'envoi avant de le suivre.
 *   Sans script (mesure débranchée), ces attributs sont inertes.
 * - `suivre()` sert aux gestes sans clic (étapes du calendrier, formulaire) :
 *   sans script chargé, elle ne fait rien.
 * - Le vocabulaire des événements est FERMÉ : un nom inconnu ne compile pas.
 */
export type Evenement =
  | "telechargement"
  | "demo_clic"
  | "rdv_calendrier"
  | "rdv_evenement"
  | "rdv_creneau"
  | "rdv_reserve"
  | "contact_email"
  | "formulaire_affiche"
  | "formulaire_envoye"
  | "formulaire_erreur";

/** Propriétés d'un événement : des libellés courts, jamais une saisie du visiteur. */
export type Proprietes = Record<string, string>;

declare global {
  interface Window {
    umami?: { track(evenement: string, proprietes?: Proprietes): void };
  }
}

/** Attribut lu par le script au clic (les propriétés suivent en `-<nom>`). */
const ATTRIBUT = "data-umami-event";

/** Charge le script de mesure, une seule fois — uniquement si la mesure est branchée. */
export function chargerMesure(): void {
  if (!MESURE_ACTIVE) return;
  if (document.querySelector(`script[data-website-id="${SITE.idMesure}"]`)) return;
  const script = document.createElement("script");
  script.defer = true;
  script.src = SITE.urlScriptMesure;
  script.dataset.websiteId = SITE.idMesure;
  // Seuls ces domaines comptent : ni le poste de développement, ni l'aperçu GitHub Pages.
  script.dataset.domains = SITE.domainesMesure;
  document.head.appendChild(script);
}

/** Compte un geste sans clic. Sans script chargé : rien. */
export function suivre(evenement: Evenement, proprietes?: Proprietes): void {
  window.umami?.track(evenement, proprietes);
}

/** Attributs à poser sur un lien ou un bouton pour que son clic soit compté. */
export function attributsMesure(evenement: Evenement, proprietes?: Proprietes): Proprietes {
  const attributs: Proprietes = { [ATTRIBUT]: evenement };
  for (const [cle, valeur] of Object.entries(proprietes ?? {})) {
    attributs[`${ATTRIBUT}-${cle}`] = valeur;
  }
  return attributs;
}

export type Systeme = "windows" | "macos" | "autre";
export type Appareil = "ordinateur" | "mobile";

type NavigateurEtendu = Navigator & {
  userAgentData?: { platform?: string; mobile?: boolean };
};

/** Système du visiteur, lu dans le navigateur au moment du clic — jamais enregistré ailleurs. */
export function systemeVisiteur(): Systeme {
  const nav = navigator as NavigateurEtendu;
  const plateforme = (nav.userAgentData?.platform ?? nav.platform ?? "").toLowerCase();
  const agent = nav.userAgent.toLowerCase();
  if (plateforme.includes("mac") || agent.includes("macintosh")) return "macos";
  if (plateforme.includes("win") || agent.includes("windows")) return "windows";
  return "autre";
}

/** Un téléphone ou une tablette ne peut pas installer Noltan : le lien se reçoit par e-mail. */
export function appareilVisiteur(): Appareil {
  const nav = navigator as NavigateurEtendu;
  if (typeof nav.userAgentData?.mobile === "boolean") {
    return nav.userAgentData.mobile ? "mobile" : "ordinateur";
  }
  return /android|iphone|ipad|ipod|mobile/i.test(nav.userAgent) ? "mobile" : "ordinateur";
}
