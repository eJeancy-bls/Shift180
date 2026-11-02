<div align="center">

# 📚 Documentation complète — Shift180

**Plateforme d'apprentissage Fullstack en 180 jours · Statique · Offline-first · PWA**

*Version de la doc : Novembre 2026*

</div>

---

## 1. Vue d'ensemble

**Shift180** est une plateforme d'apprentissage **100 % statique** (HTML/CSS/JS pur, aucun framework, aucun build obligatoire) qui accompagne une roadmap **Fullstack de 180 jours** : 1 jour = 1 leçon = 1 aimant posé sur un tableau.

| Caractéristique | Détail |
|---|---|
| Stack | HTML5 · CSS3 · JavaScript vanilla (ES2020+) · Supabase (compte/sync) |
| Hébergement | GitHub Pages (statique) |
| Fonctionnement hors ligne | Service Worker + localStorage (100 % fonctionnel sans compte ni réseau) |
| Installation | PWA (manifest + service worker), Android/Desktop/iOS |
| Langue | Français |

---

## 2. Fonctionnalités

### 2.1 Parcours d'apprentissage
- **Tableau d'aimants** : grille ventilée par mois (6 filières), page courte.
- **Verrouillage strict** : le Jour *N+1* s'ouvre seulement après validation du Jour *N*, puis au lendemain. Les jours "pause" (`wait`) ne sont jamais accessibles avant terme.
- **60 leçons détaillées** (jours 1–60) : théorie, lexique, figures SVG, bloc "PC only", TP. Jours 61–180 : gabarit générique enrichi.
- **TP comme gated-content** : le bouton « Poser ton aimant » ne s'active que lorsque **tous les TP sont cochés**.
- **Lexique interactif** : chaque terme technique est dépliable, avec définition.
- **Figures SVG pédagogiques** : schémas dessinés en SVG inline themable.
- **Compléments vidéo YouTube** : pastilles par jour ; clic → **lecture intégrée** (embed youtube-nocookie) + bouton rouge « Ouvrir sur YouTube ».

### 2.2 Compte & synchronisation (Supabase)
- Inscription/connexion par **email + mot de passe**.
- OAuth **Google · GitHub · Facebook · Discord** (gratuits ; Apple exclu car payant 99 $/an).
- **Local-first** : chaque validation est d'abord écrite dans le navigateur, puis poussée au compte.
- **File d'attente hors ligne** (`pending`) : sans réseau, les validations s'accumulent et partent automatiquement au retour de la connexion.
- **Pull au login** : la progression complète est tirée du serveur à la connexion.
- **Code des TP sauvegardé** par jour (`Store.code`, colonne `code`).
- Sécurité : clé *anon* publique + **Row Level Security** (chacun ne voit que ses lignes).

### 2.3 PWA / Offline
- `manifest.webmanifest` (standalone, icônes 192/512 + maskable, raccourcis).
- `sw.js` : **network-first pour les pages**, cache-first pour les assets, fallback hors ligne.
- **Auto-update** : dès qu'une nouvelle version du SW prend le contrôle, la page se recharge.
- **Popup d'installation** à la première visite + bouton permanent sur la page Compte. Multi-plateforme : bouton natif (Chrome/Edge/Android), feuille de partage iOS avec animation d'aide.

### 2.4 Git : fichier unique hors ligne
- `start.html` permet de **(re)générer `dist/shift180-hors-ligne.html`** : toute la plateforme dans **un seul fichier HTML** (utile sur mobile sans hébergement).

### 2.5 UI/UX
- Thème **clair / sombre / système** (palette pastel « cozy »).
- Motion design : snap d'aimant, confetti de validation, compteurs animés (respecte `prefers-reduced-motion`).
- Responsive complet : cibles tactiles ≥ 44px, typographie fluide, grilles auto-adaptées.

---

## 3. Architecture des fichiers

```
Shift180/
├── index.html            # Landing : hero, carrousel des 2 modes, bouton Commencer
├── start.html            # Slider des modes + détection d'appareil + génération du fichier unique
├── app.html / app.js     # Tableau de bord : rail des mois, grille d'aimants, stats
├── day.html / day.js     # Page de cours : théorie, lexique, figures, bloc PC, TP, éditeur, vidéos
├── login.html / login.js # Page Compte : email/password + OAuth, sync, gestion install PWA
├── style.css             # Thème pastel, clair/sombre/système, composants
├── data.js               # RAW (180 jours) + fusion LESSONS + helpers
├── lessons-d1-15/16-30/31-45/46-60.js  # Leçons détaillées jours 1–60
├── figures.js            # FIGS (SVG) + GLOSS (lexique zéro-dev)
├── videos.js             # Compléments vidéo par jour [chaîne, titre, videoId]
├── core.js               # ★ Cœur : Store, Sync, thème, boot, chip auth, SW auto-update
├── config.js             # Clés Supabase (URL + clé publishable)
├── install.js            # Popup install PWA multi-plateforme
├── sw.js                 # Service worker (cache offline)
├── manifest.webmanifest  # PWA
├── build-standalone.js   # node build-standalone.js → dist/shift180-hors-ligne.html
├── standalone-src.js     # Code intégré dans le fichier unique (duplique la logique de base)
├── icons/                # Logo + icônes PWA (+ scripts de QA smoke)
├── supabase.sql          # Table day_progress + RLS
├── .devserver.js         # Serveur statique de dev → http://localhost:8642
└── docs/                 # Cette documentation
```

---

## 4. Modules fondamentaux (`core.js`)

### 4.1 `Store` — état local

| API | Rôle |
|---|---|
| `Store.load()/save()` | Lecture/écriture de `localStorage['pbd.state.v2']` avec migration depuis `fs180` |
| `Store.progress` | `{ [jour]: 'date ISO de validation' }` |
| `Store.pending` | File d'attente hors ligne : `{ [jour]: { ts } }` |
| `Store.code` | Code des TP par jour `{ [jour]: code }` |
| `Store.validate(n)` | Marque le Jour *n* validé (si tous les TP sont cochés) |
| `Store.status(n)` | `'open' \| 'locked' \| 'wait' \| 'done'` — la logique de verrouillage du jeu |

**Logique de statut (Numstorage)** :
1. Jour valide → `done`.
2. Précédent validé et date du jour atteinte → `open`.
3. Jour "pause" non débloqué → `wait` (attente).
4. Sinon → `locked`.

### 4.2 `Sync` — Supabase

| API | Rôle |
|---|---|
| `Sync.init()` | Crée le client si `config.js` est rempli + `window.supabase` présent (CDN), restaure la session, `onAuthStateChange` |
| `Sync.signIn/signUp` | Email + mot de passe |
| `Sync.signInOAuth(provider)` | OAuth via `signInWithOAuth` avec `redirectTo: login.html` (retour traité par `?code=`) |
| `Sync.signOut()` | Déconnexion |
| `Sync.pull()` | Tirage de la progression + code du serveur (local-first : le serveur ne remplace pas les données locales plus récentes) |
| `Sync.pushSoon(force)` | Poussée différée/dédupliquée des validations + de la file `pending` |
| `Sync.refreshBadge()` | Met à jour le chip d'authentification et la pastille de file d'attente |

### 4.3 Boot commun
`bootCommon()` (appelé par chaque page) : applique le thème → initialise `Sync` → `renderAuth()` (chip compte dans la topbar) → enregistre le service worker et met en place l'**auto-update** (`controllerchange` → reload).

---

## 5. Pages

### 5.1 `app.html` — Tableau de bord
- Rail horizontal des 6 mois (survole/clic → grille du mois).
- Cartes-aimants par jour avec statut visuel (posé ✓ / ouvert / verrouillé / pause).
- Stats animées : jours posés, série (streak), progression %.
- Auto-repli sur mobile : grille du mois courant seulement.

### 5.2 `day.html` — Leçon
- Théorie enrichie (`figures.js` : glossaire + SVG), **bloc PC** repliable pour les actions nécessitant clavier/OS.
- Liste de **TP** à cocher bout par bout.
- **Éditeur intégré** : HTML/CSS/DOM directement rendus dans l'iframe `#fr` (preview live) ; JS avec console isolée, exécution via **Ctrl+Entrée**.
- **Vidéos complémentaires** : panneau après le cours, lecture inline, bouton YouTube.
- **Poser l'aimant** : bouton verrouillé jusqu'à TP complets ; au succès → snap + confetti + retour tableau.

### 5.3 `login.html` — Compte
- Slider connexion/inscription, formulaire email+mot de passe.
- Boutons OAuth (Google, GitHub, Facebook, Discord) avec logos officiels SVG.
- Retour OAuth `?code=` → échange de session → redirection vers `?next=` (défaut `app.html`).
- Vue connectée : avatar, prénom, sync immédiate, état de la file offline, **bouton « Installer l'app »** (PWA).

### 5.4 `index.html` / `start.html`
- `index.html` : landing (hero, carrousel des 2 modes, CTA).
- `start.html` : détection d'appareil, choix du mode (en ligne / fichier unique), génération du fichier `dist/` via `Blob` des sources.

---

## 6. Modèle de données

### 6.1 Local (localStorage)
```js
'pbd.state.v2' = {
  progress: { [1..180]: 'AAAA-MM-JJ' },
  pending:  { [jour]: { ts } },   // à pousser vers le compte
  code:     { [jour]: 'source du TP' }
}
'theme'  = 'light' | 'dark' | 'system'
```

### 6.2 Serveur (Supabase `day_progress`)
```sql
user_id  uuid   -- auth.users.id (RLS par auth.uid())
day      int    -- 1..180
done     date   -- date de validation
code     text   -- code du TP
-- até : upsert on conflict (user_id, day)
```

### 6.3 Sources de cours
- `data.js` : `RAW` (180 entrées `n|titre|type|locale|...)`, fusion avec `LESSONS`.
- `lessons-d*.js` : jours 1–60 avec théorie riche (`s:`), TP (`x:[]`), structure.
- `figures.js` : `FIGS` (switch SVG), `GLOSS` (termes → définitions, injection automatique `glossRegex()` à flag `g`).
- `videos.js` : `YT_VIDEOS[n] = [['g'|'v', 'titre', 'videoId'], …]`.

---

## 7. Sécurité

| Point | Réponse |
|---|---|
| Clé Supabase | *publishable/anon* : publique, sans privilèges. La protection est **RLS** côté serveur. |
| RLS | `day_progress` : `select/insert/update/delete` only `auth.uid() = user_id`. |
| XSS | Éditeur exécuté dans une `iframe sandbox`, console isolée ; `rel="noopener"` sur les liens externes. |
| Secrets Aucun secret serveur côté client ; le clié est volontairement public. |

> ⚠️ Aucun secret ni privilège admin ne doit jamais être placé côté client.

---

## 8. PWA — installation détaillée

| Plateforme | Mécanisme |
|---|---|
| Android / Desktop Chrome/Edge | Bouton natif via `beforeinstallprompt` |
| iOS Safari | Bouton `navigator.share()` → l'utilisateur choisit « Sur l'écran d'accueil » ; **animation d'aide** dans la popup |
| Autres | Instructions manuelles selon l'UA (`install.js`) |

Événement déclencheur : popup à la **première visite** (flag `pbd.install.dismissed`), rappel via la page Compte.

---

## 9. Déploiement

1. **GitHub Pages** : `Settings → Pages → main /(root)`. HTTPS activé (requis pour le SW et OAuth redirect).
2. **Supabase** : exécuter `supabase.sql`, puis copier URL + clé dans `config.js`.
3. **Dashboard Supabase → Authentication → Providers** : activer Google/GitHub/Facebook/Discord, ajouter `https://<domaine>/login.html` aux Redirect URLs.
4. Build du fichier unique (optionnel) : `node build-standalone.js`.

### Serveur de développement
```bash
node .devserver.js   # → http://localhost:8642
```

---

## 10. QA & scripts annexes (`icons/` + `video/`)

| Script | Rôle |
|---|---|
| `smoke-auth.js` | Playwright : session stub injectée, vérifie chip/pastille/redirection OAuth sur toutes les pages |
| `smoke-lessons.js / smoke-icons.js / smoke-videos.js` | Tests anti-régression contenus/icônes/vidéos |
| `yt-verify.js` | Validation des `videoId` via l'API oEmbed YouTube |
| `video/*.js` | Génération du teaser vidéo du projet |

---

## 11. Limites connues & bonnes pratiques d'évolution

- **Jours 61–180** : leçons génériques — enrichir progressivement (`lessons-d61+.js`) sans casser le verrouillage.
- `standalone-src.js` **duplique** une partie de `core.js`/`app.js`/`day.js` : toute évolution de la logique de base doit être répercutée dans les deux (ou régénérer via `build-standalone.js`).
- Après modification de `sw.js` ou des assets, **incrémenter la version du cache** (`pbd-vN`) pour forcer l'update chez les utilisateurs.
- Google/Facebook/Discord OAuth nécessitent d'ajouter le domaine de production aux **Authorized redirect URIs** côté fournisseur.
- Les vidéos YouTube embed nécessitent une connexion ; hors ligne, les pastilles restent visibles mais la lecture échouera (comportement IO attendu).

---

*Documentation générée automatiquement — Shift180, par Emmanuel Jeancy BILOMBO-SILAHO.*
