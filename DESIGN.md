# Design — Shift180 / monde « Tableau d'aimants »

Monde pastel cozy refondu en 2026 (remplacement du thème sombre simple historique). Une identité, trois pages (préface, tableau de bord, page jour), installable PWA.

## Décision de monde
Un **tableau familial d'aimants** : chaque leçon validée est une pastille-aimant claquée sur un tableau. Les états se lisent par la matière (aimant posé / en attente / empreinte fantôme), pas seulement par le texte. Le rituel quotidien estEnough : c'est la version domestique et chaleureuse d'un habit tracker.

## Tokens (style.css)

### Ambiances
- Thèmes : `data-theme="light" | "dark" | "system"` (sur `<html>`, choice gardé en `localStorage['pbd.theme']`).
- Clair : paper crème `#fbf6ed`, board `#f2ebdc`, ink prune `#3f3e52`.
- Sombre : ardoise nuit `#23222e`, board `#2a2937`, ink ivoire `#efebdf` — les aimants gardent leurs couleurs pastel éclairées avec inks sombres internes.

### Aimants (états de données)
| État | Fond | Ink | Présence |
|---|---|---|---|
| Terminé | `--mint` `#b7e3c3` / dark `#5da97e` | `--mint-ink` | aimant posé + mini barre |
| Disponible (aujourd'hui) | `--peach` `#ffcf9e` / dark `#e8a263` | `--peach-ink` | badge « AUJOURD'HUI » + lévitation |
| Demain | `--butter` `#f7e5a3` | `--butter-ink` | aimant posé mais chaud |
| Verrouillé | transparent | `--muted` | bordure pointillée 2px, aucune ombre |

### Accents
- Marque : `--brand` lilas `#8b7fd8` (éklaire `#b0a5ec` la nuit), soft `--brand-soft`.
- Secondaires : `--sky` (notes/conseils), `--lilac` (boutons secondaires).

### Forme & lumière
- Rayons : aimants 14px, panneaux `--r-l` 24px, boutons pill 999px.
- Ombres : `--shadow` au repos, `--shadow-lift` au survol — jamais d'ombre dure.
- Body : Segoe UI/system stack (pas de webfont — priorité hors ligne) ; data en `ui-monospace`.

## Type de service « signature »
1. **Snapshot d'aimant** : `settle` keyframes (pose avec micro-rebond) à la validation + confetti en pastel (5 couleurs du monde).
2. **Lévitation** : le magnet d'aujourd'hui flotte (`float` 2.6s infinite) — seule boucle animée autorisée.
3. Apparition en cascade (`rise` 80 ms de décalage) au chargement du dashboard.
4. Courbes : `cubic-bezier(.22,1,.36,1)` (ease-out-quart) partout ; `prefers-reduced-motion` coupe le tout.

## Composants du système
- `.topbar` sticky translucide (backdrop blur 10px) ; `.chip-btn` = petits aimants à presser (lift + rotate -1deg).
- `.number rail` des 6 mois : tabs avec mini-barre de progression mensuelle ; onglet actif = fond soft + lift +4px.
- `.board` : fond « tableau » (board + inset), grille `auto-fill minmax(158px,1fr)` (128px mobile) — page courte, un mois à la fois.
- `.hero` : anneau de progression (stroke-dasharray animé), compteurs count-up, CTA « Poser ton aimant · Jn ».
- `sync-badge` : état sync par point coloré (en ligne menthe / hors ligne pêche / sync bleu vacillant).
- `.panel` page jour : cours (theory) avec `.keepnote` sky, `.task` checkboxes au style carré, éditeur + console et iframe en panel.
- `.validate-bar` sticky bas : bouton « Poser ton aimant » + compteur de TP restants.

## Connexions inter-surfaces
- La page jour hérite du monde : stack de panels avec magnet coloré en en-tête de panel (lilac/peach/mint).
- La landing (préface) : hero avec em coloré brand en accent (pas de dégradé de texte), cartes de mode (hors ligne/menthe, en ligne/peach), feature strip levant du rail.
- Le logo `icons/logo.svg` (Shift180) : chip arrondie dégradé pêche→menthe→bleu ; le « shift » = arc de 180° à pointe de flèche en ink prune, et l'axe du pivot = la pastille-aimant pêche ; déclinée en PNG 180/192/512 + maskable (régénération : `node gen-icons.js`).

## Accessibilité
Contrast AA (ininks à inks sombres sur pastels), focus 3px brand visible, cibles ≥ 44px sur mobile, textes `clamp()`, lives sur console.

## Rapport du détecteur (mecanicol)
3 avis « contraste » résiduels : faux positifs de cascade (l'encre des boutons est comparée au paper sombre au lieu du fond pastel réel — ratios réels 4.6–5.8:1). Les vrais signaux (kicker pill, dalle-icône, padding barre, textes dégradés, easings bounce) ont été corrigés en session.
