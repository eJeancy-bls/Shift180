# Vidéo teaser Shift180 — 4K 60 fps · 80 s

Génération d'une vidéo motion design 2D/3D de présentation de la plateforme
(style commercial tech, palette et typographie de l'interface).

## Pipeline

1. **Captures d'interface** (si `video/assets/` est vide) :
   ```
   node .devserver.js          # serveur local port 8642 (autre terminal)
   node video/ui-shots.js      # 9 captures 3200×1800 → video/assets/
   ```
2. **Capture image par image** (rendu déterministe, ~40–50 min par part) :
   ```
   node video/render.js --part 1/3   # 80 s × 60 fps = 4800 frames 4K
   node video/render.js --part 2/3   # (3 terminaux en parallèle,
   node video/render.js --part 3/3   #  numérotation globale des frames)
   node video/render.js --t-end 2    # test rapide (2 s, efface frames/)
   ```
   > Part 1 efface le dossier de frames au départ ; parts 2 et 3 écrivent dans
   > le même dossier `%TEMP%\opencode\frames` avec des intervalles disjoints.
   > Les trois parts peuvent tourner simultanément.
3. **Encodage** (ffmpeg avec libx264, décompressé dans `%TEMP%\opencode\ffmpeg`) :
   ```
   node video/encode.js        # MP4 4K60 (CRF 17) + poster + version 1080p60 → video/out/
   ```
4. **QA images fixes** (PNG sans perte à des instants donnés) :
   ```
   node video/still.js "27:qa-auth.png" "45.8:qa-offline.png"
   ```

> Le binaire ffmpeg essentials (libx264) : https://www.gyan.dev/ffmpeg/builds/
> Dézipper dans `%TEMP%\opencode\ffmpeg` (chemin attendu par `encode.js`).

## Sorties (`video/out/`, non versionnées)

- `Shift180-teaser-4K60.mp4` — master 3840×2160, 60 ips, H.264, 80 s
- `Shift180-teaser-1080p60.mp4` — version légère pour partage
- `Shift180-teaser-poster.jpg` — miniature (frame t = 62 s : compteur 180 + badge)

## Découpage (80 s · 9 actes)

| # | Scène | Temps | Contenu |
|---|---|---|---|
| 1 | Intro | 0 – 6.2 | Kicker, titre lettre par lettre, promesse, 3 pastilles |
| 2 | Constellation | 5.9 – 14.6 | 11 tuiles verre (HTML, CSS, JS, Git, GitHub, React, Node, Express, MongoDB, Merise/UML, Supabase) convergent en anneau, lignes, glyphes |
| 3 | Interface réelle | 14.4 – 23.3 | 3 captures 3D : tableau clair, tableau sombre, leçon du jour |
| 4 | Connexion | 23.1 – 31.5 | Badges OAuth officiels : Google · GitHub · Facebook · Discord |
| 5 | Éditeur + console | 31.3 – 39.9 | Capture exécutée : code, aperçu visuel, sortie console |
| 6 | Hors ligne / PWA | 39.7 – 48.5 | Schéma dessiné : aimant validé → file d'attente → nuage → téléphone « Installer » |
| 7 | Vidéos YouTube | 48.3 – 55.9 | Lecteur intégré (Grafikart.fr & Graven) |
| 8 | Progression | 55.7 – 65.4 | Barre 0 → 180 jours, 6 jalons, badge de fin |
| 9 | Outro | 65.2 – 80 | Logo, tagline, URL, CTA « Commencer — Jour 1 », crédit |

Transitions ≥ 0.6 s, légendes ≥ 2.5 s — lisibilité avant vélocité.

La scène (`video/index.html`) est **déterministe** : `window.__seek(t)` rend
chaque image comme une fonction pure du temps — aucune animation CSS, ce qui
garantit un rendu frame-perfect en 60 fps.

> Piège headless : sans double `requestAnimationFrame` avant `screenshot`, les
> calques transformés 4K peuvent perdre des tuiles de raster (zones blanches).
> `render.js` et `still.js` le gèrent déjà.
