import { Menu, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { cn, lien } from "@/lib/utils";
import { Logo } from "./Logo";

interface SiteNavProps {
  /** true sur le hero sombre de l'accueil : nav transparente en texte blanc. */
  overlay?: boolean;
}

const liens = [
  { href: "/#parcours", label: "Le parcours" },
  { href: "/#usages", label: "Fonctionnalités" },
  { href: "/#confiance", label: "Sécurité" },
  { href: "/telechargement/", label: "Télécharger" },
];

/** Le lien correspond-il à la page courante ? (ancres de l'accueil exclues) */
const estPageActive = (href: string) =>
  typeof window !== "undefined" && !href.includes("#") && window.location.pathname === lien(href);

export const SiteNav: React.FC<SiteNavProps> = ({ overlay = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const boutonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // Menu mobile : Échap, clic à l'extérieur, blocage du défilement, retour du focus.
  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOuvert(false);
        boutonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const cible = e.target as Node;
      if (!menuRef.current?.contains(cible) && !boutonRef.current?.contains(cible))
        setOuvert(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    const overflowAvant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      document.body.style.overflow = overflowAvant;
    };
  }, [ouvert]);

  const solid = !overlay || scrolled || ouvert;

  return (
    <header
      className={cn(
        "top-0 z-50 w-full transition-colors duration-300",
        overlay ? "fixed" : "sticky",
        solid
          ? "border-b border-ink-200/70 bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6"
        aria-label="Navigation principale"
      >
        <Logo dark={overlay && !solid} />

        {/* Liens — ordinateur */}
        <div className="hidden items-center gap-1 md:flex">
          {liens.map((l) => {
            const active = estPageActive(l.href);
            return (
              <a
                key={l.href}
                href={lien(l.href)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "cursor-pointer rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2",
                  overlay && !solid
                    ? "text-ink-200 hover:bg-white/10 hover:text-white focus-visible:outline-white"
                    : active
                      ? "bg-ink-100 text-ink-900 focus-visible:outline-ink-900"
                      : "text-ink-700 hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-ink-900",
                )}
              >
                {l.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ButtonLink
            href={lien("/demo/")}
            variant={overlay && !solid ? "gold" : "primary"}
            className="hidden h-10 shrink-0 px-4 text-[13px] sm:inline-flex"
          >
            {SITE.libelleDemo}
          </ButtonLink>

          {/* Bouton menu — mobile */}
          <button
            ref={boutonRef}
            type="button"
            onClick={() => setOuvert((o) => !o)}
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
            className={cn(
              "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden",
              overlay && !solid
                ? "text-white hover:bg-white/10 focus-visible:outline-white"
                : "text-ink-900 hover:bg-ink-100 focus-visible:outline-ink-900",
            )}
          >
            {ouvert ? (
              <X size={20} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Menu size={20} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Panneau menu — mobile */}
      {ouvert && (
        <div ref={menuRef} id="menu-mobile" className="border-t border-ink-200 bg-white md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            {liens.map((l) => {
              const active = estPageActive(l.href);
              return (
                <a
                  key={l.href}
                  href={lien(l.href)}
                  onClick={() => setOuvert(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block cursor-pointer rounded-xl px-4 py-3 text-[15px] font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
                    active
                      ? "bg-ink-100 text-ink-900"
                      : "text-ink-700 hover:bg-ink-50 hover:text-ink-900",
                  )}
                >
                  {l.label}
                </a>
              );
            })}
            <a
              href={lien("/demo/")}
              onClick={() => setOuvert(false)}
              className="mt-2 block cursor-pointer rounded-xl bg-ink-900 px-4 py-3 text-center text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-ink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
            >
              {SITE.libelleDemo}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
