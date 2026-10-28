// lessons-d1-15.js — Leçons détaillées jours 1 à 15 (web, HTML, CSS)
// Cadre académique adapté de : « Chapitre I WEB » (enseignement post-bac), MDN Web Docs,
// OpenClassrooms « Écrivez du HTML et du CSS », Cisco NetAcad (JavaScript Essentials 1/2).
// t = cours (HTML) · s = code de départ · x = travaux pratiques
window.LESSONS_D1 = {
1:{ figs:['requete','url'], t:`<div class="keepnote">🎯 Aujourd'hui : comprendre la machine que tu manipuleras 180 jours. Objectif pédagogique — savoir expliquer ce qui se passe entre un clic et un affichage.</div>
<h3>1. Définition du web — le modèle client/serveur</h3>
<p><b>Définition.</b> Le web est un système d'information distribué : un ordinateur fait une <b>demande</b> (le client), un autre la <b>sert</b> (le serveur). Le dialogue qui les relie suit un protocole strict, le <b>HTTP</b>, finalisé par le W3C (World Wide Web Consortium), l'organisme qui publie les normes du web.</p>
<p>Une page web repose sur <b>trois couches</b>, chacune avec son langage et son rôle — c'est la séparation des préoccupations, principe fondateur de tout l'ingénierie web :</p>
<table><tr><th>Couche</th><th>Langage</th><th>Rôle</th><th>Nature</th></tr>
<tr><td><b>Structure</b></td><td>HTML</td><td>le squelette : titres, paragraphes, liens, images</td><td>langage de <b>description</b> de données</td></tr>
<tr><td><b>Style</b></td><td>CSS</td><td>la présentation : couleurs, tailles, positionnement</td><td>langage de <b>présentation</b></td></tr>
<tr><td><b>Comportement</b></td><td>JS</td><td>la logique : réactions aux événements, calculs, données</td><td>langage de <b>programmation</b></td></tr></table>
<p><small style="color:var(--muted)">📚 Sources : MDN — « Comment fonctionne le Web » · OpenClassrooms, ch. 1 · cours « Chapitre I WEB », introduction.</small></p>
<h3>2. Le voyage d'une requête, étape par étape</h3>
<p>Quand tu tapes une URL et presses Entrée, une chaîne d'événements précise se déclenche :</p>
<ol><li>Le navigateur interroge le <b>DNS</b> : « quelle est l'adresse IP de <code>exemple.com</code> ? » → <code>93.184.216.34</code> (le DNS est l'annuaire du web).</li>
<li>Il ouvre une connexion vers ce serveur (protocole <b>TCP</b>, chiffrée par <b>TLS</b> si l'URL commence par <code>https</code>).</li>
<li>Il envoie une <b>requête HTTP</b> signée, par ex. <code>GET /index.html HTTP/1.1</code>.</li>
<li>Le serveur répond : un <b>code de statut</b> + un corps de réponse (HTML, puis CSS, JS et images au fur et à mesure des découvertes du document).</li></ol>
<h3>3. Les codes de statut à connaître dès le premier jour</h3>
<table><tr><th>Code</th><th>Signification</th></tr>
<tr><td><b>200</b></td><td>OK — la requête a abouti</td></tr>
<tr><td><b>301</b></td><td>redirection permanente (l'adresse a changé)</td></tr>
<tr><td><b>404</b></td><td>la ressource n'existe pas (erreur client)</td></tr>
<tr><td><b>500</b></td><td>erreur côté serveur</td></tr></table>
<div class="keepnote">💡 À retenir : le navigateur est un client qui fait confiance à ce que le serveur lui envoie. Pendant 180 jours tu apprendras à écrire <b>les deux bouts</b> de ce dialogue — et à sécuriser les deux. Dès aujourd'hui, chaque statut vu dans F12 est une donnée : lis-la comme un médecin lit une ordonnance.</div>`,
s:`<h1>Mon premier site</h1>\n<p>J'écris du HTML depuis mon éditeur intégré !</p>\n<button onclick="console.log('Clic détecté !')">Clique-moi</button>`,
pc:{ figs:['f12','devtools'], steps:[
 'Sur un PC : ouvre le site <b>mdn.dev</b> dans Chrome, presse <b>F12</b> (voir la figure), ouvre l\'onglet <b>Réseau</b>, recharge la page (F5).',
 'Repère 3 requêtes : leur <b>nom</b> (fichier demandé) et leur <b>statut</b> (200, 301, 404…). Note-les, c\'est ce que tu reporteras plus bas.',
 'Ouvre l\'onglet <b>Console</b> et tape <code>1+1</code> puis Entrée : la console calcule — c\'est ton laboratoire JS.'],
 note:'Chaque action a sa figure ci-dessus : la touche F12, puis la fenêtre de l\'outillage ouverte au bas de la page.'},
x:['Observer les requêtes d\'un vrai site avec F12 → Réseau : nommer 3 requêtes et leurs statuts','Expliquer client / serveur / DNS / statut HTTP avec tes mots, à voix haute','Modifier le starter (texte + bouton) puis Exécuter : lire la console','Écrire 3 exemples d\'erreur : 404 (page inexistante), 500 (serveur), une faute de frappe dans l\'URL']},
2:{t:`<div class="keepnote">🎯 Aujourd'hui : la grammaire du HTML — la balise, ses types, la structure minimale obligatoire. 30 balises suffisent pour 90 % d'une page.</div>
<h3>1. Définition — ce que le HTML est, ce qu'il n'est pas</h3>
<ul><li>Le HTML (<i>HyperText Markup Language</i>) est un <b>langage de description de données</b>, et non un langage de programmation : il ne contient pas de logique d'exécution, il <b>décrit</b> la structure.</li>
<li>Il est <b>figé</b> : une fois le document chargé, il ne répond à aucune action de l'utilisateur sur le contenu — c'est le métier de JS (jour 23). Le HTML est un texte balisé.</li>
<li>Son vocabulaire : un système de <b>balisage</b> qui structure le document.</li></ul>
<h3>2. La balise — définition et types</h3>
<p><b>Définition.</b> Une balise est un élément ajouté au texte de départ pour indiquer au navigateur comment l'afficher. Elle n'est pas affichée telle quelle : elle est <b>interprétée</b>. Elle est toujours délimitée par <code>&lt;</code> et <code>&gt;</code>.</p>
<p><b>Définition.</b> Un <b>attribut</b> est une information complémentaire caractérisant la balise, sous la forme <code>nom="valeur"</code> : <code>&lt;html lang="fr"&gt;</code>. <i>Attention :</i> ne pas confondre un attribut HTML et une propriété CSS — l'un paramètre la balise, l'autre règle le rendu.</p>
<table><tr><th>Type</th><th>Synonyme</th><th>Exemple</th><th>Propriété</th></tr>
<tr><td>Balise <b>simple</b></td><td>orpheline (ou « void element »)</td><td><code>&lt;img src="…"&gt;</code></td><td>vide, ne contient rien, jamais fermée</td></tr>
<tr><td>Balise <b>double</b></td><td>paire</td><td><code>&lt;p&gt;…&lt;/p&gt;</code></td><td>ouvrante + fermante avec <code>/</code></td></tr></table>
<h3>3. La structure minimale obligatoire</h3>
<pre><code>&lt;!DOCTYPE html&gt;        → déclare le HTML5
&lt;html lang="fr"&gt;       → racine + langue (accessibilité)
  &lt;head&gt;               → invisible : charset, titre, styles
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;…&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;               → visible : tout le contenu
    &lt;p&gt;Salut !&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
<h3>4. Le DOCTYPE : mode Standard vs mode Quirks</h3>
<p>Cette première déclaration sert d'une part à soumettre la page au <a href="https://validator.w3.org/" target="_blank" rel="noopener">validateur du W3C</a> (vérification des erreurs de syntaxe), d'autre part à indiquer au navigateur <b>comment interpréter</b> les balises et propriétés CSS :</p>
<ul><li>présente → <b>mode Standard</b> (rendu conforme aux normes) ;</li>
<li>absente → <b>mode Quirks</b> (rendu « non conforme », héritages trompeurs).</li></ul>
<h3>5. Les commentaires</h3>
<p>Délimités par <code>&lt;!-- … --&gt;</code>, multilignes, placés n'importe où dans le document. Ils ne s'affichent pas mais <b>restent lisibles dans le code source</b> :</p>
<ul><li>jamais d'informations confidentielles dans un commentaire HTML ;</li>
<li>éviter les doubles tirets consécutifs à l'intérieur (compatibilité entre navigateurs) ;</li>
<li>HTML, CSS et JS ont <b>chacun leur propre</b> syntaxe de commentaires : ne pas mélanger.</li></ul>
<div class="keepnote">💡 À retenir : HTML propre = HTML sans chevauchement. La règle d'imbrication est absolue : <b>la première balise ouverte est la dernière fermée</b> — le chevauchement est une grave erreur. Un HTML validé W3C à zéro erreur passe headless dans tous les navigateurs.</div>`,
s:`<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Ma page</title>\n</head>\n<body>\n  <h1>Bonjour</h1>\n  <p>Mon premier document HTML complet.</p>\n  <img src="" alt=""> \n</body>\n</html>`,
x:['Écrire de mémoire une page complète (DOCTYPE → /html), sans copier','Créer une erreur d\'imbrication volontaire (balises croisées), observer, corriger','Distinguer dans ta page une balise simple et une balise double : commenter','Ajouter un commentaire multi-lignes « propre » (sans double tiret, sans secret)','Passer la page au validateur W3C : atteindre zéro erreur']},
3:{t:`<div class="keepnote">🎯 Aujourd'hui : la hiérarchie éditoriale — titres, paragraphes, listes, mise en forme du texte. C'est 50 % de l'accessibilité.</div>
<h3>1. Les niveaux de titres <code>&lt;h1&gt;</code> … <code>&lt;h6&gt;</code></h3>
<p><b>Définition.</b> Les six niveaux de titres hiérarchisent le contenu ; le niveau le plus haut est <code>&lt;h1&gt;</code>. Trois règles héritées du cours académique :</p>
<ul><li>un titre <code>&lt;h2&gt;</code> ne se retrouve <b>jamais</b> au-dessus d'un <code>&lt;h1&gt;</code> dans un document : respecter la hiérarchie ;</li>
<li>le <code>&lt;h1&gt;</code> étant le plus important, il n'apparaît <b>qu'une seule fois</b> par page ;</li>
<li>ne choisir <b>jamais</b> un titre pour son rendu visuel dans le navigateur (qui varie selon les navigateurs et se règle en CSS), mais pour la <b>valeur hiérarchique</b> qu'il représente.</li></ul>
<h3>2. Le paragraphe <code>&lt;p&gt;</code></h3>
<p><b>Définition.</b> Comme dans un traitement de texte on segmente un texte en paragraphes, en HTML il faut préciser où commence et où se termine chaque paragraphe : c'est le rôle de <code>&lt;p&gt;</code>. Sa mise en forme (marges verticales entre deux <code>p</code>) est un espace par défaut, modifiable en CSS.</p>
<p>Saut de ligne forcé : <code>&lt;br&gt;</code> — exclusivement <b>dans</b> un paragraphe (adresse, vers d'un poème). Jamais pour « espacer » : c'est le métier de CSS.</p>
<h3>3. La mise en forme du texte — moderne vs historique</h3>
<p>Les techniques historiques existent encore, mais la bonne pratique est de s'en séparer au profit d'un langage plus puissant, le CSS — ou, quand la nuance est <b>sémantique</b>, leur balise dédiée :</p>
<table><tr><th>Historique</th><th>Moderne sémantique</th><th>Quand le choisir</th></tr>
<tr><td><code>&lt;b&gt;</code> (gras)</td><td><code>&lt;strong&gt;</code></td><td>une <b>importance réelle</b> (lecture accentuée, alerte)</td></tr>
<tr><td><code>&lt;i&gt;</code> (italique)</td><td><code>&lt;em&gt;</code></td><td>une <b>accentuation</b> de ton</td></tr>
<tr><td><code>&lt;u&gt;</code> (souligné)</td><td>CSS <code>text-decoration</code></td><td>jamais en « décoration » : réservé (liens, fautes)</td></tr>
<tr><td><code>&lt;s&gt;</code> (barré)</td><td><code>&lt;del&gt;</code> / <code>&lt;s&gt;</code></td><td>contenu retiré, prix barré</td></tr>
<tr><td><code>&lt;sup&gt;/&lt;sub&gt;</code></td><td>inchangés ✓</td><td>exposant (m²), indice (H₂O)</td></tr>
<tr><td><code>&lt;font&gt;</code> (couleur/taille)</td><td>CSS <code>color/font-size</code></td><td>⤵ <b>obsolète</b> — jamais en HTML ; la police se règle en CSS (jour 9)</td></tr></table>
<h3>4. Les 2 listes <code>ul</code> / <code>ol</code></h3>
<table><tr><th>Type</th><th>Balises</th><th>Usage</th></tr>
<tr><td>À puces</td><td><code>ul &gt; li</code></td><td>ingrédients, menus — sans ordre</td></tr>
<tr><td>Numérotée</td><td><code>ol &gt; li</code></td><td>étapes, classements, procédures</td></tr></table>
<pre><code>&lt;ul&gt;
  &lt;li&gt;Entrée
    &lt;ul&gt;&lt;li&gt;Soupe&lt;/li&gt;&lt;/ul&gt;
  &lt;/li&gt;
  &lt;li&gt;Plat&lt;/li&gt;
&lt;/ul&gt;</code></pre>
<div class="keepnote">💡 À retenir : l'arbre de titres est la table des matières que les moteurs de recherche et lecteurs d'écran lisent. Un arbre droit = une page que tout le monde retrouve. L'<i>apparence</i> des titres ne concerne pas le HTML : elle appartient au CSS (jour 9).</div>`,
s:`<h1>Recette de kuaku</h1>\n<h2>Ingrédients</h2>\n<ul>\n  <li>Manioc</li>\n  <li>Arachide</li>\n</ul>\n<h2>Étapes</h2>\n<ol>\n  <li>Peler</li>\n  <li>Piler</li>\n  <li>Cuire</li>\n</ol>`,
x:['Écrire une page de vraie recette (3 niveaux de titres, 2 listes)','Utiliser strong, em, s et sup/sub dans le contexte sémantique juste','Imbriquer une liste dans une liste (entrées/plats)','Un &lt;br&gt; dans un paragraphe légitime (adresse) et pas ailleurs','Changer visuellement un &lt;h6&gt; en « gros et rouge » en CSS, puis expliquer pourquoi c\'est une mauvaise pratique']},
4:{t:`<div class="keepnote">🎯 Aujourd'hui : le lien hypertexte — la fonction qui a inventé le web — puis les images et leurs attributs vitaux.</div>
<h3>1. Définition du lien hypertexte</h3>
<p><b>Définition.</b> Un lien hypertexte est un élément HTML permettant d'envoyer le visiteur vers une nouvelle page. On distingue deux types : le <b>lien externe</b> (vers une page d'un autre site, ou une autre page de ton site) et le <b>lien interne</b> (vers un autre endroit de la même page).</p>
<p>Le tout passe par la balise <code>&lt;a&gt;</code> (ancre) : tout ce qu'elle contient devient cliquable (texte, images, autres balises « inline »). L'adresse vit dans l'attribut <code>href</code>.</p>
<pre><code>&lt;a href="https://mdn.dev" target="_blank" rel="noopener"&gt;Lien externe&lt;/a&gt;
&lt;a href="apropos.html"&gt;Page locale&lt;/a&gt;
&lt;a href="#chapitre2"&gt;Ancre interne&lt;/a&gt;
&lt;h2 id="chapitre2"&gt;…&lt;/h2&gt;   → cible de l'ancre</code></pre>
<h3>2. Ancres et navigation interne</h3>
<p>Le signe <code>#</code> suivi d'un mot-clé pointe vers la balise dont l'attribut <code>id</code> porte ce mot-clé — c'est le principe d'un sommaire. Vers une autre page : <code>href="page.html#ancre"</code>.</p>
<h3>3. L'attribut <code>target</code> : où s'ouvre le lien</h3>
<table><tr><th>Valeur</th><th>Comportement</th></tr>
<tr><td><code>_self</code></td><td>fenêtre courante (par défaut)</td></tr>
<tr><td><code>_blank</code></td><td>nouvel onglet — TOUJOURS accompagné de <code>rel="noopener"</code> (sécurité + perf)</td></tr>
<tr><td><code>_top</code></td><td>toute la fenêtre courante</td></tr>
<tr><td><code>_parent</code></td><td>cadre enveloppant (contexte d'imbrication)</td></tr></table>
<p>L'attribut <code>title</code> renseigne un petit descriptif de la cible : atout pour l'accessibilité et le référencement. Liens <b>relatifs</b> (dans le même site) vs <b>absolus</b> (URL complète) : un site porté d'un serveur à l'autre ne casse jamais s'il utilise des liens relatifs.</p>
<h3>4. Le lien e-mail</h3>
<pre><code>&lt;a href="mailto:toi@exemple.com"&gt;Écris-moi&lt;/a&gt;</code></pre>
<h3>5. L'image &lt;img&gt; et ses attributs vitaux</h3>
<pre><code>&lt;img src="photo.jpg" alt="Marché de Brazzaville au matin" width="600"&gt;</code></pre>
<ul><li><code>src</code> : chemin de l'image — <b>absolu</b> (http) ou <b>relatif</b> (fichier local) ; <code>alt</code> : texte alternatif affiché si l'image ne se charge pas — il aide les moteurs de recherche (SEO) et les lecteurs d'écran ; <b>jamais optionnel</b>.</li>
<li>Formats : <code>JPG</code> (photos), <code>PNG</code> (transparence, dessins), <code>GIF</code> (petites animations), <code>WebP</code>/<code>AVIF</code> (modernes, plus légers). Éviter BMP : énorme sans gain.</li>
<li><code>loading="lazy"</code> : chargement hors-écran différé (performance) ; <code>width/height</code> explicites : éviter le décalage de mise en page.</li>
<li><i>Note historique :</i> les attributs <code>align</code> et <code>background</code> existaient pour aligner l'image ou la mettre en fond — ils sont <b>obsolètes</b> : aujourd'hui, tout ça se règle en CSS (jours 8–12).</li></ul>
<h3>6. Approfondissement — zones réactives &lt;map&gt; / &lt;area&gt;</h3>
<p>HTML peut découper une image en plusieurs zones cliquables (une « <b>carte</b>», <code>&lt;map&gt;</code>). L'image référence la carte via <code>usemap="#nom"</code>, la carte porte un <code>name</code> identique, et chaque <code>&lt;area&gt;</code> décrit une zone :</p>
<pre><code>&lt;img src="plan.jpg" alt="Plan" usemap="#carte"&gt;
&lt;map name="carte"&gt;
  &lt;area shape="rect"  coords="10,50,60,60"   href="a.html"&gt;
  &lt;area shape="circle" coords="40,40,10"   href="b.html"&gt;
  &lt;area shape="poly"  coords="0,0,40,50,78,101" href="c.html"&gt;
&lt;/map&gt;</code></pre>
<ul><li><code>rect</code> : coins haut-gauche et bas-droit (x1,y1,x2,y2) ; <code>circle</code> : centre + rayon (x,y,r) ; <code>poly</code> : liste de points (x1,y1,x2,y2…) — tout en pixels, depuis le coin haut-gauche de l'image.</li>
<li>Ne pas faire se chevaucher les zones : c'est la première définie qui s'affiche au-dessus.</li></ul>
<h3>7. La balise &lt;audio&gt;</h3>
<pre><code>&lt;audio src="chanson.ogg" controls&gt;&lt;/audio&gt;</code></pre>
<p><code>controls</code> affiche les boutons (lecture, pause, volume) — c'est lui qui rend le lecteur visible. <code>autoplay</code> fait partir le son automatiquement, <code>loop</code> le répète (à réserver à de vrais besoins : l'autoplay non demandé agresse l'utilisateur).</p>
<div class="keepnote">💡 À retenir : une adresse (href / src) est en <b>relatif</b> tant qu'elle est dans ton site, en <b>absolu</b> quand elle est ailleurs. C'est ce qui rendra tes projets portables. alt obligatoire, target="_blank" toujours avec rel="noopener".</div>`,
s:`<h1>Ma page de liens et médias</h1>\n<a href="https://developer.mozilla.org" target="_blank" rel="noopener" title="Documentation MDN">MDN</a>\n<a href="mailto:moi@exemple.com">Écris-moi</a>\n<p>\n  <img src="" alt="texte alternatif" width="200" loading="lazy">\n</p>\n<audio src="" controls></audio>`,
pc:{ figs:['f12'], steps:[
 'Sur PC : F12 → Éléments. Repère avec l\'icône de sélection (flèche) une image d\'un site : lis ses attributs <b>src</b> et <b>alt</b>.',
 'Colle dans ton éditeur un <code>&lt;img usemap&gt;</code> avec une <code>&lt;map&gt;</code> 2 zones (rect + circle) sur une image de ton choix, puis ouvre le fichier : passe la souris sur chaque zone.',
 'Vérifie au validateur W3C que ton document reste à zéro erreur avec map/area.'],
 note:'coords se lit en pixels tous points confondus, côté haut-gauche de l\'image : zoome l\'image dans un logiciel de dessin pour lire les coordonnées.'},
x:['Un lien externe target="_blank" + rel="noopener" + attribut title','Un lien interne vers une ancre de la même page (id + href="#…")','Un mailto: vers ton adresse réelle','Une image avec alt obligatoire + width/height + loading="lazy"','(Avancé) une map/area rect + circle avec 2 destinations']},
5:{t:`<div class="keepnote">🎯 Aujourd'hui : les données structurées — tableaux et formulaires. HTML devient déjà un langage d'application.</div>
<h3>1. Le tableau de données &lt;table&gt;</h3>
<pre><code>&lt;table&gt;
  &lt;thead&gt;
    &lt;tr&gt;&lt;th&gt;Ville&lt;/th&gt;&lt;th&gt;Population&lt;/th&gt;&lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;&lt;td&gt;Kinshasa&lt;/td&gt;&lt;td&gt;17 M&lt;/td&gt;&lt;/tr&gt;
    &lt;tr&gt;&lt;td&gt;Brazzaville&lt;/td&gt;&lt;td&gt;2,4 M&lt;/td&gt;&lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;</code></pre>
<ul><li><code>th</code> = cellule d'en-tête (<code>scope="col"</code>/<code>"row"</code> pour l'accessibilité).</li>
<li>Un tableau sert à des <b>données</b>, jamais à faire une mise en page (c'est le métier de CSS Grid, jour 13).</li></ul>
<h3>2. Le formulaire &lt;form&gt; — collecter une saisie utilisateur</h3>
<pre><code>&lt;form&gt;
  &lt;label for="nom"&gt;Nom :&nbsp;&lt;/label&gt;
  &lt;input id="nom" name="nom" required&gt;

  &lt;select name="pays"&gt;
    &lt;option value="cg"&gt;Congo&lt;/option&gt;
    &lt;option value="cd"&gt;RDC&lt;/option&gt;
  &lt;/select&gt;
  &lt;textarea name="msg" rows="4"&gt;&lt;/textarea&gt;
  &lt;button type="submit"&gt;Envoyer&lt;/button&gt;
&lt;/form&gt;</code></pre>
<ul><li><code>&lt;label for=id&gt;</code> lié à l'input — double la zone cliquable et active l'accessibilité.</li>
<li>Le <code>name</code> est tout : c'est la clé sous laquelle la donnée est envoyée au serveur.</li>
<li>Types d'input : <code>text</code>, <code>email</code> (validation native), <code>number</code>, <code>checkbox</code>, <code>radio</code>, <code>date</code>, <code>password</code>.</li>
<li><code>required</code>, <code>min</code>, <code>max</code>, <code>pattern</code> : la validation HTML gratuite.</li></ul>
<div class="keepnote">💡 À retenir : input sans label = champ aveugle. Le duo for ↔ id est le plus oublié du web. Et un tableau sert aux données, pas aux colonnes de mise en page.</div>`,
s:`<form>\n  <label for="nm">Nom :</label>\n  <input id="nm" name="nom" required>\n  <select name="niveau">\n    <option value="debut">Débutant</option>\n    <option value="moins6">Moins de 6 mois</option>\n  </select>\n  <button type="submit">S'inscrire</button>\n</form>`,
x:['Un tableau à 2 colonnes avec thead / tbody / th scope','Un formulaire : nom (required), email type=email, sélecteur pays','Lier chaque input à son label (for ↔ id)','Tester la validation native : soumettre un email invalide et lire le message','Bloquer un input pattern (ex : ^[0-9]{3}$) et expliquer le message d\'erreur']},
6:{t:`<div class="keepnote">🎯 Aujourd'hui : le HTML sémantique — écrire des mots que les machines comprennent.</div>
<h3>1. Pourquoi sémantique ? La différence entre balise générique et balise à sens</h3>
<p><code>&lt;div&gt;</code> et <code>&lt;span&gt;</code> ne disent <i>rien</i> — ce sont des <b>récipients neutres</b>. Les balises sémantiques disent <b>ce qu'elles sont</b> : navigation, article, pied de page. Gain concret : un lecteur d'écran peut sauter à la navigation ; un moteur de recherche classe le contenu.</p>
<h3>2. Le squelette sémantique type</h3>
<pre><code>&lt;body&gt;
  &lt;header&gt;     → logo, titre, nav
    &lt;nav&gt;…&lt;/nav&gt;
  &lt;/header&gt;
  &lt;main&gt;       → un seul par page !
    &lt;article&gt;   → un contenu autonome (post, produit)
      &lt;h2&gt;&lt;/h2&gt;
    &lt;/article&gt;
    &lt;section&gt;   → un regroupement thématisé
    &lt;aside&gt;     → contenu de côté : pub, liens connexes
  &lt;/main&gt;
  &lt;footer&gt;     → colophon, mentions
  &lt;/footer&gt;
&lt;/body&gt;</code></pre>
<h3>3. La règle de décision</h3>
<ul><li><b>&lt;main&gt; est unique</b>.</li>
<li><code>section</code> doit normalement être titrée.</li>
<li>Si une boîte ne mérite qu'un « casier visuel », garde un <code>div</code> — le sémantique n'interdit pas le div, il l'exclut quand du sens existe.</li>
<li>Test : « si je remplace cette balise par div, ai-je perdu du sens ? » Oui → sémantique. Non → div acceptable.</li></ul>
<div class="keepnote">💡 À retenir : le HTML des jours 1 à 6 décrit ; il gagnera sa présentation demain avec le CSS. Un balisage sémantique rapporte gratuitement : SEO, accessibilité, maintenance.</div>`,
s:`<body>\n<header>\n  <nav><a href="#">Accueil</a> · <a href="#">Contact</a></nav>\n</header>\n<main>\n  <article>\n    <h2>Mon article</h2>\n    <p>Je réfléchis à la structure sémantique !</p>\n  </article>\n  <aside>Liens frères</aside>\n</main>\n<footer>© 2026</footer>`,
x:['Reconstruire le squelette : header &gt; nav, main &gt; article/aside, footer','Écrire en commentaire un cas où un div est légitime (et pourquoi)','Titrer chaque section : ajouter h2 sous peine de hiérarchie floue','Vérifier : un seul main, chaque section titrée']},
7:{t:`<div class="keepnote">🎯 Premier mini-projet. Rigueur académique : on analyse AVANT de coder. Les 6 premiers jours suffisent comme briques.</div>
<h3>1. Analyse du besoin (5 min, d'après la méthode Merise — modèle fonctionnel)</h3>
<p>Avant d'écrire la moindre balise, réponds sur papier à trois questions — c'est exactement ce qu'un analyste fait avant toute application :</p>
<ol><li><b>Qui échange quoi avec qui ?</b> Ici : le visiteur navigue entre les trois sections (Bio → Compétences → Contact) via le menu de la nav.</li>
<li><b>Quelles données la structure doit-elle afficher ?</b> nom, avatar, bio, compétences, formulaire de contact.</li>
<li><b>Quelles contraintes ?</b> un seul main, un seul h1, ancres fonctionnelles, label ↔ id.</li></ol>
<h3>2. Cahier des charges</h3>
<p>Une page de <b>profil personnel</b> sémantiquement propre — comme un vrai site deviendrait ton portfolio :</p>
<ol><li><code>&lt;header&gt;</code> : logo texte + nom + navigation (3 ancres internes : Bio, Compétences, Contact)</li>
<li><code>&lt;main&gt;&lt;article&gt;</code> : une section Bio (h2 + premier paragraphe), une section Compétences (liste ou tableau), une section Contact avec formulaire (nom, email type=email + message)</li>
<li><code>&lt;img&gt;</code> : avatar avec <code>alt</code>, <code>width/height</code>, <code>loading="lazy"</code></li>
<li><code>&lt;footer&gt;</code> : année + mention</li></ol>
<h3>3. Grille d'auto-évaluation (10 pts)</h3>
<ul><li>Un seul main — <b>2 pts</b></li>
<li>Un seul h1 + hiérarchie propre des h2/h3 — <b>2 pts</b></li>
<li>Nav à ancres internes fonctionnelles — <b>2 pts</b></li>
<li>Formulaire complètement lié (for↔id, name, required, type=email) — <b>2 pts</b></li>
<li>Image avec alt obligatoire + width/height — <b>1 pt</b></li>
<li>Div utilisés uniquement en « casier visuel » — <b>1 pt</b></li></ul>
<div class="keepnote">🙂 Méthode : n'écris pas d'un bloc. Écris la structure, teste chaque ancre, puis viens le formulaire. Pose ton aimant à 8/10 minimum — le CSS de demain l'habillera.</div>`,
s:`<!-- Page de profil — J7 : structure à compléter -->\n<header>\n  <h1>Emmanuel</h1>\n  <nav><a href="#bio">Bio</a> · <a href="#comp">Compétences</a> · <a href="#ctc">Contact</a></nav>\n</header>\n<main>\n  <article>\n    <h2 id="bio">Bio</h2>\n    <p>Développeur en formation...</p>\n  </article>\n  <!-- TODO : section compétences, section contact avec formulaire -->\n</main>\n<footer>© 2026</footer>`,
x:['Écrire d\'abord l\'analyse (3 questions) en commentaire, PUIS coder','Compléter le squelette en une page de profil complète','Ancres internes (Bio/Compétences/Contact) qui fonctionnent au clic','Formulaire complet avec labels liés, name, type=email, required','Auto-évaluation sur grille /10 : écrire ta note dans un commentaire']},
8:{t:`<div class="keepnote">🎯 CSS entre en scène : la couche de PRESENTATION. On a fait structure (HTML) — on habille.</div>
<h3>1. Définition et phrase d'une règle CSS</h3>
<p><b>Définition.</b> CSS (<i>Cascading Style Sheets</i>, feuilles de style en cascade) : un langage de présentation qui décrit le rendu du HTML. Attention : ne pas confondre <b>attribut HTML</b> (ex : <code>href</code>, dans la balise) et <b>propriété CSS</b> (ex : <code=color</code>, dans une règle).</p>
<pre><code>sélecteur {
  propriété: valeur;
  autre-propriété: autre-valeur;
}
p { color: red; }   → tous &lt;p&gt; deviennent rouges</code></pre>
<h3>2. Trois façons de brancher le CSS</h3>
<table><tr><th>Voie</th><th>Portée</th><th>Quand l'utiliser</th></tr>
<tr><td><code>&lt;style&gt;</code> dans &lt;head&gt;</td><td>une seule page</td><td>prototypes, exercices</td></tr>
<tr><td><code>&lt;link rel="stylesheet" href="style.css"&gt;</code></td><td>plusieurs pages</td><td>le réflexe de prod</td></tr>
<tr><td><code>style="…"</code> inline</td><td>une seule ligne (triomphe sur tous)</td><td>à éviter (rare cas JS/emails)</td></tr></table>
<h3>3. Les sélecteurs à connaître ce soir</h3>
<pre><code>*        { }          → tout
p        { }          → par balise
.info    { }          → par classe    &lt;div class="info"&gt;
#top     { }          → par id      &lt;img id="top"&gt;
ul li    { }          → descendant
a:hover  { }          → pseudo-classe (états)</code></pre>
<ul><li><b>Classe</b> (réutilisable) vs <b>id</b> (unique) : l'id ne devrait pas servir de sélecteur CSS — réserve-le au JS et aux ancres.</li>
<li><b>Cascade et spécificité</b> : une règle plus précise gagne (id &gt; classe &gt; balise) ; à spéc antagonistes égales, la dernière écrite écrase l'ancienne.</li></ul>
<div class="keepnote">💡 À retenir : on style des <b>classes</b>, pas des balises nues, et jamais des id. C'est le réflexe qui évitera des guerres de spécificité. Sources : OpenClassrooms « Écrivez du HTML5 et du CSS3 », ch. sélecteurs · MDN — Selector.</div>`,
s:`<style>\n  p { color: white; }        /* essaie de changer avec une classe */\n  .titre { color: steelblue; }\n</style>\n<h1 class="titre">CSS commence</h1>\n<p>Ce paragraphe suit la cascade.</p>\n<p class="titre">Celui-ci gagne-t-il ? Pourquoi ?</p>`,
x:['Créer une règle p + une classe + un id ; observer la cascade','Réécrire TOUTES les règles via des .classes (plus d\'id en CSS)','Utiliser a:hover pour changer la couleur des liens','Déplacer le CSS dans &lt;link rel="stylesheet"&gt; : quel lien avec la portée ?','Expliquer en 2 lignes pourquoi une classe « gagne » sur une balise']},
9:{t:`<div class="keepnote">🎯 Couleurs, polices, unités — le vocabulaire du visuel, avec ses deux écritures héritées.</div>
<h3>1. Écrire une couleur</h3>
<ul><li><b>Hexadécimal RGB</b> précédé d'un <code>#</code> : <code>#ff0000</code> = rouge, <code>#00ff00</code> = vert, <code>#0000ff</code> = bleu. Raccourci permis : <code>#34A</code> = <code>#3344AA</code>.</li>
<li><b>Nominales</b> (en anglais) : <code>red</code>, <code>yellow</code>, <code>pink</code>, <code>teal</code>… — pratiques pour l'école, dangereuses en prod (palette limitée, traductions hasardeuses).</li>
<li>Moderne : <code>rgb(99 129 208)</code> / <code>rgba(99 129 208 / .4)</code> (transparence), et <code>hsl(220 55% 60%)</code> : Teinte → Saturation → Luminosité — changer la teinte de +40 crée une variante : c'est le langage des thèmes.</li></ul>
<h3>2. Les polices — la pile de familles</h3>
<p>Une police demandée peut être absente de la machine du visiteur. On écrit donc une <b>liste de repli</b> : la famille de polices est une liste séparée par des virgules, dans l'ordre de préférence, se terminant par une catégorie générique :</p>
<pre><code>font-family: "Segoe UI", Verdana, sans-serif;
/* si Segoe UI manque → Verdana ; sinon → une sans-serif générique */</code></pre>
<ul><li><b>serif</b> : à empattements — titres officiels · <b>sans-serif</b> : net — le web moderne.</li>
<li><code>font-weight</code> : 400 normal · 700 bold · 600 semi-bold · 800 extra-bold.</li>
<li><i>Héritage du cours historique :</i> l'attribut <code>font</code>/<code>face</code>/<code>size</code> du HTML 4 est mort — pas de police HTML, uniquement CSS.</li></ul>
<h3>3. Les unités : px n'est pas ton ami pour tout</h3>
<table><tr><th>Unité</th><th>Sens</th><th>Usage</th></tr>
<tr><td><code>px</code></td><td>pixels écran (fixe)</td><td>lignes, ombres, bordures fines</td></tr>
<tr><td><code>em</code></td><td>facteur du parent</td><td>à éviter : se cumule en cascade</td></tr>
<tr><td><code>rem</code></td><td>facteur de la racine (~16px)</td><td>typographie, espaces : responsive gratuit</td></tr>
<tr><td><code>%</code></td><td>pourcentage du parent</td><td>largeurs</td></tr>
<tr><td><code>vh / vw</code></td><td>% du viewport</td><td>héros, bandes pleines</td></tr></table>
<div class="keepnote">💡 À retenir : l'utilisateur règle la taille de police de son navigateur. Une page en <code>rem</code> grandit avec lui — c'est de l'accessibilité, pas de l'esthétique. Sources : cours « Chapitre I WEB », ch. couleurs &amp; polices · MDN — font-family.</div>`,
s:`<style>\n  :root { font-size: 18px; }   /* change ça : tout suit */\n  .pastel { color: hsl(220 55% 60%); }\n  .pile { font-family: "Segoe UI", Verdana, sans-serif; }\n</style>\n<h1 class="pastel pile">hsl + pile de polices</h1>\n<p style="font-size:.9rem">Je suis en rem : je respecte :root.</p>\n<p style="color:#ff0000">Rouge en hexadécimal RGB.</p>`,
x:['Créer 3 couleurs via hsl(), 1 via hex complet, 1 via rgba (transparence)','Changer la base rem :root → tout le texte suit : observer','Écrire une font-family en vraie pile (3 familles + générique final)','Comparer rem vs px sur un zoom navigateur (Ctrl +) : noter la différence']},
10:{ figs:['boxmodel'], t:`<div class="keepnote">🎯 La box model : quatre boîtes concentriques qui suivent TOUS tes composants.</div>
<h3>1. Définition — la tour de boîtes</h3>
<pre><code>┌───────────────────────────┐
│         margin            │   transparent, écarte les voisins
│ ┌───────────────────────┐ │
│ │       border          │ │   visible, épaisseur 2-3 px, couleur
│ │  ┌─────────────────┐  │ │
│ │  │     padding     │ │   respiration DANS la boîte
│ │  │  ┌───────────┐  │ │
│ │  │  │  content  │  │ │   contenu (width/height par défaut)
│ │  │  └───────────┘  │ │
│ │  └─────────────────┘  │
│ └───────────────────────┘ │
└───────────────────────────┘</code></pre>
<h3>2. Le piège classique et son remède</h3>
<p>Par défaut, <code>width</code> = le contenu seul. Donc <code>width:200px + padding:20px + border:2px = 244px réels</code>. Remède définitif (utilisé par 100 % des sites modernes) :</p>
<pre><code>* { box-sizing: border-box; }   /* width inclut padding + border */</code></pre>
<h3>3. Marges fusionnées et marges auto</h3>
<ul><li>Deux marges verticales adjacentes <b>fusionnent</b> (la plus grande gagne) : cause classique des « espaces surprises ».</li>
<li><code>margin-left/right: auto</code> envoie un bloc centré : <code>max-width: 720px; margin: 0 auto;</code>.</li>
<li>Les marges négatives existent et servent à « rattraper » un padding.</li></ul>
<div class="keepnote">💡 À retenir : dans la console (F12 → Éléments → panneau Computed), le navigateur affiche les boîtes en couleurs. Apprends à la LIRE comme une carte géographique. Source : MDN — box model.</div>`,
s:`<style>\n  * { box-sizing: border-box }        /* teste sans cette ligne */\n  .carte { width: 300px; padding: 20px; border: 2px solid teal; margin: 20px; }\n  .carte2 { max-width: 220px; margin: 0 auto; }\n</style>\n<div class="carte">Mesure-moi en F12 (Computed)</div>\n<div class="carte2">Et maintenant centrée</div>`,
pc:{ figs:['devtools'], steps:[
 'Sur PC avec F12 : ouvre l\'onglet <b>Éléments</b>, clique sur une <code>&lt;div&gt;</code> de ta page.',
 'Dans l\'onglet <b>Computed</b> (ou le panneau box model), lis la largeur réelle : vérifie le calcul 300 + (20×2) + (2×2). Compare aux valeurs écrites dans le CSS.',
 'Change <code>* { box-sizing }</code> dans l\'inspecteur et observe la valeur qui bouge en direct.'],
 note:'L\'inspecteur réécrit le CSS en brouillon : ces essais ne s\'enregistrent pas — le fichier reste ta source de vérité.'},
x:['Reproduire une carte sans/avec box-sizing : noter la largeur calculée','En F12, lire l\'inspecteur box model sur 2 éléments','Centrer un bloc via max-width + margin auto','Comparer les styles hérités vs recopiés : à quoi ça sert ?']},
11:{t:`<div class="keepnote">🎯 display et position : la logique de « où est chaque boîte ? ».</div>
<h3>1. Les 4 <code>display</code> fondamentales</h3>
<ul><li><code>block</code> : occupe toute la largeur disponible (p, div, h1…)</li>
<li><code>inline</code> : s'intègre dans le texte sans couper la ligne (a, strong…) — <b>padding/margin verticaux sans effet</b> : piège courant.</li>
<li><code>inline-block</code> : inline mais accepte toutes les dimensions.</li>
<li><code>none</code> : disparaît de la mise en page (vs <code>visibility: hidden</code> qui garde la place).</li></ul>
<h3>2. Les 5 <code>position</code></h3>
<table><tr><th>Valeur</th><th>Comportement</th><th>Usage courant</th></tr>
<tr><td><code>static</code></td><td>flux normal (défaut)</td><td>—</td></tr>
<tr><td><code>relative</code></td><td>dans le flux + décalage possible</td><td>parent de référence pour des enfants absolus</td></tr>
<tr><td><code>absolute</code></td><td>hors flux, ancré au plus proche ancêtre positionné</td><td>badges, tooltips</td></tr>
<tr><td><code>fixed</code></td><td>hors flux, ancré au viewport</td><td>header, toasts</td></tr>
<tr><td><code>sticky</code></td><td>dans le flux + se colle au seuil</td><td>entête de table, rail</td></tr></table>
<h3>3. Z-index : empiler les couches</h3>
<ul><li><code>z-index</code> ne marche qu'avec des éléments positionnés (ou flex/grid). Grande valeur = devant.</li>
<li>Un <code>position:absolute</code> sans parent positionné se cale dans la page — c'est souvent là qu'on perd un badge.</li></ul>
<div class="keepnote">💡 À retenir : le combo n°1 : <code>parent relative</code> + <code>enfant absolute</code>. Badge sur un avatar, étiquette sur une carte, menu déroulant — tout commence là.</div>`,
s:`<style>\n  .badge { position: absolute; top: -8px; right: -8px; background: tomato; color: white; padding: 4px 8px; border-radius: 99px; }\n  .wrap { position: relative; display: inline-block; }\n</style>\n<div class="wrap">\n  🟦 élément positionné\n  <span class="badge">3</span>\n</div>`,
x:['Un badge absolu sur une carte relative','Un fixed : bannière fixe qui reste au scroll','sticky sur un titre de section','Comparé : display:none vs visibility:hidden — mesurer la différence']},
12:{t:`<div class="keepnote">🎯 Flexbox : l'outil n°1 pour aligner. D'ici 30 jours tu l'écriras les yeux fermés.</div>
<h3>1. Les propriétés du conteneur</h3>
<pre><code>.flex {
  display: flex;                                 /* les enfants deviennent "flexibles" */
  justify-content: center;                       /* aligner sur l'axe PRINCIPAL */
  align-items: center;                           /* aligner sur l'axe TRANSVERSAL */
  gap: 12px;                                     /* espace régulier entre enfants */
}</code></pre>
<h3>2. Direction et échange d'axes</h3>
<ul><li><code>flex-direction: row | column</code> : l'axe principal se tourne.</li>
<li>Astuce : quand tu écris <code>column</code>, <code>justify-content</code> devient vertical. Toujours te demander « quel est mon axe principal ? ».</li>
<li><code>flex-wrap: wrap</code> pour autoriser le renvoi à la ligne.</li></ul>
<h3>3. Alignement — tableau de valeurs</h3>
<table><tr><th>Propriété</th><th>Valeurs majeures</th></tr>
<tr><td><code>justify-content</code></td><td><code>flex-start · center · flex-end · space-between · space-around</code></td></tr>
<tr><td><code>align-items</code></td><td><code>stretch · center · flex-start · flex-end</code></td></tr></table>
<h3>4. Les enfants qui se répartissent</h3>
<pre><code>.enfant  { flex: 1; }          /* s'agrandit proportionnellement */
.enfant2 { flex: 0 0 300px; }  /* immuable : croissance 0, base 300px */</code></pre>
<div class="keepnote">💡 À retenir : <code>display:flex + align-items:center + justify-content:center</code> = la ligne sacrée du centrage parfait. Tu l'écriras des centaines de fois.</div>`,
s:`<div style="display:flex; gap:12px; align-items:center; justify-content:space-between">\n  <span>A</span><span>B</span><span>C</span>\n</div>`,
x:['Aligner 3 éléments : space-between vs space-around, comparer','Centrer parfaitement (horizontal + vertical) une boîte dans son parent','Une barre nav : logo à gauche + liens à droite','Observer flex:1 : réduire la fenêtre, les enfants se partagent «Prompt Avec ce qui se répartit»']},
13:{t:`<div class="keepnote">🎯 Grid : la mise en page par <b>lignes ET colonnes</b>. Flex gère une dimension — Grid en gère deux.</div>
<h3>1. Une grille en 2 lignes</h3>
<pre><code>.grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;   /* 3 colonnes, le milieu double */
  gap: 16px;                            /* la gouttière, propre */
}</code></pre>
<p><code>fr</code> = part flexible de l'espace restant : <code>1fr 2fr 1fr</code> donne le double au milieu. C'est le langage des trames de page.</p>
<h3>2. Étaler des enfants</h3>
<pre><code>.header { grid-column: 1 / -1; }        /* occupe toute la rangée */
.figure { grid-row: span 2; }</code></pre>
<h3>3. La victoire du jour — l'auto responsive</h3>
<pre><code>grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));</code></pre>
<p>Quand la fenêtre s'élargit, cette seule ligne crée des grilles responsive sans media queries : des cartes qui passent de 2 à 5 colonnes toutes seules.</p>
<h3>4. Grid vs Flex, la relation</h3>
<ul><li>Flex = 1 ligne d'éléments (barre nav, aligner boutons) · Grid = page entière, boîtes (plateaux), cartes</li>
<li>Hybridation courante : le conteneur est Grid et chaque cellule interne est à son tour flex.</li></ul>
<div class="keepnote">💡 À retenir : si « j'élargis la fenêtre et tout se re-tisse », grid auto-fill suffit. Les media queries de demain servent plutôt à restructurer la navigation, pas à empiler les colonnes.</div>`,
s:`<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:10px">\n  <div style="background:teal; color:white; padding:20px; border-radius:8px">1</div>\n  <div style="background:tomato; color:white; padding:20px; border-radius:8px">2</div>\n  <div style="background:green; color:white; padding:20px; border-radius:8px">3</div>\n</div>`,
x:['Grille 3 colonnes : 1fr 2fr 1fr, header plein sur la rangée 1','auto-fill minmax : élargir la fenêtre et compter les colonnes','Une carte qui s\'étale sur 2 lignes dans la même grille','Décider grid ou flex : écrire le critère en 2 phrases']},
14:{t:`<div class="keepnote">🎯 Responsive : un site se lit à 360px, 768px, 1200px — LE SITE EST LE MÊME, la grille s'adapte.</div>
<h3>1. Le viewport, réflexe historique</h3>
<pre><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code></pre>
<p>Sans cette ligne le téléphone simule une fenêtre de 980px et réduit la page. Avec elle, la page suit les vrais pixels du device.</p>
<h3>2. Le mobile-first, l'esprit</h3>
<ul><li>Écrire le CSS du MOBILE d'abord (le minimum viable) — puis « élargir » avec <code>@media (min-width: …)</code>.</li>
<li>Avantages : base simple, adaptation naturelle au vrai mobile. Les media queries servent d'enrichissement, pas de correction.</li></ul>
<h3>3. Les valeurs fluides entre les paliers</h3>
<ul><li><code>:root { font-size: clamp(14px, 1rem + 2vw, 18px); }</code></li>
<li><code>padding: clamp(12px, 5vw, 32px)</code> — pont fluide et sécurisé.</li>
<li><code>100vw/100vh</code> : attention aux barres de navigateur mobiles (amélioré par <code>dvh</code>)</li></ul>
<div class="keepnote">💡 À retenir : mobile-first n'est pas une mode : c'est simplement partir de la contrainte la plus étroite. Le desktop hérite facilement ; l'inverse exige de détruire. Source : OpenClassrooms — Design responsive.</div>`,
s:`<style>\n  .box { padding: 20px; background: peachpuff; }\n  @media (min-width: 600px) {\n    .box { background: lightsteelblue; padding: 40px; }\n  }\n</style>\n<div class="box">Redimensionne la fenêtre → je change</div>\n<a href="https://developer.mozilla.org/fr/docs/Web/CSS/@media" target="_blank">Référence media queries</a>`,
x:['Rétrécir la fenêtre : lister 3 défauts (espaces, colonnes, tailles…)','Ajouter une media (min-width) d\'enrichissement, sans réécrire tout','Appliquer clamp() sur un padding ou la font-size de la racine','Comparer le rendu avec/sans meta viewport : noter l\'effet']},
15:{ pc:{ figs:['devmode'], steps:[
 'Sur PC : presse F12, clique l\'icône <b>téléphone/tablette</b> (en haut à gauche des outils, voir figure).',
 'Déroule la liste des résolutions : teste ta page à <b>390</b> (téléphone), <b>768</b> (tablette), <b>1200</b> (desktop).',
 'Note 2 défauts qui apparaissent sous 768 : menu écrasé, texte trop long, cible tactile trop petite… Tu les corrigeras en CSS.'],
 note:'Le simulateur fait gagner des heures — mais garde un vrai appareil pour la validation finale : clic gauche, zoom, tactile… tous les sens. Rien ne le remplace.'}, t:`<div class="keepnote">🎯 Les media queries en pratique — on adapte la mise en page selon les tailles.</div>
<h3>1. Syntaxe et points de rupture (breakpoints)</h3>
<pre><code>@media (min-width: 768px) { … }   /* tablette et plus */
@media (min-width: 1100px) { … }  /* desktop */
@media (max-width: 480px) { … }   /* mobile uniquement */</code></pre>
<ul><li><b>Breakpoints</b> usuels ≈ 480 / 768 / 1100. Évite les micro-rebondissements : réserve les breakpoints aux vrais changements de structure, le reste se règle avec <code>clamp()</code> et <code>vw</code>.</li>
<li><code>@media (prefers-reduced-motion: reduce)</code> : y loger un vrai cas d'usage (respect des utilisateurs sensibles au mouvement).</li>
<li><b>Grille type responsive</b> : comme sur le tableau de bord de cette plateforme : cartes de largeur minimale qui refluent automatiquement.</li></ul>
<h3>2. Orientations et conditions</h3>
<pre><code>@media (orientation: landscape) { … }
@media (hover: none) { … }       /* pas de survol : tactile */
@media (min-width: 768px) and (orientation: portrait) { … }</code></pre>
<h3>3. Les cibles tactiles de 44px minimum</h3>
<ul><li>Boutons ≥ 44×44 px sur mobile — marge de tolérance incluse</li>
<li>Distance entre éléments actifs ≥ 8px : moins de clics ratés</li>
<li>En dev : simulateur mobile de Chrome (F12 → mode appareil)</li></ul>
<div class="keepnote">💡 À retenir : 44 px = la cible tactile standard des OS ; cette plateforme applique cette règle sur ses boutons de validation.</div>`,
s:`<style>\n  .navbar { display: flex; flex-direction: column; gap: 8px; }\n  .navbar a { min-height: 44px; padding: 12px; background: ivory; border-radius: 8px }\n  @media (min-width: 768px) {\n    .navbar { flex-direction: row; }\n    .navbar a { min-height: 32px; }\n  }\n</style>\n<nav class="navbar"><a href="#">Accueil</a><a href="#">Bio</a><a href="#">Contact</a></nav>`,
x:['Nav qui s\'empile sur mobile / à l\'horizontal à 768px','Chaque lien actif ≥ 44px de haut : vérifie avec la dev tools','Une media query prefers-color-scheme inversée sur 3 styles','Remplacer 2 breakpoints par du clamp() : quels critères garde-t-on ?']}
};
