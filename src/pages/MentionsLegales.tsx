import type React from "react";
import { PageShell } from "@/components/site/PageShell";
import { SITE } from "@/lib/site";

/*
 * Les champs légaux (forme juridique, SIREN, hébergeur) vivent dans
 * src/lib/site.ts — source unique — et ne s'affichent que s'ils sont
 * renseignés : aucun placeholder n'apparaît sur le site public.
 */
const MentionsLegales: React.FC = () => (
  <PageShell>
    <section className="border-b border-ink-200 bg-ink-50 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-gold-700">Légal</p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Mentions légales
        </h1>
        <p className="mt-3 text-sm text-ink-500">Dernière mise à jour : {SITE.derniereMajLegale}</p>
      </div>
    </section>

    <section className="bg-white py-14">
      <div className="prose prose-slate mx-auto max-w-3xl px-6 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-gold-700 prose-strong:text-ink-900">
        <h2>Éditeur du site</h2>
        <p>
          Le site {SITE.url} et l'application Noltan sont édités par <strong>{SITE.editeur}</strong>
          {SITE.formeJuridique && <>, {SITE.formeJuridique}</>}
          {SITE.siren && <> — SIREN {SITE.siren}</>}
          {SITE.tvaIntra && <> — TVA intracommunautaire {SITE.tvaIntra}</>}.
          {SITE.adresseEditeur && (
            <>
              <br />
              Adresse : {SITE.adresseEditeur}
            </>
          )}
          <br />
          Contact : <a href={`mailto:${SITE.emailContact}`}>{SITE.emailContact}</a>
        </p>

        <h2>Directeur de la publication</h2>
        <p>{SITE.editeur}</p>

        {SITE.hebergeurNom && (
          <>
            <h2>Hébergement</h2>
            <p>
              {SITE.hebergeurNom}
              {SITE.hebergeurAdresse && <> — {SITE.hebergeurAdresse}</>}
            </p>
          </>
        )}

        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus de ce site (textes, visuels, logo, application Noltan) est protégé
          par le droit de la propriété intellectuelle. Toute reproduction non autorisée est
          interdite. Les captures d'écran présentées sur ce site montrent l'application remplie d'un
          jeu de démonstration entièrement fictif : toute ressemblance avec des personnes ou
          dossiers réels serait fortuite, et rien n'y constitue un conseil en investissement.
        </p>

        <h2>Signalement</h2>
        <p>
          Pour signaler un contenu ou un dysfonctionnement :{" "}
          <a href={`mailto:${SITE.emailContact}`}>{SITE.emailContact}</a>.
        </p>
      </div>
    </section>
  </PageShell>
);

export default MentionsLegales;
