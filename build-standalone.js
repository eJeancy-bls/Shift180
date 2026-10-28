// build-standalone.js — assemble dist/shift180-hors-ligne.html : toute la plateforme en UN fichier
// > node build-standalone.js
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const read = p => fs.readFileSync(p, 'utf8');

const sources = [
  'config.js', 'lessons-d1-15.js', 'lessons-d16-30.js', 'lessons-d31-45.js',
  'lessons-d46-60.js', 'data.js', 'figures.js', 'core.js', 'standalone-src.js'
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
      <button class="chip-btn small theme-toggle" aria-haspopup="true" aria-label="Choisir le thème">🌗</button>
      <div class="theme-pop" role="menu" aria-label="Thème">
        <button data-t="light" aria-checked="false">☀️ Clair</button>
        <button data-t="dark" aria-checked="false">🌙 Sombre</button>
        <button data-t="system" aria-checked="false">🖥️ Système</button>
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
    <section class="panel">
      <h2><span class="magnetish" style="background:var(--peach)"></span> Travaux pratiques</h2>
      <div id="tasks"></div>
    </section>
    <section class="panel">
      <h2><span class="magnetish" style="background:var(--mint)"></span> Éditeur de code</h2>
      <div class="editor-label"><label for="ed">Écris puis exécute (Ctrl+Entrée)</label></div>
      <textarea id="ed" spellcheck="false" aria-label="Éditeur de code"></textarea>
      <div class="row">
        <button class="btn multi" id="run">▶ Exécuter le code</button>
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
          <button class="btn mint" id="ok">✅ Poser ton aimant</button>
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
