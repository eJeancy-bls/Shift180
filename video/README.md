# Vidéo teaser Shift180 — 4K 60 fps

Génération d'une vidéo motion design 2D/3D de présentation de la plateforme
(style commercial tech, palette et typographie de l'interface).

## Pipeline

1. **Captures d'interface** (si `video/assets/` est vide) :
   ```
   node .devserver.js          # serveur local port 8642 (autre terminal)
   node video/ui-shots.js      # 7 captures 3200×1800 → video/assets/
   ```
2. **Capture image par image** (rendu déterministe, ~35 min) :
   ```
   node video/render.js                 # 24 s × 60 fps = 1440 frames 4K → %TEMP%\opencode\frames
   node video/render.js --t-end 2       # test rapide (2 s)
   ```
3. **Encodage** (ffmpeg avec libx264, décompressé dans `%TEMP%\opencode\ffmpeg`) :
   ```
   node video/encode.js        # MP4 4K60 (CRF 17) + poster + version 1080p60 → video/out/
   ```

> Le binaire ffmpeg essentials (libx264) : https://www.gyan.dev/ffmpeg/builds/
> Dézipper dans `%TEMP%\opencode\ffmpeg` (chemin attendu par `encode.js`).

## Sorties (`video/out/`, non versionnées)

- `Shift180-teaser-4K60.mp4` — master 3840×2160, 60 ips, H.264
- `Shift180-teaser-1080p60.mp4` — version légère pour partage
- `Shift180-teaser-poster.jpg` — miniature (frame t = 12 s)

## Découpage (24 s)

| Scène | Temps | Contenu |
|---|---|---|
| Intro | 0.0 – 3.2 | Titre lettre par lettre, promesse 180 jours, 3 pastilles |
| Constellation | 3.2 – 9.4 | 11 tuiles verre (HTML, CSS, JS, Git, GitHub, React, Node, Express, MongoDB, Merise/UML, Supabase) convergent, lignes de liaison, glyphes `{ }` `</>` |
| Interface | 9.4 – 16.0 | 3 captures 3D : tableau clair, tableau sombre, page leçon + éditeur |
| Progression | 16.0 – 21.0 | Barre 0 → 180 jours, compteur, 6 jalons mensuels, badge de fin |
| Outro | 21.0 – 24 | Logo, URL, CTA « Commencer — Jour 1 », crédit créateur |

La scène (`video/index.html`) est **déterministe** : `window.__seek(t)` rend
chaque image comme une fonction pure du temps — aucune animation CSS, ce qui
garantit un rendu frame-perfect en 60 fps.
