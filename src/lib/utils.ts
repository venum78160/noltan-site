import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Préfixe un chemin interne avec la base du site ("/" en production sur le
 * domaine dédié, "/plutus-site/" sur l'aperçu GitHub Pages).
 * À utiliser pour TOUT lien ou ressource interne commençant par "/".
 */
export function lien(chemin: string) {
  return import.meta.env.BASE_URL + chemin.replace(/^\//, "");
}
