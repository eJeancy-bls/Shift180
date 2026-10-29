// standalone-src.js — moteur SPA de la version « fichier unique » hors ligne
// (inlined par build-standalone.js dans dist/shift180-hors-ligne.html ; toutes les pages y vivent en une seule)
/* eslint-env browser */

const WEB_AWARE = n => n <= 18 || (n >= 46 && n <= 55);
const LABS = { done: '✓ Terminé', open: 'Poser ton aimant', wait: '⏳ Demain', locked: 'Verrouillé' };
const HOOK = `<script>const _p=(t,a)=>parent.postMessage({t,m:a.map(x=>typeof x=='object'?JSON.stringify(x):String(x)).join(' ')},'*');
console.log=(...a)=>_p('log',a);console.error=(...a)=>_p('err',a);
onerror=m=>_p('err',[m]);addEventListener('unhandledrejection',e=>_p('err',[e.reason]));<\/script>`;

/* lexique + figures (copie des helpers de day.js : le fichier est autonome) */
let glossRe2 = null;
function glossify(html) {
  if (!window.GLOSS) return html;
  if (!glossRe2) {
    const keys = Object.keys(GLOSS).filter(k => GLOSS[k]).sort((a, b) => b.length - a.length)
      .map(k => k.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'));
    glossRe2 = new RegExp(`(?<![A-Za-zÀ-ÿ])(${keys.join('|')})(?![A-Za-zÀ-ÿ])`, 'g');
  }
  const parts = html.split(/(<[^>]*>)/g);
  let skip = 0;
  return parts.map(seg => {
    if (seg.startsWith('<')) {
      const m = seg.match(/^<\/?([a-zA-Z]+)/);
      if (m) { const tag = m[1].toLowerCase(); if (['code', 'pre', 'a', 'dfn', 'button'].includes(tag)) skip += seg.startsWith('</') ? -1 : 1; }
      return seg;
    }
    if (skip > 0 || !seg.trim()) return seg;
    return seg.replace(glossRe2, w => {
      const k = Object.keys(GLOSS).find(x => x === w || x.toLowerCase() === w.toLowerCase());
      if (!k) return w;
      return `<button class="term" type="button" data-t="${k.replace(/"/g, '&quot;')}"><span>${w}</span><span class="term-def" hidden>${GLOSS[k]}</span></button>`;
    });
  }).join('');
}
function figHTML(id) {
  const f = FIGS && FIGS[id]; if (!f) return '';
  return `<figure class="fig"><div class="fig-art">${f.svg}</div><figcaption>${f.cap}</figcaption></figure>`;
}
function theoryHTML(les) {
  // le lexique s'applique au texte du cours SEUL, jamais aux SVG (un <button> dans <text> casse le SVG)
  let t = glossify(les.t);
  if (les.figs && les.figs.length) t += `<h3 class="figs-title">🖼️ Figures du jour</h3>` + les.figs.map(figHTML).join('');
  if (les.pc && les.pc.steps) {
    const figs = (les.pc.figs || []).map(figHTML).join('');
    t += `<details class="pconly">
      <summary>🖱️ ${les.pc.title || 'Actions à reproduire sur un ordinateur'}</summary>
      <p class="pcwhy">💾 Sur téléphone ou tablette tu peux tout suivre en lecture : ces actions demandent un vrai clavier / OS, elles attendent ta prochaine session PC.</p>
      ${figs}<ol class="pc-steps">${les.pc.steps.map(s => `<li>${s}</li>`).join('')}</ol>
      ${les.pc.note ? `<p class="pc-note">${les.pc.note}</p>` : ''}</details>`;
  }
  return iconify(t);   // emojis de l'interface → icônes SVG
}
/* pastilles vidéo YouTube (Grafikart.fr · Graven — Développement) */
function ytPills(n) {
  const vids = (window.YT_VIDEOS && window.YT_VIDEOS[n]) || [];
  if (!vids.length) return '';
  const YT_ICON = '<svg class="ico yt-ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="#ff4d4d" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8z"/><path fill="#fff" d="M9.6 15.6V8.4L15.8 12z"/></svg>';
  return vids.map(([c, t, id]) =>
    `<button class="yt-pill" type="button" data-yt="${id}" title="Lire la vidéo sur la plateforme">${YT_ICON}<span class="yt-t">${t}</span><span class="yt-ch">${c === 'v' ? 'Graven' : 'Grafikart'}</span></button>`).join('');
}

/* ---------- rendu ---------- */
function monthDayStats(mi) {
  const [a, b] = MONTHS[mi - 1].range;
  let done = 0;
  for (let n = a; n <= b; n++) if (Store.progress[n]) done++;
  return { done, total: b - a + 1 };
}
let compactTimer2 = null, boardCompact2 = false;
function collapseBoard() {
  const cards = $$('#board .magnet'); const btn = $('#boardToggle');
  if (cards.length <= 7) { btn.hidden = true; return; }
  cards.slice(7).forEach(c => c.classList.add('minoring'));
  setTimeout(() => {
    cards.slice(7).forEach(c => { c.classList.add('minor'); c.classList.remove('minoring'); });
    btn.textContent = `⌄ Dérouler les ${cards.length} jours`;
    btn.hidden = false;
  }, 270);
  boardCompact2 = true;
}
function expandBoard() {
  sessionStorage.setItem('pbd.standaloneFull', '1');
  $$('#board .magnet.minor').forEach(c => c.classList.remove('minor'));
  $('#boardToggle').hidden = true;
  boardCompact2 = false;
}
function scheduleBoardCollapse() {
  const btn = $('#boardToggle'); if (!btn) return;
  clearTimeout(compactTimer2);
  const small = matchMedia('(max-width: 700px)').matches;
  const full = sessionStorage.getItem('pbd.standaloneFull') === '1';
  if (!small || full) { btn.hidden = true; return; }
  if (boardCompact2) { collapseBoard(); btn.hidden = false; return; }
  btn.hidden = true;
  compactTimer2 = setTimeout(collapseBoard, 3000);
  btn.onclick = expandBoard;
}

function renderDashboard() {
  $('#dayView').hidden = true;
  $('#tableau').hidden = false;
  window.scrollTo(0, 0);
  const saved = +localStorage.getItem('pbd.month') || 0;
  const firstOpen = DAYS.find(d => d && Store.status(d.n) !== 'locked');
  const cur = firstOpen ? MONTHS.findIndex(m => firstOpen.n >= m.range[0] && firstOpen.n <= m.range[1]) + 1 : 1;
  const selected = saved || cur;
  const m = MONTHS[selected - 1], [a, b] = m.range;
  const { done, total } = monthDayStats(selected);
  const { done: Dall } = { done: Object.keys(Store.progress).length };
  $('#boardTitle').textContent = `${m.title} (J${a}–${b})`;
  $('#boardSub').textContent = `${done}/${total} posés · ${Dall}/180 au total · file d'aide en haut du fichier`;
  $('#rail').innerHTML = MONTHS.map(mi => {
    const s = monthDayStats(mi.n);
    const active = mi.n === selected;
    return `<button class="month-tab" role="tab" aria-selected="${active}" data-m="${mi.n}">
      <b>Mois ${mi.n}</b><small>${mi.title}</small>
      <span class="month-mini"><i style="width:${s.done / s.total * 100}%"></i></span>
    </button>`;
  }).join('');
  $$('.month-tab').forEach(t => t.onclick = () => {
    localStorage.setItem('pbd.month', +t.dataset.m);
    renderDashboard();
  });
  $('#board').innerHTML = Array.from({ length: b - a + 1 }, (_, i) => {
    const n = a + i, D = DAYS[n], st = Store.status(n);
    return `<a class="magnet ${st}${st === 'open' ? ' today' : ''}" ${st === 'locked' ? 'aria-disabled="true"' : ''} data-d="${n}" href="#d=${n}">
      <span class="dnum">J${n}</span><span class="dtitle">${D.title}</span><span class="dbadge">${LABS[st]}</span></a>`;
  }).join('');
  $('#board').innerHTML = iconify($('#board').innerHTML);
  $$('#board .magnet').forEach(x => x.onclick = e => {
    e.preventDefault();
    openDay(+x.dataset.d);
  });
  scheduleBoardCollapse();
}

function openDay(n) {
  const st = Store.status(n);
  if (st === 'locked' || st === 'wait') { toast('Le Jour ' + n + ' n\'est pas encore disponible.'); return; }
  $('#tableau').hidden = true;
  $('#dayView').hidden = false;
  window.scrollTo(0, 0);
  const D = DAYS[n], les = (typeof LESSONS !== 'undefined' && LESSONS[n]) || generic(D);
  $('#dayTitle').textContent = 'Jour ' + n + ' — ' + D.title;
  $('#dayMeta').textContent = MONTHS.find(m => n >= m.range[0] && n <= m.range[1]).title;
  $('#theory').innerHTML = theoryHTML(les);

  /* pastilles vidéo YouTube du jour */
  const pillsHTML = ytPills(n);
  $('#vidPills').innerHTML = pillsHTML;
  $('#vidPan').hidden = !pillsHTML;

  $('#theory').addEventListener('click', e => {
    const b = e.target.closest('.term'); if (!b) return;
    const def = b.querySelector('.term-def');
    const open = def.hidden;
    $$('#theory .term-def').forEach(d => { if (d !== def) { d.hidden = true; d.parentElement.setAttribute('aria-expanded', 'false'); } });
    def.hidden = !open; b.classList.toggle('open', open);
  });

  /* TP */
  const savedTicks = JSON.parse(localStorage.getItem('pbd.tick.' + n) || '[]');
  $('#tasks').innerHTML = les.x.map((t, i) =>
    `<label class="task${savedTicks[i] ? ' checked' : ''}"><input type="checkbox" data-i="${i}"${savedTicks[i] ? ' checked' : ''}><span>${iconify(t)}</span></label>`).join('');

  /* éditeur */
  const ed = $('#ed'), con = $('#con'), fr = $('#fr');
  ed.value = Store.code[n] !== undefined ? Store.code[n] : String(les.s).replace(/\\n/g, '\n');
  fr.hidden = !WEB_AWARE(n);
  if (!WEB_AWARE(n)) $('#previewWrap').hidden = true; else $('#previewWrap').hidden = false;
  con.innerHTML = iconify('<span class="hint">Exécute ton code (▶) pour voir la sortie ici…</span>');
  window.onmessage = e => { if (e.source === fr.contentWindow) { const d = document.createElement('div'); d.textContent = (e.data.t === 'err' ? '✖ ' : '› ') + e.data.m; if (e.data.t === 'err') d.className = 'err'; con.appendChild(d); } };
  ed.onkeydown = e => {
    if (e.key === 'Tab') { e.preventDefault(); document.execCommand('insertText', false, '  '); }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
  };
  const run = () => {
    Store.setCode(n, ed.value);
    con.innerHTML = '';
    fr.srcdoc = HOOK + (WEB_AWARE(n) ? ed.value : `<script>${ed.value}<\/script>`);
  };
  $('#run').onclick = run;
  $('#reset').onclick = () => { ed.value = les.s; Store.setCode(n, ''); con.innerHTML = '<span class="hint">Remis à zéro.</span>'; };
  ed.oninput = () => Store.setCode(n, ed.value);

  /* validation */
  const boxes = $$('#tasks input');
  const upd = () => {
    const tick = boxes.map(b => b.checked);
    try { localStorage.setItem('pbd.tick.' + n, JSON.stringify(tick)); } catch {}
    boxes.forEach(b => b.closest('.task').classList.toggle('checked', b.checked));
    const ok = $('#ok');
    const allDone = boxes.every(b => b.checked);
    ok.disabled = st === 'done' || !allDone;
    $('#okHint').textContent = st === 'done' ? '✓ déjà validé' : allDone ? 'Tous les TP cochés : pose ton aimant !' : `TP restants : ${boxes.filter(b => !b.checked).length}`;
  };
  boxes.forEach(b => b.onchange = upd);
  upd();
  const ok = $('#ok');
  ok.onclick = () => {
    Store.validate(n);
    ok.innerHTML = iconify('✓ Aimant posé !');
    try { confetti(); } catch {}
    toast('Leçon validée ✓ — progression gardée sur cet appareil.');
    setTimeout(renderDashboard, 700);
  };
}

/* ---------- boot ---------- */
async function bootStandalone() {
  document.documentElement.classList.add('js');
  Theme.init();
  Store.load();
  $('#back').onclick = renderDashboard;
  renderDashboard();
  // note capacité de sauvegarde
  try { localStorage.setItem('pbd.probe', '1'); localStorage.removeItem('pbd.probe'); }
  catch { toast('⚠️ Sur cet appareil, la progression ne peut pas être sauvegardée entre les sessions (navigateur restreint). Utilise le mode en ligne.'); }
}
bootStandalone();
