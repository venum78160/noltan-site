import type React from "react";
import { useEffect } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";

/** Active l'apparition douce des blocs marqués .reveal au fil du défilement. */
const useReveal = () => {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    for (const el of els) io.observe(el);
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("js-reveal");
    };
  }, []);
};

interface PageShellProps {
  /** true : la nav flotte sur un hero sombre (accueil). */
  heroOverlay?: boolean;
  children: React.ReactNode;
}

/**
 * Le contenu est rendu par React après le chargement : à l'arrivée sur une URL
 * avec ancre (/demo/#rdv depuis l'accueil), le navigateur cherche la cible
 * avant qu'elle existe et reste en haut de page — on y défile une fois montés.
 */
const useAncreInitiale = () => {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);
};

export const PageShell: React.FC<PageShellProps> = ({ heroOverlay = false, children }) => {
  useReveal();
  useAncreInitiale();
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNav overlay={heroOverlay} />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};
