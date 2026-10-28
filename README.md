<div align="center">

# Shift180

**Ma plateforme d'apprentissage pour maîtriser le développement Fullstack en 180 jours — sur un « tableau d'aimants » : 1 jour = 1 leçon = 1 aimant posé.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B4?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8)
![Supabase](https://img.shields.io/badge/Compte-Supabase-3ECF8E)
![Hors ligne](https://img.shields.io/badge/Fonctionne-hors_ligne-3ecf8e)

*Créé par **Emmanuel Jeancy BILOMBO-SILAHO**, développeur congolais 🇨🇬🇨🇩*

</div>

---

## 📖 À propos

**Shift180** est une plateforme statique conçue sur mesure pour suivre une roadmap **Fullstack de 180 jours** : HTML → CSS/Git → JavaScript → DOM → React → Node/Express → MongoDB → sécurité/déploiement/carrière.

Le principe : **1 jour = 1 leçon**. Le site verrouille automatiquement la suite tant que la leçon du jour n'est pas validée, puis jusqu'au lendemain. Chaque leçon terminée est un **aimant posé** sur ton tableau — visible, daté, motivant.

Aucun framework, aucun build : du **HTML, CSS et JavaScript pur**. La synchronisation par compte s'ajoute gracieusement via Supabase.

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🧲 **Tableau d'aimants** | Grille ventilée par mois (6 filières) — page courte, jamais les 180 jours d'un coup |
| 🔒 **Verrouillage strict** | La leçon suivante s'ouvre seulement après validation, puis le lendemain |
| 👤 **Compte & synchronisation** | Progression + code sauvegardés dans le cloud via Supabase, reprise sur n'importe quel terminal |
| 📴 **Offline-first** | Sans réseau : tout est enregistré dans le navigateur, puis synchronisé au retour en ligne (file d'attente automatique) |
| 📚 **Cours complets** | 60 leçons détaillées (théorie + exemples + TP sérieux), générique enrichi pour la suite |
| ✅ **Validación par les TP** | Le bouton « Poser ton aimant » ne s'active que quand tous les TP sont cochés |
| 💻 **Éditeur + console + aperçu** | HTML/CSS/DOM rendus en direct, JS avec console isolée (`Ctrl+Entrée`) |
| 🌗 **Thème clair / sombre / système** | Palette pastel « cozy », choix gardé entre les visites |
| 📲 **PWA installable** | Manifest + service worker : comme une app, même hors ligne |
| 🫶 **Responsive** | Smartphones/tablettes/PC : rails, cibles tactiles ≥ 44px, typographie fluide |
| 🎞️ **Motion design** | Snap d'aimant, lévitation du jour, confetti de validation, compteurs animés (respect `prefers-reduced-motion`) |

---

## 🗺️ La roadmap en un coup d'œil

| Mois | Thème | Jours |
|---|---|---|
| **1** | Fondamentaux du web : HTML, CSS, Git & GitHub, bases de JavaScript | 1 – 30 |
| **2** | Maîtrise de JavaScript : JS moderne, asynchrone, DOM, intro à React | 31 – 60 |
| **3** | Frontend React : hooks, routing, context, API, projets | 61 – 90 |
| **4** | Backend : Node.js, Express, API REST, JWT | 91 – 120 |
| **5** | Bases de données & intégration | 121 – 150 |
| **6** | Sécurité, déploiement, CI/CD, carrière | 151 – 180 |

Le détail jour par jour : [`data.js`](data.js) (+ considérer les leçons détaillées dans `lessons-*.js`).

---

## 🗂️ Structure du projet

```
Shift180/
├── index.html            # Préface : hero, carrousel des 2 modes, bouton Commencer
├── start.html            # Slider des modes + détection d'appareil + (re)génération du fichier unique
├── login.html / login.js # Page Compte dédiée : connexion/inscription email + OAuth Google/GitHub
├── app.html              # Tableau de bord : rail des mois, grille (auto-repliée sur mobile)
├── day.html              # Page de cours : théorie + lexique + figures + bloc PC, TP, éditeur
├── style.css             # Monde « tableau d'aimants » : pastel clair/sombre/système
├── data.js               # Plan des 180 jours + fusion des leçons
├── lessons-d1-15.js …    # Leçons détaillées jours 1–60 (4 fichiers)
├── figures.js            # Figures SVG pédagogiques + lexique zéro-dev (FIGS & GLOSS)
├── core.js               # Thème + stockage local + auth/sync Supabase (+ OAuth)
├── app.js / day.js       # Logique des pages
├── config.js             # ← Tes clés Supabase (voir ci-dessous)
├── build-standalone.js   # (build) node build-standalone.js → dist/shift180-hors-ligne.html
├── dist/shift180-hors-ligne.html  # Toute la plateforme en UN fichier (mode hors ligne mobile)
├── manifest.webmanifest  # PWA
├── sw.js                 # Service worker (cache hors ligne)
├── icons/                # Logo + icônes PWA
├── supabase.sql          # Schéma de la table + RLS
└── .devserver.js         # (dev) serveur statique local : node .devserver.js → http://localhost:8642
```

---

## 🔐 Compte & synchronisation (mode en ligne)

La progression par compte est **locale d'abord** : chaque validation est écrite dans le navigateur, puis renvoyée au compte quand le réseau est disponible.

### Brancher Supabase (≈ 5 minutes, gratuit)

1. Crée un projet sur [supabase.com](https://supabase.com).
2. **SQL Editor** → colle et exécute [`supabase.sql`](supabase.sql) (table `day_progress` + sécurisation RLS).
3. **Settings → API** : copie *Project URL* et la clé *anon public*.
4. Édite [`config.js`](config.js) :
   ```js
   window.PBD_CONFIG = { url: 'https://xxxx.supabase.co', key: 'ta-clé-anon' };
   ```
5. Déploiement terminé — le bouton « Se connecter » devient fonctionnel.

### Ce qui se passe ensuite

- **Connecté** : chaque jour validé est envoyé au compte ; une reconnexion sur un autre appareil **tire** la progression complète depuis le serveur.
- **Mode hors ligne (connecté)** : les validations partent dans une **file d'attente locale** ; dès le retour du réseau, elles sont poussées automatiquement.
- **Compte unique qui n'à rien** : tout fonctionne comme avant en local pur.

> 🔐 La clé *anon* est publique mais sans risque : les accès sont filtrés par **Row Level Security** (chacun ne voit que ses jours).

---

## ⏳ Le verrouillage

La progression locale vit dans `localStorage` (`pbd.state.v2` : `{ jour : date de validation }`, avec migration automatique de l'ancien format `fs180`).

- Jour 1 : disponible immédiatement.
- Valide le jour *N* → date enregistrée + aimant posé (snap + confetti 🎉).
- Le jour *N+1* reste « Demain » jusqu'à la date du jour suivante.
- Les jours > *N+1* restent verrouillés (empreintes fantômes).

> ⚠️ C'est un outil de **discipline personnelle**, pas de sécurité — le localStorage reste modifiable via la console.

---

## ▶️ Utilisation

### Démarrage — `start.html`

La page **Commencer** (`start.html`, atteinte depuis l'accueil) propose un slider entre les deux modes. Elle **détecte l'appareil** : sur téléphone/tablette, le « fichier unique » passe en recommandé ; sur PC, le clonage du dépôt.

### Mode hors ligne

Le mode hors ligne s'adapte à l'appareil :

- **PC (dossier complet)** — 1. Clone le dépôt · 2. double-clic sur `index.html` (tout est local, aucune dépendance réseau).
- **Téléphone / tablette (fichier unique)** — la plateforme se compile en **un seul fichier HTML autonome** : `dist/shift180-hors-ligne.html` (régénération : `node build-standalone.js`). Télécharge-le, ouvre-le dans Chrome/Firefox : les 6 mois, les leçons, le lexique et l'éditeur y vivent sans Internet. Aucun dossier à cloner, aucun serveur. *(Sur iOS, Safari limite la sauvegarde de progression sur `file://` : le mode en ligne reste la meilleure option sur iPhone/iPad.)*
- **PWA installable** (la plateforme en ligne) : Chrome/Edge → icône d'installation. Elle tourne ensuite comme une app, même sans réseau.

### Mode en ligne (multi-appareil via GitHub Pages)

1. Branche tes clés Supabase ci-dessus et push tout.
2. **Settings → Pages** → *Deploy from a branch* → `main` → `/ (root)`.
3. Ouvre `https://shift180.pages.dev/` → **Commencer** → mode « En ligne » → **Créer ton compte / Se connecter** (page `login.html` dédiée — plus aucun champ de connexion dans l'app).

#### Connexions Google & GitHub (OAuth)

Dans la page Compte (et sur `start.html`), les boutons **Google** / **GitHub** utilisent `supabase.auth.signInWithOAuth`. Pour les activer :

1. **Dashboard Supabase** → *Authentication → Providers* → active **Google** et/ou **GitHub**, colle les `Client ID`/`Secret` (créés sur <https://console.cloud.google.com/> et <https://github.com/settings/developers>).
2. Dans **Authentication → URL Configuration** : **Site URL** = `https://shift180.pages.dev/` et **Redirect URLs** = `https://shift180.pages.dev/login.html` (+ `http://localhost:8642/login.html` pour les tests locaux).

---

## 📱 Ce qui a été pensé pour le mobile

- **Grille auto-repliée** : sur petit écran, le tableau ramène la grille à **7 aimants** 3 s après l'arrivée ; un bouton **⌄ Dérouler les 30 jours** les replace tous (mémorisé pour la session).
- **Accueil en carrousel** : les deux modes de démarrage se glissent (les titres d'abord, la description au défilement), un clic dans la carte sélectionne le mode, et le bouton **Commencer** ouvre `start.html`.
- **Page jour 100 % lisible sur téléphone** : les actions impossibles sans clavier (F12, terminal, clonage…) sont regroupées dans un bloc déroulant **« 🖱️ Actions à reproduire sur un ordinateur »** avec une figure SVG de l'action — rien ne bloque la lecture.
- **Lexique au fil du cours** : chaque terme technique (DNS, IP, serveur, HTTP, JWT…) est tap-able dans le texte pour afficher sa définition en une phrase, sur tous les jours (1 à 180).

---

## ✍️ Écrire une leçon

```js
// dans un fichier lessons-d*.js
4:{ t:`<h3>Titres</h3><p>…</p>`,            // cours (HTML)
   figs:['url'],                            // figures SVG (voir figures.js) — optionnel
   pc:{ figs:['f12'],                       // figures pour le bloc PC — optionnel
        steps:['Sur PC…'], note:'…' },      // bloc « actions sur ordinateur » — optionnel
   s:`<a href="…">Lien</a>`,                // code de départ de l'éditeur
   x:["Créer un lien", "…"] }               // travaux pratiques
```

| Clé | Rôle |
|---|---|
| `t` | Cours (HTML) — en-têtes, tableaux, exemples de code, note « Garde en tête » |
| `figs` | Figures illustratives affichées en fin de cours (clés de `FIGS`) |
| `pc` | Bloc déroulant PC : `figs` (figures de l'action), `steps`, `note` |
| `s` | Code initial de l'éditeur |
| `x` | TP à cocher (le bouton de validation s'active seulement quand tout est coché) |

Les figures sont **des SVG inline** (`figures.js`) : elles marchent hors ligne, dans les 3 thèmes, et sur n'importe quel écran — contrairement à des images externes.

---

## 📍 État d'avancement du contenu

- [x] Moteur du site + monde visuel (rail de mois, aimants, sync)
- [x] Plan complet des 180 jours
- [x] Leçons détaillées sérieuses : **jours 1 à 60**, actualisées en mode académique
- [x] Lexique zéro-dev sur les 180 jours + figures des actions PC
- [ ] Leçons détaillées : jours 61 à 180 *(générique enrichi en attendant)*
- [x] Export / import via compte (multi-terminaux)
- [x] Mode installable PWA
- [x] Fichier unique hors ligne (téléphone/tablette)

### Sources académiques (leçons 1–60)

Les leçons des 60 premiers jours s'appuient sur un socle à quatre sources, avec resserrage pédagogique « définition → mécanisme → exemple annoté → pièges → synthèse » :

- **« Chapitre I WEB »** (support de cours fourni : définitions du HTML, balises simples/doubles, DOCTYPE — mode Standard vs Quirks, hiérarchie des titres, images, zones réactives `map`/`area`, `<audio>`, liens externes/internes/ancres/mailto) — intégré aux jours 1–7, modernisé (`<font>`, `<marquee>` et autres attributs obsolètes remplacés par CSS).
- **Exercices « Chaînes de caractères »** (support fourni, exercices C++ transposés en JavaScript) : validation de format « 12h55 », voyelles, palindrome, conjugaison du 1ᵉʳ groupe, lettre la plus fréquente → jour 34 et jour 30.
- **OpenClassrooms** (« Écrivez du HTML5 et du CSS3 », design responsive) + **MDN Web Docs**.
- **Cisco NetAcad** (JavaScript Essentials 1/2) + **Merise** (fiche fournie) : approche d'analyse fonctionnelle des flux avant tout mini-projet (jours 7 et 41–45).

---

## 🛠️ Technologies

- **HTML5/CSS3/JS** — pas de framework, pas de build
- **CSS `color-mix`, clamp(), media queries** — thème pastel + responsive fluide
- **Supabase JS v2** (CDN, mis en cache par le SW) — auth (email + Google/GitHub) + Postgres RLS
- **Service worker** — cache-first app shell, stale-while-revalidate sur le CDN
- **`build-standalone.js`** — compile toute la plateforme en un seul HTML (217 Ko) pour l'usage mobile offline

---

## 📄 Licence

**MIT** — voir le fichier [`LICENSE`](LICENSE).

Tu es libre d'utiliser, copier, modifier et redistribuer Shift180, y compris dans un usage commercial, à condition de conserver la note de copyright. Le texte complet des permissions et de la garantie limitée est dans le fichier `LICENSE`.

> 💡 Droit moral : la MIT ne le couvre pas (il est inaliénable) — tu restes reconnu comme **l'auteur** (« Shift180 · Créé par Emmanuel Jeancy BILOMBO-SILAHO »), ce que le footer des pages fait déjà naturellement.

Voir aussi [`CREDITS.md`](CREDITS.md) : tous les crédits des supports et sources qui ont nourri le projet.

---

## 👤 Auteur

**Emmanuel Jeancy BILOMBO-SILAHO**, développeur congolais, étudiant en génie logiciel.

> *« Un jour, une leçon. 180 jours pour devenir développeur Fullstack. »*
