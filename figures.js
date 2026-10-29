// figures.js — figures pédagogiques SVG inline (dessous : hors ligne, sans dépendance réseau)
// + LEXIQUE : définitions zéro-dev des termes techniques, injectées au fil des cours.
/* eslint-env browser */

window.FIGS = {
  requete: {
    cap: "Le voyage d'une demande : ton navigateur (client) demande l'adresse au DNS, puis parle au serveur, qui répond en HTTP.",
    svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Schéma navigateur - DNS - serveur">
      <rect x="0" y="0" width="480" height="240" rx="18" fill="var(--card)" stroke="var(--line)"/>
      <rect x="28" y="84" width="112" height="72" rx="12" fill="var(--peach)"/>
      <text x="84" y="118" text-anchor="middle" font-size="15" font-weight="700" fill="var(--peach-ink)">Navigateur</text>
      <text x="84" y="136" text-anchor="middle" font-size="11" fill="var(--peach-ink)">(le client)</text>
      <rect x="184" y="84" width="112" height="72" rx="12" fill="var(--sky)"/>
      <text x="240" y="112" text-anchor="middle" font-size="15" font-weight="700" fill="var(--sky-ink)">DNS</text>
      <text x="240" y="130" text-anchor="middle" font-size="11" fill="var(--sky-ink)">annuaire</text>
      <text x="240" y="146" text-anchor="middle" font-size="11" fill="var(--sky-ink)">exemple.com → IP</text>
      <rect x="340" y="84" width="112" height="72" rx="12" fill="var(--mint)"/>
      <text x="396" y="112" text-anchor="middle" font-size="15" font-weight="700" fill="var(--mint-ink)">Serveur</text>
      <text x="396" y="130" text-anchor="middle" font-size="11" fill="var(--mint-ink)">ordi. toujours allumé</text>
      <text x="396" y="146" text-anchor="middle" font-size="11" fill="var(--mint-ink)">rend des pages</text>
      <path d="M148 106 H 178 M 304 106 H 334" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" marker-end="none"/>
      <path d="M334 134 H 304 M 178 134 H 148" stroke="var(--brand)" stroke-width="4" stroke-linecap="round"/>
      <text x="240" y="60" text-anchor="middle" font-size="12" font-weight="600" fill="var(--muted)">1 · demande « où est exemple.com ? » → 2 · « voilà son IP »</text>
      <text x="240" y="190" text-anchor="middle" font-size="12" font-weight="600" fill="var(--brand)">3 · requête HTTP ⤞ 4 · réponse : HTML + statut 200</text>
    </svg>`
  },
  url: {
    cap: "Anatomie d'une URL : le protocole, le domaine, le chemin.",
    svg: `<svg viewBox="0 0 480 190" role="img" aria-label="Découpage d'une URL">
      <rect x="0" y="0" width="480" height="190" rx="18" fill="var(--card)" stroke="var(--line)"/>
      <rect x="30" y="62" width="420" height="56" rx="12" fill="var(--board)" stroke="var(--line-strong)"/>
      <circle cx="52" cy="90" r="7" fill="var(--mint-strong)"/><circle cx="70" cy="90" r="7" fill="var(--butter)"/>
      <text x="96" y="95" font-size="14" font-family="ui-monospace, monospace"><tspan fill="var(--sky-ink)" font-weight="700">https://</tspan><tspan fill="var(--peach-ink)" font-weight="700">monsite.congo</tspan><tspan fill="var(--mint-ink)" font-weight="700">/courses/page.html</tspan></text>
      <path d="M96 130 v14 M96 130 h 66 M 202 130 v14 M202 130 h 110 M 346 130 v14 M346 130 h 84" stroke="var(--muted)" stroke-width="2"/>
      <text x="129" y="160" text-anchor="middle" font-size="12" fill="var(--sky-ink)" font-weight="700">protocole</text>
      <text x="257" y="160" text-anchor="middle" font-size="12" fill="var(--peach-ink)" font-weight="700">domaine</text>
      <text x="388" y="160" text-anchor="middle" font-size="12" fill="var(--mint-ink)" font-weight="700">chemin</text>
      <text x="240" y="40" text-anchor="middle" font-size="12" font-weight="600" fill="var(--muted)">« l'adresse postale » d'une page web</text>
    </svg>`
  },
  f12: {
    cap: "Où est la touche F12 (clavier de PC) : en haut à droite, à côté de F11.",
    svg: `<svg viewBox="0 0 480 230" role="img" aria-label="Clavier avec F12 en surbrillance">
      <rect x="0" y="0" width="480" height="230" rx="18" fill="var(--card)" stroke="var(--line)"/>
      <text x="240" y="40" text-anchor="middle" font-size="13" font-weight="600" fill="var(--muted)">Rangée de touches fonctions d'un clavier de PC</text>
      <rect x="30" y="66" width="420" height="58" rx="10" fill="var(--board)" stroke="var(--line-strong)"/>
      <rect x="52" y="78" width="38" height="34" rx="7" fill="var(--card)" stroke="var(--line-strong)"/>
      <text x="71" y="100" text-anchor="middle" font-size="12" fill="var(--ink)">F8</text>
      <rect x="98" y="78" width="38" height="34" rx="7" fill="var(--card)" stroke="var(--line-strong)"/>
      <text x="117" y="100" text-anchor="middle" font-size="12" fill="var(--ink)">F9</text>
      <rect x="144" y="78" width="38" height="34" rx="7" fill="var(--card)" stroke="var(--line-strong)"/>
      <text x="163" y="100" text-anchor="middle" font-size="12" fill="var(--ink)">F10</text>
      <rect x="190" y="78" width="38" height="34" rx="7" fill="var(--card)" stroke="var(--line-strong)"/>
      <text x="209" y="100" text-anchor="middle" font-size="12" fill="var(--ink)">F11</text>
      <rect x="236" y="72" width="46" height="46" rx="9" fill="var(--peach)" stroke="var(--peach-strong)" stroke-width="3"/>
      <text x="259" y="101" text-anchor="middle" font-size="14" font-weight="800" fill="var(--peach-ink)">F12</text>
      <rect x="290" y="78" width="38" height="34" rx="7" fill="var(--card)" stroke="var(--line-strong)"/>
      <g stroke="var(--ink)" stroke-width="1.8" fill="none" stroke-linecap="round"><circle cx="309" cy="92.5" r="6.2"/><path d="M306.5 101.5h5M307.5 104.5h3"/></g>
      <path d="M259 150 q 0 26 30 30" stroke="var(--peach-strong)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <text x="240" y="190" text-anchor="middle" font-size="13" font-weight="700" fill="var(--peach-ink)">Presse F12 → l'outillage du navigateur s'ouvre au bas de la page</text>
    </svg>`
  },
  devtools: {
    cap: "Le navigateur après F12 : la page en haut, l'outillage (Console, Éléments, Réseau) en bas.",
    svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Fenêtre du navigateur avec outils de développement">
      <rect x="0" y="0" width="480" height="250" rx="18" fill="var(--card)" stroke="var(--line)"/>
      <rect x="26" y="22" width="428" height="88" rx="10" fill="var(--board)" stroke="var(--line-strong)"/>
      <rect x="40" y="36" width="150" height="13" rx="6" fill="var(--mint)"/>
      <rect x="40" y="58" width="240" height="8" rx="4" fill="var(--line-strong)"/>
      <rect x="40" y="74" width="200" height="8" rx="4" fill="var(--line)"/>
      <rect x="330" y="36" width="108" height="58" rx="8" fill="var(--sky)"/>
      <text x="384" y="70" text-anchor="middle" font-size="11" fill="var(--sky-ink)" font-weight="700">ta page</text>
      <rect x="26" y="122" width="428" height="108" rx="10" fill="#1e1d29"/>
      <rect x="40" y="134" width="86" height="22" rx="7" fill="var(--brand)"/>
      <text x="83" y="149" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">Console</text>
      <rect x="132" y="134" width="86" height="22" rx="7" fill="#3a3453"/>
      <text x="175" y="149" text-anchor="middle" font-size="11" fill="#cfc7f4" font-weight="600">Éléments</text>
      <rect x="224" y="134" width="86" height="22" rx="7" fill="#3a3453"/>
      <text x="267" y="149" text-anchor="middle" font-size="11" fill="#cfc7f4" font-weight="600">Réseau</text>
      <text x="44" y="180" font-size="12" font-family="ui-monospace, monospace" fill="#b7e3c3">› console.log("bonjour")</text>
      <text x="44" y="200" font-size="12" font-family="ui-monospace, monospace" fill="#a29dbb">  bonjour</text>
      <text x="240" y="243" text-anchor="middle" font-size="11" fill="var(--muted)" font-weight="600">l'outillage développeur — ta loupe sur la page</text>
    </svg>`
  },
  ctrlentree: {
    cap: "La combinaison Ctrl + Entrée : deux touches pressées en même temps.",
    svg: `<svg viewBox="0 0 480 200" role="img" aria-label="Touches Ctrl et Entrée en surbrillance">
      <rect x="0" y="0" width="480" height="200" rx="18" fill="var(--card)" stroke="var(--line)"/>
      <rect x="44" y="58" width="392" height="70" rx="10" fill="var(--board)" stroke="var(--line-strong)"/>
      <rect x="72" y="70" width="64" height="46" rx="9" fill="var(--peach)" stroke="var(--peach-strong)" stroke-width="3"/>
      <text x="104" y="99" text-anchor="middle" font-size="15" font-weight="800" fill="var(--peach-ink)">Ctrl</text>
      <rect x="150" y="70" width="128" height="46" rx="9" fill="var(--card)" stroke="var(--line-strong)"/>
      <text x="214" y="99" text-anchor="middle" font-size="12" fill="var(--muted)">… autres touches</text>
      <rect x="292" y="70" width="118" height="46" rx="9" fill="var(--peach)" stroke="var(--peach-strong)" stroke-width="3"/>
      <text x="351" y="99" text-anchor="middle" font-size="14" font-weight="800" fill="var(--peach-ink)">Entrée ⏎</text>
      <text x="240" y="160" text-anchor="middle" font-size="13" font-weight="700" fill="var(--peach-ink)">Ctrl maintenu + petit coup d'Entrée = « exécuter mon code »</text>
    </svg>`
  },
  fileopen: {
    cap: "Sur PC : ouvrir le fichier index.html depuis le dossier cloné (double-clic → il s'ouvre dans le navigateur).",
    svg: `<svg viewBox="0 0 480 230" role="img" aria-label="Double-clic sur index.html dans le dossier">
      <rect x="0" y="0" width="480" height="230" rx="18" fill="var(--card)" stroke="var(--line)"/>
      <rect x="30" y="34" width="200" height="150" rx="12" fill="var(--board)" stroke="var(--line-strong)"/>
      <text x="130" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="var(--peach-ink)">Dossier Shift180</text>
      <rect x="46" y="76" width="80" height="16" rx="5" fill="var(--card)"/><text x="60" y="88" font-size="10" fill="var(--muted)">style.css</text>
      <rect x="46" y="100" width="80" height="16" rx="5" fill="var(--card)"/><text x="60" y="112" font-size="10" fill="var(--muted)">app.html</text>
      <rect x="46" y="124" width="80" height="16" rx="5" fill="var(--peach)" stroke="var(--peach-strong)" stroke-width="2"/>
      <text x="62" y="136" font-size="10" font-weight="700" fill="var(--peach-ink)">index.html</text>
      <path d="M60 96 l6 6 l10 -12" stroke="var(--mint-ink)" stroke-width="2.4" fill="none"/>
      <path d="M250 108 h 46" stroke="var(--brand)" stroke-width="5" stroke-linecap="round"/>
      <path d="M292 96 l 16 12 l -16 12" fill="none" stroke="var(--brand)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="330" y="60" width="120" height="100" rx="12" fill="var(--sky)" opacity=".9"/>
      <text x="390" y="100" text-anchor="middle" font-size="13" font-weight="700" fill="var(--sky-ink)">Navigateur</text>
      <text x="390" y="120" text-anchor="middle" font-size="11" fill="var(--sky-ink)">affiche la page</text>
      <text x="240" y="212" text-anchor="middle" font-size="12" font-weight="600" fill="var(--muted)">aucun serveur requis : le navigateur lit les fichiers en local</text>
    </svg>`
  },
  terminal: {
    cap: "Un terminal : tu tape des commandes directes, ligne par ligne.",
    svg: `<svg viewBox="0 0 480 230" role="img" aria-label="Fenêtre de terminal">
      <rect x="0" y="0" width="480" height="230" rx="18" fill="var(--card)" stroke="var(--line)"/>
      <rect x="34" y="28" width="412" height="170" rx="12" fill="#1e1d29"/>
      <circle cx="56" cy="46" r="5" fill="#f09a52"/><circle cx="72" cy="46" r="5" fill="#74bd8d"/><circle cx="88" cy="46" r="5" fill="#8b7fd8"/>
      <text x="240" y="50" text-anchor="middle" font-size="11" fill="#a29dbb">terminal</text>
      <text x="54" y="86" font-size="13" font-family="ui-monospace, monospace" fill="#bfd9f2">PS C:\\projets&gt;</text>
      <text x="160" y="86" font-size="13" font-family="ui-monospace, monospace" fill="#efebdf">git init</text>
      <text x="54" y="112" font-size="13" font-family="ui-monospace, monospace" fill="#74bd8d">Initialized empty Git repository</text>
      <text x="54" y="140" font-size="13" font-family="ui-monospace, monospace" fill="#bfd9f2">PS C:\\projets&gt;</text>
      <text x="160" y="140" font-size="13" font-family="ui-monospace, monospace" fill="#efebdf">git status</text>
      <text x="54" y="166" font-size="13" font-family="ui-monospace, monospace" fill="#a29dbb">nothing to commit, working tree clean</text>
      <text x="240" y="228" text-anchor="middle" font-size="11" fill="var(--muted)" font-weight="600">les commandes Git (et plus tard npm) se tapent ici</text>
    </svg>`
  },
  gitflow: {
    cap: "Le cycle Git : le dossier local se synchronise avec le dépôt GitHub (push → en ligne, pull → vers toi).",
    svg: `<svg viewBox="0 0 480 230" role="img" aria-label="Cycle local - GitHub">
      <rect x="0" y="0" width="480" height="230" rx="18" fill="var(--card)" stroke="var(--line)"/>
      <rect x="34" y="70" width="140" height="90" rx="12" fill="var(--peach)"/>
      <text x="104" y="104" text-anchor="middle" font-size="14" font-weight="700" fill="var(--peach-ink)">Ton dossier</text>
      <text x="104" y="126" text-anchor="middle" font-size="11" fill="var(--peach-ink)">+ git add / commit</text>
      <rect x="306" y="70" width="140" height="90" rx="12" fill="var(--mint)"/>
      <text x="376" y="104" text-anchor="middle" font-size="14" font-weight="700" fill="var(--mint-ink)">GitHub</text>
      <text x="376" y="126" text-anchor="middle" font-size="11" fill="var(--mint-ink)">le dépôt en ligne</text>
      <path d="M182 100 H 296" stroke="var(--brand)" stroke-width="4" stroke-linecap="round"/>
      <path d="M296 92 l 12 8 l -12 8" fill="var(--brand)"/>
      <text x="240" y="86" text-anchor="middle" font-size="12" font-weight="700" fill="var(--brand-strong)">git push ⤞</text>
      <path d="M296 130 H 182" stroke="var(--muted)" stroke-width="4" stroke-linecap="round"/>
      <path d="M182 122 l -12 8 l 12 8" fill="var(--muted)"/>
      <text x="240" y="156" text-anchor="middle" font-size="12" font-weight="600" fill="var(--muted)">git pull ⤞ vers toi</text>
      <text x="240" y="200" text-anchor="middle" font-size="12" font-weight="600" fill="var(--muted)">commit = point de sauvegarde · push = publier</text>
    </svg>`
  },
  boxmodel: {
    cap: "La boîte CSS vue par le navigateur : contenu, padding, bordure, marge (Ctrl+Maj+I / F12 pour la lire en direct).",
    svg: `<svg viewBox="0 0 480 230" role="img" aria-label="Le modèle de boîte CSS">
      <rect x="0" y="0" width="480" height="230" rx="18" fill="var(--card)" stroke="var(--line)"/>
      <rect x="70" y="30" width="340" height="150" rx="12" fill="var(--sky)" opacity=".55"/>
      <text x="240" y="48" text-anchor="middle" font-size="12" font-weight="700" fill="var(--sky-ink)">marge (margin)</text>
      <rect x="110" y="60" width="260" height="110" rx="10" fill="var(--mint)" opacity=".7"/>
      <text x="240" y="80" text-anchor="middle" font-size="12" font-weight="700" fill="var(--mint-ink)">bordure (border)</text>
      <rect x="150" y="90" width="180" height="70" rx="8" fill="var(--butter)"/>
      <text x="240" y="108" text-anchor="middle" font-size="12" font-weight="700" fill="var(--butter-ink)">padding (coussin)</text>
      <rect x="185" y="116" width="110" height="32" rx="6" fill="var(--card)" stroke="var(--line-strong)"/>
      <text x="240" y="137" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">contenu</text>
      <text x="240" y="208" text-anchor="middle" font-size="12" fill="var(--muted)" font-weight="600">la largeur réelle = contenu + paddings + bordures (sauf box-sizing)</text>
    </svg>`
  },
  devmode: {
    cap: "Le « mode appareil » du navigateur : transformer la fenêtre en écran de téléphone pour tester le responsive sur PC.",
    svg: `<svg viewBox="0 0 480 230" role="img" aria-label="Mode appareil du navigateur">
      <rect x="0" y="0" width="480" height="230" rx="18" fill="var(--card)" stroke="var(--line)"/>
      <rect x="30" y="28" width="420" height="150" rx="12" fill="var(--board)" stroke="var(--line-strong)"/>
      <rect x="44" y="40" width="392" height="20" rx="6" fill="var(--card)" stroke="var(--line)"/>
      <rect x="340" y="43" width="34" height="14" rx="4" fill="var(--brand)"/>
      <g fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"><rect x="353" y="44.5" width="8" height="11" rx="2"/><path d="M355.5 53h3"/></g>
      <rect x="150" y="70" width="120" height="94" rx="12" fill="var(--sky)" stroke="var(--sky-ink)"/>
      <rect x="164" y="84" width="92" height="34" rx="7" fill="var(--card)"/>
      <rect x="164" y="128" width="92" height="8" rx="4" fill="var(--card)"/>
      <rect x="164" y="142" width="60" height="8" rx="4" fill="var(--card)" opacity=".7"/>
      <text x="240" y="200" text-anchor="middle" font-size="11" fill="var(--muted)" font-weight="600">F12 → petite icône téléphone → teste 390, 768, 1200 px sans vrai téléphone</text>
    </svg>`
  }
};

/* ---------------- LEXIQUE : zéro-dev, au fil du texte ---------------- */
window.GLOSS = {
  DNS: "L'annuaire d'Internet : il traduit les noms de domaines (exemple.com) en adresses IP de machines.",
  IP: "L'adresse d'une machine sur le réseau — son « numéro de téléphone » internet.",
  serveur: "Un ordinateur toujours allumé qui répond aux demandes des navigateurs : il « sert » des pages.",
  client: "Le logiciel qui demande : sur le web, c'est presque toujours ton navigateur.",
  HTTP: "Le langage des requêtes entre navigateur et serveur (« GET », « 200 OK »…).",
  HTTPS: "HTTP chiffré : personne entre toi et le serveur ne peut lire le dialogue (le cadenas du navigateur).",
  TCP: "Le protocole qui fiabilise la livraison des données sur le réseau (paquets perdus renvoyés).",
  TLS: "La couche de chiffrement derrière le « S » de HTTPS.",
  URL: "L'adresse complète d'une ressource : protocole + domaine + chemin.",
  statut: "Le code de réponse HTTP : 200 = OK, 404 = introuvable, 500 = bug côté serveur.",
  protocole: "Des règles communes que deux machines respectent pour se comprendre.",
  domaine: "Le nom lisible qui remplace l'IP : github.com est un domaine.",
  navigateur: "Le logiciel qui lit le HTML/CSS/JS et affiche la page (Chrome, Firefox, Safari…).",
  hébergeur: "La société qui fait tourner ton site 24 h/24 (GitHub Pages, Netlify, Vercel…).",
  hébergement: "Le service qui rend ton site accessible en permanence depuis Internet.",
  déploiement: "Mettre ton site en ligne sur un hébergeur : une URL que tout le monde peut ouvrir.",
  dépôt: "Un « repo » : le dossier de ton projet suivi par Git, ici hébergé par GitHub.",
  cloner: "Récupérer une copie complète d'un dépôt Git sur ta machine.",
  Git: "Le logiciel de suivi de versions : il enregistre l'historique complet de ton code.",
  GitHub: "Le site qui héberge les dépôts Git en ligne et les rend collaboratifs.",
  commit: "Un point de sauvegarde Git : un message + un instantané du code.",
  branche: "Une copie parallèle du code pour travailler une idée sans casser la version principale.",
  terminal: "La fenêtre où tu tapes des commandes directes à la machine (Git, npm…).",
  console: "La zone du navigateur (F12) où s'affichent les messages de ton JavaScript et les erreurs.",
  'éditeur': "Le logiciel où on écrit le code (VS Code…) — ici, celui intégré à la page jour.",
  localhost: "Ton propre PC vu comme un serveur (http://localhost) — utile pour tester en local.",
  PWA: "Progressive Web App : un site installable comme une application (icône + fonctionnement hors ligne).",
  'service worker': "Le programme caché d'une PWA qui garde les fichiers en cache pour le hors ligne.",
  cache: "Une copie locale gardée par le navigateur pour aller vite et marcher sans réseau.",
  API: "Une porte d'entrée d'un autre service pour lire ou écrire des données par programme.",
  JSON: "Format de données à base de dictionnaires/listes — la langue des APIs.",
  frontend: "Tout ce qui tourne chez l'utilisateur : HTML, CSS, JS affiché par le navigateur.",
  backend: "Le code qui tourne sur un serveur : bases de données, sécurité, logique métier.",
  framework: "Une carcasse prête à l'emploi qui structure ton code (React, Node/Express).",
  bibliothèque: "Une boîte à outils de fonctions réutilisables qu'on appelle quand on veut (ex: lodash).",
  'librairie': "Équivalent courant de bibliothèque : du code prêt réutilisable.",
  composant: "Une brique d'interface réutilisable (bouton, carte) avec son affichage et son état.",
  state: "La mémoire interne d'un composant — quand elle change, l'écran se re-dessine.",
  props: "Les données qu'on passe à un composant de l'extérieur (des arguments).",
  hook: "Une fonction React qui branche ton composant sur le framework (ex: useState).",
  React: "Le framework frontend le plus répandu : construire l'interface en composants.",
  'Node.js': "JavaScript qui tourne hors du navigateur, sur une machine ou un serveur.",
  npm: "Le gestionnaire de paquets JS : télécharge et installe les librairies du projet.",
  Express: "Le mini-framework backend pour Node : routes, middlewares, API REST.",
  REST: "Style d'API web simple : des URLs par ressource + HTTP comme langage.",
  JWT: "Un jeton signé qui prouve ton identité aux APIs — un cadenas portable.",
  'base de données': "Un logiciel spécialisé pour ranger et retrouver des données vite et en sécurité.",
  MongoDB: "Base de données orientée documents : du JSON rangé.",
  PostgreSQL: "Base de données relationnelle robuste (utilisée par Supabase).",
  SQL: "Le langage pour interroger les bases relationnelles (SELECT, JOIN…).",
  CORS: "Le garde-fou du navigateur qui décide quels sites peuvent appeler une API.",
  authentification: "Prouver qui tu es (email + mot de passe, connexion Google…) pour un compte.",
  'mot de passe': "Secret de connexion — jamais en clair dans le code ni dans le dépôt.",
  cookie: "Un petit fichier que le serveur pose sur ton navigateur pour se souvenir de toi.",
  session: "L'état connecté d'un utilisateur entre deux visites.",
  Supabase: "Le backend-service utilisé par cette plateforme : comptes + base PostgreSQL hébergés.",
  responsive: "Un site qui s'adapte à l'écran : téléphone, tablette, PC.",
  accessibilité: "Rendre l'interface utilisable par tous : lecteurs d'écran, clavier seul, contrastes.",
  Lighthouse: "L'outil d'audit de Chrome (dans F12) qui note performance et accessibilité sur 100.",
  DOM: "L'arbre d'objets que le navigateur construit depuis ton HTML, manipulable en JavaScript.",
  asynchrone: "Ce qui attend sans bloquer : délais, réseau — gérés par promises et await.",
  promise: "L'objet qui représente une valeur qui arrivera plus tard (then / await).",
  fetch: "La fonction du navigateur pour demander une ressource sur le réseau (API, image…).",
  router: "Le chef d'orchestre des pages : décide quel écran afficher pour quelle URL.",
  middleware: "Une fonction qui reçoit une requête, la traite, puis la passe à la suivante.",
  migration: "Une modification versionnée du schéma d'une base de données.",
  'CI/CD': "L'automatisation qui teste puis publie ton code à chaque modification.",
  'environnement': "Le contexte d'exécution : local, recette, production.",
  '.env': "Fichier de secrets locaux (clés) — jamais poussé sur GitHub.",
  '.gitignore': "La liste des fichiers que Git doit ignorer (secrets, node_modules…).",
  Actions: "GitHub Actions : l'automatisation intégrée à GitHub qui teste et déploie à chaque push.",
  Pages: "GitHub Pages : l'hébergement gratuit d'un site statique depuis un dépôt.",
  WSL: "Windows Subsystem for Linux : une vraie console Linux à l'intérieur de Windows.",
  W3C: "Le consortium qui écrit les standards du web (validateur HTML, CSS…).",
  MDN: "La documentation de référence du web (de Mozilla) — ton réflexe de recherche."
};
