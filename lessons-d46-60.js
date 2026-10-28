// lessons-d46-60.js — Leçons détaillées jours 46 à 60 (DOM, apps JS, entrée React)
window.LESSONS_D4 = {
46:{t:`<div class="keepnote">🎯 Le DOM : ton JS touche à l'écran. À partir d'aujourd'hui, le code change ce qu'on VOIT.</div>
<h3>1. Le DOM est un arbre vivant</h3>
<pre><code>document                    → racine
 └─ html → head, body
       └─ div#app
            └─ button  …</code></pre>
<p>Modifier l'arbre = modifier l'écran, instantanément, sans recharger.</p>
<h3>2. Les 3 sélecteurs du quotidien</h3>
<pre><code>document.querySelector('#app')        // 1er correspondant (CSS style)
document.querySelectorAll('.task')   // NodeList → tableau via [...liste] → [...list]
document.getElementById('app')       // l'ancien rapide</code></pre>
<p>Toutes les APIs de traversal : <code>el.closest(sel)</code>, <code>el.parentElement</code>, <code>el.children</code>.</p>
<h3>3. Lire et écrire</h3>
<pre><code>el.textContent = 'texte brut'           // sécuritaire (HTML échappé)
el.innerHTML = '&lt;b&gt;gras&lt;/b&gt;'           // position dangerous : HTML exécuté
el.value = 'x' / el.style.color / el.classList</code></pre>
<h3>4. Créer et brancher</h3>
<pre><code>const d = document.createElement('div');
d.textContent = 'bonjour';
document.querySelector('#app').append(d);</code></pre>
<div class="keepnote">⚠️ innerHTML n'accueille JAMAIS une donnée utilisateur (XSS — jour 151). textContent, oui. Cette règle sauve des comptes.</div>`,
s:`<h2 id="titre">Hello</h2>\n<script>\n  const h = document.querySelector('#titre');\n  h.textContent = 'Hello — changé depuis JS';\n  h.style.color = 'steelblue';\n<\/script>`,
x:['La différence textContent vs innerHTML sur un &lt;script&gt; injecté','Créer une carte complète (createElement + append) en 1 clic','closest() : un clic qui trouve son parent bouton','querySelectorAll + for…of sur ce même panneau']},
47:{t:`<div class="keepnote">🎯 Événements : le dialogue de l'écran. addEventListener est le verbe du programmeur interactif.</div>
<h3>1. Le duo addEL/removeEL</h3>
<pre><code>el.addEventListener('click', (e) =&gt; {…});
// noms clés : click, input, submit, keydown, change, mouseenter, scroll, resize</code></pre>
<ul><li>Un handler reçoit un objet <b>event</b> : <code>e.target</code>, <code>e.key</code>, <code>e.clientX</code>, <code>e.preventDefault()</code>.</li>
<li>onclick = un seul handler; addEventListener = plusieurs. C'EST la façon pro.</li></ul>
<h3>2. Bubbling : l'événement remonte</h3>
<pre><code>liste.addEventListener('click', e =&gt; {
  const li = e.target.closest('li');   // délégation ! un listener pour mille éléments
});</code></pre>
<h3>3. preventDefault : quand on écrase le comportement natif</h3>
<pre><code>form.addEventListener('submit', e =&gt; { e.preventDefault(); });</code></pre>
<div class="keepnote">💡 Garde en tête : la <b>délégation</b> est LA pattern des listes dynamiques. Un seul listener sur le parent = tu écoutes tout, même les éléments créés après.</div>
<h3>4. Keyboard</h3>
<pre><code>input.addEventListener('keydown', e =&gt; { if (e.key === 'Enter') envoyer(); });</code></pre>`,
s:`<ul id="liste">\n  <li>HTML</li><li>CSS</li><li>JS</li>\n</ul>\n<script>\n  document.querySelector('#liste').addEventListener('click', e => {\n    const li = e.target.closest('li');\n    if (li) li.classList.toggle('actif');\n  });\n<\/script>\n<style>.actif { background: lavender; }</style>`,
x:['La délégation sur une liste (tous éléments par 1 listener)','Un formulaire qui refuse le submit natif (preventDefault + log)','keydown Enter → Focus/anne','Un compteur de clics sur un bouton (mutation du texte)']},
48:{t:`<div class="keepnote">🎯 Formulaires DOM : Lecture de FormData + validation — l'utilisateur est le POINT faible SCRUPULE de toute app réelle.</div>
<h3>1. La lecture propre : FormData</h3>
<pre><code>form.addEventListener('submit', e =&gt; {
  e.preventDefault();
  const d = new FormData(e.target);        // tous les champs de la page (name!)
  const data = Object.fromEntries(d);      // { nom: '…', mail: '…' }
});</code></pre>
<p>Le <b>name</b> de chaque input est la clé du POST. Sans name → donnée perdue.</p>
<h3>2. Validation d'abord HTML, re-en JS</h3>
<ul><li>Les attributs natifs (required, email, min) requièrent le contrôle avant submit.</li>
<li>JS vérifie une deuxième fois : <code>form.checkValidity()</code> ou la regex spécifique.</li>
<li>Message d'erreur dans l'écran, pas seulement en console.</li></ul>
<h3>3. Le vide comme règle d'art : On garde l'utilisateur au courant</h3>
<pre><code>afficheErreur(inputEl, 'Adresse email invalide');   // message près du champ
form.reset();  // Only after successful submit</code></pre>
<div class="keepnote">💡 Garde en tête : ne JAMAIS faire confiance au client : la validation front est une expérience user, pas une sécurité (rappel au jour 100).. Chez toi, quand le DOM est modifiable, tout est truquable.</div>`,
s:`<form id="f">\n  <input name="nom" required placeholder="nom">\n  <input name="mail" type="email" required placeholder="email">\n  <button>Envoyer</button>\n  <p id="msg"></p>\n</form>\n<script>\n  document.querySelector('#f').addEventListener('submit', e => {\n    e.preventDefault();\n    const d = Object.fromEntries(new FormData(e.target));\n    document.querySelector('#msg').textContent = 'Reçu : ' + d.nom + ' <' + d.mail + '>';\n  });\n<\/script>`,
x:['Form 3 champs → FormData → affiché dans la page','Validation longue : minimum 3 caractères + message','Un placeholder + label liés (rappel du jour 5)','reset() après success + toast console']},
49:{t:`<div class="keepnote">🎯 LocalStorage : la mémoire entre les visites. C'est elle qui fait des web apps des apps persistentes.</div>
<h3>1. L'API 3-lignes</h3>
<pre><code>localStorage.setItem('k', 'valeur');       // texte only (!)
localStorage.getItem('k');                  // string ou null
localStorage.removeItem('k');
JSON.stringify(obj) / JSON.parse(obj)      // dans les 2 sens</code></pre>
<h3>2. La bonne pratique : un seul clé par app</h3>
<pre><code>const K = 'todo.v1';
function sauver(state) { localStorage.setItem(K, JSON.stringify(state)); }
function charger() { return JSON.parse(localStorage.getItem(K) || 'null') ?? { taches: [] }; }</code></pre>
<ul><li>try/catch sur parse : un JSON corrompu ne doit pas briser l'app.</li>
<li>localStorage synchronique (bloque) et limité (~5 Mo). Asynchrone et gros → IndexedDB (plus tard).</li></ul>
<h3>3. La différence avec les cookies</h3>
<ul><li>Cookie : partagent le serveur automatiquement (qui a sa function).</li>
<li>localStorage : purement client, aucun envoi réseau — c'est TOI qui synchronises (raison pour quoi cette plateforme le fait manuellement !).</li></ul>
<div class="keepnote">💡 Garde en tête : localStorage = <b>cache local vivant pendant la session offline-first</b>. Le jour 2 elle mélange la progression et le code grâce à cette même API construite en v2 clé.</div>`,
s:`const K = 'note.v1';\nconst noteIn = document.querySelector('#nIn'), out = document.querySelector('#pre');\nfunction save(t) { localStorage.setItem(K, t); } // ← compléte par read + render\n<p>\n  <input id="nIn" placeholder="note" />\n  <button onclick="save(document.querySelector('#nIn').value || 'vide')">Save</button>\n</p>\n<pre id="pre"></pre>`,
x:['setItem / getItem sur un champ de note (persistance après refresh)','JSON round-trip d\'un objet à 3 clés','Un JSON corrompu : try/catch + fallback {}']},
50:{t:`<div class="keepnote">🎯 Fetch : la passerelle vers API. Aujourd'hui, retiens : fetch renvoie une PROMISE — donc le jour 38/39 déjà t'est parvenu.</div>
<h3>1. Read (GET)</h3>
<pre><code>const r = await fetch('https://api.github.com/users/emmanuel/repos');
if (!r.ok) throw new Error('HTTP ' + r.status);           // fetch NE rejette PAS les 4xx !
const data = await r.json();</code></pre>
<h3>2. Write (POST)</h3>
<pre><code>await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ titre: 'bonjour' })
});</code></pre>
<h3>3. Ce que tu dois RETENIR absolument</h3>
<ul><li><code>fetch</code> resolve même en 404/500. vérifier <code>r.ok</code> — piège n°1 des débutants.</li>
<li><code>r.json()</code> est aussi un a wait : le body est une promesse (readable stream).</li>
<li>CORS : le serveur doit y autoriser (basé sur l'En-tête).</li></ul>
<div class="keepnote">💡 Garde en tête : les trois étapes de chaque fetch : fetch → check r.ok → r.json(). Considère sur l'API JSONPlaceholder ou GitHub : lisible sans clé.</div>`,
s:`async function chargeRepo() {\n  try {\n    const r = await fetch('https://api.github.com/users/octocat/repos?per_page=3');\n    if (!r.ok) throw new Error('HTTP ' + r.status);\n    const d = await r.json();\n    console.table(d.map(x => ({ nom: x.name, ★: x.stargazers_count })));\n  } catch (e) { console.error('fetch raté:', e.message); }\n}\nchargeRepo();  // cette API est réelle — teste !`,
x:['fetch GET + check r.ok + json sur une API publique','POST sur jsonplaceholder + log du résultat','Un r.status vérifié une erreur 404 intentionnelle','2 fetches parallèles (Promise.all) — rappel du J39']},
51:{t:`<h3>Projet J51 : « Liste de tâches » (le rituel : jour 1 de tout développeur)</h3>
<p>Une Todo interactive complète, en 4 étapes :</p>
<ol><li>render(todos) : redessine la liste en DOM (li × checkbox + bouton ✕).</li>
<li>ajouter via formulaire (J48 : FormData + preventDefault).</li>
<li>cocher = toggle un booléen + barre de progression %.</li>
<li><b>persist</b> au localStorage (J49) — ferme, rouvre : ce doit être là.</li></ol>
<h3>Le concept de render : TOUT depuis les données</h3>
<p>Une fonction <code>render()</code> unique : à partir de l'état complet, redessine. Fini les bugs de désynchronisation entre state et UI.</p>
<div class="keepnote">💡 Garde en tête : <code>étan</code> = un seul objet clever <code>{ taches: [] }</code>. Toute action modifies cet objet PUIS appelle render(). Ce réflexe décrit 15 jours avant les hooks React et compagnie.</div>`,
s:`<form id="f"><input name="t"><button>Ajouter</button></form>\n<ul id="list"></ul>\n<script>\n  const state = { taches: [] };\n  function render() {\n    document.querySelector('#list').innerHTML = state.taches\n      .map((t, i) => \`<li>\${t}</li>\`).join('');  // TODO : checkbox + ✕\n  }\n<\/script>`,
x:['Form → ajoute au state → render attends le DOM','Le toggle checkbox → state sync (coche persiste)','Suppression ✕ (délégation d\'événement J47)','Persistance localStorage complète au refresh']},
52:{t:`<h3>Projet J52 : « Calculatrice » (événements + gris + état compact)</h3>
<p>Une calculatrice de bureau en 3 zones :</p>
<ol><li>Écran : caraće <code>#ecran</code> (textContent).</li>
<li>Grille boutons 4×4 : chifres, opérateurs, C, =' + boutons en grid (J13).</li>
<li>Logique : opérateur binaire retenus (chiffre courant + opérateur courant), écrire sans eval() (le malin sécurité).</li>
<li>Calculator : gestion décimale + division par 0.</li></ol>
<h3>Ce que ce TP fait travailler</h3>
<ul><li>La délégation d'événement sur une grille entière (un listener)</li>
<li>Le state c readonly machine</li>
<li>Il gère des états vivants: input de décimales, reset sur opération.</li></ul>
<div class="keepnote">🙂 Règle d'or du TP : jamais <code>eval()</code>. Une calculatrice qui éval le code utilisateur est une faille — le chemin du calcul doit passer par des nombres réels.</div>`,
s:`<div id="ecran">0</div>\n<div id="pad"></div>\n<script>\n  // TO DO: grid buttons [7 8 9 ÷] [4 5 6 ×] [1 2 3 -] [0 . C +] [=]\n<\/script>\n<style>\n  #pad { display: grid; grid-template-columns: repeat(4, 60px); gap: 6px }\n  #pad button { padding: 12px }\n</style>`,
x:['Grille 4×4 généré par JS (for + createElement)','Inputs → number accéléroire courant + opérateur stocked','= calcule sans eval (2 opérandes max)','C reset + division par 0 message interessante']},
53:{t:`<h3>Projet J53 : « Chronomètre & minuter » (intervalle + états)</h3>
<p>Un timer professionnel :</p>
<ol><li>Démarrer/Pause : un setInterval (J37) qui actualise chaque 10ms → 2 décimales).</li>
<li>format : mm:ss.cs via <code>padStart</code> (J34).</li>
<li>Ré-initialiser : annule les timers — clean-up est LE réflexe utilisé aussi par useEffect (J61).</li>
<li>Laps : push dans un tableau + liste historique.</li></ol>
<h3>Ce que ce TP fait travailler</h3>
<ul><li>Date.now() vs performance.now (précision infra-millisecondes)</li>
<li>Le cleanup des intervalles (le plus oublié des devs débutants)</li>
<li>Désactivation intelligente des boutons (disabled selon l'état)</li></ul>
<div class="keepnote">💡 Garde en tête : poll c'est moins précis — le VRAI affichage date de Date.now() comme référence : retrait de la durée différencie chaque tick indépendamment des délais de JS. Cette méthode garantit un chronomètre précis même si le navigateur est lent.</div>`,
s:`<span id="ecran">00:00.0</span>\n<button id="start">Démarrer</button> <button id="lap">Lap</button> <button id="reset">Reset</button>\n<ol id="laps"></ol>\n<script>\n  const e = document.querySelector('#ecran');\n  const t0=performance.now(); // TODO —setTimeout : e.textContent = fmt(...)\n  function fmt(ms) { /* mm:ss.cs via padStart */ }\n<\/script>`,
x:['Le compteur performance.now LIVE','Pause/resume propre (jamais de double intervalle)','fmt via padStart : 2 chiffres partout (01:05.3)','Lap push + liste historique']},
54:{t:`<h3>Projet J54 : « Galerie images » (fetch + DOM + UI charge)</h3>
<p>Une galerie avec images réelles d'API (picsum) :</p>
<ol><li>Pagination de fetch : <code>https://picsum.photos/v2/list?page=1&limit=9</code>.</li>
<li>Chaque image → card fig + figcaption + auteur. <b>loading="lazy"</b> (J4).</li>
<li>Bouton « suivant » → page+1 (appends to grid, pas remplacer). Spinner pendant fetch.</li>
<li>Un clic image → swap modal (overlay + image large) à clore par clic extérieur/Escape.</li></ol>
<h3>Ce que ce TP fait travailler</h3>
<ul><li>Un fetch UI-state : loading → données, error, fin (le TEMPLATE des apps fetch)</li>
<li>Modal : overlay pos fixed + délégation cliquer-backdrop + keyboard</li>
<li>UX : boutons désactivés pendant la requête (protection contre le double-clic)</li></ul>
<div class="keepnote">🙂 État d'« une interface de requête » blanc : doute loading / idle / error / vide — les quatre des réponses doivent être visibles distinctes. Re-feinissent chaque page API plus tard.</div>`,
s:`<div id="galerie"></div>\n<button id="suite">Charger 9 images</button>\n<script>\n  async function charge() {\n    // TODO : fetch picsum list page --append cards <figure>\n  }\n  document.querySelector('#suite').addEventListener('click', charge);\n<\/script>`,
x:['fetch + render cards (figure / figcaption / alt)','Page-suivant cumulatif + bouton disabled pendant la load','Modal ouvert/fermé (clic extérieur + Escape)','Un état erreur GET (page inexistante) affiché en page']},
55:{t:`<h3>Projet J55 : « L'assemblage final JS » — todo + galerie + timer dans UNE app à onglets</h3>
<p>La synthèse de J51–J54 :</p>
<ol><li>Navigation à onglets : 3 onglets (Todo, Gallerie, Minuteur) via délégation + classes .hidden.</li>
<li>Chaque module : son render() indépendant, son état local propre.</li>
<li>Pile finale : header (titre + date) / nav onglets / zone / footer.</li>
<li>Persistance : la todo persiste, le timer reset à chaque refresh (doc : c'est une app métier, pas un serveur).</li></ol>
<h3>L'architecture du navigateur SPA avant React</h3>
<p>Le clone de vue par onglets est exactement LE pattern académique du React Router (J66) : state de route → render. Ce layout mental est ce quiMicron utilise 10 jours plus tard sans effort.</p>
<div class="keepnote">🎉 MOIS 2 COMPLET. Tu viens de CODER une SPA vanilla : tu sais inventer du state, celui. React sera l'outillage de tout ce que tu viens de comprendre à la main.</div>`,
s:`<nav>\n  <button data-tab="todo">Todo</button> <button data-tab="gal">Galerie</button> <button data-tab="minu">Minuteur</button>\n</nav>\n<section id="tab-todo"></section> <section id="tab-gal" hidden></section> <section id="tab-minu" hidden></section>`,
x:['Délégation nav → show/hide des onglets','Les 3 modules intégrés + états indépendants','Pas de fonctons entrelacées : render séparé, états séparés','Écriture bilan Mois 2 : 3 acquis, 2 à revoir']},
56:{ figs:['terminal'], pc:{ figs:['terminal'], steps:[
 'Sur PC : installe <b>Node.js LTS</b> (nodejs.org, installateur en 4 clics). Vérifie : <code>node -v</code> et <code>npm -v</code> dans le terminal (voir la figure).',
 'À la racine de tes projets : <code>npm create vite@latest mon-app -- --template react</code>, puis <code>cd mon-app && npm install</code>.',
 '<code>npm run dev</code> → ouvre <b>http://localhost:5173</b> : ta première app React tourne en local.',
 'Dans un éditeur de code (<b>VS Code</b>, gratuit) à installer si besoin : modifie <code>App.jsx</code>, sauvegarde (Ctrl+S) → le navigateur se met à jour tout seul (HMR).'],
 note:'Pas de PC ce soir ? Utilise StackBlitz ou CodeSandbox (navigateur) : la logique reste identique, seul le terminal diffère.'},
t:`<div class="keepnote">🎯 React : le framework orienté composant. On voit aujourd'hui CE POURQUOI le framework existe. (C'est aussi la partie où ton terminal devient ton poste de travail.)</div>
<h3>1. Ce que React résout</h3>
<p>En vanilla, tu gères l'état ET le rendu manuellement (attach/détach éléments, listeners dupliqués, sync des textes). React automatise LE RENDU déclaratif : tu décrits la vue selon l'état, React se colletine le recalcul.</p>
<h3>2. L'installation</h3>
<p>Aujourd'hui, pas d'éditeur web : le React vit hors navigateur. Deux voies :</p>
<ol><li><b>Vite</b> (le net outil moderne) : <code>npm create vite@latest mon-app -- --template react</code> → <code>cd mon-app && npm i && npm run dev</code>.</li>
<li>Un éditeur online type StackBlitz/Codesandbox pour les jours sans PC fixe.</li></ol>
<h3>3. JSX : l'HTML rédigé par JS</h3>
<pre><code>const el = &lt;h1 className="titre"&gt;Bonjour {nom}&lt;/h1&gt;;   {/* JSX compile */}</code></pre>
<ul><li><code>class</code> → <code>className</code> (mot réservé JS)</li>
<li><code>{expr}</code> = fenêtre dynamique</li>
<li>Un seul élément racine par composant (fragments &lt;&gt;&lt;/&gt;).</li></ul>
<div class="keepnote">💡 Garde en tête : les fichiers JSX vivent dans <code>src/components/</code>. Fais cc : d'ici 5 jours, tu rends React fichier par fichier comme les autres gens — avec composants réutilisés, pas d'innovation à inventer.</div>`,
s:`// J56 : hors éditeur web — installe et observe vite create react (notes console)\nconsole.log('Setup note:', ['node -v: …','npm create vite…', 'dev server: port 5173']);`,
x:['Vite installé (Node ≥ 18) + projet env dev lancé','Arborescence expliquée (main.jsx, App.jsx, index.css)','Modifier App.jsx : 1× h1 personnalisé + 1 variable affichée','Créer un fichier components/Titre.jsx importé dans App']},
57:{t:`<h3>Composants : les briques</h3>
<p>Un composant React = une fonction qui retourne du JSX. C'est TOUT.</p>
<pre><code>function Magnet({ jour, titre }) {
  return &lt;div className="magnet"&gt;&lt;b&gt;J{jour}&lt;/b&gt;&lt;span&gt;{titre}&lt;/span&gt;&lt;/div&gt;;
}
function Tableau() {
  return &lt;div&gt;
      &lt;Magnet jour={1} titre="HTML" /&gt;
      &lt;Magnet jour={2} titre="CSS" /&gt;
    &lt;/div&gt;;
}</code></pre>
<h3>Règles d'or</h3>
<ul><li><b>PascalCase</b> nommage (Magnet, pas magnet).</li>
<li>Props : les <b>paramètres</b> du composant (objet unique — déstructuring, J35).</li>
<li>Composant petit et pure : pas de mutation, pas de Requête hors cycle.</li></ul>
<h3>Le fichier App.jsx = ton morceau ROOT</h3>
<pre><code>export default function App() { return &lt;Tableau /&gt; }</code></pre>
<div class="keepnote">💡 Garde en tête : si tu pointe vers &copy; un HTML &lt;div class&gt; — React want className. 3 sorties de vue : className, style={{…}} (camélcasé CSS), htmlFor.</div>`,
s:`function Magnet({ jour, titre }) {\n  return <div className="magnet"><b>J{jour}</b> {titre}</div>;\n}\nfunction App() {\n  return (\n    <>\n      <Magnet jour={1} titre="HTML" />\n      <Magnet jour={2} titre="CSS" />\n    </>\n  );\n}`,
x:['Créer 2 composants + 1 liste + 1 map props','Méthode pour rendre une map (keys, la réflexion J64)','Nesting / composition : Magnet dans Colonne dans Tableau','Modifier props live (vite HMR montre le re-render instant)']},
58:{t:`<h3>Props en profondeur : input/output de composants</h3>
<pre><code>&lt;Carte titre="Bienvenue" contenu="…" estGrande /&gt;   {/* un booléen sans juste value */}
function Carte({ titre, contenu, estGrande, children }) {  ... }  /* children = l'enfant */</code></pre>
<ul><li>Props READ ONLY : un composant ne modifie jamais ses props (les prop utils vers parent bureaucratie callback).</li>
<li>children : tout le contenu entre &lt;Composant&gt;…&lt;/Composant&gt; — la composition majeurs.</li>
<li>defaultProps → syntaxe paramètres défaut (destructuring).</li></ul>
<h3>Communication remontante (règle propriétaire)</h3>
<pre><code>function Parent() {
  return &lt;Filtre onPick={v =&gt; console.log(v)} /&gt;;
}
function Filtre({ onPick }) { return &lt;button onClick={() =&gt; onPick('vert')} /&gt;; }</code></pre>
<div class="keepnote">💡 Garde en tête : un flux unidirectionnel : props descendent, events remontent. Toute l'architecture React repose sur cette règle d'arrosage.</div>`,
s:`function Carte({ titre, children, grande }) {\n  return <div className={grande ? 'card big' : 'card'}>\n    <h3>{titre}</h3>\n    {children}\n  </div>;\n}\nfunction App() {\n  return <Carte titre="Accueil" grande><p>Contenu injecté depuis App.</p></Carte>;\n}`,
x:['children (du contenu injecté) + un booléen de style','Un callback Props (onClick down/up) qui log avec l\'action','Aucune mutation de props : tester et noté l\'erreur','Un composant configurable (5 props + rendu différenciés)']},
59:{t:`<h3>State : la mémoire du composant</h3>
<pre><code>import { useState } from 'react';
function Compteur() {
  const [n, setN] = useState(0);
  return &lt;button onClick={() =&gt; setN(n + 1)}&gt;Cliqué {n}×&lt;/button&gt;;
}</code></pre>
<ul><li><code>useState(0)</code> renvoie un couple [valeur, setterinstanc] destructuré.</li>
<li>Setter = file un render. <b> onChange reçoisiValue</b> : setN(n => n + 1) est le SAFE quand n est dans une factory.</li>
<li>Les state locaux disparaissent avec le composant : rien ne persiste ici.</li></ul>
<div class="keepnote">💡 Garde en tête : useState = LE remplacement des <code>variables du composant vanilla</code>. Deux updates sans les batchers = re-render double ; React compile ça moderne : batch par défaut.</div>`,
s:`import { useState } from 'react';\nfunction Compteur() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n => n + 1)}>Cliqué {n} fois</button>;\n}`,
x:['Une ToDO local (2 items, useState array)','Un toggle d\'affichage de text (booléen state)','Un formulaire contrôlé : state + onChange sync','Un state par formulaire avec input + bouton reset']},
60:{t:`<h3>Projet J60 : Mini-app React « Tableau d'aimants » v0 (votre 1er composant d'état complet)</h3>
<p>De la vanilla (J51) vers le composant React, en 3 étapes :</p>
<ol><li><code>&lt;App&gt;</code> state <code>{ jours: [...nom...] }</code> + rendu <code>Carte jour</code>.</li>
<li><code>Cocher(n)</code> : state immuable (<code>.map((j, i) =&gt; i === n ? { ...j, fait: true } : j</code>), jamais push direct.</li>
<li>Barre de progression : derive d'état (<code>jours.filter(j =&gt; j.fait).length</code> calculé au render — jamais manual sync !).</li></ol>
<h3>Ce que ce TP fait travailler</h3>
<ul><li>L'immuabilité (J36 : spread ne mute pas) — là donner d'OR React.</li>
<li>Derivatives state = moins de state à maintenir (principe LEAR)</li>
<li>Composition complète (Tableau → Carte → Badge)</li></ul>
<div class="keepnote">🎉 J60 · 33 % du parcours. Tu es passer de « scripteur de page » à « constructeur d'app composants ». Les jours 61–90 font Reactogenic (hooks, routing…) — le même disc plus industrialisé. Congratulation sur ton mois : prenez une vrai pause, pose ton aimant, ouvre demain nouveau chapitre.</div>`,
s:`import { useState } from 'react';\nfunction App() {\n  const [jours, setJours] = useState([\n    { n: 1, titre: 'HTML', fait: true },\n    { n: 2, titre: 'CSS', fait: false },\n    { n: 3, titre: 'JS', fait: false }\n  ]);\n  // TODO : cocher(n) immuable + barre % dérivée\n}`,
x:['Liste de 5 jours faites à cocher (check = immuable spread)','Barre % dérivée du state (aucun compteur séparé)','Un composant Carte réutilisé (props + état partagé parent)','Bilan J1–60 : 3 acquis / 3 projets à relire — notes console']}
};
