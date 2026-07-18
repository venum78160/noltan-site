import type React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "gold";
type Size = "default" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-ink-900 text-white hover:bg-ink-700 shadow-sm focus-visible:outline-ink-900",
  secondary:
    "border border-ink-200 bg-white text-ink-900 hover:border-ink-400 hover:bg-ink-50 focus-visible:outline-ink-900",
  ghost: "text-ink-700 hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-ink-900",
  gold: "bg-gold-700 text-white hover:bg-gold-800 shadow-sm focus-visible:outline-gold-700",
};

const sizeClasses: Record<Size, string> = {
  default: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
}

/** Bouton-lien : toutes les actions du site sont des navigations. */
export const ButtonLink: React.FC<ButtonLinkProps> = ({
  variant = "primary",
  size = "default",
  className,
  children,
  ...props
}) => (
  <a
    className={cn(
      "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2",
      variantClasses[variant],
      sizeClasses[size],
      className,
    )}
    {...props}
  >
    {children}
  </a>
);
