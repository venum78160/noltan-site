import { Check, ListChecks, MessagesSquare, Video } from "lucide-react";
import type React from "react";
import { Capture } from "@/components/site/Capture";
import { PageShell } from "@/components/site/PageShell";
import { ButtonLink } from "@/components/ui/button";
import { LIEN_DEMO, RDV_EN_LIGNE, SITE } from "@/lib/site";
import { lien } from "@/lib/utils";

const deroulement = [
  {
    icone: Video,
    titre: "En visio, sur l'outil réel",
    texte:
      "Pas de diapositives : vous voyez Plutus fonctionner en direct, sur un dossier exemple proche de votre pratique.",
  },
  {
    icone: ListChecks,
    titre: "Le parcours complet",
    texte:
      "De l'arrivée d'un prospect à l'envoi du compte rendu : import des informations, préparation du rendez-vous, génération des documents, suivi.",
  },
  {
    icone: MessagesSquare,
    titre: "Vos questions, vos cas particuliers",
    texte:
      "Vos modèles de documents, vos extranets, votre organisation : on regarde ensemble comment Plutus s'adapte à votre cabinet.",
  },
];

const pourQui = [
  "CGP indépendants qui veulent structurer leur activité sans usine à gaz",
  "Petites structures qui partagent des dossiers entre plusieurs conseillers",
  "Cabinets qui souhaitent garder leurs données chez eux, pas dans un cloud tiers",
];

const Demo: React.FC = () => (
  <PageShell>
    <section className="border-b border-ink-200 bg-ink-50 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-gold-700">
          Démonstration
        </p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          Voir Plutus fonctionner, avant de l'adopter
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-500">
          Une démonstration personnalisée, en visio, guidée par l'éditeur de l'outil. Sans
          engagement et sans préparation de votre côté.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <ButtonLink href={LIEN_DEMO} size="lg">
            {SITE.libelleDemo}
          </ButtonLink>
          {SITE.dureeDemo && <p className="text-[13px] text-ink-500">Durée : {SITE.dureeDemo}</p>}
          <p className="text-[13px] text-ink-500">
            {RDV_EN_LIGNE ? (
              <>Choisissez directement un créneau dans l'agenda — sans engagement.</>
            ) : (
              <>
                Le bouton ouvre un e-mail pré-rempli : indiquez vos disponibilités, nous revenons
                vers vous rapidement. Vous pouvez aussi écrire directement à{" "}
                <a
                  href={`mailto:${SITE.emailContact}`}
                  className="cursor-pointer font-medium text-gold-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
                >
                  {SITE.emailContact}
                </a>
                .
              </>
            )}
          </p>
          <p className="text-[13px] text-ink-500">
            Aucun prérequis : pas d'installation ni de préparation nécessaires de votre côté.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {deroulement.map((d) => (
            <div key={d.titre} className="reveal rounded-2xl border border-ink-200 p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                <d.icone size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-[15px] font-semibold text-ink-900">{d.titre}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{d.texte}</p>
            </div>
          ))}
        </div>

        <div className="reveal mt-16 grid items-center gap-10 lg:grid-cols-2">
          <div className="min-w-0 max-w-lg">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-ink-900">
              À qui s'adresse la démonstration ?
            </h2>
            <ul className="mt-6 space-y-3">
              {pourQui.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-700"
                >
                  <Check
                    size={17}
                    strokeWidth={2.25}
                    className="mt-1 shrink-0 text-gold-700"
                    aria-hidden="true"
                  />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-ink-500">
              Vous préférez essayer par vous-même ? L'application se{" "}
              <a
                href={lien("/telechargement/")}
                className="cursor-pointer font-medium text-gold-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
              >
                télécharge ici
              </a>
              .
            </p>
          </div>
          <Capture
            fichier="synthese-client.webp"
            ecran="Fiche client complète"
            legende="Ce que vous verrez pendant la démonstration : l'outil réel, sur un dossier exemple."
            className="min-w-0"
          />
        </div>
      </div>
    </section>
  </PageShell>
);

export default Demo;
