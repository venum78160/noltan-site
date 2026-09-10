# Site vitrine Noltan

Site public de **Noltan**, l'espace de travail du conseiller en gestion de
patrimoine. Site statique (Vite + React + TypeScript + Tailwind), déployé sur
GitHub Pages.

> **Rôle de ce dépôt** : uniquement le site public. Le code de l'application
> n'est pas publié (il vit dans un dépôt privé, avec la documentation interne) ;
> les releases publiques et `version.json` vivent dans
> [`venum78160/Noltan`](https://github.com/venum78160/Noltan).

## Prérequis

- Node.js ≥ 20 et npm
- Un navigateur à moteur Chromium (uniquement pour les captures de contrôle et
  les tests — Playwright utilise Edge/Chrome déjà présent en local, et installe
  Chromium en CI)

## Installation & commandes

```bash
npm ci                    # installation reproductible
npm run dev               # site en local sur http://localhost:5173
npm run build             # build de production dans dist/
npm run preview           # prévisualisation du build

npm run format:check      # formatage (Biome) — format pour corriger
npm run lint              # lint (Biome)
npm run typecheck         # vérification TypeScript
npm run test              # tests de navigation Playwright (build + preview auto)

npm run verifier          # scan de dist/ : secrets, chemins locaux, placeholders
npm run verifier:depot    # scan des fichiers SUIVIS PAR GIT : docs internes,
                          # versions codées en dur, données personnelles dupliquées
npm run verifier:version  # version.json accessible + installeur joignable
npm run controle          # captures d'écran du site → controle-visuel/ (non versionné)
```

## Version affichée & téléchargement — source de vérité

**Il n'y a AUCUN numéro de version dans ce dépôt, ni au build.**

- Source de vérité unique :
  [`version.json`](https://raw.githubusercontent.com/venum78160/Noltan/main/version.json)
  du dépôt public de releases, réécrit automatiquement à chaque publication de
  l'application.
- La page de téléchargement le récupère **dans le navigateur** au chargement
  (`src/lib/version.ts`) : le numéro affiché, le lien de l'installeur
  (`url_exe`), les notes et le lien de release proviennent du même objet JSON
  validé. Une nouvelle release est donc visible **immédiatement**, sans
  redéploiement du site.
- Si `version.json` est indisponible ou invalide, la page n'affiche aucun
  numéro et propose la page officielle des releases — jamais une ancienne
  version présentée comme actuelle.
- Aucun secret, aucun déclenchement inter-dépôts n'est nécessaire.

## Image de partage (og.png)

`npm run og` régénère `public/og.png` (1200 × 630) depuis
`scripts/og-image.html` avec Edge (Playwright) — même marque, polices et
teintes que le site. À relancer quand le nom, la promesse ou le domaine
changent, puis vérifier l'image et la committer.

## Mettre à jour les captures du produit

Les 9 images de `public/captures/` montrent l'application remplie d'un jeu de
démonstration entièrement fictif. Le pipeline de régénération dépend de
l'application : il est documenté dans le dépôt privé (documentation interne du
site). Pour publier de nouvelles captures, remplacer les fichiers `.webp` de
`public/captures/` à noms constants — le site les reprend tel quel.

## Configuration

Tout ce qui s'affiche (coordonnées, libellés, champs légaux) est centralisé
dans [`src/lib/site.ts`](src/lib/site.ts) — source unique, sans duplication
dans la documentation.

Variable de build :

| Variable | Défaut | Rôle |
|---|---|---|
| `SITE_BASE` | `/` | Chemin de base. `/noltan-site/` pour l'aperçu GitHub Pages (ajoute aussi `noindex`) ; `/` quand le domaine dédié sera actif. En CI : variable de dépôt `SITE_BASE`. |

## Déploiement

GitHub Actions (`.github/workflows/deploy.yml`) : formatage, lint, types,
build, scans de publication, contrôle de la chaîne de téléchargement
(**bloquant** : le site n'est pas publié si `version.json` est indisponible ou
invalide), tests de navigation, puis publication sur GitHub Pages — sur push
`main` ou à la demande. Aucun secret n'est nécessaire.

### Passage au domaine dédié `noltan.fr` (acheté chez OVHcloud le 10/09/2026)

Le site est publié par un workflow GitHub Actions : dans ce mode, GitHub
**ignore tout fichier `CNAME`** du dépôt — le domaine se règle dans les
paramètres du dépôt, pas dans le code.

1. Chez OVHcloud (Web Cloud ▸ Noms de domaine ▸ noltan.fr ▸ Zone DNS) :
   remplacer l'enregistrement `A` de l'apex par les 4 adresses de GitHub Pages
   (185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153),
   ajouter les 4 `AAAA` (2606:50c0:8000::153 / 8001::153 / 8002::153 /
   8003::153) et faire pointer `www` en `CNAME` vers `venum78160.github.io.`.
   Ne pas toucher aux `MX`/`TXT` si la boîte e-mail OVH est utilisée.
2. Sur GitHub, Settings ▸ Pages ▸ « Custom domain » : `noltan.fr`, puis cocher
   « Enforce HTTPS » une fois le certificat émis (quelques minutes à une
   heure après la propagation DNS). Recommandé avant : vérifier le domaine au
   niveau du compte (Settings du profil ▸ Pages ▸ « Add a domain », TXT
   `_github-pages-challenge-venum78160`) pour interdire toute reprise.
3. Régler la variable de dépôt `SITE_BASE` à `/` (Settings ▸ Secrets and
   variables ▸ Actions ▸ Variables) et relancer le déploiement.
4. Les balises canoniques et `SITE.url` (`src/lib/site.ts`) pointent déjà sur
   `https://noltan.fr`. Mettre à jour ensuite l'écran de consentement Google
   (domaine autorisé + URL de la politique de confidentialité).

## Licence

© Valentin L'Hotellier. Tous droits réservés — la publication du code source de
ce site est **assumée et intentionnelle**, pour les besoins de l'hébergement
GitHub Pages ; elle n'emporte aucune licence de réutilisation.
