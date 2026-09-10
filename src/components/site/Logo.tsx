import type React from "react";
import { cn, lien } from "@/lib/utils";

/**
 * Logo Noltan : reprise du motif de l'icône réelle de l'application
 * (assets/icone.png) — document crème à coin plié or sur carré d'encre.
 */
export const MarqueNoltan: React.FC<{ taille?: number; className?: string }> = ({
  taille = 28,
  className,
}) => (
  <svg
    width={taille}
    height={taille}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <rect
      x="0.5"
      y="0.5"
      width="27"
      height="27"
      rx="7.5"
      className="fill-ink-950"
      stroke="currentColor"
      strokeOpacity="0.14"
    />
    <path
      d="M9.5 6.5h7.2l4.3 4.3v10a1.7 1.7 0 0 1-1.7 1.7H9.5a1.7 1.7 0 0 1-1.7-1.7V8.2a1.7 1.7 0 0 1 1.7-1.7Z"
      fill="#F4EFE4"
    />
    <path d="M16.7 6.5 21 10.8h-4.3V6.5Z" className="fill-gold-500" />
    <rect x="10.3" y="13" width="7.4" height="1.6" rx="0.8" className="fill-gold-600" />
    <rect x="10.3" y="16" width="5.6" height="1.6" rx="0.8" className="fill-gold-600" />
    <rect x="10.3" y="19" width="6.5" height="1.6" rx="0.8" className="fill-gold-600" />
  </svg>
);

export const Logo: React.FC<{ dark?: boolean; className?: string }> = ({
  dark = false,
  className,
}) => (
  <a
    href={lien("/")}
    className={cn(
      "inline-flex cursor-pointer items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4",
      dark
        ? "text-white focus-visible:outline-white"
        : "text-ink-900 focus-visible:outline-ink-900",
      className,
    )}
    aria-label="Noltan — retour à l'accueil"
  >
    <MarqueNoltan />
    <span className="text-[17px] font-semibold tracking-tight">Noltan</span>
  </a>
);
