import { Maximize2, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn, lien } from "@/lib/utils";

export interface CaptureProps {
  /** Nom de fichier dans /captures/ (ex. "synthese-client.webp"). */
  fichier: string;
  /** Description de l'écran, sert d'alt et de libellé d'emplacement. */
  ecran: string;
  /** Légende courte affichée sous la capture (optionnelle). */
  legende?: string;
  /** Ratio réservé pour éviter tout saut de mise en page (défaut 16/10). */
  ratio?: string;
  /** Ombre et fond du cadre : "clair" sur sections blanches, "sombre" sur sections ink. */
  ton?: "clair" | "sombre";
  /** true pour l'image principale du hero : chargement immédiat et prioritaire. */
  priorite?: boolean;
  className?: string;
}

/** Survol possible uniquement avec un pointeur précis (souris/trackpad). */
const pointeurFin = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Capture d'écran produit dans un cadre de fenêtre.
 * - Survol (souris) : zoom ×1,75 dans le cadre, centré sous le curseur.
 * - Clic / Entrée : ouverture en plein écran (fonctionne aussi au tactile).
 * Tant que le fichier n'existe pas dans public/captures/, un croquis
 * d'interface s'affiche à la place — aucune fausse interface n'est simulée.
 */
export const Capture: React.FC<CaptureProps> = ({
  fichier,
  ecran,
  legende,
  ratio = "16/10",
  ton = "clair",
  priorite = false,
  className,
}) => {
  const [manquante, setManquante] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [origine, setOrigine] = useState("50% 50%");
  const [agrandie, setAgrandie] = useState(false);
  const declencheurRef = useRef<HTMLButtonElement>(null);
  const sombre = ton === "sombre";

  // Plein écran : Échap pour fermer, défilement bloqué, retour du focus.
  useEffect(() => {
    if (!agrandie) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAgrandie(false);
    };
    document.addEventListener("keydown", onKey);
    const overflowAvant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowAvant;
      declencheurRef.current?.focus();
    };
  }, [agrandie]);

  const suivreCurseur = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (((e.clientX - r.left) / r.width) * 100).toFixed(1);
    const y = (((e.clientY - r.top) / r.height) * 100).toFixed(1);
    setOrigine(`${x}% ${y}%`);
  };

  return (
    <figure className={cn("w-full", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-xl border shadow-xl",
          sombre
            ? "border-white/10 bg-ink-900 shadow-black/40"
            : "border-ink-200 bg-white shadow-ink-900/10",
        )}
      >
        {/* Barre de fenêtre */}
        <div
          className={cn(
            "flex items-center gap-2 border-b px-4 py-2.5",
            sombre ? "border-white/10 bg-ink-950" : "border-ink-100 bg-ink-50",
          )}
          aria-hidden="true"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-ink-300/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-300/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold-500/70" />
          <span
            className={cn(
              "ml-3 truncate text-[11px] font-medium",
              sombre ? "text-ink-400" : "text-ink-500",
            )}
          >
            Plutus — {ecran}
          </span>
        </div>

        {!manquante ? (
          <button
            ref={declencheurRef}
            type="button"
            onClick={() => setAgrandie(true)}
            onMouseEnter={() => pointeurFin() && setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={suivreCurseur}
            aria-label={`Agrandir la capture : ${ecran}`}
            style={{ aspectRatio: ratio }}
            className={cn(
              "group relative block w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-2",
              sombre
                ? "bg-ink-900 focus-visible:outline-gold-300"
                : "bg-ink-50/60 focus-visible:outline-ink-900",
            )}
          >
            <img
              src={lien(`/captures/${fichier}`)}
              alt={`Capture d'écran de Plutus : ${ecran}`}
              loading={priorite ? "eager" : "lazy"}
              fetchPriority={priorite ? "high" : "auto"}
              style={{ transformOrigin: origine, transform: zoom ? "scale(1.75)" : undefined }}
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 ease-out motion-reduce:transition-none"
              onError={() => setManquante(true)}
            />
            {/* Indice d'agrandissement — s'efface pendant la loupe */}
            <span
              className={cn(
                "pointer-events-none absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-opacity duration-200",
                zoom ? "opacity-0" : "opacity-90",
                sombre
                  ? "border-white/15 bg-ink-950/80 text-ink-200"
                  : "border-ink-200 bg-white/90 text-ink-700",
              )}
              aria-hidden="true"
            >
              <Maximize2 size={14} strokeWidth={2} />
            </span>
          </button>
        ) : (
          /* Croquis d'interface en attendant la capture réelle.
             Volontairement abstrait : aucune donnée, aucune fausse fonctionnalité. */
          <div
            style={{ aspectRatio: ratio }}
            className={cn("relative flex w-full", sombre ? "bg-ink-900" : "bg-white")}
            data-capture-attendue={fichier}
            title={`Capture attendue : /captures/${fichier}`}
          >
            <div
              className={cn(
                "hidden w-[22%] shrink-0 flex-col gap-2.5 border-r p-4 sm:flex",
                sombre ? "border-white/10 bg-ink-950/60" : "border-ink-100 bg-ink-50/70",
              )}
            >
              <div className="h-2.5 w-2/3 rounded-full bg-gold-500/50" />
              {[0.9, 0.75, 0.85, 0.6, 0.8].map((w, i) => (
                <div
                  key={i}
                  className={cn("h-2 rounded-full", sombre ? "bg-white/10" : "bg-ink-200/70")}
                  style={{ width: `${w * 100}%` }}
                />
              ))}
            </div>
            <div className="relative flex min-w-0 flex-1 flex-col gap-3 p-5">
              <div className="flex items-center gap-2">
                <div
                  className={cn("h-3 w-1/3 rounded-full", sombre ? "bg-white/15" : "bg-ink-200")}
                />
                <div className="ml-auto h-6 w-24 rounded-full bg-gold-500/30" />
              </div>
              {[0.95, 0.7, 0.85, 0.55, 0.75, 0.65].map((w, i) => (
                <div
                  key={i}
                  className={cn("h-2.5 rounded-full", sombre ? "bg-white/8" : "bg-ink-100")}
                  style={{ width: `${w * 100}%` }}
                />
              ))}
              <div className="mt-auto flex items-center justify-center pb-2">
                <span
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[12px] font-medium",
                    sombre
                      ? "border-white/15 bg-ink-950/70 text-ink-400"
                      : "border-ink-200 bg-white/90 text-ink-500",
                  )}
                >
                  Aperçu en préparation — {ecran}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {legende && (
        <figcaption
          className={cn(
            "mt-3 text-center text-[13px] leading-relaxed",
            sombre ? "text-ink-400" : "text-ink-500",
          )}
        >
          {legende}
        </figcaption>
      )}

      {/* Plein écran — rendu dans <body> via portail : les ancêtres à transform/filter
          (drop-shadow du hero, sections .reveal) créeraient sinon un containing block
          qui piégerait le position:fixed dans le cadre de la figure. */}
      {agrandie &&
        !manquante &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Capture agrandie : ${ecran}`}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-ink-950/90 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setAgrandie(false)}
          >
            <img
              src={lien(`/captures/${fichier}`)}
              alt={`Capture d'écran de Plutus : ${ecran}`}
              className="max-h-[86svh] max-w-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="max-w-2xl text-center text-sm text-ink-300">{legende || ecran}</p>
            <button
              type="button"
              autoFocus
              onClick={() => setAgrandie(false)}
              aria-label="Fermer l'aperçu"
              className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X size={19} strokeWidth={2} />
            </button>
          </div>,
          document.body,
        )}
    </figure>
  );
};
