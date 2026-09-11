import { ExternalLink } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";

/** Script officiel du widget Calendly — chargé une seule fois, à la demande. */
const SCRIPT_CALENDLY = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(options: {
        url: string;
        parentElement: HTMLElement;
        resize?: boolean;
      }): void;
    };
  }
}

interface CalendrierRdvProps {
  /** URL du calendrier intégré (type d'événement + paramètres d'apparence). */
  url: string;
  /** URL nue du type d'événement, proposée en lien de secours. */
  urlSecours: string;
}

/**
 * Calendrier de prise de rendez-vous Calendly intégré dans la page (pas de
 * fenêtre surgissante), sur le modèle de valentin-lhotellier.fr/#rdv.
 * - Le script Calendly n'est chargé qu'au montage du composant, donc sur la
 *   seule page qui l'affiche ; une fois chargé, il initialise lui-même tout
 *   élément .calendly-inline-widget[data-url] de la page.
 * - S'il est déjà en mémoire (rechargement à chaud), le widget est initialisé
 *   à la main — jamais deux fois dans le même conteneur.
 * - Script bloqué (pare-feu, extension) : le lien de secours ouvre la page
 *   Calendly dans un nouvel onglet — aucun faux calendrier n'est simulé.
 */
export const CalendrierRdv: React.FC<CalendrierRdvProps> = ({ url, urlSecours }) => {
  const conteneur = useRef<HTMLDivElement>(null);
  const [bloque, setBloque] = useState(false);

  useEffect(() => {
    const el = conteneur.current;
    if (!el || el.querySelector("iframe")) return;
    if (window.Calendly) {
      window.Calendly.initInlineWidget({ url, parentElement: el, resize: true });
      return;
    }
    // Script déjà demandé (second montage en mode strict) : il fera le travail.
    if (document.querySelector(`script[src="${SCRIPT_CALENDLY}"]`)) return;
    const script = document.createElement("script");
    script.src = SCRIPT_CALENDLY;
    script.async = true;
    script.onerror = () => setBloque(true);
    document.body.appendChild(script);
  }, [url]);

  if (bloque) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white px-6 py-10 text-center">
        <p className="text-sm leading-relaxed text-ink-700">
          Le calendrier n'a pas pu être chargé : votre réseau ou une extension bloque Calendly.
        </p>
        <ButtonLink href={urlSecours} target="_blank" rel="noreferrer" className="mt-5">
          Réserver sur Calendly
          <ExternalLink size={15} strokeWidth={2.25} aria-hidden="true" />
        </ButtonLink>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
        <div
          ref={conteneur}
          className="calendly-inline-widget"
          data-url={url}
          data-resize="true"
          style={{ minWidth: 320, height: 700 }}
        />
      </div>
      <p className="mt-4 text-center text-[13px] text-ink-500">
        Le calendrier ne s'affiche pas ?{" "}
        <a
          href={urlSecours}
          target="_blank"
          rel="noreferrer"
          className="inline-flex cursor-pointer items-center gap-1 font-medium text-gold-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
        >
          Réservez directement sur Calendly
          <ExternalLink size={13} strokeWidth={2.25} aria-hidden="true" />
        </a>
      </p>
    </div>
  );
};
