import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  MonitorCheck,
  ShieldAlert,
} from "lucide-react";
import React from "react";
import { PageShell } from "@/components/site/PageShell";
import { ButtonLink } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { lien } from "@/lib/utils";
import { type InfosVersion, recupererVersion } from "@/lib/version";

const prerequis = [
  "Windows 10 ou 11 (64 bits)",
  "Microsoft Word ou LibreOffice (pour la conversion des documents en PDF)",
  "Un navigateur récent (Edge ou Chrome) pour l'affichage de l'application",
];

const etapesInstallation = [
  {
    titre: "Téléchargez l'installeur",
    texte:
      "Cliquez sur le bouton ci-dessus : le fichier d'installation s'enregistre dans vos téléchargements.",
  },
  {
    titre: "Lancez l'installation",
    texte:
      "Double-cliquez sur le fichier téléchargé et laissez-vous guider : l'installation prend moins d'une minute.",
  },
  {
    titre: "Ouvrez Noltan",
    texte:
      "Un raccourci est créé sur votre bureau. Au premier lancement, l'assistant de bienvenue configure le cabinet pas à pas.",
  },
];

/**
 * État de la récupération de version.json (côté navigateur) :
 * numéro affiché et lien de téléchargement proviennent du MÊME objet validé.
 * En cas d'échec : aucun numéro, aucun lien direct — repli honnête vers la
 * page des releases (jamais une ancienne version présentée comme actuelle).
 */
type EtatVersion =
  | { statut: "chargement" }
  | { statut: "ok"; infos: InfosVersion }
  | { statut: "echec" };

const Telechargement: React.FC = () => {
  const [etat, setEtat] = React.useState<EtatVersion>({ statut: "chargement" });

  React.useEffect(() => {
    let actif = true;
    recupererVersion().then((infos) => {
      if (actif) setEtat(infos ? { statut: "ok", infos } : { statut: "echec" });
    });
    return () => {
      actif = false;
    };
  }, []);

  return (
    <PageShell>
      <section className="border-b border-ink-200 bg-ink-50 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-gold-700">
            Téléchargement
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            Installez Noltan sur votre poste
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-500">
            {etat.statut === "ok" ? `Version ${etat.infos.version} pour Windows.` : "Pour Windows."}{" "}
            L'application s'installe localement : vos données ne quittent jamais votre cabinet.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3" aria-live="polite">
            {etat.statut === "chargement" && (
              <>
                <span
                  aria-busy="true"
                  className="inline-flex h-12 cursor-progress items-center justify-center gap-2 rounded-full bg-ink-900/60 px-7 text-[15px] font-semibold text-white"
                >
                  <Download size={17} strokeWidth={2.25} aria-hidden="true" />
                  Télécharger Noltan pour Windows
                </span>
                <p className="text-[13px] text-ink-500">Vérification de la dernière version…</p>
              </>
            )}

            {etat.statut === "ok" && (
              <>
                <ButtonLink href={etat.infos.urlExe} size="lg" download>
                  <Download size={17} strokeWidth={2.25} aria-hidden="true" />
                  {`Télécharger Noltan ${etat.infos.version} pour Windows`}
                </ButtonLink>
                <p className="text-[13px] text-ink-500">Fichier .exe · {SITE.poidsInstalleur}</p>
                {etat.infos.notes && (
                  <p className="max-w-xl text-[13px] leading-relaxed text-ink-500">
                    Nouveautés de la version {etat.infos.version} : {etat.infos.notes}{" "}
                    <a
                      href={etat.infos.urlRelease}
                      className="cursor-pointer font-medium text-gold-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
                    >
                      Détail de la release
                    </a>
                  </p>
                )}
              </>
            )}

            {etat.statut === "echec" && (
              <>
                <ButtonLink href={SITE.urlReleases} size="lg">
                  <ExternalLink size={17} strokeWidth={2.25} aria-hidden="true" />
                  Ouvrir la dernière version sur GitHub
                </ButtonLink>
                <p className="mx-auto max-w-md text-[13px] leading-relaxed text-ink-500">
                  La vérification automatique de la dernière version n'a pas abouti — plutôt que
                  d'afficher un numéro potentiellement périmé, nous vous dirigeons vers la page
                  officielle des téléchargements, toujours à jour.
                </p>
              </>
            )}

            <p className="text-sm text-ink-500">
              Vous découvrez Noltan ?{" "}
              <a
                href={lien("/demo/")}
                className="cursor-pointer font-medium text-gold-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
              >
                Commencez par une démonstration
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-5xl gap-5 px-6 lg:grid-cols-2">
          {/* Prérequis */}
          <div className="reveal rounded-2xl border border-ink-200 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                <MonitorCheck size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <h2 className="text-[15px] font-semibold text-ink-900">Configuration requise</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {prerequis.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700"
                >
                  <CheckCircle2
                    size={17}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0 text-gold-600"
                    aria-hidden="true"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Avertissement SmartScreen */}
          <div className="reveal rounded-2xl border border-gold-300 bg-gold-50 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gold-700">
                <ShieldAlert size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <h2 className="text-[15px] font-semibold text-ink-900">
                Windows affiche un avertissement ?
              </h2>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-ink-700">
              C'est normal : Windows SmartScreen signale les applications récentes encore peu
              téléchargées, sans que cela indique un danger. Pour poursuivre l'installation :
            </p>
            <ol className="mt-4 list-inside list-decimal space-y-2 text-sm leading-relaxed text-ink-700">
              <li>
                Cliquez sur <strong>« Informations complémentaires »</strong> dans la fenêtre bleue
                ;
              </li>
              <li>
                puis sur <strong>« Exécuter quand même »</strong>.
              </li>
            </ol>
          </div>
        </div>

        {/* Étapes d'installation */}
        <div className="mx-auto mt-5 max-w-5xl px-6">
          <div className="reveal rounded-2xl border border-ink-200 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                <FileText size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <h2 className="text-[15px] font-semibold text-ink-900">
                Installation en trois étapes
              </h2>
            </div>
            <ol className="mt-6 grid gap-6 md:grid-cols-3">
              {etapesInstallation.map((e, i) => (
                <li key={e.titre}>
                  <span className="text-sm font-semibold tabular-nums text-gold-600">0{i + 1}</span>
                  <h3 className="mt-1.5 text-sm font-semibold text-ink-900">{e.titre}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{e.texte}</p>
                </li>
              ))}
            </ol>
          </div>

          <p className="reveal mt-8 text-center text-sm text-ink-500">
            Une question, un blocage à l'installation ?{" "}
            <a
              href={`mailto:${SITE.emailContact}`}
              className="cursor-pointer font-medium text-gold-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
            >
              Écrivez-nous
            </a>
            , nous répondons rapidement.
          </p>
        </div>
      </section>
    </PageShell>
  );
};

export default Telechargement;
