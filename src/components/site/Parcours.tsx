import type React from "react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Capture } from "./Capture";

interface Etape {
  titre: string;
  resume: string;
  detail: string;
  fichier: string;
  ecran: string;
  ratio?: string;
}

const etapes: Etape[] = [
  {
    titre: "Un prospect arrive, son dossier se construit",
    resume: "Une fiche qui fait référence : situation, patrimoine, échanges.",
    detail:
      "Identité, situation familiale, patrimoine, prochain rendez-vous et tâches en cours : la fiche client rassemble tout. Les informations déjà saisies chez vos partenaires s'importent au lieu de se recopier.",
    fichier: "synthese-client.webp",
    ecran: "Fiche client — synthèse du dossier",
  },
  {
    titre: "Le rendez-vous se prépare en un instant",
    resume: "Date, type, intitulé — et l'événement Google Calendar en un clic.",
    detail:
      "Depuis la fiche du client : un créneau, un type de rendez-vous, et le bouton « Créer + Google Calendar » pose l'événement dans votre agenda. La date peut même rester vide et se fixer plus tard.",
    fichier: "preparation-rdv.webp",
    ecran: "Planification d'un rendez-vous",
  },
  {
    titre: "Le rendez-vous se déroule, les notes restent",
    resume: "Notes et décisions s'écrivent dans la fiche, reliées au dossier.",
    detail:
      "Tout s'enregistre automatiquement pendant que vous tapez : notes libres, décisions prises, tâches liées. Les opérations du client restent sous les yeux, et le compte rendu se prépare depuis la même fiche.",
    fichier: "fiche-rdv.webp",
    ecran: "Fiche rendez-vous — notes et décisions",
  },
  {
    titre: "Les documents se remplissent depuis le dossier",
    resume: "Vos modèles remplis automatiquement, avec contrôles avant génération.",
    detail:
      "Lettre de mission, déclarations d'adéquation : les champs se remplissent depuis le dossier — ici, 21 champs chargés d'un coup — et les contrôles signalent ce qui manque avant de générer. « Prêt » veut dire prêt.",
    fichier: "generation-documents.webp",
    ecran: "Génération de documents",
  },
  {
    titre: "Le client est suivi, les prochaines actions aussi",
    resume: "Les tâches de la semaine, par dossier, avec leurs échéances.",
    detail:
      "Chaque opération garde son statut — présentée, acceptée, signée, en place — et chaque tâche son échéance. Le tableau de bord remonte ce qui doit être fait cette semaine, dossier par dossier.",
    fichier: "taches-a-faire.webp",
    ecran: "Tâches de la semaine",
    ratio: "1730/520",
  },
];

/** Fil conducteur interactif : de la prise de contact au suivi du client. */
export const Parcours: React.FC = () => {
  const [actif, setActif] = useState(0);
  const panneauRef = useRef<HTMLDivElement>(null);
  const etape = etapes[actif];

  const choisir = (i: number) => {
    setActif(i);
    // Sur mobile, le panneau est sous la liste : on l'amène à l'écran pour
    // que le changement soit visible (comportement natif si mouvement réduit).
    if (window.innerWidth < 1024) {
      panneauRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
      {/* Liste des étapes */}
      <div>
        <p className="mb-3 px-5 text-[13px] font-medium text-ink-500">
          Cliquez sur une étape pour voir l'écran correspondant
        </p>
        <ol className="space-y-1.5">
          {etapes.map((e, i) => {
            const estActif = i === actif;
            return (
              <li key={e.titre}>
                <button
                  type="button"
                  onClick={() => choisir(i)}
                  aria-current={estActif ? "step" : undefined}
                  className={cn(
                    "group flex w-full cursor-pointer items-baseline gap-4 rounded-xl border px-5 py-3.5 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
                    estActif
                      ? "border-gold-300 bg-gold-50 shadow-sm"
                      : "border-transparent hover:border-ink-200 hover:bg-white",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums transition-colors duration-200",
                      estActif ? "text-gold-700" : "text-ink-500 group-hover:text-ink-700",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-[15px] font-semibold transition-colors duration-200",
                        estActif ? "text-ink-900" : "text-ink-700 group-hover:text-ink-900",
                      )}
                    >
                      {e.titre}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 block text-sm leading-relaxed transition-colors duration-200",
                        estActif ? "text-ink-700" : "text-ink-500",
                      )}
                    >
                      {e.resume}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Panneau de la capture active */}
      <div ref={panneauRef} className="scroll-mt-20 lg:sticky lg:top-24" aria-live="polite">
        <Capture
          key={etape.fichier}
          fichier={etape.fichier}
          ecran={etape.ecran}
          ratio={etape.ratio}
        />
        <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-ink-700">
          <span className="font-semibold text-ink-900">
            Étape {actif + 1} sur {etapes.length} —{" "}
          </span>
          {etape.detail}
        </p>
      </div>
    </div>
  );
};
