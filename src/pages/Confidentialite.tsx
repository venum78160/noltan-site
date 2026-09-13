import type React from "react";
import { PageShell } from "@/components/site/PageShell";
import { FORMULAIRE_ACTIF, MESURE_ACTIVE, RDV_EN_LIGNE, SITE } from "@/lib/site";

/** Sous-sections du point 3, numérotées dans l'ordre de celles qui sont branchées (site.ts). */
const SOUS_SECTIONS = [
  ["rdv", RDV_EN_LIGNE],
  ["telechargement", FORMULAIRE_ACTIF],
  ["mesure", MESURE_ACTIVE],
] as const;
type SousSection = (typeof SOUS_SECTIONS)[number][0];
const presentes = SOUS_SECTIONS.filter(([, active]) => active).map(([nom]) => nom);
const numero = (nom: SousSection) => `3.${presentes.indexOf(nom) + 1}`;

/** « a, b ou c » — ou « a » seul. */
const enumerer = (elements: (string | false)[]) => {
  const l = elements.filter((e): e is string => typeof e === "string");
  return l.length <= 1 ? l.join("") : `${l.slice(0, -1).join(", ")} ou ${l[l.length - 1]}`;
};

const formulaires = [
  RDV_EN_LIGNE && `la prise de rendez-vous (point ${numero("rdv")})`,
  FORMULAIRE_ACTIF && `la demande de téléchargement (point ${numero("telechargement")})`,
].filter((f): f is string => typeof f === "string");
const phraseFormulaires =
  formulaires.length === 0
    ? "Il ne comporte aucun formulaire de collecte."
    : formulaires.length === 1
      ? `Son seul formulaire est ${formulaires[0]}.`
      : `Ses seuls formulaires sont ${formulaires.join(" et ")}.`;

const Confidentialite: React.FC = () => (
  <PageShell>
    <section className="border-b border-ink-200 bg-ink-50 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-gold-700">Légal</p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Politique de confidentialité
        </h1>
        <p className="mt-3 text-sm text-ink-500">Dernière mise à jour : {SITE.derniereMajLegale}</p>
      </div>
    </section>

    <section className="bg-white py-14">
      <div className="prose prose-slate mx-auto max-w-3xl px-6 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-gold-700 prose-strong:text-ink-900">
        <p>
          Cette politique décrit les données traitées par l'application de bureau{" "}
          <strong>Noltan</strong> et par le présent site ({SITE.url}), édités par {SITE.editeur}.
          Elle s'adresse aux professionnels du conseil en gestion de patrimoine qui utilisent
          l'application.
        </p>

        <h2>1. Le principe : une application locale</h2>
        <p>
          Noltan est un logiciel installé sur l'ordinateur de l'utilisateur. Il ne s'appuie sur{" "}
          <strong>aucun serveur de l'éditeur</strong> : les dossiers clients, documents générés,
          comptes rendus, paramètres et historiques sont stockés exclusivement sur le poste de
          l'utilisateur, dans des dossiers qu'il maîtrise.
        </p>
        <ul>
          <li>L'éditeur de Noltan n'a accès à aucune donnée saisie dans l'application.</li>
          <li>
            Aucune donnée n'est collectée, transmise, revendue ou utilisée à des fins publicitaires.
          </li>
          <li>
            Les sauvegardes créées par l'application sont chiffrées localement ; la clé de
            chiffrement reste sur le poste de l'utilisateur.
          </li>
          <li>
            L'utilisateur professionnel demeure seul responsable de traitement, au sens du RGPD, des
            données de ses propres clients qu'il saisit dans l'application.
          </li>
          <li>
            Au démarrage, l'application vérifie uniquement si une nouvelle version est disponible
            (comparaison de numéros de version) ; aucune donnée client n'est transmise à cette
            occasion.
          </li>
        </ul>

        <h2>2. Données Google (connexion facultative)</h2>
        <p>
          Noltan propose une connexion facultative au compte Google de l'utilisateur, via le
          protocole OAuth 2.0 de Google, afin de rendre deux services précis. L'utilisateur peut
          refuser cette connexion : l'application fonctionne sans.
        </p>

        <h3>2.1 Accès demandés et usage exact</h3>
        <ul>
          <li>
            <strong>Agenda</strong> (portée <code>calendar.events</code>) : Noltan crée, modifie et
            supprime uniquement les événements correspondant aux rendez-vous planifiés dans
            l'application (titre, date, lien de visioconférence, invitation du client), et lit les
            événements du jour pour afficher un aperçu de la journée et éviter les conflits
            d'horaires.
          </li>
          <li>
            <strong>Envoi d'e-mails</strong> (portée <code>gmail.send</code>) : Noltan envoie, à la
            demande explicite de l'utilisateur (clic sur un bouton d'envoi), des e-mails rédigés
            dans l'application — typiquement le compte rendu d'un rendez-vous — depuis l'adresse de
            l'utilisateur. <strong>Noltan ne lit jamais la boîte de réception</strong>, n'accède à
            aucun e-mail reçu et n'envoie aucun message sans action de l'utilisateur.
          </li>
        </ul>

        <h3>2.2 Stockage et partage</h3>
        <ul>
          <li>
            Les échanges avec les services Google se font en HTTPS, directement entre le poste de
            l'utilisateur et Google, sans intermédiaire.
          </li>
          <li>
            Les jetons d'accès Google sont stockés localement sur le poste de l'utilisateur et ne
            sont jamais transmis à l'éditeur ni à des tiers.
          </li>
          <li>
            Les données obtenues via les API Google (événements d'agenda) sont utilisées uniquement
            pour afficher et gérer les rendez-vous dans l'application ; elles ne sont ni revendues,
            ni utilisées à des fins publicitaires, ni transférées à des tiers.
          </li>
          <li>
            Aucune donnée Google n'est utilisée pour entraîner des modèles d'intelligence
            artificielle.
          </li>
        </ul>

        <h3>2.3 Engagement « Limited Use »</h3>
        <p>
          L'utilisation par Noltan des informations reçues des API Google est conforme aux{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noreferrer"
          >
            Règles relatives aux données utilisateur des services d'API Google
          </a>
          , y compris les exigences d'utilisation limitée (<em>Limited Use requirements</em>).
        </p>

        <h3>2.4 Révocation</h3>
        <p>L'utilisateur peut couper l'accès de Noltan à son compte Google à tout moment :</p>
        <ul>
          <li>depuis les réglages de l'application (bouton « Déconnecter le compte Google ») ;</li>
          <li>
            ou depuis les paramètres de sécurité de son compte Google (
            <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">
              myaccount.google.com/permissions
            </a>
            ).
          </li>
        </ul>

        <h2>3. Données collectées par ce site</h2>
        <p>
          Le site {SITE.url} est un site vitrine statique : il ne dépose{" "}
          <strong>aucun cookie de suivi</strong> et n'embarque aucun outil publicitaire
          {MESURE_ACTIVE
            ? ` ; sa fréquentation est mesurée sans cookie (point ${numero("mesure")}).`
            : "."}{" "}
          {phraseFormulaires} Les journaux techniques standards de l'hébergeur (adresses IP, pages
          consultées) sont conservés par celui-ci pour la sécurité et supprimés selon ses délais
          légaux.
        </p>
        {RDV_EN_LIGNE && (
          <>
            <h3>{numero("rdv")} Prise de rendez-vous pour une démonstration</h3>
            <p>
              Le calendrier de réservation de la page de démonstration est fourni par{" "}
              <strong>Calendly</strong> (Calendly LLC, États-Unis) et n'est chargé que sur cette
              page. En réservant un créneau, vous communiquez votre nom, votre adresse e-mail et, si
              vous le souhaitez, le nom de votre cabinet, le nombre de conseillers et un message
              pour préparer la démonstration. Ces données servent uniquement à organiser le
              rendez-vous demandé (mesures précontractuelles prises à votre demande, article 6.1.b
              du RGPD) ; sans suite de votre part, elles sont supprimées au plus tard six mois après
              le dernier échange. Calendly les traite pour le compte de l'éditeur et peut les
              héberger hors de l'Union européenne, avec les garanties prévues par le RGPD (clauses
              contractuelles types). Le calendrier dépose les cookies nécessaires à son
              fonctionnement ; son bandeau d'information est masqué ici pour ne pas gêner la
              réservation, et les traitements propres à Calendly sont décrits dans sa{" "}
              <a href="https://calendly.com/legal/privacy-notice" target="_blank" rel="noreferrer">
                politique de confidentialité
              </a>
              . Vous pouvez toujours demander une démonstration par simple e-mail à{" "}
              <a href={`mailto:${SITE.emailContact}`}>{SITE.emailContact}</a>, sans passer par le
              calendrier.
            </p>
          </>
        )}
        {FORMULAIRE_ACTIF && (
          <>
            <h3>{numero("telechargement")} Demande de téléchargement de l'application</h3>
            <p>
              Avant de télécharger l'application, vous indiquez votre prénom, votre nom, votre
              adresse e-mail professionnelle et, si vous le souhaitez, le nom de votre cabinet. Ces
              données servent à vous remettre le lien de téléchargement (affiché aussitôt, et envoyé
              par e-mail), à vous accompagner pendant votre essai, puis à vous informer des
              évolutions de Noltan — dont la fin de la période d'essai gratuite et les conditions de
              licence. Le premier usage relève des mesures précontractuelles prises à votre demande
              (article 6.1.b du RGPD) ; l'information sur Noltan relève de l'intérêt légitime de
              l'éditeur à présenter son outil aux professionnels concernés (article 6.1.f) : chaque
              message comporte un lien de désinscription, et vous pouvez vous y opposer à tout
              moment. Les données sont enregistrées, et les e-mails envoyés, par{" "}
              <strong>Brevo</strong> (société française établie à Paris), qui les héberge dans
              l'Union européenne et les traite pour le compte de l'éditeur. Sans suite de votre
              part, elles sont supprimées au plus tard trois ans après le dernier échange. Elles ne
              sont transmises à aucun autre tiers. Le lien de téléchargement s'affiche même si cet
              enregistrement échoue.
            </p>
          </>
        )}
        {MESURE_ACTIVE && (
          <>
            <h3>{numero("mesure")} Mesure d'audience, sans cookie</h3>
            <p>
              Pour connaître la fréquentation du site (pages consultées, provenance, type d'appareil
              et de système) et ce qui est utile aux visiteurs, le site utilise{" "}
              <strong>Umami</strong> (Umami Software, Inc.), un outil de mesure d'audience{" "}
              <strong>sans cookie</strong>, configuré pour héberger ses données dans l'Union
              européenne : rien n'est déposé ni lu sur votre appareil, aucun identifiant n'est
              conservé, et l'adresse IP n'est utilisée qu'au moment de la visite pour former une
              statistique agrégée, sans être enregistrée. Les données, anonymes, ne sont croisées
              avec aucun autre traitement et ne sont transmises à personne. Les gestes comptés sont
              eux aussi anonymes : clic sur un bouton de téléchargement, de demande de démonstration
              ou de contact, étapes de la prise de rendez-vous — jamais ce que vous saisissez. Ce
              traitement repose sur l'intérêt légitime de l'éditeur à connaître l'audience de son
              site (article 6.1.f du RGPD) ; il ne nécessite pas de bandeau de consentement.
            </p>
          </>
        )}

        <h2>4. Licences et échanges avec l'éditeur</h2>
        <p>
          Lorsqu'un utilisateur contacte l'éditeur (
          {enumerer([
            "par e-mail",
            RDV_EN_LIGNE && "en réservant une démonstration",
            FORMULAIRE_ACTIF && "en demandant à télécharger l'application",
          ])}
          ) ou souscrit une licence, l'éditeur traite les seules données nécessaires à cette
          relation : nom, adresse e-mail, cabinet et informations de facturation le cas échéant. Ces
          données ne sont jamais cédées à des tiers et sont conservées pendant la durée de la
          relation commerciale, puis les durées légales applicables.
        </p>

        <h2>5. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez de droits d'accès, de rectification, d'effacement,
          d'opposition et de portabilité sur les données que l'éditeur détient à votre sujet (cf.
          section 4). Pour les exercer, écrivez à{" "}
          <a href={`mailto:${SITE.emailContact}`}>{SITE.emailContact}</a>. Vous pouvez également
          saisir la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
            cnil.fr
          </a>
          ).
        </p>

        <h2>6. Contact</h2>
        <p>
          Pour toute question relative à cette politique :{" "}
          <a href={`mailto:${SITE.emailContact}`}>{SITE.emailContact}</a>.
        </p>
      </div>
    </section>
  </PageShell>
);

export default Confidentialite;
