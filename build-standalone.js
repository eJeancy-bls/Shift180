// build-standalone.js — assemble dist/shift180-hors-ligne.html : toute la plateforme en UN fichier
// > node build-standalone.js
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const read = p => fs.readFileSync(p, 'utf8');

const sources = [
  'config.js', 'lessons-d1-15.js', 'lessons-d16-30.js', 'lessons-d31-45.js',
  'lessons-d46-60.js', 'data.js', 'figures.js', 'videos.js', 'core.js', 'standalone-src.js'
];

// le contenu inline ne doit jamais fermer le <script> hôte
const safe = js => js.replace(/<\/script/gi, '<\\/script');

fs.mkdirSync('dist', { recursive: true });
const out = `<!DOCTYPE html>
<html lang="fr" data-theme="system">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Shift180 — hors ligne (fichier unique)</title>
<meta name="description" content="Toute la roadmap fullstack 180 jours en un seul fichier HTML, utilisable sans Internet sur téléphone, tablette ou PC.">
<style data-src="style.css">
${safe(read('style.css'))}
</style>
</head>
<body>
<header class="topbar">
  <div class="topbar-inner">
    <a class="brand" href="#"><b>Shift180 · hors ligne</b></a>
    <span class="spacer"></span>
    <div class="theme-menu">
      <button class="chip-btn small theme-toggle" aria-haspopup="true" aria-label="Choisir le thème"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/></svg></button>
      <div class="theme-pop" role="menu" aria-label="Thème">
        <button data-t="light" aria-checked="false"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg> Clair</button>
        <button data-t="dark" aria-checked="false"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg> Sombre</button>
        <button data-t="system" aria-checked="false"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> Système</button>
      </div>
    </div>
  </div>
</header>

<main class="container">
  <section id="tableau">
    <h2 id="boardTitle" style="margin:18px 0 4px"></h2>
    <p style="margin:0 0 12px;color:var(--muted);font-weight:600" id="boardSub"></p>
    <div class="month-rail" id="rail" role="tablist" aria-label="Mois"></div>
    <section class="board" id="board" aria-label="Jours du mois"></section>
    <div class="board-footnote"><button class="chip-btn small" id="boardToggle" hidden></button></div>
  </section>

  <section id="dayView" hidden>
    <p><button class="chip-btn small" id="back" type="button">← Retour au tableau</button></p>
    <div class="day-head">
      <h1 id="dayTitle"></h1>
      <p class="dmeta" id="dayMeta"></p>
    </div>
    <section class="panel">
      <h2><span class="magnetish" style="background:var(--lilac)"></span> Cours du jour</h2>
      <div class="theory" id="theory"></div>
    </section>
    <section class="panel vidpan" id="vidPan" hidden>
      <h2><span class="magnetish" style="background:#ff8a8a"></span> Vidéos complémentaires</h2>
      <div class="yt-pills" id="vidPills"></div>
      <p class="vid-note">Sélection de vidéos des chaînes <b>Grafikart.fr</b> et <b>Graven — Développement</b>, classées selon le thème du jour.</p>
    </section>
    <section class="panel">
      <h2><span class="magnetish" style="background:var(--peach)"></span> Travaux pratiques</h2>
      <div id="tasks"></div>
    </section>
    <section class="panel">
      <h2><span class="magnetish" style="background:var(--mint)"></span> Éditeur de code</h2>
      <div class="editor-label"><label for="ed">Écris puis exécute (Ctrl+Entrée)</label></div>
      <textarea id="ed" spellcheck="false" aria-label="Éditeur de code"></textarea>
      <div class="row">
        <button class="btn multi" id="run"><svg class="ico" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M7 4.8v14.4c0 .8.9 1.3 1.6.9l11-7.2c.6-.4.6-1.4 0-1.8l-11-7.2c-.7-.4-1.6.1-1.6.9z"/></svg> Exécuter le code</button>
        <button class="chip-btn" id="reset" type="button">Réinitialiser</button>
      </div>
      <div id="previewWrap">
        <small style="font-weight:700">Aperçu visuel</small>
        <iframe id="fr" sandbox="allow-scripts" title="Aperçu de la page générée"></iframe>
      </div>
      <small style="font-weight:700">Console</small>
      <pre class="console" id="con" aria-live="polite"></pre>
      <div class="validate-bar" style="position:static;margin-top:14px">
        <div class="inner">
          <button class="btn mint" id="ok"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5.5"/></svg> Poser ton aimant</button>
          <small id="okHint"></small>
        </div>
      </div>
    </section>
  </section>
</main>

<footer class="site-foot">
  <div class="container">Shift180 · fichier unique hors ligne · Créé par Emmanuel BILOMBO-SILAHO</div>
</footer>
${sources.map((f, i) => `<script${i === sources.length - 1 ? ' id="standaloneApp"' : ''} data-src="${f}">\n${safe(read(f))}\n</script>`).join('\n')}
</body>
</html>
`;

fs.writeFileSync(path.join('dist', 'shift180-hors-ligne.html'), out);
const kb = Math.round(fs.statSync(path.join('dist', 'shift180-hors-ligne.html')).size / 1024);
console.log('dist/shift180-hors-ligne.html généré ·', kb, 'Ko');
