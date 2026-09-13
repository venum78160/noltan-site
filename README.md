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

## Favicon (onglet du navigateur et résultats Google)

`public/favicon.ico`, `public/favicon.png` (256 × 256) et
`public/apple-touch-icon.png` (180 × 180, réduction du précédent) sont des
copies de l'icône réelle de l'application (`assets/icone.ico` et `icone.png`
du dépôt privé) : l'onglet, Google et le poste installé montrent le même
dessin. À recopier quand l'icône de l'application change, sans jamais renommer
les fichiers (Google exige une URL stable). Pas de SVG ni de data URI : Google
n'accepte que des fichiers image (ICO, PNG, JPEG…) qu'il peut télécharger, et
affiche sinon un globe générique à la place du logo.

## Mettre à jour les captures du produit

Les 9 images de `public/captures/` montrent l'application remplie d'un jeu de
démonstration entièrement fictif. Le pipeline de régénération dépend de
l'application : il est documenté dans le dépôt privé (documentation interne du
site). Pour publier de nouvelles captures, remplacer les fichiers `.webp` de
`public/captures/` à noms constants — le site les reprend tel quel.

## Prise de rendez-vous (Calendly)

La démonstration se réserve dans un **calendrier Calendly intégré** à la page
`/demo/` (section `#rdv`, sans fenêtre surgissante), sur le modèle du site du
cabinet pilote. Une seule valeur commande tout : `SITE.urlCalendly` dans
[`src/lib/site.ts`](src/lib/site.ts), l'URL du type d'événement
(`https://calendly.com/<compte>/<slug>`).

- **Vide** : aucun calendrier n'est simulé — le bouton « Demander une
  démonstration » ouvre un e-mail pré-rempli.
- **Renseignée** : le calendrier apparaît sur `/demo/#rdv`, tous les boutons
  d'action y mènent et la politique de confidentialité décrit le traitement
  Calendly. Une URL d'une autre forme est refusée par `npm run typecheck`.

Le script Calendly n'est chargé que sur la page de démonstration
(`src/components/site/CalendrierRdv.tsx`) ; s'il est bloqué, un lien ouvre la
page Calendly dans un nouvel onglet. Les tests Playwright vérifient que la
politique de confidentialité mentionne Calendly si, et seulement si, le
calendrier est branché.

## Mesure d'audience (Umami, sans cookie)

La fréquentation du site se mesure avec **Umami Cloud** (région Union
européenne), sans cookie ni bandeau : rien n'est déposé sur l'appareil du
visiteur, l'adresse IP n'est pas conservée. Une seule valeur commande tout :
`SITE.idMesure` dans [`src/lib/site.ts`](src/lib/site.ts), l'identifiant de
site affiché par Umami (un UUID — une autre forme est refusée par
`npm run typecheck`).

- **Vide** : aucun script chargé, aucun événement envoyé, aucune mention dans
  la politique de confidentialité.
- **Renseigné** : le script est chargé sur toutes les pages
  (`src/components/site/PageShell.tsx`), limité aux domaines de
  `SITE.domainesMesure` (le poste de développement et l'aperçu GitHub Pages ne
  comptent jamais), et la politique de confidentialité décrit le traitement.

Tout ce qui est compté passe par [`src/lib/mesure.ts`](src/lib/mesure.ts)
(vocabulaire fermé : un nom inconnu ne compile pas) :

| Événement | Geste | Propriétés |
|---|---|---|
| `telechargement` | clic sur le bouton de téléchargement | `systeme` (windows / macos / autre), `version` |
| `demo_clic` | clic sur « Demander une démonstration » | `emplacement` (menu, menu-mobile, accueil-hero, accueil-fin, demo-haut, telechargement, pied) |
| `rdv_calendrier`, `rdv_evenement`, `rdv_creneau`, `rdv_reserve` | étapes du calendrier Calendly, signalées par le widget (`window.postMessage`, origine calendly.com seulement, aucune donnée personnelle) | — |
| `contact_email` | clic sur l'adresse de contact | `emplacement` |
| `formulaire_affiche`, `formulaire_envoye`, `formulaire_erreur` | formulaire avant téléchargement (section suivante) | `appareil` (ordinateur / mobile) |

Les gestes à un clic se déclarent par attributs `data-umami-event` (le script
attend la fin de l'envoi avant de suivre un lien) ; les autres passent par
`suivre()`. Pages vues, sources, UTM, pays, système et appareil sont mesurés
automatiquement. Le calendrier intégré porte `utm_source=noltan.fr` : dans
Calendly, une réservation faite depuis le site se distingue d'une réservation
faite depuis un lien envoyé par e-mail.

## Formulaire avant téléchargement (Brevo)

Quand `SITE.formulaireTelechargement` est renseigné (adresse de réception d'un
formulaire Brevo, `https://<compte>.sibforms.com/serve/<formulaire>` — une
autre forme est refusée par `npm run typecheck`), un encadré Prénom / Nom /
E-mail professionnel / Cabinet (facultatif) précède le bouton de la page de
téléchargement (`src/components/site/FormulaireTelechargement.tsx`) :

- le contact part dans Brevo (champs `EMAIL`, `PRENOM`, `NOM`, `CABINET` et
  `SOURCE`, à créer dans le formulaire côté Brevo — `SOURCE` reçoit le système,
  l'appareil et la version), et le bouton de téléchargement apparaît
  **aussitôt** ; une automatisation Brevo envoie le lien par e-mail ;
- un échec d'envoi ne bloque jamais le téléchargement : le bouton apparaît, le
  message le dit, l'événement `formulaire_erreur` le rend visible ;
- depuis un téléphone (installation impossible), le bouton devient « Recevoir
  le lien sur mon ordinateur » ;
- la politique de confidentialité décrit le traitement (Brevo, finalités,
  durée) si, et seulement si, le formulaire est branché — vérifié par les
  tests, comme pour Calendly.

**Vide** : bouton de téléchargement direct. Quand l'une de ces valeurs change,
actualiser aussi `SITE.derniereMajLegale`.

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
