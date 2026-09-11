import type React from "react";
import { PageShell } from "@/components/site/PageShell";
import { RDV_EN_LIGNE, SITE } from "@/lib/site";

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
          <strong>aucun cookie de suivi</strong> et n'embarque aucun outil publicitaire.{" "}
          {RDV_EN_LIGNE
            ? "Son seul formulaire est la prise de rendez-vous décrite au point 3.1."
            : "Il ne comporte aucun formulaire de collecte."}{" "}
          Les journaux techniques standards de l'hébergeur (adresses IP, pages consultées) sont
          conservés par celui-ci pour la sécurité et supprimés selon ses délais légaux.
        </p>
        {RDV_EN_LIGNE && (
          <>
            <h3>3.1 Prise de rendez-vous pour une démonstration</h3>
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

        <h2>4. Licences et échanges avec l'éditeur</h2>
        <p>
          Lorsqu'un utilisateur contacte l'éditeur (par e-mail
          {RDV_EN_LIGNE && " ou en réservant une démonstration"}) ou souscrit une licence, l'éditeur
          traite les seules données nécessaires à cette relation : nom, adresse e-mail, cabinet et
          informations de facturation le cas échéant. Ces données ne sont jamais cédées à des tiers
          et sont conservées pendant la durée de la relation commerciale, puis les durées légales
          applicables.
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
