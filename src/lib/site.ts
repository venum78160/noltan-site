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
  emailContact: "valentin7892@gmail.com",

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

  editeur: "Valentin L'Hotellier",
  derniereMajLegale: "17 juillet 2026",

  /* ——— Action commerciale (un seul endroit pour tout changer) ——— */
  /** Libellé unique du bouton d'action, utilisé partout à l'identique. */
  libelleDemo: "Demander une démonstration",
  /** Durée affichée pour la démonstration. "" = non affichée. */
  dureeDemo: "",
  /**
   * URL d'un outil de prise de rendez-vous (page de réservation Google Agenda,
   * Calendly…). Tant que la valeur est vide, le site propose l'e-mail
   * pré-rempli ci-dessous — aucun faux calendrier n'est simulé.
   */
  lienPriseRdv: "",

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

/** Lien effectif du bouton « Demander une démonstration ». */
export const LIEN_DEMO = SITE.lienPriseRdv || MAILTO_DEMO;

/** true si la prise de rendez-vous en ligne est branchée. */
export const RDV_EN_LIGNE = SITE.lienPriseRdv.length > 0;
