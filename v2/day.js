// v2/day.js — Page de cours v2 · 3 onglets, éditeur live + FAB, ressources, feedback riche
/* $ et $$ sont fournis par core.js */
const QS = $$;
const n = +(new URLSearchParams(location.search).get('d') || 1);
const haptic = ms => { if (navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) {} } };

let les = null, codeMode = 'html';

/* ---------- glossaire (réutilise GLOSS de figures.js) : remplace les termes par des <button class="term"> dépliables ---------- */
let glossRe = null;
function glossify(el) {
  const keys = Object.keys(window.GLOSS || {});
  if (!keys.length) return;
  if (!glossRe) glossRe = new RegExp(`(?<![A-Za-zÀ-ÿ])(${keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![A-Za-zÀ-ÿ])`, 'g');
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!glossRe.test(node.data)) continue;
    glossRe.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0, m;
    while ((m = glossRe.exec(node.data))) {
      if (m.index > last) frag.appendChild(document.createTextNode(node.data.slice(last, m.index)));
      const b = document.createElement('button');
      b.className = 'term'; b.type = 'button';
      b.innerHTML = `<span>${m[0]}</span><br><span class="term-def" hidden><b>${m[0]}</b> — ${window.GLOSS[m[0]]}</span>`;
      frag.appendChild(b);
      last = m.index + m[0].length;
    }
    if (last < node.data.length) frag.appendChild(document.createTextNode(node.data.slice(last)));
    node.replaceWith(frag);
  }
}


function theoryHTML(les) {
  let html = les && les.t ? iconify(les.t) : `<p>Leçon bientôt disponible.</p>`;
  if (les && les.pc) html += pcHTML(les.pc);
  return html;
}
function pcHTML(pc) {
  const figs = (pc.flys || []).map(f => (window.FIGS || {})[f] || '').join('');
  return `<details class="pconly" style="margin-top:12px"><summary>🖱 Partie complète sur PC</summary><p style="color:var(--ink-soft);font-size:13px">💾 Sur téléphone ces actions attendent une session PC.</p>${figs}<ol>${(pc.steps || pc.s || []).map(s => `<li>${s}</li>`).join('')}</ol>${pc.note ? `<p>${pc.note}</p>` : ''}</details>`;
}

/* ---------- onglets ---------- */
function tabs() {
  QS('.tabs button').forEach(b => b.onclick = () => {
    QS('.tabs button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    QS('.tabpan').forEach(p => p.classList.toggle('visible', p.id === 'pan' + b.dataset.tab.replace(/^\w/, c => c.toUpperCase())));
    if (b.dataset.tab === 'code' && !$('#ed').value) $('#ed').value = (les && les.s) || '';
  });
}

function showTab(name) { document.querySelector(`.tabs button[data-tab="${name}"]`).click(); }

/* ---------- éditeur + preview ---------- */
function run() {
  const code = $('#ed').value;
  const capture = `<script>(function(){const P=parent;const send=(l,a)=>{try{P.postMessage({src:'v2console',l:l,a:a.map(x=>String(x))},'*')}catch(e){}};['log','warn','error'].forEach(k=>{const o=console[k].bind(console);console[k]=(...a)=>{o(...a);send(k,a)}});window.onerror=(m)=>{send('error',[m]);return false};})()<\/script>`;
  const jsMode = codeMode === 'js';
  $('#fr').srcdoc = jsMode
    ? capture + `<script>${code}<\/script>`
    : code;
}

function consoleFrame() {
  window.addEventListener('message', e => {
    if (!e.data || e.data.src !== 'v2console') return;
    let log = document.querySelector('#consoleOut');
    if (!log) { log = document.createElement('pre'); log.id = 'consoleOut'; log.className = 'panel'; document.querySelector('#panCode').appendChild(log); }
    log.textContent += `[${e.data.l}] ${e.data.a.join(' ')}\n`;
  });
}

/* ---------- TP + pose de l'aimant ---------- */
function renderTasks(list) {
  $('#tasks').innerHTML = list.map((t, i) =>
    `<label class="task"><input type="checkbox" data-i="${i}"><span>${t}</span></label>`).join('');
  const box = QS('#tasks input');
  box.forEach(b => b.onchange = () => {
    haptic(6); updatePoseBtn();
    if (![...box].some(b2 => !b2.checked)) toast2('Tous les TP sont cochés — l\u2019aimant attend.');
  });
}
function updatePoseBtn() {
  const ok = [...QS('#tasks input')].every(b => b.checked);
  const btn = $('#poseBtn'); btn.disabled = !ok;
  const left = [...QS('#tasks input')].filter(b => !b.checked).length;
  $('#poseHint').textContent = ok
    ? 'TP faits — l\u2019aimant n\u2019attend plus que toi.'
    : `${left} TP${left > 1 ? 's' : ''} restant${left > 1 ? 's' : ''} avant de poser l\u2019aimant.`;
}
function pose() {
  /* re-vérifie le gating des TP : le verrou est côté UI + Store */
  if ([...QS('#tasks input')].some(b => !b.checked)) return toast2('Complète tous les TP pour poser l\u2019aimant.');
  Store.validate(n);
  haptic(50);
  const btn = document.querySelector('#poseBtn');
  btn.textContent = 'Aimant posé ✓';
  btn.classList.add('settled');
  confetti();
  toast2('Aimant posé ! La prochaine leçon arrive au rythme régulier. 🎉');
  setTimeout(() => location.href = 'app.html', 1500);
}

/* ---------- ressources ---------- */
const YT_ICON = '<svg class="ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#ff4d4d" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8z"/><path fill="#fff" d="M9.6 15.6V8.4L15.8 12z"/></svg>';
function renderVids() {
  const vids = (window.YT_VIDEOS && window.YT_VIDEOS[n]) || [];
  $('#vidsP').innerHTML = `
    <h2>Compléments vidéo</h2>` + (vids.length
    ? vids.map(([c, t, id]) => `<button class="yt-pill" data-id="${id}">${YT_ICON}<span>${t}</span></button>`).join('')
    : `<p style="color:var(--ink-soft)">Pas de vidéo complémentaire pour ce jour.</p>`);
  QS('.yt-pill').forEach(b => b.onclick = () => playVid(b.dataset.id));
}
function playVid(id) {
  let emb = document.querySelector('#vidsP .yt-embed');
  if (emb) emb.remove();
  const wrap = document.createElement('div');
  wrap.innerHTML = `<div class="yt-embed" style="margin-top:12px">
    <iframe style="width:100%;aspect-ratio:16/9;border:0;border-radius:12px;box-shadow:var(--shadow)"
      src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="Vidéo du jour"
      allow="encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>
    <a class="yt-open" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">${YT_ICON} Ouvrir sur YouTube</a></div>`;
  document.querySelector('#vidsP').appendChild(wrap.firstElementChild);
  showTab('res');
}

/* ---------- net badge / toast / historique ---------- */
function netBadge() {
  const t = $('#netTxt'); if (!t) return;
  const online = navigator.onLine, pend = Object.keys(Store.pending).length;
  $('#netBadge').classList.toggle('off', !online);
  t.textContent = online ? 'En ligne' : `Hors ligne · ${pend} en file`;
}
function toast2(msg) { toast(msg); haptic(10); }

/* ---------- boot ---------- */
function boot() {
  bootCommon();
  const D = DAYS[n], st = Store.status(n);
  if (st === 'locked' || st === 'wait') {
    $('#app').classList.add('hidden'); $('#lockPage').classList.remove('hidden');
    $('#lockWhy').textContent = st === 'wait' ? 'C\'est un jour de pause planifié. Reviens à sa date d\'ouverture.' : 'Valide la leçon précédente pour ouvrir celle-ci.';
    netBadge(); return;
  }
  les = (typeof LESSONS !== 'undefined' && LESSONS[n]) || generic(D);
  $('#dayTitle').textContent = `Jour ${n} — ${D.title}`;
  $('#dayMeta').textContent = (MONTHS.find(m => n >= m.range[0] && n <= m.range[1]) || {}).title || '';
  $('#theory').innerHTML = theoryHTML(les);
  $('#app').classList.remove('hidden');
  document.querySelector('#theory').addEventListener('click', e => {
    const b = e.target.closest('.term'); if (!b) return;
    haptic(5); const d = b.querySelector('.term-def'); if (d) d.hidden = !d.hidden;
  });
  const TPs = les && Array.isArray(les.x) ? les.x : ['Relis la théorie du jour', 'Note en 3 lignes ce que tu as appris'];
  renderTasks(TPs);
  codeMode = n > 0 && n < 22 ? 'html' : 'js';
  $('#ed').value = (les && les.s) || (codeMode === 'html' ? '<!-- Écris ici… -->' : '// Ton code ici');
  run();
  tabs(); renderVids(); netBadge();
  $('#poseBtn').onclick = pose;
  $('#runFab').innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M7 4.5 21 12 7 19.5z"/></svg>`;
  $('#runFab').onclick = run; $('#runBtn').onclick = run;
  $('#ed').addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); run(); } });
  consoleFrame();
  history.replaceState({ v2day: n }, '');
  window.addEventListener('popstate', () => { location.href = 'app.html'; });
}

document.addEventListener('DOMContentLoaded', boot);
