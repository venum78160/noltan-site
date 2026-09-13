import { lien } from "@/lib/utils";

/**
 * "" tant que le calendrier n'est pas branché, sinon l'URL exacte d'un type
 * d'événement Calendly (https://calendly.com/<compte>/<slug>) — toute autre
 * forme est refusée à la compilation (npm run typecheck).
 */
type UrlCalendly = "" | `https://calendly.com/${string}/${string}`;

/**
 * "" tant que la mesure d'audience n'est pas branchée, sinon l'identifiant de
 * site fourni par Umami (un UUID) — toute autre forme est refusée à la
 * compilation.
 */
type IdMesure = "" | `${string}-${string}-${string}-${string}-${string}`;

/**
 * "" tant que le formulaire n'est pas branché, sinon l'adresse de réception
 * d'un formulaire Brevo (https://<compte>.sibforms.com/serve/<formulaire>) —
 * toute autre forme est refusée à la compilation.
 */
type UrlFormulaire = "" | `https://${string}.sibforms.com/serve/${string}`;

/**
 * Configuration centrale du site — l'action commerciale et les informations
 * légales se règlent UNIQUEMENT ici (aucune duplication dans les fichiers
 * Markdown du dépôt : ce qui est affiché sur le site vit dans ce fichier).
 */
export const SITE = {
  nom: "Noltan",
  tagline: "L'espace de travail du conseiller en gestion de patrimoine",
  /** URL publique du site (écran de consentement Google + balises canoniques). */
  url: "https://noltan.fr",
  /** Adresse de contact affichée sur le site et dans la politique de confidentialité. */
  emailContact: "contact@noltan.fr",

  /* ——— Téléchargement ———
     SOURCE DE VÉRITÉ UNIQUE : version.json du dépôt public de releases,
     récupéré PAR LE NAVIGATEUR sur la page de téléchargement (cf.
     src/lib/version.ts). Aucun numéro de version n'existe dans ce dépôt. */
  /** Emplacement public de version.json (numéro, url de release, url_exe, notes). */
  urlVersionJson: "https://raw.githubusercontent.com/venum78160/Noltan/main/version.json",
  /** Page générale des releases — repli affiché quand version.json est indisponible. */
  urlReleases: "https://github.com/venum78160/Noltan/releases/latest",
  /** Poids approximatif de l'installeur, affiché à côté du bouton. */
  poidsInstalleur: "≈ 40 Mo",

  /* ——— Mesure d'audience (sans cookie, hébergée en Union européenne) ———
     Une seule valeur commande tout. Vide : aucun script chargé, aucun
     événement envoyé, aucune mention dans la politique de confidentialité.
     Renseignée : le script Umami est chargé sur toutes les pages, les gestes
     clés sont comptés (téléchargement avec le système du visiteur, demande de
     démonstration, étapes du calendrier, contact) et la politique décrit le
     traitement (cf. README, section « Mesure d'audience »). */
  /** Identifiant du site dans Umami Cloud (région UE), tel qu'affiché dans son code de suivi. */
  idMesure: "" satisfies IdMesure,
  /** URL du script de suivi, telle qu'affichée par Umami à côté de l'identifiant. */
  urlScriptMesure: "https://cloud.umami.is/script.js",
  /** Seuls ces domaines comptent : ni le poste de développement, ni l'aperçu GitHub Pages. */
  domainesMesure: "noltan.fr,www.noltan.fr",

  /* ——— Formulaire avant téléchargement (Brevo) ———
     Vide : bouton de téléchargement direct. Renseignée : adresse de réception
     du formulaire Brevo — l'encadré Prénom / Nom / E-mail / Cabinet précède le
     bouton, le contact part dans Brevo (champs EMAIL, PRENOM, NOM, CABINET et
     SOURCE, à créer dans le formulaire), le lien est aussi envoyé par e-mail
     (automatisation Brevo) et la politique de confidentialité décrit le
     traitement. Le téléchargement n'est JAMAIS bloqué par un échec d'envoi. */
  formulaireTelechargement: "" satisfies UrlFormulaire,

  editeur: "Valentin L'Hotellier",
  derniereMajLegale: "11 septembre 2026",

  /* ——— Action commerciale (un seul endroit pour tout changer) ——— */
  /** Libellé unique du bouton d'action, utilisé partout à l'identique. */
  libelleDemo: "Demander une démonstration",
  /** Durée affichée pour la démonstration. "" = non affichée. */
  dureeDemo: "30 minutes",
  /**
   * URL du type d'événement Calendly de la démonstration. Vide : le site
   * propose l'e-mail pré-rempli ci-dessous — aucun faux calendrier n'est
   * simulé. Renseignée : calendrier intégré sur /demo/#rdv, boutons d'action
   * redirigés dessus, politique de confidentialité complétée (cf. README).
   */
  urlCalendly: "https://calendly.com/noltan/demonstration" satisfies UrlCalendly,

  /* ——— Promesses configurables ——— */
  /** Accompagnement au démarrage : formulation prudente tant que le dispositif
      de support n'est pas arrêté. Modifier ici quand la décision est prise. */
  accompagnementTitre: "Un démarrage guidé",
  accompagnementTexte:
    "Un assistant de bienvenue configure le cabinet pas à pas à la première " +
    "ouverture, et la démonstration se fait en direct, sur l'outil réel — " +
    "vos questions trouvent des réponses avant même d'installer l'application.",

  /* ——— Mentions légales (champs vides = ligne non affichée sur le site) ——— */
  formeJuridique: "entrepreneur individuel",
  adresseEditeur: "27 rue Paul Leplat, 78160 Marly-le-Roi",
  siren: "923 657 431",
  tvaIntra: "FR77 923 657 431",
  hebergeurNom: "GitHub, Inc. (GitHub Pages)",
  hebergeurAdresse: "88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis",
} as const;

/** E-mail pré-rempli de demande de démonstration (repli sans backend). */
const MAILTO_DEMO = `mailto:${SITE.emailContact}?subject=${encodeURIComponent(
  "Demande de démonstration Noltan",
)}&body=${encodeURIComponent(
  `Bonjour,

Je souhaite découvrir Noltan lors d'une démonstration.

Cabinet :
Nombre de conseillers :
Disponibilités :

Merci !`,
)}`;

/** true si la prise de rendez-vous en ligne (Calendly) est branchée. */
export const RDV_EN_LIGNE = SITE.urlCalendly.length > 0;

/**
 * Lien effectif du bouton « Demander une démonstration » : le calendrier
 * intégré de la page de démonstration, sinon l'e-mail pré-rempli.
 */
export const LIEN_DEMO = RDV_EN_LIGNE ? lien("/demo/#rdv") : MAILTO_DEMO;

/** true si la mesure d'audience est branchée (script chargé, gestes comptés). */
export const MESURE_ACTIVE = SITE.idMesure.length > 0;

/** true si le formulaire précède le bouton de téléchargement. */
export const FORMULAIRE_ACTIF = SITE.formulaireTelechargement.length > 0;

/**
 * URL du calendrier intégré (widget Calendly « inline ») aux couleurs du site :
 * or Noltan pour l'action, encre pour le texte, fond blanc. Le bandeau cookies
 * de Calendly est masqué (hide_gdpr_banner, décision du 11/09/2026) : le
 * point 3.1 de la politique de confidentialité informe à sa place. Les
 * paramètres utm_* sont conservés par Calendly sur chaque réservation : dans
 * sa liste des réunions, une réservation faite depuis le site se distingue
 * d'une réservation faite depuis un lien envoyé par e-mail.
 */
export const URL_CALENDLY_INTEGREE = RDV_EN_LIGNE
  ? `${SITE.urlCalendly}?hide_gdpr_banner=1&primary_color=86611e&text_color=0f172a&background_color=ffffff&utm_source=noltan.fr&utm_medium=site&utm_campaign=demo`
  : "";
