// day.js — page de cours (day.html) : théorie, figures, lexique, TP, PC-ONLY, éditeur, console, validation
const hook = `<script>const _p=(t,a)=>parent.postMessage({t,m:a.map(x=>typeof x=='object'?JSON.stringify(x):String(x)).join(' ')},'*');
console.log=(...a)=>_p('log',a);console.error=(...a)=>_p('err',a);
onerror=m=>_p('err',[m]);addEventListener('unhandledrejection',e=>_p('err',[e.reason]));<\/script>`;

/* ---------- LEXIQUE au fil du texte : enveloppe les termes connus (hors code/liens) ---------- */
let glossRe = null;
function glossRegex() {
  if (glossRe) return glossRe;
  const keys = Object.keys(GLOSS).filter(k => GLOSS[k]).sort((a, b) => b.length - a.length)
    .map(k => k.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'));
  glossRe = new RegExp(`(?<![A-Za-zÀ-ÿ])(${keys.join('|')})(?![A-Za-zÀ-ÿ])`);
  return glossRe;
}
function glossify(html) {
  const parts = html.split(/(<[^>]*>)/g);
  let skip = 0;
  return parts.map(seg => {
    if (seg.startsWith('<')) {
      const m = seg.match(/^<\/?([a-zA-Z]+)/);
      if (m) {
        const tag = m[1].toLowerCase();
        if (['code', 'pre', 'a', 'dfn', 'button'].includes(tag)) skip += seg.startsWith('</') ? -1 : 1;
      }
      return seg;
    }
    if (skip > 0 || !seg.trim()) return seg;
    try {
      return seg.replace(glossRegex(), w => {
        let k = w;
        if (GLOSS[k] === undefined) { // essai casse-insensible défensif
          k = Object.keys(GLOSS).find(x => x.toLowerCase() === w.toLowerCase());
          if (!k) return w;
        }
        return `<button class="term" type="button" aria-expanded="false" data-t="${k.replace(/"/g, '&quot;')}"><span>${w}</span><span class="term-def" hidden>${GLOSS[k]}</span></button>`;
      });
    } catch { return seg; }
  }).join('');
}

function figHTML(id) {
  const f = FIGS[id];
  if (!f) return '';
  return `<figure class="fig"><div class="fig-art">${f.svg}</div><figcaption>${f.cap}</figcaption></figure>`;
}

async function main() {
  await bootCommon();   // remplit aussi le chip d'authentification (renderAuth)

  const n = +new URLSearchParams(location.search).get('d') || 1;
  const D = DAYS[n];
  if (!D) { location.href = 'app.html'; return; }
  document.title = `J${n} · Shift180`;
  $('#title').textContent = D.title;
  $('#dayNum').textContent = 'Jour ' + n;
  $('#dayMeta').textContent = `${MONTHS.find(m => n >= m.range[0] && n <= m.range[1]).title} · Mois ${MONTHS.findIndex(m => n >= m.range[0] && n <= m.range[1]) + 1}`;
  $('#prev').href = n > 1 ? 'day.html?d=' + (n - 1) : 'app.html';
  $('#next').href = n < 180 ? 'day.html?d=' + (n + 1) : 'app.html';

  const st = Store.status(n);
  $('#statusChip').innerHTML = iconify(LABD[st] || '');

  if (st === 'locked' || st === 'wait') {
    $('#app').hidden = true;
    $('#lockPage').hidden = false;
    $('#lockIconWrap').innerHTML = iconify(st === 'wait' ? '⏳' : '🔒');
    $('#lockTitle').textContent = st === 'wait' ? 'Aimant déjà posé aujourd\'hui' : 'Prochain aimant verrouillé';
    const dm = Store.maxDone() + 1;
    $('#lockMsg').textContent = st === 'wait'
      ? 'Jour validé ! Ton prochain aimant se débloque demain : la règle anti-précipitation garde ton rythme durable.'
      : `Termine d'abord le Jour ${dm} pour poser celui-ci.`;
    return;
  }

  renderDay(n, D, st);
  Sync.refreshBadge();
}

const LABD = { done: '✓ Terminé', open: 'À faire aujourd\'hui', wait: '⏳ Reviens demain', locked: 'Verrouillé' };

function renderDay(n, D, st) {
  const web = n <= 18 || (n >= 46 && n <= 55);
  const les = LESSONS[n] || generic(D);

  /* théorie + figures + lexique
     NB : le lexique s'applique AVANT les figures — jamais à l'intérieur des SVG
     (un <button class="term"> injecté dans <text> ferait casser le SVG par le parser). */
  let theoryHTML = glossify(les.t);            // lexique AVANT les figures (jamais dans les SVG)
  if (les.figs && les.figs.length) {
    theoryHTML += `<h3 class="figs-title">🖼 Figures du jour</h3>` + les.figs.map(figHTML).join('');
  }
  theoryHTML = iconify(theoryHTML);            // emojis de l'interface → icônes SVG
  $('#theory').innerHTML = theoryHTML;

  /* bloc « actions à reproduire sur un ordinateur » (déroulé, dédié mobile) */
  if (les.pc && les.pc.steps) {
    const title = les.pc.title || 'Actions à reproduire sur un ordinateur';
    const steps = les.pc.steps.map(s => `<li>${s}</li>`).join('');
    const figs = (les.pc.figs || []).map(figHTML).join('');
    $('#theory').insertAdjacentHTML('afterend', iconify(`
      <details class="pconly">
        <summary>🖱 ${title}${les.pc.figs && les.pc.figs.length ? ' · <small>' + les.pc.figs.length + ' figure' + (les.pc.figs.length > 1 ? 's' : '') + '</small>' : ''}</summary>
        <p class="pcwhy">💾 Sur téléphone ou tablette tu peux tout suivre en lecture : ces actions demandent un vrai clavier / OS, elles attendent ta prochaine session PC.</p>
        ${figs}
        <ol class="pc-steps">${steps}</ol>
        ${les.pc.note ? `<p class="pc-note">${les.pc.note}</p>` : ''}
      </details>`));
  }

  /* pastilles vidéo YouTube (Grafikart.fr · Graven — Développement) */
  const vids = (window.YT_VIDEOS && window.YT_VIDEOS[n]) || [];
  if (vids.length) {
    const YT_ICON = '<svg class="ico yt-ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="#ff4d4d" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8z"/><path fill="#fff" d="M9.6 15.6V8.4L15.8 12z"/></svg>';
    const pills = vids.map(([c, t, id]) =>
      `<button class="yt-pill" type="button" data-yt="${id}" title="Lire la vidéo sur la plateforme">${YT_ICON}<span class="yt-t">${t}</span><span class="yt-ch">${c === 'v' ? 'Graven' : 'Grafikart'}</span></button>`).join('');
    $('#theory').closest('section.panel').insertAdjacentHTML('afterend', `
      <section class="panel rise vidpan" style="animation-delay:30ms">
        <h2><span class="magnetish" style="background:#ff8a8a"></span> Vidéos complémentaires</h2>
        <div class="yt-pills">${pills}</div>
        <p class="vid-note">Sélection de vidéos des chaînes <b>Grafikart.fr</b> et <b>Graven — Développement</b>, classées selon le thème du jour. Clique pour lire directement ici.</p>
      </section>`);
    document.querySelectorAll('.yt-pill').forEach(b => b.addEventListener('click', () => {
      const sec = b.closest('.vidpan');
      let emb = sec.querySelector('.yt-embed');
      if (emb) { emb.remove(); return; }
      emb = document.createElement('div');
      emb.className = 'yt-embed';
      emb.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.yt}?rel=0" title="Vidéo YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
      sec.querySelector('.yt-pills').after(emb);
    }));
  }

  /* lexique interactif : déplier la définition */
  $('#theory').addEventListener('click', e => {
    const b = e.target.closest('.term');
    if (!b) return;
    const def = b.querySelector('.term-def');
    const open = def.hidden;
    $$('#theory .term-def').forEach(d => { if (d !== def) { d.hidden = true; d.parentElement.setAttribute('aria-expanded', 'false'); } });
    def.hidden = !open;
    b.setAttribute('aria-expanded', String(open));
    b.classList.toggle('open', open);
  });

  /* TP */
  const savedTicks = JSON.parse(localStorage.getItem('pbd.tick.' + n) || '[]');
  $('#tasks').innerHTML = les.x.map((t, i) =>
    `<label class="task${savedTicks[i] ? ' checked' : ''}"><input type="checkbox" data-i="${i}"${savedTicks[i] ? ' checked' : ''}><span>${iconify(t)}</span></label>`).join('');

  /* éditeur */
  const ed = $('#ed'), fr = $('#fr'), con = $('#con');
  ed.value = Store.code[n] !== undefined ? Store.code[n] : (typeof les.s === 'string' ? les.s : les.s.replace(/\\n/g, '\n'));
  fr.hidden = !web;
  $$('.preview-only').forEach(e => e.hidden = !web);
  if (!web) $('#frLabel').textContent = 'Aperçu indisponible ce jour (Node / Git : recopie-le dans ton terminal)';

  const log = (m, c) => {
    const e = document.createElement('div');
    if (c) e.className = c;
    e.textContent = (c === 'err' ? '✖ ' : '› ') + m;
    con.appendChild(e);
  };
  if (st !== 'done') con.innerHTML = '<span class="hint">Exécute ton code pour voir la sortie ici…</span>';
  window.onmessage = e => { if (e.source === fr.contentWindow) log(e.data.m, e.data.t === 'err' ? 'err' : ''); };

  const run = () => {
    Store.setCode(n, ed.value);
    con.innerHTML = '';
    fr.srcdoc = hook + (web ? ed.value : `<script>${ed.value}<\/script>`);
  };
  $('#run').onclick = run;
  $('#reset').onclick = () => { ed.value = les.s; Store.setCode(n, ''); con.innerHTML = '<span class="hint">Remis à zéro.</span>'; };
  ed.onkeydown = e => {
    if (e.key === 'Tab') { e.preventDefault(); document.execCommand('insertText', false, '  '); }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
  };

  /* TP cochés persistés */
  const boxes = [ ...$$('#tasks input')];
  const updTasks = () => {
    const tick = boxes.map(b => b.checked);
    localStorage.setItem('pbd.tick.' + n, JSON.stringify(tick));
    boxes.forEach(b => b.closest('.task').classList.toggle('checked', b.checked));
    updValidate();
  };
  const updValidate = () => {
    const allDone = boxes.every(b => b.checked);
    $('#ok').disabled = st === 'done' || !allDone;
    $('#okHint').textContent = st === 'done' ? 'Déjà validé — reviens quand tu veux relire.' :
      allDone ? 'Tous les TP sont cochés : pose ton aimant !' : `TP restants : ${boxes.filter(b => !b.checked).length}`;
  };
  boxes.forEach(b => b.onchange = updTasks);
  updTasks();
  if (st === 'done') { $('#ok').innerHTML = iconify('✓ Aimant déjà posé'); boxes.forEach(b => b.checked = true); updTasks(); }

  $('#ok').onclick = () => {
    const r = Store.validate(n);
    $('#ok').innerHTML = iconify('✓ Aimant posé !');
    confetti();
    toast(r.pushed ? 'Leçon validée — mise en ligne sur ton compte ✓' : 'Leçon validée ✓ (en attente de réseau pour la sync)');
    setTimeout(() => { location.href = 'app.html'; }, 900);
  };

  ed.oninput = () => Store.setCode(n, ed.value);
}

main();
