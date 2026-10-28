// lessons-d16-30.js — Leçons détaillées jours 16 à 30 (animations, Git, JS bases)
window.LESSONS_D2 = {
16:{ pc:{ figs:['devtools'], steps:[
 'Sur PC : F12 → onglet <b>Performance</b>. Clique le bouton d\'enregistrement (●), met ton curseur sur « Survol-moi » 3 secondes, arrête l\'enregistrement.',
 'Repère les barres longues du thread principal : <b>Layout</b> / <b>Recalcul styles</b> = le navigateur recalcule à chaque frame.',
 'Relance le test en remplaçant `width` par `transform: scaleX()` dans le keyframes : la barre Layout disparaît.']},
t:`<div class="keepnote">🎯 Transitions et animations : une interface vit. Mais chaque frame coûte - on anime intelligemment.</div>
<h3>1. La transition : d'un état A à un état B</h3>
<pre><code>.btn { transition: transform .2s ease, background .3s; }
.btn:hover { transform: translateY(-2px); }</code></pre>
<ul><li><code>transition: propriété durée [courbe] [délai]</code></li>
<li>Courbes clés : <code>ease</code> (défaut), <code>linear</code>, <code>ease-out</code> (part vite puis s'arrête en douceur : le classique pour hover), et l'« overshoot » <code>cubic-bezier(.34,1.56,.64,1)</code> — la courbe « ressort » du bouton aimant.</li></ul>
<h3>2. L'animation : plusieurs étapes tapées</h3>
<pre><code>@keyframes float {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-7px); }
  100% { transform: translateY(0); }
}
.magnet { animation: float 2.6s ease-in-out infinite; }</code></pre>
<ul><li><code>animation: nom durée courbe [délai] [itérations] [direction]</code>.</li>
<li>sur <code>infinite</code> : attention à ne pas « prendre la tête » de l'utilisateur — réserve la boucle aux états d'attention (aujourd'hui en lévitation).</li></ul>
<h3>3. Les règles du motion design net</h3>
<ul><li><b>anime transform et opacity</b> : le navigateur les gère sur GPU, 60 fps garantis. Animer <code>width</code>, <code>top</code>, <code>margin</code> = jank (recalcul layout à chaque frame).</li>
<li>150–250 ms pour les micro-interactions. Moins court = invisible, plus long = traînant.</li>
<li><b>prefers-reduced-motion</b> : le jour 15 t'a donné la media query — place ici les suppressions.</li>
<li>Une grosse entrée : <code>opacity: 0 → 1</code> + <code>translateY(16px) → 0</code> = le « rise » universel des interfaces modernes, utilisé par la plateforme aujourd'hui-même.</li></ul>
<div class="keepnote">💡 Garde en tête : 60 fps ≈ 16 ms par frame. Tout ce qui oblige le navigateur à recaller du layout pendant une animation coûte et saute. Ne touche jamais à width/height en animation quotidienne.</div>`,
s:`<style>\n  .kart { transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s; }\n  .kart:hover { transform: translateY(-4px) rotate(-1deg); box-shadow: 0 8px 20px #0002; }\n  @keyframes float { 50% { transform: translateY(-6px) } }\n  .today { animation: float 2s ease-in-out infinite; }\n</style>\n<button class="kart">Survol-moi</button>\n<div class="today">Je lévite</div>`,
x:['Un bouton hover avec overshoot cubic-bezier (remarque le rebond)','Un keyframes 2 états appliqué à un badge','Serre le timing : 150ms vs 500ms — écris la sensation','Animer width vs transform : comparer la fluidité en F12 Performance']},
17:{ pc:{ figs:['f12'], steps:[
 'Choisis un site simple sur PC, presse F12 → onglet <b>Éléments</b> : inspecte la structure (en-tête, héros, cartes).',
 'F12 → <b>Styles</b> : clique sur les couleurs clés (fond du héros, accent des boutons) puis copie leurs codes hex dans tes variables `--brand`, `--ink`…',
 'Prends aussi 2 polices : récupère-les via le panneau <b>Computed</b> → font-family.']},
t:`<div class="keepnote">🎯 Projet J17 — cloner la page d'accueil d'un site simple. On combine tout jours 1-16.</div>
<h3>Choix de la cible</h3>
<p>Prends un site <b>sans JS visible complexe</b> : une page d'accueil d'agence, un blog statique, une page produit simple. On ne clone pas le JS — on clone structure + style.</p>
<h3>Méthode pro en 4 passes</h3>
<ol><li><b>Passe structure</b> : dans le dev tools, copie l'ossature sémantique (header, sections, footer). Recrée-la de mémoire, toc pour toc.</li>
<li><b>Passe couleurs</b> : aspire la palette (F12 → Styles, ou palette dominante). Capte-la dans des variables CSS <code>:root</code> — c'est le réflexe pro dès le premier vrai projet.</li>
<li><b>Passe typographie</b> : 2 familles max, une d'écran ! Hauteur (h1, h2, body) à reproduire.</li>
<li><b>Passe comportement</b> : nav sticky ? hover cartes ? transcribe en CSS (pas de JS nécessaire à ce niveau).</li></ol>
<h3>Barème</h3>
<ul><li>Structure sémantique identique : 3 pts · Header sticky fonctionnel : 2 pts</li>
<li>Palette + typographies proches : 2 pts · Image responsive qui ne déforme pas : 2 pts</li>
<li>Un hover animé proche du modèle : 1 pt</li></ul>
<h3>Bonus calendrier de discipline</h3>
<p>Ne copie pas le code source. Lis, réécris, compare. Le but du clonage n'est pas un site doré, mais le muscle <b>lecture du CSS inconnu</b>.</p>`,
s:`<!-- J17 : squelette de clone à compléter -->\n<style>\n  :root { --brand: #000; --muted: #666; }  /* passe 2 : remplir */\n</style>\n<header>LOGO  NAV STICKY</header>\n<main>\n  <section class="hero">Titre accroche + CTA</section>\n  <section class="gallery">3 cartes</section>\n</main>\n<footer>©</footer>`,
x:['Écrire la structure sémantique complète reproduite en mémoire','Définir :root avec au moins 4 couleurs + 2 tailles extraites','Header sticky + cartes hover animées (transform, pas top/width)','Comparer ton rendu au site modèle : liste 3 écarts et corrige l\'un']},
18:{ pc:{ figs:['devmode'], steps:[
 'Ouvre ton clone en local (double-clic sur <code>index.html</code>) — ou via un mini-serveur : dans le terminal du dossier, <code>npx serve</code>.',
 'F12 → mode appareil (figure) : 390, 768, 1200. Note 1 défaut par taille puis corrige le CSS en mobile-first.',
 'F12 → onglet <b>Lighthouse</b> (si absent : rien à installer, il est dans les outils) → Analyser → note Accessibilité et Performance, corrige le haut des rapports.']},
t:`<div class="keepnote">🎯 Projet J18 — finitions du clone. Aujourd'hui ça devient "présentable", pas "à peu près".</div>
<h3>1. La passe responsive</h3>
<ul><li>Dev tools → mode tablette (768) puis mobile (390) : à CHAQUE palier, liste 3 défauts (gros espaces, texte tronqué, cibles < 44px).</li>
<li>Corrige en mobile-first : le CSS de base = mobile ; les <code>@media (min-width:…)</code> = enrichissement.</li></ul>
<h3>2. La passe accessibilité</h3>
<ul><li>Contraste du texte ≥ 4.5/1 : vérifie-le en 30 s dans Lighthouse → Accessibilité.</li>
<li>Tab clavier : passe TOUT en Tab ; rien d'inaccessible, focus visible partout.</li>
<li>Alt partout, un seul h1, ordre logique des titres.</li></ul>
<h3>3. La passe performance</h3>
<ul><li>Images : <code>loading="lazy"</code> + <code>width/height</code> explicites (evite le CLS, le saut de mise en page).</li>
<li>Lighthouse → Performance : note ton score, cible > 80 en local (sans réseau c'est naturellement haut).</li></ul>
<h3>Livraison du projet</h3>
<ol><li>Pousse ton dossier sur GitHub → pages → affiche le lien.</li>
<li>Baseline : journal de bord (2 lignes : ce qui a marché / ce qui a coincé).</li></ol>
<div class="keepnote">Ça fait 18 jours que tu sais faire du web. Ce premier clone dans les règles est ton premier vrai « produit ». Pose l'aimant.</div>`,
s:`<!-- J18 : checklist finalisation -->\n<!-- [ ] responsive 390/768/1200 -->\n<!-- [ ] contrastes ok -->\n<!-- [ ] tab parcours complet -->\n<!-- [ ] alt + lazy + width/height -->\n<h1>Mon clone finalisé</h1>`,
x:['Mode device : corriger 3 défauts par palier (390, 768)','Lighthouse : Accessibilité ≥ 90, enregistrer le score','Lighthouse : Performance ≥ 80, corriger le top rapport','Pousser sur GitHub (commit « clone J18 ») + journal de bord 2 lignes']},
19:{ figs:['gitflow'], pc:{ figs:['terminal'], steps:[
 'Sur PC : ouvre un <b>terminal</b> (Windows : recherche « PowerShell » ou installe <b>Git Bash</b> ; macOS/Linux : Terminal). Voir la figure.',
 '<code>git --version</code> : si la commande échoue, installe git-scm.com (5 minutes).',
 'Crée un dossier test : <code>mkdir petit-tests && cd petit-tests && git init</code>, puis <code>echo "v1" &gt; carnet.txt</code>.',
 'Rejoue le rituel complet : <code>git status → git add .</code> → <code>git commit -m "premier carnet"</code> → <code>git log --oneline</code>, puis modifie le fichier et recommence.',
 'Recopie dans ta console (ci-dessous) le journal des commandes passées et de ce que tu as vu s\'afficher.'],
 note:'La vraie compétence Git se prend clavier sur terminal — 10 minutes aujourd\'hui valent mieux 0.'},
t:`<div class="keepnote">🎯 Git : le filet de sécurité que tout développeur installe AVANT de coder. Ça se passe dans le terminal, pas dans l'éditeur web.</div>
<h3>1. La scène de base : 3 zones</h3>
<pre><code>  fichier modifié  --add-->  staging (prêt à valider)  --commit-->  historique</code></pre>
<p>On differentiate : <code>add</code> = "je mets dans l'agenda de valide", <code>commit</code> =(photo souvenir avec message), <code>push</code> = publication.</p>
<h3>2. Le petit rituel de chaque jour</h3>
<pre><code>git status                  → quoi a changé ?
git add .                   → tout mettre en scène
git commit -m "Message clair"  → souvenirs
git log --oneline           → voir les souvenirs</code></pre>
<h3>3. Les 3 règles d'un bon message de commit</h3>
<ul><li><b>Impératif présent</b> : « ajoute le header sticky » (comme une recommandation du commit).</li>
<li><b>Une intention par commit</b> — deux features dans un commit = message mensonger.</li>
<li>Concise ligne de titre ≤ 50 caractères : le sommaire de ton repo doit être lisible.</li></ul>
<h3>4. First setup (une seule fois)</h3>
<pre><code>git config --global user.name "Ton nom"
git config --global user.email "ton@mail.com"</code></pre>
<div class="keepnote">💡 Garde en tête : un projet sans Git est un projet sans filet. Tape ces commandes en vrai (WSL, macOS terminal, ou Git Bash Windows) avec un mini-dossier de tests.</div>
<h3>Pourquoi pas dans l'éditeur web ?</h3>
<p>Git agit en local sur tes fichiers réels : l'éditeur de la plateforme ne peut pas le remplacer. La leçon vous donne la théorie ; le terminal fait le métier. Pour ton TP, consigne tes observations dans la console ci-dessous (JSON de commandes, historique) — ça synchronise le savoir.</p>`,
s:`// J19 — journal de bord Git (à compléter en pratiquant dans ton terminal)\nconst journal = [\n  { cmd: "git status",            out: "…observe et écris ici" },\n  { cmd: "git add README.txt",    out: "…" },\n  { cmd: "git commit -m 'init'",  out: "…" }\n];\nconsole.log(journal);`,
x:['Initialiser git dans un dossier test (git init + status)','Faire un add + commit correctement formulé (impératif, 1 intention)','Lire git log --oneline et recopier ton historique ici','Écrire les 3 règles de message de commit dans ma tête : test récitation']},
20:{ figs:['gitflow'], pc:{ figs:['terminal'], steps:[
 'Crée un compte sur <b>github.com</b> (email + pseudo pro : il restera).',
 'Génère ta clé SSH : dans le terminal, <code>ssh-keygen -t ed25519 -C "ton@email"</code> (Entrée x3), puis <code>cat ~/.ssh/id_ed25519.pub</code> et copie la ligne entière.',
 'GitHub → Settings → SSH and GPG keys → <b>New SSH key</b>, colle. Vérifie : <code>ssh -T git@github.com</code> → « Hi &lt;pseudo&gt;! ».',
 'Crée un repo <code>shift-tests</code> sur github.com (bouton NEW), puis dans le terminal : <code>git remote add origin git@github.com:&lt;pseudo&gt;/shift-tests.git</code> et <code>git push -u origin main</code>.'],
 note:'Tout matin dev fait ça dans la même heure : compte + clé SSH + premier push. C\'est ton passeport.'},
t:`<div class="keepnote">🎯 GitHub : Git est le moteur, GitHub est la salle d'exposition + le réseau.</div>
<h3>1. Remote : le dépôt en ligne</h3>
<pre><code>git remote add origin git@github.com:moi/projet.git
git push -u origin main      # -u : mémorise le lien (une seule fois)</code></pre>
<h3>2. SSH : la clé, une fois pour toutes</h3>
<pre><code>ssh-keygen -t ed25519 -C "ton@mail.com"   # dans ~/.ssh
cat ~/.ssh/id_ed25519.pub                  # la coller dans GitHub → Settings → SSH keys</code></pre>
<h3>3. README : carte de visite du dépôt</h3>
<ul><li>Un repo sans README = un workshop sans porte. Minimum : projet en 2 phrases, install, usage.</li>
<li>Markdown : <code># titre</code>, <code>- liste</code>, <code>[texte](url)</code>, <code>accent grave</code>, et un bloc de code \`\`\`lang…\`\`\`.</li></ul>
<h3>4. .gitignore : ce qui ne part JAMAIS</h3>
<ul><li><code>node_modules/</code>, <code>.env</code> (les secrets !), fichiers temporaires/OS (.DS_Store, Thumbs.db), builds.</li></ul>
<div class="keepnote">💡 Garde en tête : .env dans GitHub = fuite de secret (les bots les détectent minute par minute). Le jour 101 (JWT), on rappellera cette règle — elle début aujourd'hui.</div>`,
s:`// J20 — checklist GitHub\nconst checks = {\n  ssh_tested: false,          // ssh -T git@github.com\n  repo_created: false,\n  remote_added: false,\n  first_push_done: false,\n  readme_written: false,\n  gitignore_written: false    // node_modules, .env, .DS_Store\n};\nconsole.table(checks);`,
x:['Créer un repo GitHub + remote + premier push (ssh -T testé)','Écrire un README : description, install, usage, licence','Écrire un .gitignore complet et vérifier qu\'il protège un faux .env','Pousser une 2e commit : modifier le README et re-push']},
21:{ pc:{ figs:['terminal'], steps:[
 'Dans ton dossier test (J19) : <code>git switch -c feature-carnet</code>, modifie <code>carnet.txt</code>, <code>git add . && git commit -m "ajoute ligne 2"</code>',
 'Crée un vrai conflit : modifie LA MÊME ligne depuis <code>main</code> ET depuis la branche, puis tente le <code>git merge</code>.',
 'Ouvre <code>carnet.txt</code> : lis les marqueurs `<<<<<<<`, décide, supprime-les, <code>git add . && git commit</code> — premier conflit résolu.']},
t:`<div class="keepnote">🎯 Branches : le superpouvoir. On expérimente SANS casser la version qui marche.</div>
<h3>1. La mentalité des branches</h3>
<p>Un repo Git est un <b>arbre</b>. <code>main</code> est le tronc stable. Chaque idée nouvelle = une branche ; on peut la supprimer sans trace si elle échoue.</p>
<pre><code>git branch feature-menu        → créer
git switch feature-menu        → changer (l'ancien : git checkout)
git switch -c feature-contact  → créer + basculer en 1
git merge feature-menu         → fusionner (depuis main)
git branch -d feature-menu     → supprimer la branche fondue</code></pre>
<h3>2. Merge vs rebase (distinguer dès maintenant)</h3>
<li><b>merge</b> : crée un commit de fusion ; l'historique reste simple à lire (les ramifications restent visibles).</li>
<li><b>rebase</b> : re-implante tes commits comme s'ils avaient été faits sur main — historique linéaire, mais réécriture d'historique (jamais sur des commits déjà poussés/partagés).</li></ul>
<h3>3. Le conflit : c'est normal</h3>
<pre><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
ma version
=======
version d'à côté
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-menu</code></pre>
<p>On garde ce qu'on veut, on supprime les marqueurs, on re-commit. Un conflit n'est pas une panne — c'est Git qui demande une décision.</p>
<div class="keepnote">💡 Garde en tête : main propre + petites branches courtes = 90 % des conflits évités. Un commit toujours tombé sur une branche qui vit plus de 2 jours est un risque.</div>`,
s:`// J21 — simulation d'arbre de branches\nconst tree = {\n  main:    ['c1 init', 'c2 readme'],\n  feature: ['c3 menu'],\n  merge:   'c4 fusion'\n};\nconsole.log(tree);\n// Décris en commentaire ce que rend le tree après merge feature → main`,
x:['Créer + basculer sur une branche, y committer, fusionner dans main','Provoquer un vrai conflit (modifier la même ligne des 2 côtés) et le résoudre','branch --graph (git log --graph --oneline) : recopier ton arbre','Écrire merge vs rebase avec tes mots : disparition ? sécurité ?']},
22:{ pc:{ figs:['terminal'], steps:[
 'Rejoue le workflow 6 étapes en vrai sur un projet réel (clone de J18 ou autre) : branche → commit → push → Pull Request → merge.',
 'GitHub → ton profil : photo (silhouette ok), bio 1 ligne, lien de ton site Pages.',
 'Crée le repo spécial <code>&lt;pseudo&gt;.github.io</code> ou un <code>profile</code> README : il s\'affichera sur ta page de profil après push.']},
t:`<div class="keepnote">🎯 Fin de bloc Git : ton deviseur automatisé + portfolio. Chaque projet de J18 en vit.</div>
<h3>1. Le workflow nuit & jour (à mémoriser en un flash)</h3>
<pre><code>1. git switch -c feature-x     4. git commit -m "…"
2. coder                       5. git push -u origin feature-x
3. git add .                   6. Pull Request → merge → delete</code></pre>
<h3>2. Pull Request : le rituel d'équipe</h3>
<ul><li>Une PR = 1 intention, auto-testée, titre fort, description claire.</li>
<li>Cherchée seule, PR garde les méritas : relecture future, revert facile, doc de la décision.</li>
<li>Templates, labels, milestones — plus tard. Ce soir : une PR réelle merged en local.</li></ul>
<h3>3. Ton GitHub, entrée de portfolio</h3>
<ul><li>Photo, bio (développeur congolais, formation fullstack), site link.</li>
<li>Pin des meilleurs repos. Profile README dédié (repo du même nom).</li>
<li>Contrib graph = "motivation visible" : 180 jours, elle deviendra verte.</li></ul>
<div class="keepnote">🎉 J23 commence le JavaScript : la partie où tu deviens programmatrice, pas seulement descriptrice. Ton vocabulaire HTML/CSS est acqui.</div>`,
s:`// J22 — mémoire active : reproduis de tête, sans doc\nconst workflow = ['git switch -c …', '…', '…', '…', '…', '…'];  // 6 étapes\nconsole.log(workflow.join(' → '));`,
x:['Refaire le cycle complet sur un vrai projet (branche → PR → merge)','Paramétrer le profil GitHub (bio, photo, pin repos)','Construire un profile README (présentation + stack en cours)','Réciter le workflow 6 étapes de mémoire, journaliser ici']},
23:{t:`<div class="keepnote">🎯 JavaScript : la couche comportementale. Aujourd'hui : le langage des variables.</div>
<h3>1. Les 3 façons de créer une variable</h3>
<pre><code>const pays = 'Congo';        // constante : la liaison ne change pas (FAVORI)
let   age = 22;              // mutable
var   ancien = 'banni';      // à ne plus utiliser</code></pre>
<ul><li><code>const</code> n'interdit pas de <b>modifier l'intérieur</b> d'un objet : <code>const u = {}; u.age = 1;</code> ok — c'est la liaison qui est figée.</li>
<li>Défaut typique : assigner une constante → <code>TypeError: invalid assignment to const</code>. L'erreur est ton professeur.</li></ul>
<h3>2. Nominer : 50 % de la lisibilité</h3>
<ul><li><b>camelCase</b> pour variables/fonctions — <code>ageMoyen</code>.</li>
<li>Un nom se lit comme une phrase : <code>totalPrix</code>, <code>estConnecte</code>, <code>listeJoursFaits</code>.</li>
<li>Flags booléens : commencer par <b>est… / a…</b> — <code>estValide</code>.</li></ul>
<h3>3. Sortie : les 3 outils du dev du quotidien</h3>
<pre><code>console.log('texte', valeur);   // flux normal
console.table(liste);           // tableau 2D — à tester ce soir
console.error; console.warn;    // signaux visuels</code></pre>
<div class="keepnote">💡 Garde en tête : <code>let</code> vs <code>const</code> n'est pas une querelle — la règle pro est : <b>const par défaut</b>, <code>let</code> seulement quand la re-assignation est vraiment nécessaire.</div>`,
s:`const pays = 'Congo';\nlet age = 22;\nage = 23;             /* re-assignation autorisée avec let */\nconsole.log(pays, age);\nconsole.table([{ nom: 'Emmanuel', age }, { nom: 'Aline', age: 19 }]);`,
x:['Créer 2 const et 2 let, prouver la différence avec une erreur intentée','Math de base : incrémenter un compteur de 5 en 5 (10 lignes)','console.table sur une vraie liste d\'objets','Renommer 3 variables mal nommées en camelCase porteur de sens']},
24:{t:`<div class="keepnote">🎯 Les 7 types et les opérateurs : 90 % des bugs débutants naissent là.</div>
<h3>1. Les types primitifs</h3>
<pre><code>'texte'   → string     42        → number     true/false → boolean
undefined → non assigné   null → vide voulu   Symbol/BigInt → (rare)</code></pre>
<p>+ le type <b>objet</b> (tableaux, objets, fonctions analogues). <code>typeof</code> interroge :</p>
<pre><code>typeof 'a'  // "string"
typeof 1    // "number"
typeof null // "object"  ← bug historique du langage, à connaître !</code></pre>
<h3>2. Comparaison : == vs ===</h3>
<pre><code>1 == '1'   // true   (conversion cachée : piège)
1 === '1'  // false  (types comptés : TOUJOURS utiliser ===)</code></pre>
<h3>3. Les opérateurs du jour</h3>
<table><tr><th>Groupe</th><th>Exemples</th><th>Note</th></tr>
<tr><td>Arithmétique</td><td><code>+ - * / % **</code></td><td><code>%</code> = reste (pair/impair), <code>**</code> = puissant</td></tr>
<tr><td>Comparaison</td><td><code>=== !== &gt; &lt; &gt;= &lt;=</code></td><td>strict</td></tr>
<tr><td>Logiques</td><td><code>&amp;&amp; || !</code></td><td>court-circuit (retourne la valeur, pas juste vrai/faux)</td></tr>
<tr><td>Coalescence</td><td><code>??</code></td><td>fallback seulement si null/undefined (diffère de <code>||</code> sur 0)</td></tr>
<tr><td>Incrément</td><td><code>i++ / ++i</code></td><td>préférer la forme lisible <code>i += 1</code></td></tr></table>
<h3>4. Chaînes : la surprise +</h3>
<p><code>"3" + 4</code> → <code>"34"</code> (la string gagne) mais <code>"3" - 1</code> → <code>2</code> (le moins force le nombre). Règle anti-bug : <code>Number("3") + 4</code>.</p>
<div class="keepnote">💡 Garde en tête : <code>===</code> réflexe obligé, et <code>??</code> pour les valeurs par défaut : <code>const seuil = maj ?? 10;</code>. Les deux sont dans toutes les codes pro.</div>`,
s:`console.log(1 == '1', 1 === '1');\nconsole.log('3' + 4, '3' - 1, 7 % 2, 2 ** 8);\nconsole.log(null ?? 'par défaut', 0 || 'par défaut');  // attention : 0 est falsy`,
x:['Tester == vs === sur 4 cas (0/false, "", 0)','% pour pair/impair sur 10 nombres','Version ( ?? vs || ) avec 0 et \'\' — écrire la différence','typeof sur 6 valeurs dont null : noter l\'anomalie']},
25:{t:`<div class="keepnote">🎯 Conditions : le programme choisit. C'est le 1er vrai nœud logique.</div>
<h3>1. if / else if / else</h3>
<pre><code>const note = 12;
if (note &gt;= 16)    { console.log('Excellent'); }
else if (note &gt;= 10) { console.log('Admis'); }
else                { console.log('Échec'); }</code></pre>
<ul><li>Le bloc <code>{...}</code> est obligatoire en pratique dès 2+ lignes — les linters l'exigent même pour une seule.</li>
<li><b>Truthy/Falsy</b> : dans un if, <code>0, '', null, undefined, NaN</code> = faux ; tout le reste = vrai. Ce modèle oriente les écritures "si (listeVide)…".</li></ul>
<h3>2. L'opérateur ternaire</h3>
<pre><code>const seuil = age &gt;= 18 ? 'adulte' : 'mineur';   /* if court sur une valeur */</code></pre>
<p>À chaîner avec prudence : un ternaire dans un ternaire = la lisibilité qui meurt.</p>
<h3>3. switch — quand une seule variable prend plusieurs valeurs</h3>
<pre><code>switch (jour) {
  case 'sam': case 'dim': console.log('week-end'); break;
  default: console.log('semaine');
}</code></pre>
<h3>4. &&|| et le if en une ligne</h3>
<pre><code>estConnecte &amp;&amp; afficherMenu();   /* condition-garde : l'appel ne se fait que si vrai */</code></pre>
<div class="keepnote">💡 Garde en tête : if pour les <b>blocs de comportement</b>, ternaire pour le <b>choix d'une valeur</b>, switch multiplex pour une seule variable à multi-valeurs. Chaque outil à son super-cadre.</div>`,
s:`const note = 12;\nconsole.log(note >= 16 ? 'Excellent' : note >= 10 ? 'Admis' : 'Échec');\nconst jour = 'sam';\nswitch (jour) { case 'sam': case 'dim': console.log('week-end'); break; default: console.log('semaine'); }`,
x:['Note → mention via if/else if (3 branches), tester 5 valeurs','Même logique en ternaire chaîné — écrire sa limite de lisibilité','switch sur type de jour : week-end/semaine/vacances','Exercice FizzBuzz préparer : condition &amp;&amp; sur 15']},
26:{t:`<div class="keepnote">🎯 Boucles : répéter sans copier. C'est le muscle no 1 d'un dev.</div>
<h3>1. for classique (index maîtrisé)</h3>
<pre><code>for (let i = 0; i &lt; 5; i++) { console.log('passage', i); }</code></pre>
<h3>2. for…of (parcours des éléments)</h3>
<pre><code>for (const jour of ['lun', 'mar']) console.log(jour);</code></pre>
<h3>3. while / do—while (condition au premier plan)</h3>
<pre><code>let n = 0;
while (n &lt; 10) { n *= 2; }   /* n= pas connu d'avance → while */
do { ask(); } while (reponse !== 'ok');</code></pre>
<ul><li><b>break</b> sortir la boucle · <b>continue</b> passer l'itération.
<li>while sans changement de condition = infinite loop : le classique du débogueur.</li></ul>
<h3>4. Les pièges du débutant</h3>
<ul><li><code>&lt;</code> vs <code>&lt;=</code> : décalage de 1 itération — garder <code>i &lt; tableau.length</code>.</li>
<li>Modifier la liste pendant le parcours — copie-la d'abord (<code>const copie = [...liste]</code>) puis parcourt la copie.</li>
<li>pré-calculer si la valeur change : <code>const total = a.length</code> avant boucle.</li></ul>
<div class="keepnote">💡 Garde en tête : tableau = <code>for…of</code> par défaut ; retenue si index ou recherche de valeurs indexées = <code>for</code> classique ; condition étrange = <code>while</code>. Ces 3 réflexes couvriront ton année.</div>`,
s:`for (let i = 1; i <= 5; i++) console.log('Table de', i);\nfor (const mm of ['HTML', 'CSS', 'JS']) console.log('mois :', mm);\nlet k = 1; while (k < 100) k *= 2; console.log(k); // 128 ? vérifie`,
x:['Table de multiplication 7 (for classique) 1→10','Somme des 100 premiers nombres avec while (règle de Gauss pour vérifier)','for…of sur une vraie liste de sujets','Un break + continue dans la même boucle : expliquer le comportement']},
27:{t:`<div class="keepnote">🎯 Fonctions : la réutilisation. C'est l'outil qui distingue un « scripteur » d'un « développeur ».</div>
<h3>1. Une fonction, une intention</h3>
<pre><code>function isPrime(n) {          /* un nom verbe + sujet */
  if (n &lt; 2) return false;
  for (let i = 2; i &lt; n; i++) if (n % i === 0) return false;
  return true;
}
console.log(isPrime(13));</code></pre>
<h3>2. Paramètres, valeurs par défaut, return</h3>
<pre><code>function salue(nom = 'invité') { return 'Salut ' + nom; }
salue();          // 'Salut invité'
salue('Emmanuel'); // 'Salut Emmanuel'</code></pre>
<ul><li><code>return</code> coupe immédiatement la fonction.</li>
<li>La fonction sans <code>return</code> renvoie <code>undefined</code> — utile pour l'effet de bord seul (console.log, modification DOM…).</li>
<li><b>Une seule responsabilité</b> par fonction : si son nom contient "et", c'est 2 fonctions.</li></ul>
<h3>3. Portée (le stage à venir, jour 31)</h3>
<ul><li>Une variable créée <code>const/let</code> dans la fonction <b>meurt</b> à la sortie — aucune fuite globale.</li>
<li>Les paramètres sont des copies : on peut les réassigner dans la fonction sans qu'il ne change rien en dehors.</li></ul>
<div class="keepnote">💡 Garde en tête : fonction courte (≈ &lt; 15 lignes), 1 responsabilité, verbe dans le nom. Cette discipline s'appelle la lisibilité — et la lisibilité, c'est la maintenabilité.</div>`,
s:`function surfaceRect(w, h) { return w * h; }\nconsole.log(surfaceRect(3, 4));\nfunction salue(nom = 'invité') { return 'Salut ' + nom + ' !'; }\nconsole.log(salue(), salue('Emmanuel'));`,
x:['Fonction isPrime : test sur 6 nombres','Fonction max2(a, b) puis max3 via 2 appels','Fonction salue avec défaut : 2 appels dont 1 vide','Écrire une fonction qu\'on a volontairement trop grosse (15+ lignes) puis la découper en 2']},
28:{t:`<div class="keepnote">🎯 Tableaux : la structure de données n°1. Ensuite les méthodes natives feront 80 % des tâches.</div>
<h3>1. Créer, lire, modifier</h3>
<pre><code>const jrs = ['HTML', 'CSS', 'JS'];
jrs.length;            // 3
jrs[0];                // 'HTML'  (index 0 !!!)
jrs.push('Git');       // ajoute à la fin
jrs.unshift('Zéro');   // ajoute au début
jrs.pop();             // retire le dernier
jrs.includes('JS');    // true</code></pre>
<h3>2. Le sens du <code>index</code> zéro</h3>
<ul><li><code>jrs[jrs.length - 1]</code> = dernier — le réflexe mental à installer.</li>
<li>En dehors → <code>undefined</code>, sans erreur : le piège classique du drapeau caché.</li></ul>
<h3>3. Le contenu peut être hétérogène</h3>
<pre><code>const panier = ['pain', 7, true, null, [1, 2]];</code></pre>
<div class="keepnote">💡 Garde en tête : <code>const tab = []</code> reste modifiable (<code>push</code> fonctionne) — c'est la <b>liaison</b> qui est figée, pas le contenu. Copie défensive : <code>[...tab]</code> (spread, jour 36). Sources : Cisco NetAcad — JavaScript Essentials 1, ch. « Arrays &amp; Objects » · MDN.</div>`,
s:`const jrs = ['HTML', 'CSS', 'JS'];\njrs.push('Git', 'SQL');\nconsole.log(jrs.length, jrs[0], jrs[jrs.length - 1]);\nconsole.log(jrs.includes('SQL'));  // ?`,
x:['Construire une pile : push 3, pop 1, log length','Dernier élément via length-1 (jamais de magie)','includes + indexOf sur une liste','Un tableau dans un tableau : lire un double index [1][0]']},
29:{t:`<div class="keepnote">🎯 Objets : des données nommées à clé. C'est aussi le format JSON que tu utiliseras tous les jours en 3 mois.</div>
<h3>1. Clé/valeur</h3>
<pre><code>const dev = { prenom: 'Emmanuel', age: 22, stack: ['HTML', 'JS'] };
dev.prenom;             // 'Emmanuel'
dev['stack'];           // syntaxe à crochets (clé dynamique)
dev.age = 23;           // muter une propriété
dev.ville = 'Brazza';   // ajouter</code></pre>
<h3>2. Méthodes : l'objet qui agit</h3>
<pre><code>const compte = {
  solde: 100,
  deposer(v) { this.solde += v; }
};
compte.deposer(50);   // this = l'objet appelant</code></pre>
<h3>3. JSON : le format d'échange</h3>
<pre><code>JSON.stringify(obj)  → texte pour l'API / localStorage
JSON.parse('{"a":1}')   → objet vivant</code></pre>
<div class="keepnote">💡 Garde en tête : un <b>tableau</b> quand l'ordre et le volume comptent, un <b>objet</b> quand les <b>noms</b> comptent. Les deux sont toujours embarqués l'un dans l'autre en vrai.</div>`,
s:`const dev = { prenom: 'Emmanuel', age: 22 };\ndev.stack = ['HTML', 'JS'];\nconsole.table([{ 'clé': 'prenom', valeur: dev.prenom }, { clé: 'taille stack', valeur: dev.stack.length }]);\nconsole.log(JSON.stringify(dev));`,
x:['Créer un objet profil (5 clés), lire via point ET via crochets','Méthode déposer/retirer sur un compte avec this','JSON.stringify / parse sur cet objet : aller-retour complet','Écrire un objet "utilisateur" au format JSON : que signifie une clé manquante ?']},
30:{t:`<div class="keepnote">🎯 Série de TP-calendrier : mélange variables + conditions + boucles + fonctions + tableaux + objets. Le Mois 1 s'achève ici.</div>
<h3>Exercice 1 — panier (10 min)</h3>
<pre><code>const panier = [{ nom: 'Café', prix: 2.5, qty: 3 }, { nom: 'Thé', prix: 1.8, qty: 2 }];
// → calculer le TOTAL puis le nom de l'article le plus cher</code></pre>
<h3>Exercice 2 — statistiques de nombres (10 min)</h3>
<pre><code>// [12, 45, 7, 23, 89, 34] → renvoi : le plus grand, le plus petit, la moyenne (arrondie)</code></pre>
<h3>Exercice 3 — grille (15 min)</h3>
<pre><code>// Afficher une grille 5×5 en console.log :
// chaque case = (i + j) pair → '■' sinon '·'</code></pre>
<h3>Exercice 4 — chaînes (10 min)</h3>
<pre><code>function compteWords(phrase) { /* "je suis ici" → 3 */ }
function capitalise(phrase) { /* 'je suis ici' → 'Je Suis Ici' */ }</code></pre>
<div class="keepnote">🎉 Fin du Mois 1 ! C'est le niveau où la compréhension commence vraiment. Note les 3 notions encore floues — tu les retravailleras en semaine 2. L'aimant est prêt.</div>`,
s:`// J30 — mini-panier : ton code de résolution\nconst panier = [\n  { nom: 'Café', prix: 2.5, qty: 3 },\n  { nom: 'Thé', prix: 1.8, qty: 2 }\n];\n// 1. total 2. article le plus cher`,
x:['Exercice 1 panier (total + plus cher)','Exercice 2 stats sur 6 nombres','Exercice 3 grille 5×5 (pair = ■, impair = ·)','Exercice 4 compteWords + capitalise']},
};
