// lessons-d31-45.js — Leçons détaillées jours 31 à 45 (JS moderne + mini-projets)
window.LESSONS_D3 = {
31:{t:`<div class="keepnote">🎯 Semaine 2 : JS moderne. On ouvre par LE sujet qui piège tous les devs : la portée.</div>
<h3>1. Scope : bloc par bloc</h3>
<pre><code>function demo() {
  if (true) { const a = 1; let b = 2; var c = 3; }
  // a et b : morts ici (scope de bloc {})
  // c : vivant jusqu'à la fin de la FONCTION (hoisting var)
}</code></pre>
<ul><li><code>const/let</code> = portée de <b>bloc</b> (<code>if, for, function…</code>).</li>
<li><code>var</code> = portée de <b>fonction</b> + hoisted + double déclaration tolérée : la source de bugs qui ont motivé le trio moderne.</li></ul>
<h3>2. Hoisting : le mécanisme exact</h3>
<pre><code>hello();           // OK ! les déclarations de fonction sont hissées
var  x; console.log(x);  // undefined (déclaration hissée, pas la valeur)
let  y; // TDZ: lire y AVANT sa ligne d'assignation → ReferenceError</code></pre>
<p>Le moteur « remonte » les déclarations. Fonctions entières : prêtes. <code>var</code> : déclaré mais <code>undefined</code>. <code>let/const</code> : zone morte temporelle (TDZ) jusqu'à leur ligne.</p>
<h3>3. Closure : la portée qui reste</h3>
<pre><code>function compte() {
  let n = 0;              // caché, vivant
  return () =&gt; ++n;       // cette fonction garde son scope natal
}
const next = compte(); next(); next(); console.log(next()); // 3</code></pre>
<ul><li>Le scope interne reste vivant tant que la fonction qui le référence existe : c'est la base des compteurs, cache et encapsulation.</li></ul>
<div class="keepnote">💡 Garde en tête : coder en <code>const/let</code> rend le hoisting un non-sujet. Mais LE connaître t'évites des heures de débogage sur du code legacy.</div>`,
s:`function compte() {\n  let n = 0;\n  return () => ++n;\n}\nconst a = compte();\nconsole.log(a(), a(), a()); // 1 2 3\n// TEST : que vaut ici... \n// if (1) { const secret = 'ok' } console.log(secret); // ?`,
x:['Démo var vs let dans un if (fuite vs TDZ)','Reproduire hoisting : fonction appelée avant sa déclaration','Une closure compteur utilisée 2 fois (2 compteurs indépendants)','Expliquer pourquoi next garde n : une phrase']},
32:{t:`<div class="keepnote">🎯 Arrow functions : la syntaxe qui simplifie ET une vraie différence avec <code>this</code>.</div>
<h3>1. Progression de la syntaxe</h3>
<pre><code>const f1 = (a, b)         =&gt; a + b;        /* return implicite */
const f2 = (a)            =&gt; a * 2;        /* 1 arg : parenthèses optionnelles */
const f3 = ()             =&gt; ({ v: 1 });   /* objet → parenthèses OBLIGATOIRES */
const f4 = (a, b) =&gt; { const t = a + b; return t; };</code></pre>
<h3>2. La vraie différence : this n'existe pas</h3>
<pre><code>obj = { n: 2, run: function () { setTimeout(() =&gt; console.log(this.n), 10); } };
// arrow : this = celui lexical (l'obj)  ✓
// function() : this = l'appelant (window/ undefined) ✗</code></pre>
<ul><li>Arrow = <b>pas de this, arguments, super</b> propres : le this du contexte englobant.</li>
<li>Mauvais choix pour scripts de méthodes d'objets et pour <code>constructor</code>.</li></ul>
<h3>3. où on les met</h3>
<ul><li>Callbacks courts (map, filter, event handlers inline) : oui.</li>
<li>API publique avec beaucoup de params : <code>function</code> classique plus lisible.</li></ul>
<div class="keepnote">💡 Garde en tête : une arrow SANS accolades retourne automatiquement le résultat (return implicite). Dès qu'on ouvre <code>{</code>, il FAUT un retour explicite.</div>`,
s:`const tri = arrs => [...arrs].sort((a, b) => a - b);\nconsole.log(tri([3, 1, 2]));\nconst fab = (n) => ({ v: n });        // → la nécessité des parens\nconsole.log(fab(7));`,
x:['Réécrire 3 fonctions classiques en arrow (1-liner)','Un objet littéral retourné dans une arrow : parenthèses','Comparer this dans function vs arrow sur objet','Une arrow multi-lignes : oublie le return puis corrige-le']},
33:{t:`<div class="keepnote">🎯 Tableaux modernes : map, filter, reduce — le trio qui construit 80 % des données d'UI.</div>
<h3>1. Les 4 transformateurs</h3>
<pre><code>const nbs = [1, 2, 3, 4];
nbs.map(n =&gt; n * 2);                 // [2,4,6,8]  même longueur, transformé
nbs.filter(n =&gt; n % 2 === 0);        // [2,4]      même longueur ou moins
nbs.reduce((acc, n) =&gt; acc + n, 0);  // 10         → UN total
nbs.find(n =&gt; n &gt; 2);                // 3 (premier) · findIndex → 2</code></pre>
<ul><li>Ceux-ci ne MUTENT PAS la source. <code>sort()</code> et <code>reverse()</code> mutent — on les copie : <code>[...nbs].sort()</code>.</li>
<li>Chaînage : <code>fil.map(...).reduce(...)</code> — chaque étape retourne un tableau.</li></ul>
<h3>2. forEach : le mur</h3>
<pre><code>nbs.forEach((n, i) =&gt; console.log(i, n));  // purement pour son effet</code></pre>
<p>forEach sert uniquement pour son effet de bord (afficher, muter autre chose). Il ne peut pas être interrompu par break/continue. Pour produire des données, resté sur map/filter/reduce.</p>
<h3>3. every / some — questions OUI/NON</h3>
<pre><code>nbs.every(n =&gt; n &gt; 0);              // true : tous
nbs.some(n =&gt; n &gt; 3);               // true : au moins un</code></pre>
<div class="keepnote">💡 Garde en tête : map = transformer, filter = filtrer, reduce = CONDENSER, find = PREMIÈRE valeur, every/some = booleans. Le nom mental aide le classement.</div>`,
s:`const panier = [\n  { nom: 'Café', prix: 2.5 }, { nom: 'Thé', prix: 1.8 }, { nom: 'Sucre', prix: 1 }\n];\nconsole.log(panier.map(p => p.nom));\nconsole.log(panier.filter(p => p.prix > 1.5));\nconsole.log(panier.reduce((acc, p) => acc + p.prix, 0));`,
x:['map sur des noms totaux filtrés (filter) puis total (reduce)','Refaire sans map : la version forEach — comparaison de style','Un sort copié (pas muté) sur 5 nombres','every/some : « est-ce que tous/au moins un… » sur le panier']},
34:{t:`<div class="keepnote">🎯 Chaînes : la manipulation de texte est partout (formulaires, parsing, UI).</div>
<h3>1. Les outils à connaître de mémoire</h3>
<pre><code>const s = '  Bonjour le Web  ';
s.trim();                       // 'Bonjour le Web'
s.toLowerCase() / s.toUpperCase()
s.replace('Web', 'Monde');       // remplace le premier
s.split(' ')                     // ['Bonjour', 'le', 'Web']
s.includes('jour') / s.startsWith('Bo') / s.endsWith(' Web')
'abc'.padStart(6, '.');          // '...abc'
s.charAt(0) / s.at(-1)           // 'B' / 'b'</code></pre>
<h3>2. Template literals : LA syntaxe moderne</h3>
<pre><code>const nom = 'Emma';
&#96;Salut \${nom}, tu as ${12 * 2} ans.&#96;</code></pre>
<ul><li>Backticks + <code>&#36;{...}</code> : n'importe quelle expression, multi-ligne OK.
<li>La concaténation <code>+</code> disparaît : fin des \'+\' surchargés.</li></ul>
<h3>3. L'indexation et l'itérabilité</h3>
<p><code>s[0]</code> marche ; on parcourt <code>for (const ch of s)</code> — le réflexe quand on travaille caractère par caractère.</p>
<div class="keepnote">💡 Garde en tête : les 3 réflexes de qualité : <code>.trim()</code> avant toute comparaison d'input, <code>toLowerCase()</code> pour comparer, chaînes en template literals.</div>
<h3>4. Série d'exercices (adaptée du cours de référence « Chaînes de caractères »)</h3>
<p>Cinq exercices classiques, de difficulté croissante — fais-les dans l'ordre :</p>
<ol><li><b>Validation de format</b> : « 12h55 » est-il bien <i>2 chiffres + h + 2 chiffres</i> ? Teste <code>longueur === 5</code>, <code>s[2] === 'h'</code>, et <code>!isNaN(Number(...))</code> sur les deux tranches découpées au <code>h</code>.</li>
<li><b>Voyelles</b> : compte puis supprime les voyelles d'une phrase (une boucle + <code>'aeiouyAEIOUY'</code> de référence).</li>
<li><b>Palindrome</b> : un mot se lit-il dans les deux sens ? Compare la chaîne à son inverse (construis l'inverse en remontant la boucle, ou via <code>[...s].reverse().join('')</code>).</li>
<li><b>Conjugaison</b> : à partir d'un verbe du 1<sup>er</sup> groupe (« chanter »), produis « je chante, tu chantes, il chante… » : sépare le radical (<code>slice(0, -2)</code>) des terminaisons <code>e, es, e, ons, ez, ent</code>.</li>
<li><b>Lettre la plus fréquente</b> : compte chaque lettre dans un objet (<code>compteur[lettre] = (compteur[lettre] || 0) + 1</code>), puis trouve le maximum.</li></ol>`,
s:`const brut = '  Je SUIS ICI ';\nconsole.log(brut.trim().toLowerCase());\nconst nomLg = 'Emmanuel';\nconsole.log(\`Bonjour \${12 * 2} mois de langue commune\`);\nconsole.log('a-b-c'.split('-').join(' · '));`,
x:['trim/toLowerCase avant de comparer 2 inputs','Un template multiligne complet + interpolation d\'un calcul','split → traiter → join : reconstruire une phrase','padStart : afficher un chronomètre 01:05:09','Exercice 1 : valider un format "12h55" (2 chiffres + h + 2 chiffres)','Exercice 3 : palindrome (kayak, radar) O/N','Exercice 4 : conjuguer un verbe du 1er groupe (6 personnes)']},
35:{t:`<div class="keepnote">🎯 Déstructuration : Extraire selon la FORME, pas selon la position brute. C'est le jour qui change la lisibilité de tous tes codes suivants.</div>
<h3>1. Objet : extraire par nom</h3>
<pre><code>const dev = { nom: 'Emma', age: 22, stack: ['HTML', 'JS'] };
const { nom, age, stack: [...] } = dev;   // stack var locale via alias
const { ville = 'Brazza' } = dev;         // valeur par défaut
const { nom: n } = dev;                   // alias n</code></pre>
<h3>2. Tableau : extraire par position</h3>
<pre><code>const [premier, , troisieme = 'défaut'] = ['a', 'b', 'c'];</code></pre>
<h3>3. Dans les paramètres de fonction (le killer feature)</h3>
<pre><code>function affiche({ nom, age }) { console.log(nom, age); }
affiche(dev);          // aucune pollution, aucune commande liée à l'ordre</code></pre>
<h3>4. Échange sans tmp et extraction de fonction (... jour 36)</h3>
<pre><code>[a, b] = [b, a];</code></pre>
<div class="keepnote">💡 Garde en tête : une fonction qui reçoit <code>{ a, b }</code> un objet déstructuré : son sommaire d'utilisateurévite l'ordre imposition. C'est comme ça que les bibliothèques modernes signent leurs APIs des options.</div>`,
s:`const dev = { nom: 'Emma', age: 22, stack: ['HTML', 'JS'] };\nconst { nom, age, ville = 'Brazza' } = dev;\nconsole.log(nom, age, ville);\nfunction affiche({ nom, age }) { return \`\${nom} (\${age})\`; }\nconsole.log(affiche(dev));`,
x:['Extraire 3 props d\'un objet + une avec défaut','Tableau : 1er et 3e éléments (trou au milieu)','Une fonction recevant 1 objet → déstructuring dans la signature','Swap a/b sans tmp (deconstucturer)']},
36:{t:`<div class="keepnote">🎯 Spread et rest : le même trois-points, deux rôles exactement opposés.</div>
<h3>1. Spread (éparer) : EXPLOSE un iterabile</h3>
<pre><code>const src = ['a', 'b'];
const copie = [...src, 'c'];               // copie non liée
Math.max(...[3, 9, 2]);
const fusion = { ...objA, ...objB, priorite: 2 }; // objets en 1 ligne</code></pre>
<ul><li>copie « shallow » : les objets internes restent partagés — attention aux envages profonds.</li></ul>
<h3>2. Rest (re récupérer) : COMPACTE le surplus</h3>
<pre><code>function logArgs(...args) { args.forEach(console.log); }
const { nom, ...reste } = dev;      // reste = ce qui reste
const [prem, ...queue] = tableau;</code></pre>
<h3>3. Où donc ça bouche des trous</h3>
<table><tr><th>Besoin</th><th>Fait par</th></tr>
<tr><td>Mettre à jour un objet sans le muter</td><td><code>{ ...state, user: nouveau }</code></td>
<tr><td>Un nb flexible d'arguments</td><td><code>(...checks) =&gt; checks.every(Boolean)</code></td></tr>
<tr><td>Enlever une clé proprement</td><td><code>const { motDePasse, ...public } = user;</code></td></tr></table>
<div class="keepnote">💡 Garde en tête : à gauche du signe = : rest (assembler). À droite : spread (étaler). Le sens se lit dans la direction de la donnée.</div>`,
s:`const { solde, ...pub } = { solde: 100, nom: 'A', mail: 'b@c' };\nconsole.log(pub);\nconst merge = { ...{ a: 1 }, ...{ a: 2, b: 3 } };  /* le dernier gagne */\nconsole.log(merge, ...[1, 2, 3]);`,
x:['Copie defensive d\'un tableau, changer la copie, l\'original intact','Fusionner global par défaut + options utilisateur (options || defaut)','Une fonction (...args) qui log chaque arg','Nettoyer documenté { motDePasse, ...public } : reste exactly']},
37:{t:`<div class="keepnote">🎯 Callbacks : la base de tout. Même son valid ation de livraison : une fonction qu'on DONNE pour qu'on l'appelle plus tard.</div>
<h3>1. Le principe</h3>
<pre><code>function traite(liste, cb) {
  for (const x of liste) { const v = cb(x); console.log(v); }
}
traite([1, 2], x =&gt; x * 10);</code></pre>
<p>Une fonction QUI REÇOIT une fonction — la plus grande valeur du paramétrage moderne.</p>
<h3>2. Sync vs async callbacks</h3>
<ul><li><b>Synchrone</b> : la callback s'appelle immédiatement (map, filter, sort).</li>
<li><b>Asynchrone</b> : appelée PLUS TARD (setTimeout, événements, fetch …). continue aujourd'hui avec setTimeout : la promesse du porte-futur.</li></ul>
<h3>3. Le piège des callbacks imbriqués</h3>
<pre><code>etape1(etape2(etape3(...)))    //  « pyramide de l'horreur »</code></pre>
<p>C'est la DOULEUR qui a fait naitre promises (J38) — cette naissance të motiv la révolution JS.</p>
<h3>4. setTimeout / setInterval</h3>
<pre><code>const id = setTimeout(() =&gt; console.log('là, 2s plus tard'), 2000);
clearInterval(id);   // annuler un compte à rebours ou une répétition</code></pre>
<div class="keepnote">💡 Garde en tête : Whenever tu passes un callback, demande-toi : « qui l'appelle, avec quoi, quand ? ». C'est le contrat caché derrière chaque API JS.</div>`,
s:`setTimeout(() => console.log('+ 1s'), 1000);\nconst rot = setInterval(() => console.log('tick'), 500);\nsetTimeout(() => { clearInterval(rot); console.log('stop'); }, 3000);`,
x:['Un callback simple synchrone via map','setTimeout chainés : 3 messages successifs','setInterval + clear via un setTimeout externe','Réécrire un bloc imbré « pyramide » : compter le nombre de niveaux']},
38:{t:`<div class="keepnote">🎯 Promises : une journée-clé. LE modèle de résultat future du JS. C'est ici que le code client devient industriel.</div>
<h3>1. Le modèle en 2 lignes</h3>
<p>Une Promise = un <b>ticket de file d'attente</b>. Trois états : <code>pending</code> → <code>fulfilled</code> (OK) ou <code>rejected</code> (erreur). Une fois forcée, l'état ne change plus.</p>
<pre><code>const prom = fetch('/api');  // ex. pre
prom.then(r =&gt; r.json()).then(d =&gt; console.log(d))
    .catch(e =&gt; console.error(e));</code></pre>
<h3>2. Le chainage</h3>
<p><code>then</code> retourne TOUJOURS une nouvelle promise — d'où les chaînes plates (<code>then.then.catch</code>). Retourner une valeur la met dans la suite ; lever une throw va au <code>catch</code> le plus proche.</p>
<h3>3. Des proms existantes & composer</h3>
<pre><code>Promise.resolve(1); Promise.reject('trop tard');
Promise.all([p1, p2]);    // attend TOUT ou un seul échec
Promise.race([p1, p2]);   // le premier qui fini
Promise.allSettled([..]); dedans les états, même en échec</code></pre>
<h3>4. Promise nouvelle</h3>
<pre><code>const p = new Promise((resolve, reject) =&gt; setTimeout(() =&gt; resolve('ok'), 500));</code></pre>
<div class="keepnote">💡 Garde en tête : sans <code>catch</code>, une erreur asynchrone part en silence (console de promesse distractrice). Règle pro : chaque chaîne asynchrone finit par <code>.catch</code>.</div>`,
s:`const p = new Promise(res => setTimeout(() => res('livre après 800ms'), 800));\np.then(x => 'j\'ai reçu ' + x)\n .then(y => console.log(y))\n .catch(e => console.error('raté', e));`,
x:['Une promise resolve après 800ms puis chainée 2×','Un reject attrapé via catch (erreurs async)','Promise.all sur 2 settle simultanés','Sans catch : lever l\'erreur et noter le unhandledrejection en console']},
39:{t:`<div class="keepnote">🎯 async/await : la même promesse par la lecture séquentielle. Le code devient une histoire droite.</div>
<h3>1. La paire</h3>
<pre><code>async function route() {
  try {
    const r = await fetch('/api/data');     /* pause propre */
    const d = await r.json();
    return d;
  } catch (e) {
    console.error('chaîne ratée', e);
  }
}</code></pre>
<ul><li><code>await</code> pause LA FONCTION (not the thread), effacement ligne par ligne.</li>
<li><code>async</code> toujours retourne une Promise.</li></ul>
<h3>2. En parallèle : Promise.all reste l'outil</h3>
<pre><code>const [users, posts] = await Promise.all([fetchU(), fetchP()]);</code></pre>
<p><b>Erreur fréquente</b> : <code>await</code> séquentiel sur 2 requêtes indépendantes = 2× le temps. Le parallèle « Promise.all » connaître comme réflexe.</p>
<h3>3. await sur top-level</h3>
<p>Dans les modules modernes on peut awaiter hors fonction. Dans une plateforme comme PBD on entoure dans une async main() — compare avec la version du code de ce site.</p>
<div class="keepnote">💡 Garde en tête : await emboîte try/catch comme les fonctions normales. <b>Un await sans try/catch est une promesse non tenue</b> — ton catch est le filet.</div>`,
s:`async function routeList() {\n  try {\n    const r = await fetch('https://api.github.com/users/emmanuel-bilombo/repos?per_page=2');\n    const d = await r.json();\n    console.log(d.map(x => x.full_name));\n  } catch (e) { console.error('réseau/ erreur', e); }\n}\nrouteList();`,
x:['async fetch simple + erreurs via try/catch','Promise.all sur 2 fetches : comparer les temps','Un await sans try : observer unhandledrejection','Écrire une async fonction qui échoue et autorise une valeur par défaut']},
40:{t:`<div class="keepnote">🎯 Erreurs : un code pro c'est un code qui ÉCHECISANT PROPREMENT. Aujourd'hui, on fait du filet.</div>
<h3>1. Le trio throw/try/catch/finally</h3>
<pre><code>function retirer(compte, mont) {
  if (mont &gt; compte.solde) throw new Error('Solde insuffisant');
  compte.solde -= mont;
}
try { retirer(c, 999); }
catch (e) { console.error(e.message); }
finally { toast('Opération tentative'); }</code></pre>
<ul><li><code>finally</code> tourne quitte, succès ou échec : le nettoyage garanti (loader off, file fermée...).</li>
<li><code>Error('msg')</code> : un objet (message, stack) — throw d'une string fonctionne mais perd la trace.</li></ul>
<h3>2. Personnaliser : susclasse d'erreurs</h3>
<pre><code>class SoldeError extends Error { constructor(m) { super(m); this.name = 'SoldeError'; } }</code></pre>
<p>Un catch qui fait <code>if (e instanceof SoldeError)…</code> — polyvalent dans une app réelle. Su versus les string default = révision complète du jour 29.</p>
<h3>3. UX : l'utilisateur n'est pas un dev</h3>
<ul><li>Toast « Il yap problème, réessaie ; détail technique hideux (console.error) pour toi ».</li>
<li>Validate ALWAYS at the borders (forms, API) : la seule place où l'exception compte.</li></ul>
<div class="keepnote">💡 Garde en tête : throw surface tôt (données douteuses), catch où tu PEUX agir. Une exception lancée là où elle n'est pas utile = bruit.</div>`,
s:`class SoldeError extends Error {}\nfunction retirer(c, m) {\n  if (m > c.solde) throw new SoldeError('Solde insuffisant');\n  c.solde -= m; return c.solde;\n}\ntry { console.log(retirer({ solde: 50 }, 100)); }\ncatch (e) { console.error(e.name, '→', e.message); }\nfinally { console.log('transaction enregistrée'); }`,
x:['throw + try/catch sur une donnée invalide','Personnaliser une erreur (class extends Error)','finally : un compteur de tentatives qui trace toujours','2 branches catch (instanceof) + fallback message']},
41:{t:`<div class="keepnote">🎯 Mini-projet J41–45 : une petite app complète chaque jour — la suite est la conséquence des 40 premiers jours.</div>
<h3>0. Cadrage académique (10 min avant de coder)</h3>
<p>D'après la méthode d'analyse des systèmes d'information (Merise, modèle fonctionnel des flux) : avant toute application, déterminer <b>qui échange quoi avec qui</b>, puis les <b>règles de gestion</b>, puis les fonctions. Pour chaque projet de la semaine, écris en commentaire : 1 ligne « acteurs + données », 1 règle de gestion clé (ex. « un retrait ne peut excéder le solde »), et la liste des fonctions prévues. Tu produis comme un analyste, pas comme un tappeur.</p>
<h3>Projet J41 : « Compteur de jours »</h3>
<p>Un petit utilitaire console : entrer une date cible et afficher le nombre de jours restants. En 4 étapes :</p>
<ol><li>Définir la date cible (objet Date, parse ISO).</li>
<li>Calculer la différence de jours (Math.floor, 86 400 000 ms = 1 jour).</li>
<li>Rendre le rapport (template literals + conditions « aujourd'hui / demain / dans X jours »).</li>
<li>Des fonctions à une responsabilité : <code>joursRestants(dateCible)</code>, <code>formateCompte(jours)</code>.</li></ol>
<h3>Ce que ce TP fait travailler</h3>
<ul><li>Objet Date : <code>new Date('2026-01-01')</code>, <code>getTime()</code></li>
<li>Math.floor(a / b) / %, ceil()</li>
<li>Conditions multiples + ternaire chaîné sobres</li></ul>
<h3>Barème</h3>
<ul><li>Fonctions 1-responsibilité : 3 pts · Edge cases (date passée, aujourd'hui) : 3 pts</li>
<li>Templating propre pas de concat : 2 pts · Messages de test console.table : 2 pts</li></ul>
<div class="keepnote">🙂 Écris, exécute, CORRIGE 3×. Le projet console est ton laboratoire d'avant-DOM : la gestion des données reste ce qui compte.</div>`,
s:`// J41 — compte à rebours vers une date cible\nfunction joursRestants(iso) { /* ton code */ }\nconsole.log(joursRestants('2026-12-31'));`,
x:['Fonction joursRestants(iso) exacte (à la seconde près !)','Edge cases : hier, aujourd\'hui, dans 365 jours','Le formatage : "il reste X jours" / "c\'est demain!" / "c\'est passé !"','console.table sur 4 dates de test']},
42:{t:`<h3>Projet J42 : « Compteur bancaire » en console (classes + état)</h3>
<p>Une petite app d'état :</p>
<ol><li>Classe <code>Banque</code> : <code>comptes</code> (objet clé → { solde, historique }).</li>
<li>Méthodes : <code>creer(prenom)</code>, <code>deposer(nom, mont)</code>, <code>retirer(nom, mont)</code> (throw SoldeError du J40), <code>historique(nom)</code>.</li>
<li>Une boucle de scénario fixe : dépôt, retrait, retrait refusé, log.</li>
<li>Tracer : compter les transactions par motif (« dépôt », « retrait »…).</li></ol>
<h3>Ce que ce TP fait travailler</h3>
<ul><li>Encapsulation : historique joint aux données</li>
<li>Erreurs personnalisées (J40) entre les couches</li>
<li>J19–22 : ré-use des fondamentaux dans une app solide</li></ul>
<div class="keepnote">🙂 Objectif : 0 mutation sauvage d'un tableau global. Toute donnée doit passer par une méthode d'objet — discipline qu'on reverra en React (state).</div>`,
s:`class Banque { /* ton code */ }\nconst bq = new Banque();\nbq.creer('Emma'); bq.deposer('Emma', 100); bq.retirer('Emma', 30);\nconsole.log(bq.comptes);`,
x:['Classe Banque complet (creer/deposer/retirer/historique)','Le retrait de trop : throw SoldeError + catch au-dessus','historique = tableau de date/type/montant (toute transaction tracée)','console.table de l\'historique final']},
43:{t:`<h3>Projet J43 : « Quiz console » (état + logique + random)</h3>
<p>Un quiz à questions fixes joué dans la console :</p>
<ol><li>Array de questions <code>{ q, choix: [], rep: n }</code>  (5 questions minimum).</li>
<li>Fonction <code>jouerTour(q)</code> : affiche question + options (numérotées) — simule une réponse au hasard correcte (70 %) / incorrecte, en générant la réaction adaptée.</li>
<li>Score + message final (niveau 0-2 / 3-4 / 5).</li></ol>
<h3>Ce que ce TP fait travailler</h3>
<ul><li>Math.random(), conditions multiples</li>
<li>map/filter sur les questions ratées (bilan / feedback)</li>
<li>Le découpage : d'abord data (questions), puis logique (score), puis UI console</li></ul>
<div class="keepnote">🙂 Le J48 (formulaire DOM) fera exactement la même chose avec un vrai input utilisateur. Ce TP est son préparatoire : même penser, autre interface.</div>`,
s:`const QZ = [\n  { q: 'Balise de titre ?', choix: ['h1', 'p'], rep: 0 },\n  { q: 'La règle CSS : ?', choix: ['selector', 'menu'], rep: 0 }\n];\n// implémente jouerTour(q), score final`,
x:['5 questions minimum data-driven','Random réponse correcte/incorrecte (70 %)','Score final + message de niveau','Réussir un quiz en rejouant : toutes les questions successives']},
44:{t:`<h3>Projet J44 : « Gestionnaire de courses » (tri + filtre + résumé)</h3>
<p>Une mini app de courses d'épicerie :</p>
<ol><li><code>ajouter(article, prix, rayon)</code>, <code>lister()</code> groupé par rayon (objet agrégé).</li>
<li><code>chercher(mot)</code> via includes + toLowerCase ; <code>chercherBudget(max)</code> : filter prix ≤ max.</li>
<li>Total panier via reduce · article le plus cher via sort sur copie.</li>
<li>Export : JSON.stringify pour partager la liste (réimport possible).</li></ol>
<h3>Ce que ce TP fait travailler</h3>
<ul><li>Méthodes de tableaux (J33) en vraie app</li>
<li>Agrégation objet (reduce sur objet)</li>
<li>UX console : message d'erreur si article déjà existant (Set).</li></ul>
<div class="keepnote">🙂 Le jour 49 (LocalStorage) fera la persistance d'exactement cette data. Ceci est le banc d'essai de la logique.</div>`,
s:`const courses = [];\nfunction ajouter(n, p, r) { /* ton code */ }\najouter('Acajou', 400, 'Téléphone');\najouter('Madini', 120, 'Cuisine');\nconsole.log(courses);`,
x:['ajouter/list groupé par rayon (objet aggrégé)','chercher insensible à la casse + budget max','Total panier + article le plus cher','Interdire les doublons (Set) avec message console.err']},
45:{t:`<h3>Projet J45 : consolidé — « Carnet JS » (async + persist + tests)</h3>
<p>Le dernier mini-projet console avant DOM. Une app carnet de notes :</p>
<ol><li><code>charger()</code> : simule la lecture d'un JSON local (async, Promise de J38).</li>
<li><code>ajouterNote(titre, corps)</code> : push + horodatage (Date).</li>
<li><code>sauvegarder()</code> : JSON.stringify (console loge le texte).</li>
<li>Paillasse de tests simple : la fonction <code>assertEquals(a, b, nom)</code> qu'on réutilisera J46.</li></ol>
<h3>Barème final de la semaine projets</h3>
<ul><li>les 3 projets achevés, entrées/sorties protégées par try/catch : 4 pts</li>
<li>Des fonctions courtes nommées, 1-responsabilité : 3 pts</li>
<li>Aucune variable globale évitable : 2 pts</li>
<li>Test écrit avec assertEquals : 1 pt</li></ul>
<div class="keepnote">🎓 45 jours = 25 % du parcours. La semaine 46 passe du <b>pensant</b> au <b>visualisant</b> : mêmes outils, nouveau champ. Prépare J46 : lis 15 min la doc officielle <code>MDN DOM Introduction</code>.</div>`,
s:`function assertEquals(a, b, nom) {\n  console[a === b ? 'log' : 'error'](\`\${nom} : \${a} vs \${b}\`);\n}\nassertEquals(2 + 2, 4, 'math');\n// ton carnet de notes ici`,
x:['charger() qui répond après un setTimeout (async promise)',
'ajouterNote + horodatage ISO','assertEquals utilisé sur 3 assertions','Bilan de la semaine projets : 3 acquis / 3 à revoir']}
};
