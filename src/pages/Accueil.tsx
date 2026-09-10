import {
  ArrowRight,
  Check,
  Handshake,
  HardDrive,
  MousePointerClick,
  ShieldCheck,
  X,
} from "lucide-react";
import type React from "react";
import { Capture } from "@/components/site/Capture";
import { PageShell } from "@/components/site/PageShell";
import { Parcours } from "@/components/site/Parcours";
import { ShaderCanvas } from "@/components/ui/animated-shader-hero";
import { ButtonLink } from "@/components/ui/button";
import { LIEN_DEMO, SITE } from "@/lib/site";
import { lien } from "@/lib/utils";

/* ——— Contenu ——— */

const irritants = [
  {
    titre: "Les informations d'un même client vivent dans quatre outils",
    texte:
      "L'extranet, un tableur, la boîte mail, des dossiers Windows — et aucune vue d'ensemble.",
  },
  {
    titre: "Chaque document est recréé à la main depuis un modèle Word",
    texte: "Les mêmes noms, les mêmes montants, recopiés pour la troisième fois de la semaine.",
  },
  {
    titre: "Avant chaque rendez-vous, il faut tout rassembler",
    texte: "Retrouver où en est le dossier, ce qui a été dit, ce qui avait été promis.",
  },
  {
    titre: "Après le rendez-vous, l'administratif s'accumule",
    texte:
      "Le compte rendu attend le soir, la relance attend le compte rendu, le suivi attend tout le reste.",
  },
];

interface Usage {
  titre: string;
  texte: string;
  points: string[];
  fichier: string;
  ecran: string;
  legende: string;
  ratio?: string;
}

const usages: Usage[] = [
  {
    titre: "Toute la connaissance client, au même endroit",
    texte:
      "Patrimoine net, prochain rendez-vous, tâches en attente, points à compléter : la synthèse du client dit l'essentiel en un écran — pour vous et pour le cabinet.",
    points: [
      "Synthèse chiffrée du patrimoine, mise à jour avec le dossier",
      "Prochain rendez-vous et tâches visibles depuis la fiche",
      "Données importées depuis vos extranets au lieu d'être recopiées",
    ],
    fichier: "synthese-zoom.webp",
    ratio: "1730/940",
    ecran: "Haut de la fiche client",
    legende:
      "Le haut de la fiche client : patrimoine net, alertes de complétude, prochain rendez-vous et tâches.",
  },
  {
    titre: "Des rendez-vous préparés, des suites assurées",
    texte:
      "Les rendez-vous à venir sont listés avec leur type et leur client ; chacun s'ouvre sur sa fiche de prise de notes. L'événement Google Calendar se crée au moment de la planification.",
    points: [
      "Rendez-vous planifié et événement Google Calendar en un geste",
      "Chaque rendez-vous s'ouvre sur sa prise de notes",
      "Dates affichées avec le jour — Mardi 21/07/2026, pas d'ambiguïté",
    ],
    fichier: "rdv-a-venir.webp",
    ratio: "1730/560",
    ecran: "Rendez-vous à venir",
    legende: "Les rendez-vous à venir du cabinet — un clic ouvre la prise de notes.",
  },
  {
    titre: "Des documents prêts, contrôlés avant génération",
    texte:
      "Lettre de mission, déclarations d'adéquation : vous cochez les documents, les champs arrivent du dossier, et les contrôles indiquent précisément ce qui manque avant de générer.",
    points: [
      "Vos modèles de documents, remplis depuis le dossier",
      "Contrôles automatiques : « Prêt » ou liste exacte des champs manquants",
      "PDF générés, nommés et classés de façon cohérente",
    ],
    fichier: "documents-selection.webp",
    ratio: "770/850",
    ecran: "Sélection des documents à générer",
    legende:
      "La sélection des documents : chaque modèle affiche son état — prêt, ou champs manquants.",
  },
  {
    titre: "Une vue d'ensemble des dossiers et de ce qui les attend",
    texte:
      "Statuts Contact, Prospect ou Client, étiquettes, dernière activité : la liste des clients montre où en est chaque dossier et lesquels s'endorment — plutôt que de compter sur la mémoire.",
    points: [
      "Dernière activité affichée pour repérer les dossiers dormants",
      "Filtres par statut et étiquettes, tris en un clic",
      "Opérations suivies de la présentation à la mise en place",
    ],
    fichier: "vue-generale.webp",
    ecran: "Liste des clients",
    legende:
      "La liste des clients, triée par activité récente : les dossiers dormants remontent d'eux-mêmes.",
  },
];

const ceNoltanNestPas = [
  "Un CRM généraliste qu'il faudrait au préalable adapter longuement au métier",
  "Une GED (gestion électronique de documents) de plus qui empile des fichiers sans les relier",
  "Une collection de modèles de documents vendue comme une plateforme",
  "Une intelligence artificielle qui déciderait à la place du conseiller",
];

const confiance = [
  {
    icone: HardDrive,
    titre: "Vos données restent chez vous",
    texte:
      "Noltan s'installe sur votre poste. Dossiers, documents et historique sont stockés localement — il n'existe aucun serveur Noltan qui les collecte.",
  },
  {
    icone: ShieldCheck,
    titre: "Sauvegardes chiffrées",
    texte:
      "Les sauvegardes générées par l'application sont chiffrées, avec une clé qui n'appartient qu'à vous. Vous décidez où elles vivent.",
  },
  {
    icone: MousePointerClick,
    titre: "Rien ne part sans votre clic",
    texte:
      "Aucun e-mail, aucun document, aucune invitation n'est envoyé automatiquement. Chaque envoi passe par votre relecture et votre action explicite.",
  },
  {
    icone: Handshake,
    titre: SITE.accompagnementTitre,
    texte: SITE.accompagnementTexte,
  },
];

/* ——— Page ——— */

const Accueil: React.FC = () => (
  <PageShell heroOverlay>
    {/* ——— Hero : proposition de valeur + produit visible ——— */}
    <section className="relative overflow-hidden bg-ink-950">
      <ShaderCanvas />
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/20 to-ink-950"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-4 pt-28 text-center text-white sm:pt-32">
        <p className="animate-fade-in-down">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-300/25 bg-gold-500/10 px-4 py-1.5 text-[13px] font-medium tracking-wide text-gold-100/90 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-300" aria-hidden="true" />
            Conçu avec des CGP indépendants
          </span>
        </p>

        <h1 className="animate-fade-in-up animation-delay-200 mx-auto mt-7 max-w-5xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.4rem]">
          L'<span className="accent-serif text-gold-300">espace de travail</span>
          <br className="hidden sm:block" /> du conseiller en gestion de patrimoine
        </h1>

        <p className="animate-fade-in-up animation-delay-400 mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ink-200/90 sm:text-lg">
          Centralisez vos clients, préparez vos rendez-vous, générez vos documents et suivez chaque
          dossier — depuis un seul outil, installé chez vous.
        </p>

        <div className="animate-fade-in-up animation-delay-600 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink
            href={lien("/demo/")}
            size="lg"
            className="bg-white text-ink-900 shadow-lg shadow-black/20 hover:bg-gold-50 focus-visible:outline-white"
          >
            {SITE.libelleDemo}
          </ButtonLink>
          <ButtonLink
            href="#parcours"
            size="lg"
            className="border border-white/20 bg-white/5 font-medium text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/10 focus-visible:outline-white"
          >
            Voir le parcours
          </ButtonLink>
        </div>
      </div>
    </section>

    {/* Le produit, à cheval entre le hero et la suite : l'élément dominant */}
    <div className="relative bg-white">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-ink-950" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-6">
        <Capture
          fichier="vue-generale.webp"
          ecran="La liste des clients : statuts, coordonnées et dernière activité de chaque dossier"
          priorite
          className="drop-shadow-2xl"
        />
      </div>
    </div>

    {/* ——— Les irritants : le visiteur doit se reconnaître ——— */}
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal max-w-2xl">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-gold-700">
            Le quotidien
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Le conseil vous plaît. <span className="accent-serif">L'éparpillement</span>, moins.
          </h2>
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {irritants.map((p) => (
            <div key={p.titre} className="reveal border-l-2 border-gold-300 pl-5">
              <h3 className="text-[17px] font-semibold leading-snug text-ink-900">{p.titre}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{p.texte}</p>
            </div>
          ))}
        </div>

        <p className="reveal mt-14 max-w-2xl text-pretty text-lg font-medium leading-relaxed text-ink-900">
          Noltan réunit tout cela dans un seul espace de travail : les informations, les
          rendez-vous, les documents et le suivi s'enchaînent — au lieu de s'empiler.
        </p>
      </div>
    </section>

    {/* ——— Le parcours complet : la démonstration par l'exemple ——— */}
    <section id="parcours" className="scroll-mt-16 border-y border-ink-200 bg-ink-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-gold-700">
            Le parcours
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            D'un premier contact à un client bien suivi
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-ink-500">
            Suivez un dossier de bout en bout : chaque étape s'appuie sur la précédente, et les
            informations saisies une fois se retrouvent à chaque étape.
          </p>
        </div>

        <div className="reveal mt-14">
          <Parcours />
        </div>
        <p className="reveal mt-10 text-center text-[13px] text-ink-500">
          Écrans de l'application réelle, remplis avec un dossier de démonstration entièrement
          fictif.
        </p>
      </div>
    </section>

    {/* ——— Les usages : fonctionnalités regroupées par bénéfice métier ——— */}
    <section id="usages" className="scroll-mt-16 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-gold-700">
            Fonctionnalités
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Pensé pour le métier, pas pour la plaquette
          </h2>
        </div>

        <div className="mt-16 space-y-20">
          {usages.map((u, i) => (
            <div
              key={u.titre}
              className={`reveal grid items-center gap-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="min-w-0 max-w-lg">
                <h3 className="text-balance text-2xl font-semibold tracking-tight text-ink-900">
                  {u.titre}
                </h3>
                <p className="mt-3 text-pretty text-[15px] leading-relaxed text-ink-500">
                  {u.texte}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {u.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-700"
                    >
                      <Check
                        size={17}
                        strokeWidth={2.25}
                        className="mt-1 shrink-0 text-gold-700"
                        aria-hidden="true"
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <Capture
                fichier={u.fichier}
                ecran={u.ecran}
                legende={u.legende}
                ratio={u.ratio}
                className="min-w-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ——— Différenciation ——— */}
    <section className="border-y border-ink-200 bg-ink-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="reveal">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-gold-700">
              La différence
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Ce que Noltan n'est pas
            </h2>
            <ul className="mt-8 space-y-4">
              {ceNoltanNestPas.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-700"
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-200/70 text-ink-500"
                    aria-hidden="true"
                  >
                    <X size={13} strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal rounded-2xl border border-gold-300 bg-white p-8">
            <h3 className="text-xl font-semibold tracking-tight text-ink-900">Ce qu'il est</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
              Un fil continu entre les informations, les rendez-vous, les documents, les actions et
              le suivi — conçu dès le premier jour en fonction des spécificités métier des cabinets
              de gestion de patrimoine.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Le dossier alimente le rendez-vous, le rendez-vous alimente les documents",
                "Chaque opération laisse une trace, du premier échange à la mise en place",
                "L'outil structure et prépare — le conseil reste entièrement le vôtre",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-700"
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700"
                    aria-hidden="true"
                  >
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* ——— Confiance : sécurité, contrôle, accompagnement ——— */}
    <section id="confiance" className="scroll-mt-16 bg-ink-950 py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-gold-300">
            Confiance
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Les données de vos clients méritent mieux qu'un cloud opaque
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-ink-400">
            Vos dossiers sont enregistrés sur votre poste, et n'en partent pas : il n'existe aucun
            serveur Noltan où ils seraient envoyés. Seuls les services que vous activez — votre
            compte Google, vos extranets — reçoivent les informations nécessaires à leur
            fonctionnement.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {confiance.map((c) => (
            <div key={c.titre} className="reveal rounded-2xl border border-white/10 bg-white/5 p-7">
              <c.icone size={22} strokeWidth={2} className="text-gold-300" aria-hidden="true" />
              <h3 className="mt-4 text-[15px] font-semibold">{c.titre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{c.texte}</p>
            </div>
          ))}
        </div>

        {/* Détail des accès Google : transparence exigée par la vérification OAuth */}
        <div className="reveal mt-5 rounded-2xl border border-gold-300/20 bg-gold-500/5 p-7">
          <h3 className="text-[15px] font-semibold text-gold-100">
            Ce que Noltan fait — et ne fait pas — avec votre compte Google
          </h3>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-white">
                Agenda <span className="font-normal text-ink-400">(calendar.events)</span>
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                Créer, modifier et supprimer <em>uniquement</em> les événements planifiés depuis
                Noltan. Afficher votre planning de la journée pour empêcher tout chevauchement de
                créneaux.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                E-mail <span className="font-normal text-ink-400">(gmail.send)</span>
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                Envoyer vos comptes rendus depuis votre adresse, à votre demande explicite. Noltan
                ne lit jamais votre boîte de réception et n'envoie rien sans votre clic.
              </p>
            </div>
          </div>
          <a
            href={lien("/confidentialite/")}
            className="mt-6 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gold-300 transition-colors duration-200 hover:text-gold-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
          >
            Lire la politique de confidentialité
            <ArrowRight size={15} strokeWidth={2.25} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    {/* ——— Fin de page : la démonstration, concrètement ——— */}
    <section className="bg-white py-24">
      <div className="reveal mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Découvrez Noltan sur un <span className="accent-serif">vrai</span> dossier
        </h2>
        <p className="mt-5 text-pretty text-base leading-relaxed text-ink-500">
          La démonstration se fait en visio, sur un cas concret proche de votre pratique : de
          l'arrivée d'un prospect à l'envoi du compte rendu. Vous posez vos questions, vous voyez
          l'outil réel — pas des diapositives. Elle s'adresse aux CGP indépendants et aux petites
          structures.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={LIEN_DEMO} size="lg">
            {SITE.libelleDemo}
          </ButtonLink>
          <ButtonLink href={lien("/demo/")} variant="secondary" size="lg">
            Comment se passe la démo ?
          </ButtonLink>
        </div>
        <p className="mt-5 text-[13px] text-ink-500">
          Une simple demande par e-mail — nous revenons vers vous rapidement avec des créneaux.
        </p>
      </div>
    </section>
  </PageShell>
);

export default Accueil;
