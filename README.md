# Site vitrine Plutus

Site public de **Plutus**, l'espace de travail du conseiller en gestion de
patrimoine. Site statique (Vite + React + TypeScript + Tailwind), déployé sur
GitHub Pages.

> **Rôle de ce dépôt** : uniquement le site public. Le code de l'application
> n'est pas publié (il vit dans un dépôt privé, avec la documentation interne) ;
> les releases publiques et `version.json` vivent dans
> [`venum78160/Plutus`](https://github.com/venum78160/Plutus).

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
  [`version.json`](https://raw.githubusercontent.com/venum78160/Plutus/main/version.json)
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
| `SITE_BASE` | `/` | Chemin de base. `/plutus-site/` pour l'aperçu GitHub Pages (ajoute aussi `noindex`) ; `/` quand le domaine dédié sera actif. En CI : variable de dépôt `SITE_BASE`. |

## Déploiement

GitHub Actions (`.github/workflows/deploy.yml`) : formatage, lint, types,
build, scans de publication, contrôle de la chaîne de téléchargement
(**bloquant** : le site n'est pas publié si `version.json` est indisponible ou
invalide), tests de navigation, puis publication sur GitHub Pages — sur push
`main` ou à la demande. Aucun secret n'est nécessaire.

### Passage au domaine dédié (quand il sera acheté)

1. Créer le fichier `public/CNAME` contenant le domaine (ex. `plutus-app.fr`).
2. Régler la variable de dépôt `SITE_BASE` à `/` (Settings → Secrets and
   variables → Actions → Variables).
3. Chez le registrar : `CNAME www → venum78160.github.io` et, pour l'apex, les
   4 enregistrements A de GitHub Pages (185.199.108.153 / .109. / .110. /
   .111.) — GitHub redirige ensuite www ↔ apex selon le CNAME choisi et
   fournit le HTTPS.
4. Vérifier que les balises canoniques (`https://plutus-app.fr/...` dans les
   HTML) correspondent bien au domaine retenu.

## Licence

© Valentin L'Hotellier. Tous droits réservés — la publication du code source de
ce site est **assumée et intentionnelle**, pour les besoins de l'hébergement
GitHub Pages ; elle n'emporte aucune licence de réutilisation.
