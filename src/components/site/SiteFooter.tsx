import type React from "react";
import { SITE } from "@/lib/site";
import { lien } from "@/lib/utils";
import { Logo } from "./Logo";

const colonnes = [
  {
    titre: "Produit",
    liens: [
      { href: "/#parcours", label: "Le parcours" },
      { href: "/#usages", label: "Fonctionnalités" },
      { href: "/#confiance", label: "Sécurité des données" },
      { href: "/demo/", label: SITE.libelleDemo },
      { href: "/telechargement/", label: "Télécharger" },
    ],
  },
  {
    titre: "Légal",
    liens: [
      { href: "/confidentialite/", label: "Politique de confidentialité" },
      { href: "/mentions-legales/", label: "Mentions légales" },
    ],
  },
  {
    titre: "Contact",
    liens: [{ href: `mailto:${SITE.emailContact}`, label: SITE.emailContact }],
  },
];

export const SiteFooter: React.FC = () => (
  <footer className="border-t border-ink-200 bg-ink-50">
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-ink-500">
            {SITE.tagline}. Clients, rendez-vous, documents et suivi réunis dans un seul outil —
            installé chez vous.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {colonnes.map((col) => (
            <div key={col.titre}>
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-ink-500">
                {col.titre}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.liens.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href.startsWith("mailto:") ? l.href : lien(l.href)}
                      className="cursor-pointer break-all text-sm text-ink-700 transition-colors duration-200 hover:text-ink-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-2 border-t border-ink-200 pt-6 text-[13px] text-ink-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.editeur} — Noltan. Tous droits réservés.
        </p>
        <p>
          Application de bureau pour Windows. Aucune donnée client ne transite par nos serveurs.
        </p>
      </div>
    </div>
  </footer>
);
