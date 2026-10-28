// Shift180 — plan des 180 jours + fusion des leçons détaillées
// Les leçons détaillées (jours 1-60) vivent dans lessons-d1-15.js, lessons-d16-30.js,
// lessons-d31-45.js, lessons-d46-60.js. Les jours 61-180 reçoivent un cours générique enrichi.

const RAW = `1|Le web et le fonctionnement d'un site
2|Structure HTML et balises
3|Titres, paragraphes, listes
4|Liens, images, attributs
5|Tableaux et formulaires
6|HTML sémantique
7|Mini-projet : page de profil
8|CSS : bases et sélecteurs
9|Couleurs, polices, unités
10|Box model
11|Display et position
12|Flexbox
13|Grid
14|Design responsive
15|Media queries
16|Animations et transitions
17-18|Cloner un site simple
19|Git : bases
20|Workflow GitHub
21|Branches et merge
22|Pousser ses projets
23|JavaScript : intro et variables
24|Types de données et opérateurs
25|Conditions
26|Boucles
27|Fonctions
28|Tableaux
29|Objets
30|Exercices pratiques JS
31|Scope et hoisting
32|Arrow functions
33|Méthodes de tableaux
34|Méthodes de chaînes
35|Déstructuration
36|Spread et rest
37|Callbacks
38|Promises
39|async/await
40|Gestion d'erreurs
41-45|Mini-projets JS
46|Bases du DOM
47|Événements
48|Gestion des formulaires
49|LocalStorage
50|Fetch API
51-55|Apps JS (Todo, Calculatrice)
56|Bases de React
57|JSX et composants
58|Props
59|State
60|Petite app React
61-62|Hooks (useState, useEffect)
63|Rendu conditionnel
64|Listes et keys
65|Formulaires React
66|React Router
67|Context API
68|Intégration d'API
69|Gestion d'erreurs React
70|Performances de base
71-75|Projet : app météo
76-80|Projet : UI d'authentification
81-85|Projet : UI de dashboard
86-90|Projet : application React complète
91|Bases de Node.js
92|Modules
93|Introduction à Express
94|Routing
95|Middleware
96|API REST
97|Postman
98|Architecture MVC
99|Gestion d'erreurs Express
100|Validation
101|JWT
102|API de login
103|API d'inscription
104|Hachage de mots de passe
105|Authentification par rôles
106-110|Projet d'authentification
111-113|API CRUD
114-115|Pagination
116-117|Recherche
118-120|Mini-projet backend
121-125|MongoDB
126-128|Conception de schémas
129-130|Indexation
131-135|Connecter frontend + backend
136-140|Authentification full stack
141-145|Bases du paiement en ligne
146-150|Projet full stack
151-155|Bases de la sécurité
156-158|Déploiement
159-160|Bases du CI/CD
161-167|Projet : application e-commerce
168-171|Projet : dashboard admin
172-175|Projet : plateforme de blog
176|Construire son CV
177|Nettoyer son GitHub
178|Questions d'entretien
179-180|Bases du system design`;

const DAYS = [];
RAW.split('\n').forEach(l => {
  const [r, t] = l.split('|'), [a, b = a] = r.split('-').map(Number);
  for (let d = a; d <= b; d++) DAYS[d] = { n: d, title: a === b ? t : `${t} (${d - a + 1}/${b - a + 1})` };
});

// Noms courts des 6 mois pour le rail du tableau de bord
const MONTHS = [
  { n: 1, title: 'Fondamentaux du web', range: [1, 30] },
  { n: 2, title: 'JavaScript maîtrisé', range: [31, 60] },
  { n: 3, title: 'Frontend React', range: [61, 90] },
  { n: 4, title: 'Backend Node & Express', range: [91, 120] },
  { n: 5, title: 'Bases de données', range: [121, 150] },
  { n: 6, title: 'Emploi & avancé', range: [151, 180] }
];

// Fusion des parties de leçons détaillées (définies dans les fichiers lesson-*.js)
const LESSONS = Object.assign({},
  window.LESSONS_D1 || {}, window.LESSONS_D2 || {},
  window.LESSONS_D3 || {}, window.LESSONS_D4 || {});

// Cours générique enrichi pour les jours sans leçon détaillée (61-180)
// Cadre académique : définition → mécanisme → pratique → vérification (même canevas que les leçons détaillées).
function generic(D) {
  const q = encodeURIComponent(D.title);
  return {
    t: `<div class="keepnote">📌 Sujet du jour : <b>${D.title}</b> — fiche au canevas académique (définition → mécanisme → pratique → vérification).</div>
<h3>1. Découvrir — la définition à posséder (25 min)</h3>
<p>Cherche la référence officielle (MDN, doc Node.js, MongoDB Manual, docs Git) et prends tes notes sous ce triplet :</p>
<ul>
<li><b>Définition.</b> Qu'est-ce que <code>${D.title}</code>, en deux phrases, avec les mots du domaine ?</li>
<li><b>Mécanisme.</b> Comment ça marche sous le capot — entrées, traitement, sorties, ordre d'exécution.</li>
<li><b>Limites.</b> Dans quels cas ne PAS l'utiliser, et quelles erreurs classiques l'accompagnent.</li>
</ul>
<h3>2. Faire — 3 exemples croissants (40 min)</h3>
<ol>
<li><b>Trivial</b> : l'exemple minimum qui démontre le mécanisme.</li>
<li><b>Instrumenté</b> : le même, avec options/conditions et une erreur déclenchée volontairement pour lire le message.</li>
<li><b>Personnel</b> : un exemple de ta propre invention, connecté aux jours précédents (une notion ne s'acquiert que câblée aux anciennes).</li>
</ol>
<h3>3. Consolider — la vérification (25 min)</h3>
<ul>
<li><b>Jeu de questions</b> : quand utiliser <code>${D.title}</code>, quand s'en abstenir, quel piège éviter ?</li>
<li><b>Oral</b> : explique la notion à voix haute en 5 phrases — ce qui ne sort pas proprement de ta bouche n'est pas encore acquis.</li>
<li><b>Bilan</b> : note 1 acquis + 1 point à revoir dans le journal de bord.</li>
</ul>
<h3>4. Pratique selon le jour</h3>
<ul>
<li><b>Frontend</b> : fais-le dans l'éditeur ci-dessous, aperçu à l'appui.</li>
<li><b>Node, Git, MongoDB</b> : fais-le en local dans un terminal, puis note ici ce que tu observes (JSON des commandes, logs, erreurs).</li>
<li><b>Jours « projet »</b> : découpe en 3-4 étapes, valide un fichier/déploiement fonctionnel à chaque étape, puis publie via GitHub Pages si besoin.</li>
</ul>
<p><small style="color:var(--muted)">📚 Sources recommandées : doc officielle du sujet · MDN · OpenClassrooms · Cisco NetAcad (parcours « JavaScript Essentials » et « Networking Basics ») — pour la définition, la pratique et les exercices complémentaires.</small></p>
<div class="keepnote">🙂 Ce jour sans cours pré-écrit attend son enrichissement : complète-le au fil de ta progression.</div>`,
    s: `// Espace d'essai — ${D.title}\nconsole.log("Nouveau départ !");\n\n// Décris ce que tu apprends aujourd'hui :`,
    x: [
      'Écrire la définition + le mécanisme + 1 limite, avec tes mots',
      'Écrire 3 exemples personnels croissants sur le sujet',
      'Casser un exemple volontairement et lire l\'erreur',
      'Résumer la notion en 5 phrases, à voix haute',
      'Consigner une source sérieuse (doc officielle) DANS les notes du jour'
    ]
  };
}
