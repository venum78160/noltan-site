import { Download, Mail } from "lucide-react";
import type React from "react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { type Appareil, appareilVisiteur, suivre, systemeVisiteur } from "@/lib/mesure";
import { SITE } from "@/lib/site";
import { lien } from "@/lib/utils";
import type { InfosVersion } from "@/lib/version";

interface FormulaireTelechargementProps {
  /** Version publiée : le bouton final en dépend, exactement comme sans formulaire. */
  infos: InfosVersion;
  /** Le bouton de téléchargement réel, rendu une fois le formulaire envoyé. */
  bouton: React.ReactNode;
}

type Etat = { statut: "saisie" } | { statut: "envoi" } | { statut: "pret"; envoye: boolean };

/**
 * Champs du formulaire. Les noms sont ceux des attributs de contact attendus
 * par Brevo (EMAIL, PRENOM, NOM…) : ils doivent exister dans le formulaire
 * créé côté Brevo, sans quoi la valeur est ignorée.
 */
const CHAMPS = [
  { nom: "PRENOM", libelle: "Prénom", type: "text", autocomplete: "given-name", requis: true },
  { nom: "NOM", libelle: "Nom", type: "text", autocomplete: "family-name", requis: true },
  {
    nom: "EMAIL",
    libelle: "E-mail professionnel",
    type: "email",
    autocomplete: "email",
    requis: true,
  },
  { nom: "CABINET", libelle: "Cabinet", type: "text", autocomplete: "organization", requis: false },
] as const;

const classeChamp =
  "mt-1.5 h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 disabled:opacity-60";

const classeLien =
  "cursor-pointer font-medium text-gold-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

/**
 * Encadré « Recevez Noltan » qui précède le bouton de téléchargement quand
 * SITE.formulaireTelechargement est renseigné.
 * - Le contact part dans Brevo (adresse de réception du formulaire, envoi
 *   AJAX comme le code d'intégration officiel) et le lien de téléchargement
 *   s'affiche AUSSITÔT — il part aussi par e-mail (automatisation Brevo).
 * - Un échec d'envoi (réseau, Brevo indisponible, champ inconnu) ne bloque
 *   jamais le téléchargement : le bouton apparaît, le message le dit, et
 *   l'événement `formulaire_erreur` le rend visible dans la mesure d'audience.
 * - Depuis un téléphone (installation impossible), l'e-mail devient le service
 *   rendu : « Recevoir le lien sur mon ordinateur ».
 * - Champ piège `email_address_check`, invisible et toujours vide : un robot
 *   qui remplit tout est écarté par Brevo.
 */
export const FormulaireTelechargement: React.FC<FormulaireTelechargementProps> = ({
  infos,
  bouton,
}) => {
  const [etat, setEtat] = useState<Etat>({ statut: "saisie" });
  const [appareil] = useState<Appareil>(appareilVisiteur);
  const idBase = useId();
  const mobile = appareil === "mobile";

  useEffect(() => {
    suivre("formulaire_affiche", { appareil });
  }, [appareil]);

  const envoyer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const donnees = new FormData(e.currentTarget);
    // Contexte utile au suivi de l'essai, dans un seul champ texte (facultatif côté Brevo).
    donnees.set("SOURCE", `noltan.fr · ${systemeVisiteur()} · ${appareil} · v${infos.version}`);
    setEtat({ statut: "envoi" });
    let envoye = false;
    try {
      const url = new URL(SITE.formulaireTelechargement);
      url.searchParams.set("isAjax", "1");
      const reponse = await fetch(url, { method: "POST", body: donnees });
      envoye = reponse.ok;
    } catch {
      envoye = false;
    }
    // Le téléchargement n'attend jamais l'outil de suivi : le bouton apparaît dans tous les cas.
    suivre(envoye ? "formulaire_envoye" : "formulaire_erreur", { appareil });
    setEtat({ statut: "pret", envoye });
  };

  if (etat.statut === "pret") {
    return (
      <div className="flex flex-col items-center gap-3">
        {bouton}
        <p
          className="max-w-md text-[13px] leading-relaxed text-ink-500"
          data-formulaire-resultat={etat.envoye ? "envoye" : "erreur"}
        >
          {etat.envoye
            ? mobile
              ? "Le lien est aussi dans votre boîte e-mail : ouvrez-le depuis votre ordinateur pour installer Noltan."
              : "Nous vous avons aussi envoyé le lien par e-mail, pour le retrouver plus tard."
            : "Le lien n'a pas pu vous être envoyé par e-mail : téléchargez directement ci-dessus, et écrivez-nous en cas de besoin."}
        </p>
      </div>
    );
  }

  const envoi = etat.statut === "envoi";
  return (
    <form
      method="POST"
      action={SITE.formulaireTelechargement}
      onSubmit={envoyer}
      data-formulaire="telechargement"
      className="relative w-full max-w-xl rounded-2xl border border-ink-200 bg-white p-6 text-left shadow-sm sm:p-7"
    >
      <h2 className="text-[15px] font-semibold text-ink-900">Recevez Noltan {infos.version}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
        {mobile
          ? "Noltan s'installe sur un ordinateur : indiquez votre adresse, nous vous envoyons le lien à ouvrir depuis votre poste."
          : "Dites-nous qui vous êtes : le lien s'affiche aussitôt, et vous le recevez aussi par e-mail."}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {CHAMPS.map((c) => (
          <div key={c.nom} className={c.nom === "EMAIL" ? "sm:col-span-2" : undefined}>
            <label
              htmlFor={`${idBase}-${c.nom}`}
              className="block text-[13px] font-medium text-ink-700"
            >
              {c.libelle}
              {!c.requis && <span className="font-normal text-ink-500"> (facultatif)</span>}
            </label>
            <input
              id={`${idBase}-${c.nom}`}
              name={c.nom}
              type={c.type}
              autoComplete={c.autocomplete}
              required={c.requis}
              disabled={envoi}
              className={classeChamp}
            />
          </div>
        ))}
      </div>

      {/* Champ piège de Brevo : hors écran, jamais rempli par une personne. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input type="text" name="email_address_check" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="locale" value="fr" />

      <div className="mt-5 flex flex-col items-center gap-3">
        <Button type="submit" size="lg" disabled={envoi} className="w-full sm:w-auto">
          {mobile ? (
            <Mail size={17} strokeWidth={2.25} aria-hidden="true" />
          ) : (
            <Download size={17} strokeWidth={2.25} aria-hidden="true" />
          )}
          {envoi
            ? "Un instant…"
            : mobile
              ? "Recevoir le lien sur mon ordinateur"
              : `Télécharger Noltan ${infos.version} pour Windows`}
        </Button>
        <p className="text-center text-[13px] leading-relaxed text-ink-500">
          Nous vous écrirons au sujet de votre essai et des nouveautés de Noltan ; désinscription en
          un clic dans chaque message.{" "}
          <a href={lien("/confidentialite/")} className={classeLien}>
            Politique de confidentialité
          </a>
        </p>
      </div>
    </form>
  );
};
