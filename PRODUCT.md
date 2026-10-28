# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS pur (pas de build, pas de framework), hébergé sur GitHub Pages ; option installable PWA (manifest + service worker). Authentification et sync de progression via Supabase (auth email/mot de passe + Postgres RLS), avec repli total hors ligne sur localStorage.

## Users

Primary user : Emmanuel, développeur congolais, étudiant en génie logiciel — apprenant Fullstack solitaire qui suit une roadmap de 180 jours, souvent depuis internet limité / instable, sur PC, tablette ou smartphone.

## Product Purpose

Accompagner, jour par jour (1 jour = 1 leçon), l'apprentissage Fullstack : HTML → CSS/Git → JS → DOM → React → Node → Mongo → sécurité/déploiement/carrière. La plateforme verrouille la leçon suivante jusqu'à validation (discipline), fournit théorie + TP + éditeur/console exécutables dans le navigateur, et conserve l'avancement.

## Positioning

Fonctionne intégralement hors ligne (clone du dépôt, rien à installer) tout en proposant un mode en ligne : compte utilisateur avec progression synchronisée sur n'importe quel terminal. Un cousin de roadmap.dev, mais privé, personnel, gratuit, et utilisable sans connexion.

## Operating Context

- GitHub Pages (build statique racine) ; ou ouverture locale de `index.html`.
- Éditeur de code intégré exécuté dans une iframe sandboxée ; console + aperçu live.
- Mode hors ligne : progression + code conservés dans le navigateur ; systématisation : file d'attente de synchronisation rejouée en ligne (ne s'applique qu'aux comptes authentifiés).
- Récit cible : distraction faible (verrouillage des jours futurs), rythme quotidien, streaks motivants.

## Capabilities and Constraints

- Grille 180 jours groupée par mois (6), navigation par mois plutôt que grille géante.
- Statuts : Terminé · Disponible aujourd'hui · Demain (anti-saut) · Verrouillé.
- Préface de site (`index.html`) expliquant le projet et les deux modes d'usage (hors ligne par clonage ; en ligne avec auth).
- Thème clair / sombre / système, couleur pastel.
- PWA : manifest, service worker (cache app-shell), icônes, installable.
- Responsive smartphone / tablette / PC.
- `LESSONS` jours 1–60 détaillés et sérieux ; jours 61–180 : cours générique amélioré selon le sujet.
- Open decisions : aucun en attente (contenu 61–180 sera complété en sessions avec l'utilisateur).

## Brand Commitments

- Nom : **Shift180**.
- Auteur signature : Emmanuel BILOMBO-SILAHO, développeur congolais (pied de page obligatoire).
- Ton : encourageant, sans gamification exagérée, règles strictes de verrouillage assumées.
- User-pinned visual brief : thème pastel (moins formel), clair/sombre/système, motion design, logo dédié, interface « moins vibe-coded » (finie, sérieuse).

## Evidence on Hand

- `data.js` : plan complet 180 jours (RAW) + 3 leçons détaillées (jours 1–3) — à étendre à 60.
- `app.js` / `style.css` / `index.html` / `day.html` : implémentation actuelle (thème sombre simple), à remplacer.
- README complet décrivant l'usage hors ligne / Pages.
- Aucune photo ou illustration propriétaire ; assets à authorer (logo SVG, icônes PWA).

## Product Principles

1. Respect du rythme d'apprentissage : jamais de contenu sauté, jamais de culpabilisation inutile.
2. Le hors ligne est premier citoyen : tout doit marcher sans réseau, la sync arrivant en bonus.
3. Terminer une leçon doit être un moment satisfaisant (motion et retour positif).
4. Interface sobre, dense mais lisible : la plateforme est un outil quotidien > 6 mois.

## Accessibility & Inclusion

Contraste minimum AA (4.5:1), focus visibles, navigation clavier, `prefers-reduced-motion` respecté, textes fluides via clamp(), cibles tactiles ≥ 44px sur mobile.
